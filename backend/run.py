import os
import sys

# Get absolute path to CampusQ backend
backend_dir = os.path.dirname(os.path.abspath(__file__))

# 1. Force current process to use CampusQ backend
sys.path.insert(0, backend_dir)

# 2. Force Uvicorn reloader child processes to use CampusQ backend
os.environ["PYTHONPATH"] = backend_dir

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)