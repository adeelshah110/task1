const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const port = 8123;

// create HTTP server
http.createServer((req, res) => {
  // handle only GET requests
  if (req.method === 'GET') {
    // serve the HTML page with two div elements
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <html>
        <head>
          <title>HTTP GET request example</title>

          <style>
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: white;
              font-size: 16px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              text-align: center;
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
              padding: 10px;
              border: 1px solid black;
            }
          </style>

        </head>
        <body>
          <div class="button">click Me</div>
          <div class="table">
            <div class="table-row">
              <div class="table-cell">Name</div>
              <div class="table-cell">Age</div>
            </div>
          </div>
          <script>
            // add event listener to the click div element
            const button = document.querySelector('.button');
            button.addEventListener('click', () => {
              // make HTTP POST request to Node.js server to request data
              fetch('/', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                  // add the received data as a new row to the table
                  const table = document.querySelector('.table');
                  const newRow = document.createElement('div');
                  newRow.classList.add('table-row');
                  newRow.innerHTML = \`
                    <div class="table-cell">\${data.name}</div>
                    <div class="table-cell">\${data.age}</div>
                  \`;
                  table.appendChild(newRow);
                })
                .catch(error => console.error(error));
            });
          </script>
        </body>
      </html>
    `);
    res.end();
  } else if (req.method === 'POST') {
    // handle only POST requests
    let body = '';
    req.on('data', chunk => {
      // collect the request body data
      body += chunk.toString();
    });
    req.on('end', () => {
      // parse the request body as URL-encoded data
      const data = querystring.parse(body);
      // send a JSON response with the requested data
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ name: 'John Doe', age: 30 }));
      res.end();
    });
  } else {
    // handle all other requests with 405 Method Not Allowed status
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.write('Method Not Allowed');
    res.end();
  }
}).listen(port, () => console.log(`Server listening on port ${port}`));
