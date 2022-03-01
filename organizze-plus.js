"use strict";

var formatToBr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

checkDocument();

function checkDocument() {
    var accountsDiv = document.getElementsByClassName('zze-list-accounts')[0];
	var budgetUl = document.querySelector('div.zze-list-budgets > div > ul');
    if (accountsDiv && budgetUl) {
        console.log('organizze-plus :: doc is ready!')
        
        orderAccountsByAccountType();
		orderBudgetsByUsageDesc();
    
        var toggleInput = document.getElementsByClassName('zze-config ng-binding ng-scope')[0].firstChild;
        toggleInput.addEventListener('click', toggleInvestmentAccounts);
    
    } else {
        console.log('organizze-plus :: doc is not ready, waiting ...')
        setTimeout(checkDocument, 500);
    }
}

function sortAccountsByBalance(accounts) {
    return accounts.sort(function (a, b) {
        var aBalance = getAccountBalance(a);
        var bBalance = getAccountBalance(b);
        
        if (aBalance < bBalance)
            return 1
        else 
            return -1;
    });
}


function getAccountBalance(account) {
    var accountH1 = account.getElementsByTagName('h1')[0]
    return Number(accountH1.innerHTML.replace("R$ ", "").replace(".","").replace(",", "."))
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

    var accountsOrdered = sortAccountsByBalance(accounts);
    accountsUl.outerHTML = '<ul>' + accountsOrdered.reduce(function (init, el) { return init + el.outerHTML }, '') + '</ul>'
};

function orderAccountsByAccountType() {
    var accountsUl = document.querySelector('.zze-list-accounts > ul');
    var accountsList = accountsUl.childNodes;
    var accounts = [];
    var accountsByBank = {};
    
    accountsList.forEach(function (el) {
        if (el.nodeType !== Node.COMMENT_NODE) {
            accounts.push(el)
        };
    });

    accounts = sortAccountsByBalance(accounts)
    
    accounts.forEach(function (item) {
        var accountImg = item.querySelector('a > div > img');
        var accountIcon = item.querySelector('a > div > i');
        
        if (accountIcon)
            accountIcon = accountIcon.parentNode;

        var logoName = accountImg ? accountImg.src.split('/').pop() : accountIcon.style.backgroundColor;

        if (accountsByBank[logoName])
            accountsByBank[logoName] = [item, ...accountsByBank[logoName]]
        else
            accountsByBank[logoName] = [item]
    });

    var accountsOrdered = [];
    var bankSortered = Object.keys(accountsByBank);
    
    for (var bank in bankSortered) {
        var bankBalances = sortAccountsByBalance(accountsByBank[bankSortered[bank]])

        var totalBankBalance = bankBalances.reduce(function (sum, account) { 
            return sum + getAccountBalance(account) 
        }, 0)

        var totalBankBalanceFormated = formatToBr.format(totalBankBalance)
        var cssColor = totalBankBalance > 0 ? '#066e38' : '#ff7e75'
 
        var totalLi = document.createElement('li')
        totalLi.classList.add('zze-list-columns', 'ng-scope')
        totalLi.innerHTML = "<div class='row op-total'><div class='col-md-8'><h1 class='lb-title ng-binding' style='color:#555'>Total R$</h3></div><div class='col-md-4'><h1 class='ng-binding ng-scope' style='color:"+cssColor+"' >"+totalBankBalanceFormated+"</h1></div></div>"
        accountsOrdered = [...accountsOrdered, ...bankBalances, totalLi]
    }

    accountsUl.outerHTML = '<ul>' + accountsOrdered.reduce(function (init, el) { return init + el.outerHTML }, '') + '</ul>'
}


function toggleInvestmentAccounts() {
    var accountsListItems = document.querySelectorAll('.zze-list-accounts > ul > li');
    var totalsDiv = document.querySelectorAll('.op-total');
    var toggleInput = document.getElementsByClassName('zze-config ng-binding ng-scope')[0].firstChild;
    var shouldHide = !toggleInput.classList.contains('checked');

    if (shouldHide)
        accountsListItems.forEach(function (el) {
            var accountType = el.querySelector('a > span > p');
            if (accountType && accountType.textContent === 'Conta poupança / investimento') {
                el.style.visibility = 'hidden';
                el.style.display ='none';
                totalsDiv.forEach(function ({parentNode}) {
                    parentNode.style.visibility = 'hidden';
                    parentNode.style.display = 'none';
                })
            };
        });
    else 
        accountsListItems.forEach(function (el) {
            el.style.visibility = 'visible';
            el.style.display ='block';
            totalsDiv.forEach(function ({ parentNode }) {
                parentNode.style.visibility = 'visible';
                parentNode.style.display = 'block';
            })
        });
};

function orderBudgetsByUsageDesc() {
	var budgetUl = document.querySelector('div.zze-list-budgets > div > ul');
	var budgetLi = budgetUl.querySelectorAll('li');
	var budgetOrdered = [...budgetLi].sort(function (a, b) { 
		var aH1 = a.querySelector('h1');
		var bH1 = b.querySelector('h1');
		
		var aValue = Number(aH1.innerText.replace('%', ''));
		var bValue = Number(bH1.innerText.replace('%', ''));
		
		return (aValue < bValue) ? 1 : -1;
	});
	
	budgetUl.outerHTML = '<ul>' + budgetOrdered.reduce(function (init, el) { return init + el.outerHTML }, '') + '</ul>';
};
