import pyodbc


class Account:
    @staticmethod
    def get_account_by_type(account_type):
        my_accounts = []
        cnxn = pyodbc.connect(
            r"Driver=SQL Server;Server=.\SQLEXPRESS;Database=StockManagementSystem;Trusted_Connection=yes;"
        )
        cursor = cnxn.cursor()
        cursor.execute(
            f"SELECT '0' AS ID, 'SELECT ACCOUNT' AS NAME UNION ALL SELECT ACCOUNT_ID ID, ACCOUNT_HOLDER_FULL_NAME NAME FROM SMS_ACCOUNTS WHERE ACCOUNT_TYPE = {account_type}"
        )
        while 1:
            row = cursor.fetchone()
            if not row:
                break
            my_accounts.append(
                (
                    row.ID,
                    row.NAME,
                )
            )
        cnxn.close()

        return my_accounts

    @staticmethod
    def get_account_transaction(from_account, to_account, transaction_id):
        my_accounts_transactions = []
        cnxn = pyodbc.connect(
            r"Driver=SQL Server;Server=.\SQLEXPRESS;Database=StockManagementSystem;Trusted_Connection=yes;"
        )
        cursor = cnxn.cursor()
        cursor.execute(
            f"""SELECT	SAT.TRANSACTION_ID, 
					SA_FROM.ACCOUNT_HOLDER_FULL_NAME FROM_ACCOUNT, 
					SA_TO.ACCOUNT_HOLDER_FULL_NAME TO_ACCOUNT,
					SAT.TRANSACTION_AMOUNT,
					SAT.TRANSACTION_COMMENTS,
					STT.TRANSACTION_TYPE_SHORT_NAME TRANSACTION_TYPE,
					STT.TRANSACTION_TYPE_DESC,
					CONVERT(VARCHAR(20),SAT.Transaction_Date, 22) DT,
					SAT.Transaction_By,
                    SA_FROM.ACCOUNT_ID FROM_ACCOUNT_ID,
                    SA_TO.ACCOUNT_ID TO_ACCOUNT_ID
			FROM	SMS_ACCOUNT_TRANSACTIONS SAT INNER JOIN 
					SMS_ACCOUNTS SA_FROM ON
						SAT.FROM_ACCOUNT = SA_FROM.ACCOUNT_ID INNER JOIN 
					SMS_ACCOUNTS SA_TO ON
						SAT.TO_ACCOUNT = SA_TO.ACCOUNT_ID INNER JOIN
					SMS_TRANSACTION_TYPE STT ON
						SAT.TRANSACTION_TYPE = STT.TRANSACTION_TYPE_ID
			WHERE	(
                        0 = {transaction_id} OR SAT.TRANSACTION_ID = {transaction_id}
                    ) AND
                    (
						0 = {from_account} OR SAT.FROM_ACCOUNT = {from_account}
					) AND
					(
						0 = {to_account} OR SAT.TO_ACCOUNT = {to_account}
					)"""
        )
        while 1:
            row = cursor.fetchone()
            if not row:
                break
            my_accounts_transactions.append(
                {
                    "TRANSACTION_ID": row.TRANSACTION_ID,
                    "FROM_ACCOUNT": row.FROM_ACCOUNT,
                    "TRANSACTION_COMMENTS": row.TRANSACTION_COMMENTS,
                    "TO_ACCOUNT": row.TO_ACCOUNT,
                    "TRANSACTION_TYPE": row.TRANSACTION_TYPE,
                    "TRANSACTION_AMOUNT": row.TRANSACTION_AMOUNT,
                    "DT": row.DT,
                    "Transaction_By": row.Transaction_By,
                    "FROM_ACCOUNT_ID": row.FROM_ACCOUNT_ID,
                    "TO_ACCOUNT_ID": row.TO_ACCOUNT_ID,
                }
            )

        cnxn.close()
        return my_accounts_transactions

    @staticmethod
    def create_account(accounts_form, id):
        cnxn = pyodbc.connect(
            r"Driver=SQL Server;Server=.\SQLEXPRESS;Database=StockManagementSystem;Trusted_Connection=yes;"
        )
        cursor = cnxn.cursor()
        if id is 0:
            print("account insert")
            cursor.execute(
                """INSERT INTO SMS_ACCOUNTS(ACCOUNT_TYPE,
                                ACCOUNT_HOLDER_FULL_NAME, 
                                ACCOUNT_HOLDER_ADDRESS, 
                                ACCOUNT_HOLDER_CONTACT_NUMBER, 
                                ACCOUNT_HOLDER_BANK_DETAILS)
                                VALUES(?, ?, ?, ?, ?)""",
                accounts_form.account_type.data,
                accounts_form.full_name.data,
                accounts_form.full_address.data,
                accounts_form.mobile.data,
                accounts_form.account_number.data,
            )
        else:
            print("account update")
            cursor.execute(
                """UPDATE	SMS_ACCOUNTS
                    SET		ACCOUNT_TYPE=?,
                    		ACCOUNT_HOLDER_FULL_NAME=?, 
                    		ACCOUNT_HOLDER_ADDRESS=?, 
                    		ACCOUNT_HOLDER_CONTACT_NUMBER=?, 
                    		ACCOUNT_HOLDER_BANK_DETAILS=?
                    WHERE	ACCOUNT_ID = ?""",
                accounts_form.account_type.data,
                accounts_form.full_name.data,
                accounts_form.full_address.data,
                accounts_form.mobile.data,
                accounts_form.account_number.data,
                id,
            )
        cnxn.commit()
        cnxn.close()
        return 1

    @staticmethod
    def get_accounts(id):
        my_accounts = []
        cnxn = pyodbc.connect(
            r"Driver=SQL Server;Server=.\SQLEXPRESS;Database=StockManagementSystem;Trusted_Connection=yes;"
        )
        cursor = cnxn.cursor()
        cursor.execute(
            f"SELECT * FROM SMS_ACCOUNTS WHERE (0 = {id}) OR ACCOUNT_ID = {id}"
        )
        while 1:
            row = cursor.fetchone()
            if not row:
                break
            my_accounts.append(
                {
                    "ID": row.ACCOUNT_ID,
                    "NAME": row.ACCOUNT_HOLDER_FULL_NAME,
                    "TYPE": row.ACCOUNT_TYPE,
                    "ACCOUNT_HOLDER_FULL_NAME": row.ACCOUNT_HOLDER_FULL_NAME,
                    "ACCOUNT_HOLDER_ADDRESS": row.ACCOUNT_HOLDER_ADDRESS,
                    "ACCOUNT_HOLDER_CONTACT_NUMBER": row.ACCOUNT_HOLDER_CONTACT_NUMBER,
                    "ACCOUNT_HOLDER_BANK_DETAILS": row.ACCOUNT_HOLDER_BANK_DETAILS,
                }
            )
        cnxn.close()

        return my_accounts

    @staticmethod
    def save_transaction(accounts_form, id):
        cnxn = pyodbc.connect(
            r"Driver=SQL Server;Server=.\SQLEXPRESS;Database=StockManagementSystem;Trusted_Connection=yes;"
        )
        cursor = cnxn.cursor()
        if id is 0:
            print("new transaction")
            cursor.execute(
                """INSERT INTO [dbo].[SMS_ACCOUNT_Transactions]
                    ([FROM_ACCOUNT]
                    ,[TRANSACTION_COMMENTS]
                    ,[TO_ACCOUNT]
                    ,[TRANSACTION_TYPE]
                    ,[TRANSACTION_AMOUNT]
                    ,[Transaction_By])
                VALUES (?,?,?,?,?,?)
                """,
                accounts_form.FROM_ACCOUNT.data,
                accounts_form.TRANSACTION_COMMENTS.data,
                accounts_form.TO_ACCOUNT.data,
                1,
                accounts_form.TRANSACTION_AMOUNT.data,
                1,
            )
        else:
            print("update transaction")
            cursor.execute(
                """UPDATE	[dbo].[SMS_ACCOUNT_Transactions]
                    SET		FROM_ACCOUNT=?,
                    		TO_ACCOUNT=?, 
                    		TRANSACTION_AMOUNT=?, 
                    		TRANSACTION_COMMENTS=?
                    WHERE	TRANSACTION_ID = ?""",
                accounts_form.FROM_ACCOUNT.data,
                accounts_form.TO_ACCOUNT.data,
                accounts_form.TRANSACTION_AMOUNT.data,
                accounts_form.TRANSACTION_COMMENTS.data,
                id,
            )

        cnxn.commit()
        cnxn.close()
        return 1
