from flask import Flask, request, render_template, url_for, redirect, session
import pyodbc
from forms import AccountForm, CreditDebitForm
from db_session import Account

app = Flask(__name__)

app.config.update(TESTING=True, SECRET_KEY=b'_5#y2L"F4Q8z\n\xec]/')


@app.route("/", methods=["GET"])
def redirect_to_index():
    return redirect(url_for("index", id=0))


@app.route("/<int:id>", methods=["GET", "POST"])
def index(id):
    is_account_popup_active = ""
    accounts_form = AccountForm(request.form)
    accounts_form.hdn_account_id.data = id

    if id != 0 and request.method != "POST":
        db_account = Account.get_accounts(id)
        accounts_form.hdn_account_id.data = db_account[0]["ID"]
        accounts_form.account_type.process_data(db_account[0]["TYPE"])
        accounts_form.full_address.data = db_account[0]["ACCOUNT_HOLDER_ADDRESS"]
        accounts_form.full_name.data = db_account[0]["NAME"]
        accounts_form.mobile.data = db_account[0]["ACCOUNT_HOLDER_CONTACT_NUMBER"]
        accounts_form.account_number.data = db_account[0]["ACCOUNT_HOLDER_BANK_DETAILS"]
        is_account_popup_active = "active"

    transaction_form = CreditDebitForm()

    transaction_form.FROM_ACCOUNT.choices = Account.get_account_by_type(1)
    transaction_form.TO_ACCOUNT.choices = Account.get_account_by_type(2)
    print(request.method)
    if request.method == "POST":
        if accounts_form.validate():
            Account.create_account(accounts_form, id)
            return redirect(url_for("index", id=0))
        else:
            is_account_popup_active = "active"

    return render_template(
        "index.html",
        accounts=Account.get_accounts(0),
        account_transactions=Account.get_account_transaction(0, 0, 0),
        form=accounts_form,
        form2=transaction_form,
        is_account_popup_active=is_account_popup_active,
        is_trans_popop_active="",
    )


@app.route("/transaction/<int:id>", methods=["POST", "GET"])
def transaction(id):
    is_trans_popop_active = ""
    transaction_form = CreditDebitForm(request.form)
    transaction_form.hdn_transaction_id.data = id
    transaction_form.FROM_ACCOUNT.choices = Account.get_account_by_type(1)
    # transaction_form.FROM_ACCOUNT.default = "1"
    transaction_form.TO_ACCOUNT.choices = Account.get_account_by_type(2)
    # transaction_form.TO_ACCOUNT.default = "1"
    # transaction_form.process()

    if id != 0 and request.method != "POST":
        db_transaction_account = Account.get_account_transaction(0, 0, id)
        transaction_form.TRANSACTION_COMMENTS.data = db_transaction_account[0][
            "TRANSACTION_COMMENTS"
        ]
        transaction_form.TRANSACTION_AMOUNT.data = db_transaction_account[0][
            "TRANSACTION_AMOUNT"
        ]
        transaction_form.FROM_ACCOUNT.process_data(
            db_transaction_account[0]["FROM_ACCOUNT_ID"]
        )
        transaction_form.TO_ACCOUNT.process_data(
            db_transaction_account[0]["TO_ACCOUNT_ID"]
        )
        transaction_form.hdn_transaction_id.data = db_transaction_account[0][
            "TRANSACTION_ID"
        ]
        is_trans_popop_active = "active"

    if request.method == "POST":
        if transaction_form.validate():
            Account.save_transaction(transaction_form, id)
            return redirect(url_for("index", id=0))
        else:
            is_trans_popop_active = "active"

    return render_template(
        "index.html",
        accounts=Account.get_accounts(0),
        account_transactions=Account.get_account_transaction(0, 0, 0),
        form=AccountForm(),
        form2=transaction_form,
        is_account_popup_active="",
        is_trans_popop_active=is_trans_popop_active,
    )


if __name__ == "__main__":
    app.run(debug=True, host= '0.0.0.0')