const request = require('request');
require('dotenv').config();

exports.credentials = (req, res) => {
  let body = {
    api_key: 'yI0gFiP6jAXhVc2Ujzu8m_J878G03H5I5udH3hQoOEaA',
    workspace_id: 'ad400566-4c71-4db9-af65-b240bd427c28',
    id: '117028',
    cpf: req.body.cpf,
    desafio: '1'
  }
  
  console.log(body)
  
  request({
    uri: "https://8d829621.us-south.apiconnect.appdomain.cloud/desafios/desafio1",
    body: body,
    json: true,
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
  }, function (err, response) {
    if (err || response.body.error) {
      res.status(500).json({
        msg: 'Something is wrong, contact support.'
      });
    } else if (response.body.err) {
      res.status(400).json({
        msg: 'Already Submited.'
      });
    } else {
      res.status(201).json({
        msg: response.body
      });
    }
  });
}
