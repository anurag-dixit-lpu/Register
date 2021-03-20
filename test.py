import pyodbc

# server = "localhost\\sqlexpress"
# database = "StockManagementSystem"

cnxn = pyodbc.connect(
    r"Driver=SQL Server;Server=.\SQLEXPRESS;Database=StockManagementSystem;Trusted_Connection=yes;"
)
cursor = cnxn.cursor()
cursor.execute("SELECT * FROM SMS_ACCOUNTS")
while 1:
    row = cursor.fetchone()
    print(type(row))
    if not row:
        break
    print(row)
cnxn.close()