function palindrome(str) {
    // Good luck!
    let re = /[^0-9a-zA-Z]+/g;
    str = str.replace(re, '');
    str = str.toLowerCase();
    let aux = "";
    for(let i = str.length - 1; i >= 0; i--) {
        aux += str[i];
    }

    if(aux === str)
        return true;
    else
        return false;
}

palindrome("eye");