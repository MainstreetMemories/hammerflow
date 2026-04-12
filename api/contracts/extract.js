const { google } = require('googleapis');

// Contract extraction API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.formData();
    const file = formData.get('file');

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Read file as base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'application/pdf';

    // Extract with AI
    const extracted = await extractWithAI(base64, mimeType);

    // Save to Google Sheet
    await saveToSheet(extracted);

    return res.status(200).json({ success: true, extracted });
  } catch (error) {
    console.error('Error extracting PDF:', error);
    return res.status(500).json({ error: 'Failed to extract PDF content' });
  }
}

async function extractWithAI(base64, mimeType) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  const prompt = `You are a roofing contract data extraction system. Extract the following fields from the contract PDF and return ONLY valid JSON.

Required JSON structure:
{
  "customer": "full name of property owner",
  "phone": "phone number",
  "email": "email address", 
  "address": "property address with city, state, zip",
  "contractPrice": numeric value only,
  "actualPrice": numeric value only,
  "discount": numeric value only,
  "shingleType": "shingle manufacturer and type",
  "insuranceDeductible": numeric value only,
  "salesperson": "name of sales rep",
  "notes": "any important notes"
}

Extract from this contract:`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://hammerflow.onrender.com',
      'X-Title': 'HammerFlow'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-20250514',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
          ]
        }
      ],
      max_tokens: 1500
    })
  });

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  
  const cleaned = content.replace(/```json?/g, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return {
      customer: '', phone: '', email: '', address: '',
      contractPrice: 0, actualPrice: 0, discount: 0,
      shingleType: '', insuranceDeductible: 0,
      salesperson: '', notes: 'Manual entry needed'
    };
  }
}

async function saveToSheet(data) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDS || '{}'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1YmEsM3AvtIbNqto8DoYLMO48tH13UY23niGvRz5vOtU';

  // Get current month sheet
  const month = new Date().toLocaleString('en-US', { month: 'long' });
  
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${month}!A:P`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          data.customer, data.phone, data.email, data.address,
          data.contractPrice, data.actualPrice, data.discount,
          data.shingleType, data.insuranceDeductible, data.salesperson,
          '', '', '', '', data.notes, new Date().toLocaleDateString()
        ]]
      }
    });
  } catch (e) {
    console.error('Sheet save error:', e);
  }
}