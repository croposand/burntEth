export function roundNum(a, d) {
    return Math.round(a * 10 ** d) / (10 ** d)
}

export class ConsoleViewer {
    userCount: number;
    burntEth: number;
    url: string;
    constructor(host, port) {
        this.url = `wss://${host}:${port}`;
        this.userCount = 0;
        this.burntEth = 0;
        this.show()
    }
    /**Increases the user count**/
    increaseUserCount() {
        this.userCount++;
        this.show()
    }

    /**Decreases the user count**/
    decreaseUserCount() {
        this.userCount--;
        this.show()
    }



    /**Updates the Burnt Etherium quantity**/
    updateBurntEth(burntEth) {
        this.burntEth = burntEth;
        this.show()
    }

    /**Shows All variables in console **/
    show() {
        console.clear();
        console.log(`hosted on ${this.url}`)
        console.log(`users count: ${this.userCount}`);
        console.log(`burnt Eth: ${this.burntEth} eth`);
    }
}


const acceptedOrigins = { "croposand.github.io": true, "localhost": true, "127.0.0.1": true }
export function originIsAllowed(origin: string) {
    return acceptedOrigins[origin]
}