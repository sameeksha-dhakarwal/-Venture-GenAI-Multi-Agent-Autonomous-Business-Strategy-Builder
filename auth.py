from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔥 DB INIT
conn = sqlite3.connect("users.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    password TEXT
)
""")
conn.commit()

# 🔥 MODELS
class RegisterUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

# 🔐 HASH
def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

# 🧾 REGISTER
@router.post("/register")
def register(user: RegisterUser):
    try:
        hashed = hash_password(user.password)

        cursor.execute(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
            (user.first_name, user.last_name, user.email, hashed)
        )
        conn.commit()

        return {"message": "User created successfully"}

    except:
        raise HTTPException(status_code=400, detail="User already exists")

# 🔑 LOGIN
@router.post("/login")
def login(user: LoginUser):
    cursor.execute("SELECT * FROM users WHERE email=?", (user.email,))
    result = cursor.fetchone()

    if not result:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, result[4]):
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful",
        "user": {
            "first_name": result[1],
            "last_name": result[2],
            "email": result[3]
        }
    }

@router.post("/change-password")
def change_password(email: str, new_password: str):
    hashed = hash_password(new_password)

    cursor.execute(
        "UPDATE users SET password=? WHERE email=?",
        (hashed, email)
    )
    conn.commit()

    return {"message": "Password updated"}