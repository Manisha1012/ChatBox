
//websocket server

const webSocketsServerPort = '5000';
const webSocketServer = require('websocket').server;
const http = require("http");

const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listen on port 5000');


const wsServer = new webSocketServer({
    httpServer: server
});


const clients = [];

const getUniqueId = () => {
    const id = () => Math.floor((1 + Math.random()) * 0X10000).toString(16).substring(1);
    return id() + id() + '-' + id();
}

wsServer.on('request', function(request){
    var userId = getUniqueId();
    console.log((new Date()) + 'Receive a new connection from origin ' + request.origin + '.');

    //create connection
    var connection = request.accept(null, request.origin);
    clients[userId] = connection;
    
    //on message 
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);

            for(key in clients){
                clients[key].sendUTF(message.utf8Data);
            }
        }
    });
    //connection close with server
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});