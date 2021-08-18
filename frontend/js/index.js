const socketUrl = "ws://localhost:3000"
const priceBlocks = document.getElementsByClassName("price");

const changeAll = (p) => {
    for (priceBlock of priceBlocks) {
        priceBlock.innerHTML = roundNum(p, 2).toFixed(2)
    }
    oprice = p;
}

function roundNum(a, d) {
    return Math.round(a * 10 ** d) / (10 ** d)
}

const wss = new WebSocket(socketUrl);

let oprice = 0;
wss.onmessage = (data) => {
    const _data = JSON.parse(data.data);

    const newPrice = +_data.data
    if (_data.type === "fee_based_price") {
        transition(oprice, newPrice, changeAll)
    } else console.warn("hmmm", _data)
}


function transition2(old, k, cb) {
    let _old = old;

    return new Promise((solve) => {
        let interval = setInterval(() => {
            console.log(_old, k)

            if (roundNum(_old, 2) != roundNum(k, 2)) {
                _old += (k - _old) / 2;
                cb(_old)
            }
            else clearInterval(interval);

            _old = roundNum(_old, 2)
        }, 16.66666);
        solve()
    })
}

function transition(old, k, cb) {
    let _old = old;

    return new Promise((solve) => {
        let interval = setInterval(() => {
            //console.log(_old, k)

            if (_old > k) {
                if (_old - k > 1) _old -= 1
                if (_old - k > 10) _old -= 10
                if (_old - k > 100) _old -= 100
                if (_old - k > 1000) _old -= 1000
                if (_old - k > 10000) _old -= 10000
                else _old -= 0.01;
                cb(_old)
            }
            if (_old < k) {
                if (k - _old > 1) _old += 1
                if (k - _old > 10) _old += 10
                if (k - _old > 100) _old += 100
                if (k - _old > 1000) _old += 1000
                if (k - _old > 10000) _old += 10000
                else _old += 0.01;
                cb(_old)
            }
            else clearInterval(interval)

            _old = roundNum(_old, 2)
        }, 40);
        solve()
    })

}
