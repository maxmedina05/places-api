from flask import jsonify, request, Response, Flask
import json
import requests
from requests.exceptions import ConnectionError
from socketIO_client_nexus import SocketIO
from settings import load_environment_variables
from place import Place

env = load_environment_variables()
PROVIDER_NAME = 'Foursquare'
FOURSQUARE_CLIENT_ID = env['FOURSQUARE_CLIENT_ID']
FOURSQUARE_CLIENT_SECRET = env['FOURSQUARE_CLIENT_SECRET']
WEBSOCKET_SERVER_ENDPOINT = env['WEBSOCKET_SERVER_ENDPOINT']
FOURSQUARE_API_ENDPOINT = 'https://api.foursquare.com/v2/venues/search'
PORT = '3300'
MY_URL = 'http://localhost:{0}/venues'.format(PORT)

provider = {
    'name': PROVIDER_NAME,
    'url': MY_URL
}

app = Flask(__name__)


@app.route('/venues')
def getVenues():
    args = request.args
    query = args['query']
    latitude = args['latitude']
    longitude = args['longitude']

    params = dict(
        client_id=FOURSQUARE_CLIENT_ID,
        client_secret=FOURSQUARE_CLIENT_SECRET,
        v='20180323',
        ll='{0},{1}'.format(latitude, longitude),
        query=query,
        limit=50
    )

    places = []
    response = requests.get(url=FOURSQUARE_API_ENDPOINT, params=params)
    venues = response.json()['response']['venues']

    for venue in venues:
        newPlace = Place(
            venue['id'],
            PROVIDER_NAME,
            venue['name'],
            '',
            {
                'latitude': venue['location']['lat'],
                'longitude': venue['location']['lng']
            },
            venue['location']['formattedAddress'][0],
            ''
        )
        places.append(newPlace)

    payload = json.dumps(places, default=Place.toDict)
    return Response(payload, mimetype='application/json')


if __name__ == '__main__':

    try:
        socket = SocketIO('localhost', 3000)
        socket.emit('subscribe', provider)
        socket.wait(seconds=1)

    except ConnectionError:
        print('The server is down. Try again later.')

    app.run(port=PORT)
