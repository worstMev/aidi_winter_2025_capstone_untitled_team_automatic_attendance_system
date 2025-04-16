# snowflake_connection.py
import boto3
import json
from botocore.exceptions import ClientError
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
import snowflake.connector as sc

# Create the S3 client and session for AWS Secrets Manager.
s3 = boto3.client(
    's3',
    aws_access_key_id='',
    aws_secret_access_key='',
)

session = boto3.session.Session(
    aws_access_key_id='',
    aws_secret_access_key='',
    region_name='us-east-2'
)

client = session.client('secretsmanager')

def get_secret():
    secret_name = "snowflake/face_rec/rsa_private_key"
    region_name = "us-east-2"
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e
    secret = get_secret_value_response['SecretString']
    return secret

def load_private_key(pem_str, key_password=None):
    private_key = serialization.load_pem_private_key(
        pem_str.encode("utf-8"),
        password=key_password.encode("utf-8") if key_password else None,
        backend=default_backend()
    )
    return private_key

def get_snowflake_connection():
    pem_private_key = get_secret()
    key_password = None  # Update if your private key is password-protected.
    private_key = load_private_key(pem_private_key, key_password=key_password)
    conn_params = {
        'account': 'TIMCEXC-MYB81917',
        'user': 'face_rec_service',
        'private_key': private_key,
        'warehouse': 'COMPUTE_WH',
        'database': 'RECOG_DB',
        'schema': 'ATTEND'
    }
    ctx = sc.connect(**conn_params)
    return ctx

# Create a global connection and cursor to be used by other modules.
ctx = get_snowflake_connection()
cs = ctx.cursor()
