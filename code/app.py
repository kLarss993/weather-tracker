from flask import *
import requests

app = Flask(__name__)



@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])
def home():
    temp = None
    wndspd = None
    error = None

    if request.method == 'POST':
        city = request.form['city']

        if not city:
            error = "Please enter a city name."
        else:
            geo_url = "https://geocoding-api.open-meteo.com/v1/search"
            geo_params = {
                "name": city,
                "count": 1,
                "language": "en",
                "format": "json"
            }

        geo_url = "https://geocoding-api.open-meteo.com/v1/search"

        geo_params = {
            "name": city,
            "count": 1,
            "languages": "en,ua",
            "format": "json"
        }

        geo_data = requests.get(geo_url, params=geo_params).json()

        latitude = geo_data['results'][0]['latitude']
        longitude = geo_data['results'][0]['longitude']

        weath_url = "https://api.open-meteo.com/v1/forecast"

        weath_params = {
            "latitude": latitude,
            "longitude": longitude,
            "current_weather": True
        }

        weath_data = requests.get(weath_url, params=weath_params).json()

        temp = weath_data['current_weather']['temperature']
        wndspd = weath_data['current_weather']['windspeed']


    return render_template('home.html',
                           temp=temp,
                           wndspd=wndspd,
                           error=error)


if __name__ == '__main__':
    app.run(debug=True)