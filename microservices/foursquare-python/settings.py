import os
from os.path import join, dirname
from dotenv import load_dotenv


def load_environment_variables():
    dotenv_path = join(dirname(__file__), '.env')
    load_dotenv(dotenv_path)
    env = {}
    env['FOURSQUARE_CLIENT_ID'] = os.getenv('FOURSQUARE_CLIENT_ID')
    env['FOURSQUARE_CLIENT_SECRET'] = os.getenv('FOURSQUARE_CLIENT_SECRET')
    env['WEBSOCKET_SERVER_ENDPOINT'] = os.getenv('WEBSOCKET_SERVER_ENDPOINT')
    return env
