const Stock = require('../models/stock');
const Like = require('../models/like');
const rp = require('request-promise-native');

function StockController() {
    this.get = async function (stockSymbol, like, ip) {
        try {
            const options = {
                uri: `https://repeated-alpaca.glitch.me/v1/stock/${stockSymbol}/quote`,
                json: true // Automatically parses the JSON string in the response
            };
            const { symbol, latestPrice } = await rp(options);

            //console.log(result);
            //console.log(`${symbol} ${latestPrice}`);

            let stock = await Stock.findOne({ symbol });
            let newStock, likes, stockId;
            if (!stock) {
                try {
                    newStock = new Stock({ symbol });
                    await newStock.save();
                    stockId = newStock._id;
                } catch (e) {
                    //console.log(e);
                    return 'errorrrrrr';
                }
            } else {
                stockId = stock._id;
                likes = stock.likecount;
                newStock = stock;
            }

            if (Boolean(like) === true) {
                try {
                    let newLike = new Like({ ip, stockId });
                    await newLike.save();
                    newStock = newStock.toObject();
                    newStock.likecount++;
                    await Stock.updateOne({ _id: stockId }, newStock);
                    likes = newStock.likecount;
                } catch (e) {
                    //console.log(e);
                }
            }

            return { stock: symbol.toUpperCase(), price: latestPrice.toString(), likes };
        } catch (e) {
            console.log(e);
            return 'error';
        }
    }
}

module.exports = StockController;