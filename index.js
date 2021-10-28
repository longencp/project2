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

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});
