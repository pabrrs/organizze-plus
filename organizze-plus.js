"use strict";

checkDocument();

function checkDocument() {
    var accountsDiv = document.getElementsByClassName('zze-list-accounts')[0]
    if (accountsDiv) {
        console.log('organizze-plus :: doc is ready!')
        orderAccountsByBalanceDesc();
        document.addEventListener('DOMContentLoaded', orderAccountsByBalanceDesc);
    } else {
        console.log('organizze-plus :: doc is not ready, waiting ...')
        setTimeout(checkDocument, 500);
    }
}

function orderAccountsByBalanceDesc() {
    var accountsDiv = document.getElementsByClassName('zze-list-accounts')[0];
    var accountsUl = accountsDiv.firstChild;
    var accountsList = accountsUl.childNodes;
    var accounts = [];
    accountsList.forEach(function (el) {
        if (el.nodeType !== Node.COMMENT_NODE) {
            accounts.push(el)
        }
    });
    var accountsOrdered = accounts.sort(function (a, b) {
        var aAccountH1 = a.getElementsByTagName('h1')[0]
        var BAccountH1 = b.getElementsByTagName('h1')[0]

        var aBalance = Number(aAccountH1.innerHTML.replace("R$ ", "").replace(".","").replace(",", "."))
        var bBalance = Number(BAccountH1.innerHTML.replace("R$ ", "").replace(".","").replace(",", "."))
        
        if (aBalance < bBalance)
            return 1
        else 
            return -1;
    })
    accountsUl.outerHTML = '<ul>' + accountsOrdered.reduce(function (init, el) { return init + el.outerHTML }, '') + '</ul>'
};
