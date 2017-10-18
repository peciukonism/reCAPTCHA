// needed to use the express module
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// initialize express
const app = express();

// middleware needed to use body-parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// route thats going to load index.html
app.get('/', (req,res) => {
  // load index.html file; __dirname means current directory
  res.sendFile(__dirname + '/index.html')
});

//post request with fetch api
app.post('/subscribe', (req,res) => {
  // check to see if captcha is there
  if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ){
    return res.json({"success": false, "msg": "Please select captcha"});
  }

  // Define our secret key
  const secretKey = '{your_secret_key}';

  // Verify url
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make request to verifyUrl
  request(verifyUrl,(err,response,body) => {
    body = JSON.parse(body);
    console.log(body);

    // check body if not successful
    if(body.success != undefined && !body.success){
      res.json({"success": false, "msg": "Failed captcha verification"});
    }
    // if successful
    return res.json({"success": true, "msg": "Captcha passed"});

  });

});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
