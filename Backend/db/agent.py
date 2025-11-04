import pandas as pd
import re

# Function to validate email addresses
def is_valid_email(email):
    # Regular expression pattern for email validation
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# Read the Excel file
df = pd.read_excel('your_file.xlsx')

# Check if 'email' column exists
if 'email' in df.columns:
    # Iterate over each row and check email validity
    for index, row in df.iterrows():
        email = row['email']
        if pd.notna(email) and not is_valid_email(email):
            print(f"Invalid email '{email}' found in row {index + 2}.")
else:
    print("Email column not found in the Excel file.")