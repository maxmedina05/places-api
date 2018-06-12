# Google Place's microservice

REST API which expose places information consumed from Google Places API.

## Requirements

This project requires the following modules/libraries:

- Nodejs 8.9.x or higher version
- npm 5.8.x or higher version

## Setup

### Environment variables

Windows:

        set GOOGLE_PLACES_API_KEY=YOUR_GOOGLE_PLACES_API_KEY

or other OS:

        export GOOGLE_PLACES_API_KEY=YOUR_GOOGLE_PLACES_API_KEY

### dependencies

To set up the project we need to install the dependencies.
Run the following commands from the command prompt:

    npm install

## Usage

To start the project run the following command:

    npm start

After the service started you can use it by making a http request. For example:

    curl http://localhost:3100/places?query=Pizza&latitude=37.786882&longitude=-122.399972

## Author

Max Medina - https://github.com/maxmedina05

## License

This project is licensed under the terms of the **MIT** license.
