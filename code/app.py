from flask import *
import requests

app = Flask(__name__)

def weather():
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": 50.45,
        "longitude": 30.52,
        "current_weather": True
    }

    resp = requests.get(url, params=params)
    data = resp.json()

    temp = data['current_weather']['temperature']
    wndspd = data['current_weather']['windspeed']

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')


if __name__ == '__main__':
    app.run(debug=True)