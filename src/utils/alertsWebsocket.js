const expressWs = require("express-ws")
const LOGGER = require("../logger/logger")

// This is a websocket server that alerts the client when a new message is received
// const alertWebsocket = (ws, req) => {
//     LOGGER.debug("New alert ws client connection")

//     const userId = parseInt(req.url.substr(1), 10);
//     console.log(userId);

//     console.log(req);
    

//     ws.on('message', (msg) => {
//         ws.send(msg);
//     });


//     ws.on('close', () => {
//         console.log("Websocket connection closed")
//     });
// }

// const wsNotifyUser = (data) => {
//     expressWs.getWss("/alertws").clients.forEach(client => {
//         console.log(client);
//     })
// }

// module.exports = { 
//     alertWebsocket,
//     wsNotifyUser,

// };