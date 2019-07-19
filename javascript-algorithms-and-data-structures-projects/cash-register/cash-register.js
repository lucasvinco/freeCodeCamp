function calculateChange(value, cid, change) {
    let currencys = [["PENNY", 0.01],["NICKEL", 0.05],["DIME", 0.1],["QUARTER", 0.25],["ONE", 1],["FIVE", 5],["TEN", 10],["TWENTY", 20],["ONE HUNDRED", 100]];
    for(let j = currencys.length - 1; j >= 0; j--) {
        while(value >= currencys[j][1]) {
            if(value >= cid[j][1]) {
                value -= cid[j][1];
                change.push([currencys[j][0], cid[j][1]]);
                break;
            } else {
                let qtdNotas;
                if(value >= 1)
                    qtdNotas = Math.trunc(value / currencys[j][1]);
                else
                    qtdNotas = Math.trunc(Number((value % 1).toFixed(2)) / currencys[j][1]);
                
                change.push([currencys[j][0], qtdNotas * currencys[j][1]]);
                value -= qtdNotas * currencys[j][1];
                break;
            }
        }			
    }
}

function checkCashRegister(price, cash, cid) {
    let amount = 0;
    let diff = cash - price;
    let beforePointDecimal = Math.trunc(diff);
    let afterPointDecimal = Number((diff % 1).toFixed(2));
    let change = [];
    for(let i = 0; i < cid.length; i++) {
        amount += cid[i][1];
    }

    if(diff < amount) {
        calculateChange(beforePointDecimal, cid, change);
        calculateChange(afterPointDecimal, cid, change);

        let aux = 0;
        for(let i = 0; i < change.length; i++) {
            aux += change[i][1];
        }

        aux = Number(aux.toFixed(2));
        if(aux == diff)
            return {status: "OPEN", change: change};
        else
            return {status: "INSUFFICIENT_FUNDS", change: []};
    } else if (diff == amount) {
        return {status: "CLOSED", change: cid};
    } else {
        return {status: "INSUFFICIENT_FUNDS", change: []};
    }
}

// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.1],
// ["QUARTER", 4.25],
// ["ONE", 90],
// ["FIVE", 55],
// ["TEN", 20],
// ["TWENTY", 60],
// ["ONE HUNDRED", 100]]

checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);