var http = require('http');
var app = require('./app.js');

var httpServer = http.createServer(app).listen(8080, function (req, res) {
  console.log('HTTP SERVER has been started');
});

module.exports = io;
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function (socket) {
  //socket.emit('toclient', {msg: 'Welcome !'});
  socket.on('login', function (data) {
    query = 'select pass from login where id='+require('mysql').escape(data.id);
    console.log(query);
    sql_conn.query(query, function(err, rows, fields) {
        if(err){
          throw err;
          console.log(err);
        }
        console.log('DB:'+rows[0].pass+'input:'+data.pass);
        if(rows[0].pass == data.pass){
          socket.emit('login',{msg:'Success!'});
          console.log('Success');
          }
        else {
          socket.emit('login',{msg:'Failed!'});
          console.log('FAIL');
        }
    });
  });
var client;
  socket.on('mqtt_connection', function (data) {
    client=mqtt.connect('mqtt://'+data.host);
    client.on('connect', function(err) {
      if(err){
        socket.emit('fromserver',{msg:data.host + ' Failed!'})
      }
      else{
        socket.emit('fromserver',{msg:data.host + ' Connected!'});
      }
    });
  });

  socket.on('subscribe', function (data) {
    client.subscribe(data.topic);
    console.log('Subscribe :/'+data.topic);

    client.on('message', function(topic, msg) {
      socket.emit('fromserver', {msg:'sub: '+msg.toString()});
      console.log('mssg');
    });
  });
  socket.on('unsubscribe', function (data) {
    client.unsubscribe(data.topic);
    console.log('mssg');
  });
  socket.on('publish', function (data) {
    client.publish(data.topic,data.msg);
    console.log('Published :/'+data.topic+" "+data.msg);
  });

  socket.on('mqtt_disconnect', function () {
    console.log('disabled');
    socket.emit('fromserver', {msg:'DISCONNECTED!'});
    client.end();
  });

  socket.on('setname', function (name, data) {

    socket.broadcast.emit('toclient', {msg:name +':'+ data.msg});
    socket.emit('toclient', {msg:name+'으로 이름을 변경햐였습니다'});
    online[socket] = name;
    console.log('Message from ' + online[socket]);

  });
  });
