"use strict";

checkDocument();

function checkDocument() {
    var accountsDiv = document.getElementsByClassName('zze-list-accounts')[0]
    if (accountsDiv) {
        console.log('organizze-plus :: doc is ready!')
        
        orderAccountsByAccountType();
    
        var toggleInput = document.getElementsByClassName('zze-config ng-binding ng-scope')[0].firstChild;
        toggleInput.addEventListener('click', toggleInvestmentAccounts);
    
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

function orderAccountsByAccountType() {
    var accountsUl = document.querySelector('.zze-list-accounts > ul');
    var accountsList = accountsUl.childNodes;
    var accounts = [];
    
    accountsList.forEach(function (el) {
        if (el.nodeType !== Node.COMMENT_NODE) {
            accounts.push(el)
        };
    });
    
    var accountsOrdered = accounts.sort(function (a, b) {
        var aAccountImg = a.querySelector('a > div > img');
        var aAccountIcon = a.querySelector('a > div > i');
        
        if (aAccountIcon) {
            aAccountIcon = aAccountIcon.parentNode;
        }
        
        var bAccountImg = b.querySelector('a > div > img');
        var bAccountIcon = b.querySelector('a > div > i');

        if (bAccountIcon) {
            bAccountIcon = bAccountIcon.parentNode;
        }

        var aLogo = aAccountImg ? aAccountImg.src.split('/').pop() : aAccountIcon.style;
        var bLogo = bAccountImg ? bAccountImg.src.split('/').pop() : bAccountIcon.style;

        if (aLogo > bLogo)
            return 1;
        else 
            return -1;
    });

    accountsUl.outerHTML = '<ul>' + accountsOrdered.reduce(function (init, el) { return init + el.outerHTML }, '') + '</ul>'
};


function toggleInvestmentAccounts() {
    var accountsListItems = document.querySelectorAll('.zze-list-accounts > ul > li');
    
    var toggleInput = document.getElementsByClassName('zze-config ng-binding ng-scope')[0].firstChild;
    var shouldHide = !toggleInput.classList.contains('checked');

    if (shouldHide)
        accountsListItems.forEach(function (el) {
            var accountType = el.querySelector('a > span > p');
            if (accountType.textContent === 'Conta poupança / investimento') {
                el.style.visibility = 'hidden';
                el.style.display ='none';
            };
        });
    else 
        accountsListItems.forEach(function (el) {
            el.style.visibility = 'visible';
            el.style.display ='block';
        });
};