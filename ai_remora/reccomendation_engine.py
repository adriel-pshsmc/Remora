from ai_engine import ask_ai

def generate_recommendations(df):

    if df.empty:
        return "No SKU data available."

    summary = df.to_dict(orient="records")

    prompt = f"""
    Analyze this SKU dataset:

    {summary}

    Provide:
    1. Reorder recommendations
    2. Overstock risks
    3. Profit optimization strategies
    4. Supplier risk warnings
    5. Demand forecast insights
    """

    return ask_ai(prompt)
