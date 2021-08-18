import * as express from 'express';
import * as websocket from "websocket";
import { getBurntEth } from './api';
import { ConsoleViewer, originIsAllowed } from './utils';
const app = express();
const server = app.listen(3000, main);



function main() {
    console.log('Example app listening on port 3000!');
    // make a websocket server
    const wss = new websocket.server({
        httpServer: server,
        autoAcceptConnections: true
    });


    const keeper = new ConsoleViewer("localhost", 3000);

    // handle incoming websocket messages
    wss.on("connect", (ws) => {
        keeper.increaseUserCount();
        ws.send(JSON.stringify({ type: "fee_based_price", data: keeper.burntEth }))
        ws.on("close", () => {
            keeper.decreaseUserCount();
        })
    });

    wss.on('request', (request) => {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            return request.reject();
        }
        request.accept();
    });






    // get burnt eth
    getBurntEth((price) => {
        // send a message to the client
        wss.broadcast(JSON.stringify({ type: "fee_based_price", data: price }));
        keeper.updateBurntEth(price);
    })
}

