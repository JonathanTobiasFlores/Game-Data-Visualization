import pandas as pd

def load_data(file_path):
    """
    Load data from a CSV file.
    Args:
    file_path (str): The path to the CSV file.

    Returns:
    DataFrame: A pandas DataFrame containing the loaded data.
    """
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        print(f"Error loading the data: {e}")
        return None
