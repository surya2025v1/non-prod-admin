import bcrypt

def generate_password_hash(password: str) -> str:
    """
    Generate a bcrypt hash for the given password.
    """
    # Convert password to bytes
    password_bytes = password.encode('utf-8')
    
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # Return the hash as a string
    return hashed.decode('utf-8')

if __name__ == "__main__":
    password = "Mypassword1234"
    hashed_password = generate_password_hash(password)
    
    print("\nPassword Hash Generation")
    print("-" * 50)
    print(f"Original password: {password}")
    print(f"Hashed password: {hashed_password}")
    print("\nYou can use this hash in your database or configuration.")
    print("To verify this password later, use:")
    print("bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))") 