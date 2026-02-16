import requests
from app.config import LITELLM_ENDPOINT, LITELLM_MASTER_KEY

def ask_ai(prompt: str):

    response = requests.post(
        LITELLM_ENDPOINT,
        headers={
            "Authorization": f"Bearer {LITELLM_MASTER_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "universal-coder",
            "messages": [
                {"role": "system", "content": "You are an expert logistics AI strategist."},
                {"role": "user", "content": prompt}
            ]
        }
    )

    return response.json()["choices"][0]["message"]["content"]
