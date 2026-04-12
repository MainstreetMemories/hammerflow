const { google } = require('googleapis');

const SPREADSHEET_ID = '1YmEsM3AvtIbNqto8DoYLMO48tH13UY23niGvRz5vOtU';

export default async function handler(req, res) {
  const { month } = req.query;
  const targetMonth = month || new Date().toLocaleString('en-US', { month: 'long' });

  if (req.method === 'GET') {
    try {
      const jobs = await getJobs(targetMonth);
      return res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { row, field, value } = req.body;
      await updateJobField(targetMonth, row, field, value);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating job:', error);
      return res.status(500).json({ error: 'Failed to update job' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
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
      range: `${month}!A:P`
    });

    const rows = response.data.values || [];
    const jobs = [];

    // Skip header row (row 1) and start from row 2
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
          contractPrice: row[5] || 0,
          totalBalance: row[6] || 0,
          material: row[10] || '',
          salesperson: row[9] || '',
          doc: row[15] || '',
          estimated: row[2] || '',
          install: row[3] || '',
          paid: row[8] || '',
          paidAmount: row[9] || 0,
          notes: row[13] || '',
          depAmtHeld: row[14] || 0,
          month
        });
      }
    }

    return jobs;
  } catch (e) {
    console.error('Sheet read error:', e);
    return [];
  }
}

async function updateJobField(month, row, field, value) {
  const auth = await getClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const fieldMap = {
    'address': 1,
    'phone': 2,
    'email': 3,
    'owner': 5,
    'contractPrice': 6,
    'totalBalance': 7,
    'paid': 9,
    'paidAmount': 10,
    'material': 11,
    'salesperson': 12,
    'notes': 14,
    'depAmtHeld': 15
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