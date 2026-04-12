const express = require('express');
const path = require('path');
const { google } = require('googleapis');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

const SPREADSHEET_ID = '1YmEsM3AvtIbNqto8DoYLMO48tH13UY23niGvRz5vOtU';

// Get jobs from Google Sheet
app.get('/api/jobs', async (req, res) => {
  try {
    const month = req.query.month || new Date().toLocaleString('en-US', { month: 'long' });
    const jobs = await getJobs(month);
    res.json(jobs);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update job field
app.post('/api/jobs', async (req, res) => {
  try {
    const { month, row, field, value } = req.body;
    const targetMonth = month || new Date().toLocaleString('en-US', { month: 'long' });
    await updateJobField(targetMonth, row, field, value);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Extract contract from PDF
app.post('/api/contracts/extract', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const extracted = await extractWithAI(image, mimeType || 'image/png');
    res.json({ success: true, extracted });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save contract to Google Sheet
app.post('/api/contracts/save', async (req, res) => {
  try {
    const data = req.body;
    await saveToSheet(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get weather
app.get('/api/weather', async (req, res) => {
  // Placeholder - would integrate with weather API
  const forecast = generateWeatherForecast();
  res.json(forecast);
});

function generateWeatherForecast() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  const weather = ['☀️', '⛅', '🌧️', '⛅', '☀️', '☀️', '⛅'];
  const temps = [78, 75, 62, 70, 80, 82, 77];
  const conditions = ['Perfect', 'Good', 'Rain', 'Good', 'Great', 'Great', 'Good'];
  
  return Array.from({ length: 7 }, (_, i) => ({
    day: days[(today + i) % 7],
    icon: weather[i],
    temp: temps[i],
    condition: conditions[i],
    isGood: conditions[i] !== 'Rain'
  }));
}

async function getClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDS || '{}'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return auth.getClient();
}

async function getJobs(month) {
  const auth = await getClient();
  const sheets = google.sheets({ version: 'v4', auth });
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${month}!A:Q`
    });

    const rows = response.data.values || [];
    const jobs = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[0].toString().trim() !== '') {
        jobs.push({
          id: `${month}-${i + 1}`,
          row: i + 1,
          address: row[0] || '',
          owner: row[4] || '',
          phone: row[1] || '',
          email: row[2] || '',
          contractPrice: parseFloat(row[5]) || 0,
          totalBalance: parseFloat(row[6]) || 0,
          material: row[10] || '',
          salesperson: row[9] || '',
          doc: row[15] || '',
          estimated: row[2] || '',
          install: row[3] || '',
          paid: row[8] || '',
          paidAmount: parseFloat(row[9]) || 0,
          notes: row[13] || '',
          depAmtHeld: parseFloat(row[14]) || 0,
          month
        });
      }
    }
    return jobs;
  } catch (e) {
    console.log('Sheet not ready, returning demo data');
    return getDemoJobs();
  }
}

async function updateJobField(month, row, field, value) {
  const auth = await getClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const fieldMap = {
    'address': 1, 'phone': 2, 'email': 3, 'owner': 5,
    'contractPrice': 6, 'totalBalance': 7, 'paid': 9,
    'paidAmount': 10, 'material': 11, 'salesperson': 12,
    'notes': 14, 'depAmtHeld': 15
  };

  const col = fieldMap[field];
  if (!col) throw new Error(`Unknown field: ${field}`);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${month}!${col}${row}`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [[value]] }
  });
}

async function extractWithAI(base64, mimeType) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return {
      customer: 'Demo Customer',
      phone: '555-123-4567',
      email: 'demo@email.com',
      address: '123 Demo St, City, ST 12345',
      contractPrice: 8500,
      actualPrice: 8500,
      discount: 0,
      shingleType: 'Owens Corning Duration',
      insuranceDeductible: 500,
      salesperson: 'Demo Sales',
      notes: 'Demo extraction'
    };
  }

  const prompt = `Extract contract data. Return ONLY valid JSON:
{"customer":"","phone":"","email":"","address":"","contractPrice":0,"actualPrice":0,"discount":0,"shingleType":"","insuranceDeductible":0,"salesperson":"","notes":""}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-20250514',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
          ]
        }],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const cleaned = content.replace(/```json?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return { customer: '', phone: '', email: '', address: '', contractPrice: 0, actualPrice: 0, discount: 0, shingleType: '', insuranceDeductible: 0, salesperson: '', notes: 'Extraction failed' };
  }
}

async function saveToSheet(data) {
  const auth = await getClient();
  const sheets = google.sheets({ version: 'v4', auth });
  const month = new Date().toLocaleString('en-US', { month: 'long' });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${month}!A:Q`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[
        data.address, data.phone, data.email, '', data.owner,
        data.contractPrice, data.totalBalance || 0, '', data.paid || '',
        data.paidAmount || 0, data.material || '', data.salesperson || '',
        '', '', data.notes || '', data.depAmtHeld || 0, new Date().toLocaleDateString()
      ]]
    }
  });
}

function getDemoJobs() {
  return [
    { id: 'April-3', row: 3, address: '123 Oak St', owner: 'John Smith', phone: '555-111-2222', email: 'john@email.com', contractPrice: 8500, totalBalance: 4000, material: 'Owens Corning', salesperson: 'Tom', doc: '04/01/2026', paid: 'Partial', paidAmount: 4500, notes: 'Insurance claim', depAmtHeld: 500, month: 'April' },
    { id: 'April-4', row: 4, address: '456 Maple Dr', owner: 'Mary Johnson', phone: '555-333-4444', email: 'mary@email.com', contractPrice: 6200, totalBalance: 0, material: 'CertainTeed', salesperson: 'Jessica', doc: '04/05/2026', paid: 'Paid', paidAmount: 6200, notes: '', depAmtHeld: 0, month: 'April' },
    { id: 'April-5', row: 5, address: '789 Pine Rd', owner: 'Bob Williams', phone: '555-555-6666', email: 'bob@email.com', contractPrice: 12000, totalBalance: 12000, material: 'Metal', salesperson: 'Tom', doc: '04/08/2026', paid: 'None', paidAmount: 0, notes: 'Large job', depAmtHeld: 2000, month: 'April' }
  ];
}

// Serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 HammerFlow running on port ${PORT}`));
