from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, HiddenField
from wtforms.validators import DataRequired, Length, InputRequired, ValidationError


class AccountForm(FlaskForm):
    hdn_account_id = HiddenField(None, None)
    account_type = SelectField(
        "Account Type", choices=[("2", "Other Account"), ("1", "My Account")]
    )
    full_name = StringField(
        "Full Name", validators=[DataRequired(), Length(min=2, max=200)]
    )
    full_address = StringField(
        "Full Address", validators=[DataRequired(), Length(min=10, max=1000)]
    )
    mobile = StringField("Mobile", validators=[DataRequired(), Length(min=10, max=15)])
    account_number = StringField(
        "Account Number", validators=[DataRequired(), Length(min=10, max=25)]
    )


def select_an_account(form, field):
    if field.data == 0:
        raise ValidationError("Please select an account")


class CreditDebitForm(FlaskForm):
    hdn_transaction_id = HiddenField(None, None)
    FROM_ACCOUNT = SelectField(
        "From Account",
        coerce=int,
        validators=[InputRequired(), select_an_account],
        default=1,
    )
    TO_ACCOUNT = SelectField(
        "To Account",
        coerce=int,
        validators=[InputRequired(), select_an_account],
        default=0,
    )
    TRANSACTION_AMOUNT = StringField(
        "Amount", validators=[DataRequired(), Length(min=1, max=200)]
    )
    TRANSACTION_COMMENTS = StringField(
        "Comments", validators=[DataRequired(), Length(min=3, max=1000)]
    )
