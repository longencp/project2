const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();

connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});
// TODO: issue queries.
service.use(express.json());


service.get('/report.html', (request, response) => {
    response.sendFile(path.join(__dirname, '/report.html'));
});


service.post('/camper', (request, response) => {
  if (request.body.hasOwnProperty('name') &&
      request.body.hasOwnProperty('session_num') &&
       request.body.hasOwnProperty('balance')  &&
      request.body.hasOwnProperty('concerns')){

    const parameters = [
      request.body.name,
      request.body.session_num,
      request.body.balance,
      request.body.concerns,
    ];

    const query = 'INSERT INTO campers(name, session_num, balance, concerns) VALUES (?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId,
        });
      }
    });

  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete Camper Info.',
    });
  }
});
function rowToMemory(row) {
  return {
    name: row.name,
    session: row.session_num,
    balance: row.balance,
    concerns: row.concerns,
  };
}
service.get('/campers/:session_num', (request, response) => {
  const parameters = [
    parseInt(request.params.session_num),
  ];

  const query = 'SELECT * FROM campers WHERE session_num = ? AND is_deleted = 0'
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const memories = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

service.get('/', (request, response) => {

  const query = 'SELECT * FROM campers WHERE is_deleted = 0'
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const memories = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

service.patch('/camper/:name', (request, response) => {
  const parameters = [
    request.body.session_num,
    request.body.balance,
    request.body.concerns,
    request.params.name,
  ];

  const query = 'UPDATE campers SET session_num = ?, balance = ?, concerns = ? WHERE name = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

service.delete('/camper/:name', (request, response) => {
  const parameters = [request.params.name];

  const query = 'UPDATE campers SET is_deleted = 1 WHERE name = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});
const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});
