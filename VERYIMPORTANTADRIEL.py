# skuanalyzer.py

import os
import anthropic

# -------------------------------
# Set up Claude API client
# -------------------------------
# Make sure you have your API key set as an environment variable:
# export ANTHROPIC_API_KEY="your_api_key_here"
client = anthropic.Client(api_key=os.getenv("ANTHROPIC_API_KEY"))

# -------------------------------
# Example SKU dataset
# -------------------------------
# Each SKU has a name, category, price, units_sold, and stock
skus = [
    {"sku_id": "SKU001", "name": "Wireless Mouse", "category": "Electronics", "price": 25.99, "units_sold": 120, "stock": 40},
    {"sku_id": "SKU002", "name": "Yoga Mat", "category": "Sports", "price": 19.99, "units_sold": 200, "stock": 60},
    {"sku_id": "SKU003", "name": "Bluetooth Speaker", "category": "Electronics", "price": 49.99, "units_sold": 80, "stock": 20},
    {"sku_id": "SKU004", "name": "Coffee Mug", "category": "Home", "price": 9.99, "units_sold": 300, "stock": 100},
]

# -------------------------------
# Function to generate business insights
# -------------------------------
def generate_sku_recommendations(sku_data):
    # Prepare the prompt for Claude
    prompt = f"""
    You are a business analyst. Analyze the following SKU data and provide actionable recommendations
    for pricing, inventory, and marketing strategies. Also identify which products are top performers 
    and which are underperforming. Data:

    {sku_data}

    Provide your answer in a structured format:
    - SKU ID:
      - Recommendation:
      - Comments:
    """

    response = client.completions.create(
        model="claude-2",  # or "claude-3" if you have access
        prompt=anthropic.HUMAN_PROMPT + prompt + anthropic.AI_PROMPT,
        max_tokens_to_sample=500,
        temperature=0.7
    )

    # Return Claude's response
    return response.completion

# -------------------------------
# Run the analysis
# -------------------------------
if __name__ == "__main__":
    recommendations = generate_sku_recommendations(skus)
    print("=== Business Recommendations ===")
    print(recommendations)
