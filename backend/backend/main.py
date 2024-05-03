from fastapi import FastAPI, Response, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np

app = FastAPI()

# Allow all domains during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_data(file_path: str):
    try:
        # Load the dataset with pandas
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        print(f"Error loading the data: {e}")
        return None

@app.get("/data", response_class=JSONResponse)
async def read_data(name: str = Query(None), genre: str = Query(None), platform: str = Query(None), year: str = Query(None), publisher: str = Query(None), page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1)):
    data = load_data("./videogamesales.csv")
    if data is None:
        raise HTTPException(status_code=400, detail="Failed to load data")

    # Filter data based on query parameters
    if name:
        data = data[data['Name'].str.contains(name, case=False, na=False)]
    if genre:
        data = data[data['Genre'].str.contains(genre, case=False, na=False)]
    if platform:
        data = data[data['Platform'].str.contains(platform, case=False, na=False)]
    if year:
        data = data[data['Year'].astype(str).str.contains(year, case=False, na=False)]
    if publisher:
        data = data[data['Publisher'].str.contains(publisher, case=False, na=False)]
    
    total_items = len(data)  # Get the total number of filtered items
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_data = data.iloc[start_index:end_index].replace({np.nan: None}).to_dict(orient='records')

    # Return both paginated data and total item count
    return {"total": total_items, "data": paginated_data}

