const http = require('http');
const fs = require('fs');

// Read binary data from file
const readBinaryFile = () => {
  const buffer = fs.readFileSync('binary.dat');
  const data = {};

  data.modelNumber = buffer.readUInt32BE(0);
  data.serialNumber = buffer.readUInt32BE(4);
  data.supports48Bit = buffer.readUInt8(8) === 1;
  data.totalSectors = buffer.readUInt32BE(12);
  data.diskSize = data.totalSectors * 512;

  return data;
};

// Set up HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Return HTML page with button and table
    res.setHeader('Content-Type', 'text/html');
    res.write(`
      <html>
        <head>
          <style>
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: white;
              text-align: center;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;
            }
            .table {
              display: table;
              border-collapse: collapse;
            }
            .table-row {
              display: table-row;
            }
            .table-cell {
              display: table-cell;
              padding: 8px;
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <div class="button" onclick="getData()">click</div>
          <div class="table"></div>
          <script>
            function getData() {
              // Make HTTP POST request to get data
              const xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                  // Add new row to table with data from response
                  const data = JSON.parse(xhr.responseText);
                  const table = document.querySelector('.table');
                  const row = document.createElement('div');
                  row.className = 'table-row';
                  const modelCell = document.createElement('div');
                  modelCell.className = 'table-cell';
                  modelCell.textContent = data.modelNumber;
                  row.appendChild(modelCell);
                  const serialCell = document.createElement('div');
                  serialCell.className = 'table-cell';
                  serialCell.textContent = data.serialNumber;
                  row.appendChild(serialCell);
                  const supports48BitCell = document.createElement('div');
                  supports48BitCell.className = 'table-cell';
                  supports48BitCell.textContent = data.supports48Bit ? 'yes' : 'no';
                  row.appendChild(supports48BitCell);
                  const sizeCell = document.createElement('div');
                  sizeCell.className = 'table-cell';
                  sizeCell.textContent = data.diskSize + ' bytes';
                  row.appendChild(sizeCell);
                  table.appendChild(row);
                }
              };
              xhr.open('POST', 'http://localhost:8123');
              xhr.send();
            }
          </script>
        </body>
      </html>
    `);
    res.end();
  } else if (req.method === 'POST') {
    // Return parsed data from binary file in JSON format
    const data = readBinaryFile();
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(data));
    res.end();
  }
});

server.listen(8123, () => {
  console.log('Server listening on port 8123');
});