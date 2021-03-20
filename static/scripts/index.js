function toggleAccountPopup(self) {
    var popup = document.getElementById('addAccountPopup')
    popup.classList.toggle('active')
    document.querySelector('#addAccountPopup .popup-contents').classList.toggle('in')
    // document.querySelector('.popup-container').classList.toggle('kuchli')
}

function toggleTransactionPopup(self) {
    var popup = document.getElementById('transferMoneyPopup')
    popup.classList.toggle('active')
    document.querySelector('#transferMoneyPopup .popup-contents').classList.toggle('in')
    // document.querySelector('.main_container').classList.toggle('fademe')
    // document.querySelector('.popup-container').classList.toggle('kuchli')
}

document.querySelector('#search_accounts').focus();

document.querySelector('#search_accounts').addEventListener('keyup', (event) => {
    var search_str = event.target.value.toLowerCase()

    var account_list = document.querySelectorAll('#accounts_container button');

    account_list.forEach(li => {

        if (li.innerText.toLowerCase().indexOf(search_str) < 0) {
            li.setAttribute('style', 'display:none;');
        } else {
            li.setAttribute('style', '');
        }

    })
})


document.querySelector('#account_transaction_search').addEventListener('keyup', (event) => {
    var search_str = event.target.value.toLowerCase()

    var account_transaction_list = document.querySelectorAll('#account_transactions_container td');

    var rows_to_show = Array.from(account_transaction_list)
        .filter(td => td.innerText.toLowerCase().indexOf(search_str) >= 0)
        .map(filtered_td => filtered_td.parentElement.rowIndex)

    document.querySelectorAll('#account_transactions_container tr').forEach((tr, index) => {
        if (index != 0) {
            if (rows_to_show.some(x => x == tr.rowIndex)) {
                tr.setAttribute('style', '');
            } else {
                tr.setAttribute('style', 'display:none;');
            }
        }
    })
})

/*

account_transaction_list.filter(td => {
filtered_td.parentElement.setAttribute('style', 'display:none;');
        // tr.querySelectorAll('td').forEach(td => {
        console.log(td.innerText)
        if (td.innerText.toLowerCase().indexOf(search_str) < 0) {
            td.parentElement.setAttribute('style', 'display:none;');
        } else {
            // tr.setAttribute('style', '');
        }
        // })

    })
*/