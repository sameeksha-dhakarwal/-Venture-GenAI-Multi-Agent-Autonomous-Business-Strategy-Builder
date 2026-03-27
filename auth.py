from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DB_NAME = "users.db"

# 🔥 DB INIT
def init_db():
    conn = sqlite3.connect(DB_NAME)
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
    conn.close()

init_db()

# 🔥 MODELS
class RegisterUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

class ChangePasswordModel(BaseModel):
    email: str
    new_password: str

# 🔐 HASH (FIXED)
def hash_password(password):
    password = password.encode("utf-8")[:72]
    return pwd_context.hash(password)

def verify_password(password, hashed):
    password = password.encode("utf-8")[:72]
    return pwd_context.verify(password, hashed)

# 🧾 REGISTER
@router.post("/register")
def register(user: RegisterUser):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:
        hashed = hash_password(user.password)

        cursor.execute(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
            (user.first_name, user.last_name, user.email, hashed)
        )
        conn.commit()

        return {"message": "User created successfully"}

    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User already exists")

    finally:
        conn.close()

# 🔑 LOGIN
@router.post("/login")
def login(user: LoginUser):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=?", (user.email,))
    result = cursor.fetchone()

    conn.close()

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

# 🔐 CHANGE PASSWORD
@router.post("/change-password")
def change_password(data: ChangePasswordModel):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    hashed = hash_password(data.new_password)

    cursor.execute(
        "UPDATE users SET password=? WHERE email=?",
        (hashed, data.email)
    )

    conn.commit()
    conn.close()

    return {"message": "Password updated"}