

//? Two way

function localizeNumbers(node) {
    if (node.nodeType == Node.TEXT_NODE) {
        //node.data = node.data.replace(/([,\d]*\.?\d+)/g, localize);  with comma
        node.data = node.data.replace(/(\d*\.?\d+)/g, localize);  //without comma
    }
    node.childNodes.forEach(localizeNumbers);
}

function localize(numberString) {
    let number = Number(numberString.replace(/[^\d.]/g, ""));
    let persian = number?.toLocaleString("fa", { maximumFractionDigits: 10 });


    return persian;
}


//* Using localizeNumbers(document.getElementsByTagName('body')[0]);




const persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
function traverse(el) {
    if (el.nodeType == 3) {
        var list = el.data.match(/[0-9]/g);
        if (list != null && list.length != 0) {
            for (var i = 0; i < list.length; i++)
                el.data = el.data.replace(list[i], persian[list[i]]);
        }
    }
    for (var i = 0; i < el.childNodes.length; i++) {
        traverse(el.childNodes[i]);
    }
}

function toFarsiNumber(n) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return n
        ?.toString()
        .replace(/\d/g, x => farsiDigits[x]);
}
//* Using traverse(document.getElementsByTagName('body')[0]);



//* Helper
//? set isClient state in useEffect
//? if (isClient) {
//?   traverse(document.getElementsByTagName('body')[0]);
//?   localizeNumbers(document.getElementsByTagName('body')[0]);
//?  }

export {
    localizeNumbers,
    traverse,
    toFarsiNumber
}