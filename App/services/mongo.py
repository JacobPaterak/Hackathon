import certifi
from pymongo import MongoClient
from .config import MONGO_URI, DB_NAME

_client: MongoClient | None = None

def get_db():
    global _client
    if _client is None:
        # Use certifi CA bundle to satisfy TLS verification (Atlas)
        _client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = _client[DB_NAME]
    return db
