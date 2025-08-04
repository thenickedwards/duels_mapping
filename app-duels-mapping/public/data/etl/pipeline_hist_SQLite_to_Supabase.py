import os
from dotenv import load_dotenv
load_dotenv()
from data_handler import DataHandler
data_handler = DataHandler()
import sqlite3


# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")


def pipeline_hist_SQLite_to_Supabase():
    # Upload SQLite data to Supabase
    data_handler.insert_hist_SQLite_to_Supabase(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_ANON_KEY)




if __name__ == "__main__":
    pipeline_hist_SQLite_to_Supabase()