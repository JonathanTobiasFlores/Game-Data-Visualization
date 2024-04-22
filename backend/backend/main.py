from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from backend.utils.data_processor import load_data
from fastapi.responses import JSONResponse
import numpy as np

app = FastAPI()

# Allow all domains during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend's domain instead of '*'
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data", response_class=JSONResponse)
async def read_data():
    data = load_data("./videogamesales.csv")
    if data is not None:
        # Convert DataFrame to JSON, replacing NaN with None
        json_compatible_data = data.loc[:25].replace({np.nan: None}).to_dict(orient='records')
        return json_compatible_data
    else:
        return Response(content="Failed to load data", status_code=400, media_type='text/plain')
