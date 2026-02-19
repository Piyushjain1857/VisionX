from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth_api, farmer_api, admin_api, chat_api, discussion_api, diagnosis_api

from seed_db import seed_data

app = FastAPI(title="AgroGuard AI API")

@app.on_event("startup")
def startup_db_seed():
    print('seeding database')
    # seed_data()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_api.router)
app.include_router(farmer_api.router)
app.include_router(admin_api.router)
app.include_router(chat_api.router)
app.include_router(discussion_api.router)
app.include_router(diagnosis_api.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to AgroGuard AI API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
