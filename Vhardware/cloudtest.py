import requests

ngrok_url = "https://abcd1234.ngrok.io"  # replace with your URL
response = requests.post(f"{ngrok_url}/play")
print(response.text)
