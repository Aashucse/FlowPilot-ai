from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"response": "Please type something."})

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openrouter/auto",
                "messages": [
                    {"role": "system", "content": "You are a smart productivity AI assistant."},
                    {"role": "user", "content": user_message}
                ]
            }
        )

        result = response.json()
        print(result)  # debug

        if "choices" in result:
            ai_text = result["choices"][0]["message"]["content"]
        else:
            ai_text = str(result)

        return jsonify({"response": ai_text})

    except Exception as e:
        return jsonify({"response": str(e)})


if __name__ == "__main__":
    app.run(debug=True)