var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);


// server.listen(8890);

app.use(express.static('App/scripts/views'));

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/yourCustomRoute', function (req, res) {

   // Prepare output in JSON format
   response = {
       status:200
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})




