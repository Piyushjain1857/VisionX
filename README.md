# 🌾 PS7 – Digital Doctor for Farmers  

## 👥 Team VisionX
- **Team Leader:** Piyush Jain  
- **Members:** Sneha, Rishab, Harshit  

-----------------------------------------------------------------------------------------------

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL** 

-----------------------------------------------------------------------------------------------

## 🚀 Option 1: Setup

1. **Install Backend Dependencies**:
   ```bash
   cd backend

   python -m venv venv1
   .\venv1\Scripts\activate

   python3.12 -m venv env2
   source env2/bin/activate

   pip install -r requirements.txt
   ```

-----------------------------------------------------------------------------------------------

2. **Configure Environment**:
   - Create a `.env` file in the `backend` folder 
   
-----------------------------------------------------------------------------------------------

3. **Initialize Database**:
   ```bash
   python setup_db.py
   ```

-----------------------------------------------------------------------------------------------

4. **Run the Application**:
   ```bash
   python main.py
   ```
   The backend will start at `http://localhost:8000`.

-----------------------------------------------------------------------------------------------

5. **Start Frontend**:
   ```bash
   cd ./frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

-----------------------------------------------------------------------------------------------

## 📁 Project Structure

- `backend/`: FastAPI application, SQLAlchemy models, and business logic.
- `backend/sql/`: SQL schema files.
- `frontend/`: React/Vite frontend application.
- `database_schema.sql`: (Moved to `backend/sql/database_schema.sql`)

-----------------------------------------------------------------------------------------------

## kill running instance
taskkill /F /IM python.exe

-----------------------------------------------------------------------------------------------

## 🚀 Innovation

- Combines AI + Geolocation + Local Language Accessibility
- Provides structured recovery roadmap (not just diagnosis)
- Designed specifically for rural farmers
- Voice-enabled system for low literacy users
- Scalable to multiple crops and regions

-----------------------------------------------------------------------------------------------


## 🔥 Key Features

- ✅ AI-powered crop disease detection  
- ✅ Pest identification  
- ✅ Location-based recommendations  
- ✅ Weather-aware advisory system  
- ✅ Local dialect voice support  
- ✅ Structured 7-day recovery plan  
- ✅ Diagnosis history tracking  
- ✅ Mobile-first design  

-----------------------------------------------------------------------------------------------

## 🔮 Future Scope

- Government scheme integration
- Expert consultation feature
- Agriculture marketplace integration
- Offline mode for low-network areas
- IoT-based soil sensor integration

-----------------------------------------------------------------------------------------------

## 📌 Conclusion

Digital Doctor for Farmers empowers rural communities with AI-driven agricultural intelligence.
By combining artificial intelligence, geolocation intelligence, and local language support, this solution bridges the gap between farmers and agricultural expertise — ensuring healthier crops and improved productivity.

-----------------------------------------------------------------------------------------------