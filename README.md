# Max Place's API

REST API which expose places information consumed from different providers such as Google Places, FourSquare, Yelp, etc.

## Architecture

![Architecture](architecture-diagram.png?raw=true "Architecture Diagram")

My solution is based on microservices which subscribe to a core service. Each service runs independently and they’re completely decoupled from each other. Microservices communicate to the core service through websockets, if one service fails it will be automatically unsubscribed from the core service and won’t affect the whole process.
Since each service is independent they can also be used as independent restful APIs but if the core service is running they will also subscribe to it.
A user can request a list of places to the core service which will make a request to every provider that has subscribed to build the list of places.

## Requirements

This project requires the following modules/libraries:

- Nodejs 8.9.x or higher version
- npm 5.8.x or higher version
- pm2 2.x.x

## Setup

### Environment variables

Windows:

        # Foursquare
        set FOURSQUARE_CLIENT_ID=YOUR_FOURSQUARE_ID
        set FOURSQUARE_CLIENT_SECRET=YOUR_FOURSQUARE_CLIENT_SECRET

        # Google Places
        set GOOGLE_PLACES_API_KEY=YOUR_GOOGLE_PLACES_API_KEY

        # Yelp
        set YELP_API_KEY=YOUR_YELP_API_KEY

or other OS:

        # Foursquare
        export FOURSQUARE_CLIENT_ID=YOUR_FOURSQUARE_ID
        export FOURSQUARE_CLIENT_SECRET=YOUR_FOURSQUARE_CLIENT_SECRET # Google Places

        # Google Places
        export GOOGLE_PLACES_API_KEY=YOUR_GOOGLE_PLACES_API_KEY # Yelp

        # Yelp
        export YELP_API_KEY=YOUR_YELP_API_KEY

### dependencies

To setup the project we need to install the depedencies for each project. This is because we are treating each service as separate instance.
Run the following commands from the command prompt in the root directory:

Windows:

    setup.bat

Or Other OS:

    ./setup.sh

## Usage

To start the project run the following command:

    pm2 start ecosystem.config.js

if pm2 is not install you will have to start each instance individually:

    node core/index.js
    node microservices/google-places/index.js
    node microservices/yelp/index.js
    node microservices/foursquare/index.js

After the services started you use it by making an http request. For example:

    curl http://localhost:3000/api/v1/places

## Documentation

After the services started you can also browse to the online API documentation:

- http://localhost:3000/api/v1/docs

## Author

Max Medina - https://github.com/maxmedina05

## License

This project is licensed under the terms of the **MIT** license.
