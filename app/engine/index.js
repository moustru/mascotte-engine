const axios = require('axios');

const cfg = {
    date: 0,
    wallet: 10000,
    buy: 0,
    sell: 0,
    bet: 50,
    btc: 0,
    currentType: 'Buy'
}

const order = {
    buy: 0,
    sell: 0
}

const history = [];
const transactions = [];

module.exports = {
    async main() {
        let res = await axios.get('https://api.exmo.com/v1/ticker');
        order.buy = Number(res.data.BTC_RUB.buy_price);
        order.sell = Number(res.data.BTC_RUB.sell_price);

        cfg.buy = order.buy.toFixed(2);
        cfg.sell = order.buy.toFixed(2);

        let purposeBuy = transactions.find(x => x.sellPrice <= cfg.sell);
        let purposeSell = transactions.find(x => x.sellPrice <= cfg.buy);

        if(purposeSell && transactions.length > 0) this.sell(purposeForSell);
        if(!purposeBuy && transactions.length > 0) this.buy();

        return new Promise(resolve => { resolve() })
    },

    buy(e) {
        if(cfg.wallet - cfg.bet > 0) {
            let transaction = {
                BTC: (cfg.bet / cfg.sell),
                amount: Number(cfg.bet),
                sellPrice: order.sell,
                created: new Date().getTime() / 1000
            }

            cfg.wallet -= cfg.bet;
            transactions.push(transaction);
            history.push(transaction);
            cfg.btc = transactions.map(x => x.BTC).reduce((a, b) => a + b);
            currentType = 'Buy'
        } else {
            e.preventDefault();
        }
    },

    sell(transaction) {
        let amount = transaction.BTC * cfg.buy;

        cfg.wallet += amount;
        cfg.btc -= transaction.BTC;
        currentType = 'Sell';
        history.push(transaction);
        transactions.splice(transaction, 1);

        if(transactions.length == 0) this.buy();        
    },

    init() {
        cfg.date = new Date().getTime();
        this.main().then(() => { this.buy() })
        setInterval(this.main, 2000)
    }
}