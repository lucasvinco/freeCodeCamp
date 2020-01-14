/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {

    this.getNum = function (input) {
        let result;

        let temp = input.replace(/[^0-9\.\/]/g, '');
        if (temp.length >= 1) {
            temp = temp.split('/');

            if (temp.length == 2) result = Number(temp[0]) / Number(temp[1]);
            else if (temp.length > 2) result = 'invalid number';
            else result = Number(temp[0]);
        } else {
            result = 1;
        }
        return result;
    };

    this.getUnit = function (input) {
        let result;

        result = input.replace(/[0-9\.\/]/g, '').toLowerCase();

        if (!/gal$|l$|lbs$|kg$|mi$|km$/.test(result)) return 'invalid unit';
        else return result;
    };

    this.getReturnUnit = function (initUnit) {
        let result;

        switch (initUnit) {
            case 'gal':
                result = 'l';
                break;
            case 'l':
                result = 'gal';
                break;
            case 'lbs':
                result = 'kg';
                break;
            case 'kg':
                result = 'lbs';
                break;
            case 'mi':
                result = 'km';
                break;
            case 'km':
                result = 'mi';
                break;
            default:
                break;
        }

        return result;
    };

    this.spellOutUnit = function (unit) {
        let result;

        switch (unit) {
            case 'gal':
                result = 'gallons';
                break;
            case 'l':
                result = 'liters';
                break;
            case 'lbs':
                result = 'pounds';
                break;
            case 'kg':
                result = 'kilograms';
                break;
            case 'mi':
                result = 'miles';
                break;
            case 'km':
                result = 'kilometers';
                break;
            default:
                break;
        }

        return result;
    };

    this.convert = function (initNum, initUnit) {
        const galToL = 3.78541;
        const lbsToKg = 0.453592;
        const miToKm = 1.60934;
        let result;

        switch (initUnit) {
            case 'gal':
                result = initNum * galToL;
                break;
            case 'l':
                result = initNum / galToL;
                break;
            case 'lbs':
                result = initNum * lbsToKg;
                break;
            case 'kg':
                result = initNum / lbsToKg;
                break;
            case 'mi':
                result = initNum * miToKm;
                break;
            case 'km':
                result = initNum / miToKm;
                break;
            default:
                break;
        }

        return result;
    };

    this.getString = function (initNum, initUnit, returnNum, returnUnit) {
        let result;

        // 3.1 miles converts to 5.00002 kilometers
        try {
            return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum.toFixed(5)} ${this.spellOutUnit(returnUnit)}`;
        } catch (e) {
            return "";
        }
    };

}

module.exports = ConvertHandler;