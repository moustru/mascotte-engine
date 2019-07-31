const axios = require('axios');
require('dotenv').config();
const utils = require('./../utils');
const postData = utils.serialize({})

module.exports = () => {
    axios.interceptors.request.use(settings => {
        settings.headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8index.html",
            "Key": process.env.KEY,
            "Sign": utils.sign(postData)
        }
    
        return settings
    }, err => {
        return Promise.reject(err)
    })
}