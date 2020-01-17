/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const StockController = require('../controllers/stockController');
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

    const stockController = new StockController();

    app.route('/api/stock-prices')
        .get(async function (req, res) {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            //let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(",")[0];
            //console.log(ip);
            const { stock, like } = req.query;
            let result;
            if(stock && !Array.isArray(stock)) {
                result = await stockController.get(stock, like, ip);
            } else {
                let stock1 = await stockController.get(stock[0], like, ip);
                let stock2 = await stockController.get(stock[1], like, ip);
                //let rel_likes = Math.abs(stock1.likes - stock2.likes);
                if(stock1.likes > stock2.likes) {
                    stock1.rel_likes = stock1.likes - stock2.likes;
                    stock2.rel_likes = stock2.likes - stock1.likes;
                } else {
                    stock1.rel_likes = stock2.likes - stock1.likes;
                    stock2.rel_likes = stock1.likes - stock2.likes;
                }

                result = [{stock: stock1.stock, price: stock1.price, rel_likes: stock1.rel_likes}, {stock: stock2.stock, price: stock2.price, rel_likes: stock2.rel_likes}];
            }

            res.json({stockData: result});
        });

};