/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

    let convertHandler = new ConvertHandler();

    app.route('/api/convert')
        .get(function (req, res) {
            try {
                let input = req.query.input;
                let initNum = convertHandler.getNum(input);
                let initUnit = convertHandler.getUnit(input);
                let returnNum = convertHandler.convert(initNum, initUnit);
                let returnUnit = convertHandler.getReturnUnit(initUnit);
                let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

                //res.json
                //{initNum: 3.1, initUnit: 'mi', returnNum: 5.0000008, returnUnit: 'km', string: '3.1 miles converts to 5.00002 kilometers'}
                if (initUnit != 'invalid unit' && initNum != 'invalid number') {
                    if (returnUnit == 'l') returnUnit = returnUnit.toUpperCase();
                    if (initUnit == 'l') initUnit = initUnit.toUpperCase();

                    res.json({ initNum, initUnit, returnNum, returnUnit, string: toString })
                } else if (initUnit == 'invalid unit' && initNum == 'invalid number')
                    res.send('invalid number and unit');
                else if (initUnit == 'invalid unit')
                    res.send('invalid unit');
                else
                    res.send('invalid number');
            } catch (e) {
                console.log(e);
                res.send(e);
            }
        });

};