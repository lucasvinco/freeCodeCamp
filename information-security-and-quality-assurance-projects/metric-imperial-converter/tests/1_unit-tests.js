/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

const convertHandler = new ConvertHandler();

suite('Unit Tests', function () {

    suite('Function convertHandler.getNum(input)', function () {

        test('Whole number input', function (done) {
            let input = '32L';
            assert.equal(convertHandler.getNum(input), 32);
            done();
        });

        test('Decimal Input', function (done) {
            let input = '3.1';
            assert.equal(convertHandler.getNum(input), 3.1);
            done();
        });

        test('Fractional Input', function (done) {
            let input = '1/2';
            assert.equal(convertHandler.getNum(input), 0.5);
            done();
        });

        test('Fractional Input w/ Decimal', function (done) {
            let input = '5.4/3';
            assert.equal(convertHandler.getNum(input), 1.8)
            done();
        });

        test('Invalid Input (double fraction)', function (done) {
            let input = '3/7.2/4';
            assert.equal(convertHandler.getNum(input), 'invalid number');
            done();
        });

        test('No Numerical Input', function (done) {
            let input = 'gal';
            assert.equal(convertHandler.getNum(input), 1)
            done();
        });

    });

    suite('Function convertHandler.getUnit(input)', function () {

        test('For Each Valid Unit Inputs', function (done) {
            let input = ['gal', 'l', 'mi', 'km', 'lbs', 'kg', 'GAL', 'L', 'MI', 'KM', 'LBS', 'KG'];
            input.forEach(function (ele) {
                //assert
                assert.equal(convertHandler.getUnit(ele), ele.toLowerCase());
            });
            done();
        });

        test('Unknown Unit Input', function (done) {
            let input = 'ter';
            assert.equal(convertHandler.getUnit(input), 'invalid unit');
            done();
        });

    });

    suite('Function convertHandler.getReturnUnit(initUnit)', function () {

        test('For Each Valid Unit Inputs', function (done) {
            let input = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
            let expect = ['l', 'gal', 'km', 'mi', 'kg', 'lbs'];
            input.forEach(function (ele, i) {
                assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
            });
            done();
        });

    });

    suite('Function convertHandler.spellOutUnit(unit)', function () {

        test('For Each Valid Unit Inputs', function (done) {
            //see above example for hint
            let input = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
            let expect = ['gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms'];
            input.forEach(function (ele, i) {
                assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
            });
            done();
        });

    });

    suite('Function convertHandler.convert(num, unit)', function () {

        test('Gal to L', function (done) {
            let input = [5, 'gal'];
            let expected = 18.9271;
            assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1); //0.1 tolerance
            done();
        });

        test('L to Gal', function (done) {
            let input = [5, 'l'];
            let expected = 1.320860884289945;
            assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1); //0.1 tolerance
            done();
        });

        test('Mi to Km', function (done) {
            let input = [5, 'mi'];
            let expected = 8.0467;
            assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1); //0.1 tolerance
            done();
        });

        test('Km to Mi', function (done) {
            let input = [5, 'km'];
            let expected = 3.106863683249034;
            assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1); //0.1 tolerance
            done();
        });

        test('Lbs to Kg', function (done) {
            let input = [5, 'lbs'];
            let expected = 2.26796;
            assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1); //0.1 tolerance
            done();
        });

        test('Kg to Lbs', function (done) {
            let input = [5, 'kg'];
            let expected = 11.02312210091;
            assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1); //0.1 tolerance
            done();
        });

    });

});