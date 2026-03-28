from fastapi import FastAPI
from summary import scam_loss, contact_mode  # Remove the dot
from charts import line_chart, pie_chart, bar_chart  # Remove the dot
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Scam Dashboard API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Summary endpoints --------
@app.get("/summary/scam_loss")
def get_scam_loss(state: str = "ALL"):
    return scam_loss(state)

@app.get("/summary/contact_mode")
def get_contact_mode(state: str = "ALL"):
    return contact_mode(state)

# -------- Chart endpoints --------
@app.get("/charts/line")
def get_line_chart(state: str = "ALL"):
    return line_chart(state)

@app.get("/charts/pie")
def get_pie_chart(state: str = "ALL"):
    return pie_chart(state)

@app.get("/charts/bar")
def get_bar_chart(state: str = "ALL"):
    return bar_chart(state)