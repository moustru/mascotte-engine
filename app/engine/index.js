const axios = require('axios');
const Utils = require('./../utils');
require('dotenv').config();

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

const buy = () => {
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
        cfg.currentType = 'Buy'
    } else {
        return false;
    }
}

const sell = (transaction) => {
    let amount = transaction.BTC * cfg.buy;

    cfg.wallet += amount;
    cfg.btc -= transaction.BTC;
    cfg.currentType = 'Sell';
    history.push(transaction);
    transactions.splice(transaction, 1);

    if(transactions.length == 0) buy();
}

const main = async() => {
    let res = await axios.get('https://api.exmo.com/v1/ticker');

    if(res.data.BTC_RUB) {
        order.buy = Number(res.data.BTC_RUB.buy_price);
        order.sell = Number(res.data.BTC_RUB.sell_price);
    
        cfg.buy = Number(order.buy.toFixed(2));
        cfg.sell = Number(order.sell.toFixed(2));

        if(transactions.length > 0) {
            let purposeBuy = transactions[transactions.length - 1].sellPrice - order.sell >= 1 ? true : false;
            let purposeSell = transactions[transactions.length - 1].sellPrice < Math.ceil(order.buy) ? true : false;
        
            if(purposeSell && transactions.length > 0) sell(transactions[transactions.length - 1]);
            if(purposeBuy && transactions.length > 0) buy();
        }
    
        return new Promise(resolve => { resolve() })
    } else {
        console.log('Разрыв соединения. Пытаемся восстановить')
        process.disconnect();

        if(res.data.BTC_RUB) {
            process.connected;
        }
    }
}

const init = () => {
    cfg.date = new Date().getTime();
    main().then(() => { buy() });
    //getUser();
    setInterval(main, 2000);
}

const getUser = () => {
    let data = Utils.serialize({ nonce: cfg.date++ });

    axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    axios.defaults.headers.post["Key"] = process.env.KEY;
    axios.defaults.headers.post["Sign"] = Utils.sign(data);

    axios.post('https://api.exmo.com/v1/user_info', data).then(response => {
        console.log(response.data);
    })
}

const getInfo = (req, res) => {
    res.send({
        cfg,
        order,
        history,
        transactions
    })
}

module.exports = {
    main,
    init,
    getInfo
}