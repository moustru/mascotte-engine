const cryptojs = require('crypto-js');
require('dotenv').config();

module.exports = {
    sign(message) {
        return cryptojs.HmacSHA512(message, process.env.SECRET).toString(crypto.enc.hex);
    },

    serialize(obj) {
        var str = [];
        for(var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
    
        return str.join("&");
    }
}