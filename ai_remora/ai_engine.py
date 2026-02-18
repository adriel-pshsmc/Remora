from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def ask_ai(prompt: str):

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Fast + cheap
        messages=[
            {"role": "system", "content": "You are an expert logistics AI strategist."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

print("Loaded Key:", OPENAI_API_KEY)
