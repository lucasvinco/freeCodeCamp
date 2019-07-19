function rot13(str) { // SERR PBQR PNZC
    const CHAR_CODE_A = 65;
    const CHAR_CODE_Z = 90;
    const HALF_ALPHABET = 78;
    let arr = [];

    let charCode;
    for(let i = 0; i <= str.length; i++) {
        charCode = str.charCodeAt(i)
        if(charCode >= CHAR_CODE_A && charCode <= CHAR_CODE_Z) {
            if(charCode >= HALF_ALPHABET) {
                arr.push(String.fromCharCode(charCode-13));
            } else {
                arr.push(String.fromCharCode(charCode+13));
            }
        } else {
            arr.push(str[i]);
        }
    }
    return arr.join("");
}

// Change the inputs below to test
rot13("SERR PBQR PNZC");