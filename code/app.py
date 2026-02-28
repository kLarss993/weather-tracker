from flask import *
from datetime import *
import requests

app = Flask(__name__)



@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])
def home():
    now = datetime.now()
    
    temp = None
    wndspd = None
    error = None
    city = None

    if request.method == 'POST':
        city = request.form['city']


        if not city:
            error = "Please enter a city name."
        else:
            city=city.capitalize()

            geo_url = "https://geocoding-api.open-meteo.com/v1/search"
            geo_params = {
                "name": city,
                "count": 1,
                "language": "en,ua",
                "format": "json"
            }

        geo_data = requests.get(geo_url, params=geo_params).json()

        if not geo_data.get("results"):
            error = "City not found."
            return render_template("home.html", error=error)

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
        city = geo_data['results'][0]['name']


        url = "https://api.open-meteo.com/v1/forecast"

        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ["temperature_2m", "windspeed_10m"],
            "timezone": "Europe/Kyiv"
        }

        data = requests.get(url, params=params).json()

        times = data["hourly"]["time"]
        temps = data["hourly"]["temperature_2m"]
        winds = data["hourly"]["windspeed_10m"]

        target_date = "2026-03-01"

        result = []

        for i, t in enumerate(times):
            if t.startswith(target_date):
                result.append((t, temps[i], winds[i]))

        print(result)


    return render_template('home.html',
                           now=now,
                           temp=temp,
                           wndspd=wndspd,
                           error=error,
                           city=city)


app.run(debug=True)