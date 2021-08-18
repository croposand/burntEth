import * as express from 'express';
import * as websocket from "websocket";
import { getBurntEth } from './api';
import { ConsoleViewer, originIsAllowed } from './utils';
const app = express();

const port = 443;
const server = app.listen(port, main);



function main() {
    console.log(`app listening on port ${port}!`);
    // make a websocket server
    const wss = new websocket.server({
        httpServer: server,
        autoAcceptConnections: true
    });


    const keeper = new ConsoleViewer("localhost", port);

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

