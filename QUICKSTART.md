## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL** 
---

## 🚀 Option 1: Automated setup (Recommended)

1. **Install Backend Dependencies**:
   ```bash
   cd backend

   python -m venv venv1
   .\venv1\Scripts\activate

   python3.12 -m venv env2
   source env2/bin/activate

   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   - Create a `.env` file in the `backend` folder 
   
3. **Initialize Database**:
   ```bash
   python setup_db.py
   ```

4. **Run the Application**:
   ```bash
   python main.py
   ```
   The backend will start at `http://localhost:8000`. It will also seed initial data automatically.

5. **Start Frontend**:
   ```bash
   cd ./frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port shown in your terminal).


## 📁 Project Structure

- `backend/`: FastAPI application, SQLAlchemy models, and business logic.
- `backend/sql/`: SQL schema files.
- `frontend/`: React/Vite frontend application.
- `database_schema.sql`: (Moved to `backend/sql/database_schema.sql`)

## kill running instance
taskkill /F /IM python.exe