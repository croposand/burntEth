import { roundNum } from "./utils";
import * as webSocket from "websocket"
import fetch from "node-fetch"
export function getBurntEth_DEPRICATED(cb: Function) {
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

export async function getBurntEth(cb: Function) {
    let old_total_burned = 0;
    setInterval(async () => {
        const data = await fetch("https://etherchain.org/burn/data", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en,en-US;q=0.9,ar;q=0.8",
                "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://etherchain.org/burn",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors"
        }).then(data => data.json())

        if (data.old_total_burned === old_total_burned) return
        old_total_burned = data.old_total_burned;
        cb(data.total_burned)
    }, 5000)
}