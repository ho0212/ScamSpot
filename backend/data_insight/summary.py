import pandas as pd
from db import engine
from sqlalchemy import text

def scam_loss(state: str = "ALL"):
    """
    This function returns top three scam types with corresponding amount of loss
    for complainants aged 65 and over, optionally filtered by state.

    Args:
        state (str): State name. Default to "ALL", which returns results across all states.

    Returns:
        list[dict]: A list of dictionaries, each containing:
            - "Scam_Type" (str): The scam types.
            - "Total_Lost" (float): The total amount of loss from the corresponding type.

    """
    query = """
    SELECT "Scam_Type", SUM("Amount_Lost") AS "Total_Lost"
    FROM data_insight
    WHERE (%(state)s = 'ALL' OR "Address_State" = %(state)s)
      AND "Complainant_Age" = '65 and over'
    GROUP BY "Scam_Type"
    ORDER BY "Total_Lost" DESC
    LIMIT 3;
    """

    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params={"state": state})
    df["Total_Lost"] = df["Total_Lost"].round(2)
    return df.to_dict(orient="records")

def contact_mode(state: str = "ALL"):
    """
    This function returns top three scam contact methods with counts
    for complainants aged 65 and over, optionally filtered by state.

    Args:
        state (str): State name. Default to "ALL", which returns results across all states.

    Returns:
        list[dict]: A list of dictionaries, each containing:
            - "Contact_Mode" (str): Contact method.
            - "Reports" (int): The count of corresponding contact method.

    """
    query = """
    SELECT "Contact_Mode", SUM("Number_of_reports") AS "Reports"
    FROM data_insight
    WHERE (%(state)s = 'ALL' OR "Address_State" = %(state)s)
      AND "Complainant_Age" = '65 and over'
    GROUP BY "Contact_Mode"
    ORDER BY "Reports" DESC
    LIMIT 3;
    """

    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params={"state": state})
    df["Reports"] = df["Reports"].astype(int)
    return df.to_dict(orient="records")
