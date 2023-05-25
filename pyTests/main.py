import openai


def get_answer(explain: str):
    openai.organization = "org-4oUUgYA0pePxHqKXR4CNrMq5"
    openai.api_key = "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"

    messages = [
        {"role": "system", "content": "Your job is to explain the topic the best you can ONLY using emojis. "
                                      "Explain everything clearly and use as many emojis as required. "
                                      "Do not include any other text. "},
        {"role": "user", "content": f'{explain}. Remember, you can only use emojis no other characters.'},
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.7,
        messages=messages,
    )

    return response["choices"][0]["message"]["content"]


print(get_answer("9/11"))
