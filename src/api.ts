import { roundNum } from "./utils";
import * as webSocket from "websocket"
export function getBurntEth(cb: Function) {
    let kprice = 0;
    const kbd = () => {
        const web3d = new webSocket.w3cwebsocket("wss://api.ultrasound.money/fees/base-fee-feed", 'echo-protocol');
        web3d.onerror = console.error

        web3d.onmessage = async ({ data }) => {
            if (typeof data !== "string") return
            const res = JSON.parse(data);

            if (res.type.indexOf("fee") !== -1) {
                const burnetPrice = res.totalFeesBurned / (10 ** 18);
                if (kprice === burnetPrice) return
                kprice = burnetPrice;
                return cb(roundNum(burnetPrice, 2))
            }

            switch (res.type) {
                // case "leaderboard-update":
                //     break;
                case "base-fee-update":
                    const burnetPrice = res.totalFeesBurned / (10 ** 18);
                    if (kprice === burnetPrice) return
                    kprice = burnetPrice;
                    cb(roundNum(burnetPrice, 2))
                    break;

                case "leaderboard-update":
                    break;

                default:
                    console.log(res.type)
                    break;
            }
        }

        web3d.onopen = () => {
            setTimeout(() => web3d.close(), 100);
        }
    }

    kbd()
    setInterval(() => {
        kbd()
    }, 8000);
}