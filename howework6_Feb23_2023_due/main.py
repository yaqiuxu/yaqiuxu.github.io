from flask import Flask, request
from geolib import geohash
import requests

app = Flask(__name__)

google_api_key = "AIzaSyBgPDvrR3oX-ydXSErm31Tho82ik7DquSo"
ticket_master_token = "sSaF4zzRA6ok1AhXYGY7JryMB4lSTKAG"
category_map = {
    "defalt": "",
    "music": "KZFzniwnSyZfZ7v7nJ",
    "sports": "KZFzniwnSyZfZ7v7nE",
    "artsTheater": "KZFzniwnSyZfZ7v7na",
    "film": "KZFzniwnSyZfZ7v7nn",
    "miscellaneous": "KZFzniwnSyZfZ7v7n1"
}

@app.route('/')
def index():
    return app.send_static_file("index.html")

@app.route('/searchEvents')
def search():
    keyword = request.args.get("keyword")
    distance = request.args.get("distance")
    category = request.args.get("category")
    auto_location = request.args.get("auto_location")
    location = request.args.get("location")
    location_hash = ""
    
    if auto_location == "true":
        lat, lng = location.split(',')
        location_hash = geohash.encode(lat, lng, 7)
    else:
        geo_params = {
            "address": location,
            "key": google_api_key
        }
        geo_response = requests.get("https://maps.googleapis.com/maps/api/geocode/json", geo_params)
        geo_json = geo_response.json()        
        # print(geo_params)
        # print(geo_json)

        if(len(geo_json.get("results", [])) > 0):
            latitude = geo_json['results'][0]['geometry']['location']['lat']
            longitude = geo_json['results'][0]['geometry']['location']['lng']
            location_hash = geohash.encode(latitude, longitude, 7)
        else:
            # Geocoding Failure, location_hash == ""
            return {
                "events": [],
                "geocode": False
            }
        
    ticket_parmas = {
        "keyword": keyword,
        "radius": distance,
        "unit": "miles",
        "geoPoint": location_hash,
        "segmentId": category_map.get(category),
        "apikey": ticket_master_token,
    }
    print("search event pramas: ", ticket_parmas)
    ticket_response = requests.get("https://app.ticketmaster.com/discovery/v2/events.json", ticket_parmas)
    ticket_json = ticket_response.json()
    return ticket_json.get("_embedded", {"events": []})

@app.route('/eventDetail')
def eventDetail():
    id = request.args.get("id")
    ticket_parmas = {
        "id": id,
        "apikey": ticket_master_token
    }
    print("search venue pramas: ", ticket_parmas)
    ticket_response = requests.get("https://app.ticketmaster.com/discovery/v2/events", ticket_parmas)
    ticket_json = ticket_response.json()
    return ticket_json.get("_embedded", {"events": []})

@app.route('/searchVenue')
def searchVenue():
    keyword = request.args.get("keyword")
    ticket_parmas = {
        "keyword": keyword,
        "apikey": ticket_master_token
    }
    print("search venue pramas: ", ticket_parmas)
    ticket_response = requests.get("https://app.ticketmaster.com/discovery/v2/venues", ticket_parmas)
    ticket_json = ticket_response.json()
    return ticket_json.get("_embedded", {"venues": []})


if __name__ == "__main__":
    app.run(debug=True, threaded = True)
