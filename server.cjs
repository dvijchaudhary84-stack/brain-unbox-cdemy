const http = require('http');
const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, 'registrations.csv');

// Initialize registrations.csv with headers if it does not exist
if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, 'Timestamp,Name,Email,Course,Message\n', 'utf8');
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/register') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const timestamp = new Date().toLocaleString();
        
        // Escape helper for CSV formatting
        const escapeCSV = (val) => {
          if (val === undefined || val === null) return '';
          let str = val.toString().replace(/"/g, '""');
          if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            str = `"${str}"`;
          }
          return str;
        };

        const row = `${escapeCSV(timestamp)},${escapeCSV(data.name)},${escapeCSV(data.email)},${escapeCSV(data.course)},${escapeCSV(data.message)}\n`;
        
        // Append lead to registrations.csv locally
        fs.appendFileSync(CSV_FILE, row, 'utf8');
        console.log(`[Lead Captured] Name: ${data.name}, Email: ${data.email} -> Saved in registrations.csv`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Saved to local Excel sheet (registrations.csv).' }));
      } catch (err) {
        console.error('Error parsing lead details:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload.' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`Local Lead Collector Server running at: http://localhost:${PORT}`);
  console.log(`Submissions will be saved directly in Excel format to:`);
  console.log(`👉 ${CSV_FILE}`);
  console.log(`======================================================\n`);
});
