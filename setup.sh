#!/bin/bash
cd core
bash -c 'npm install'
cd ../
cd microservices/google-places
bash -c 'npm install'
cd ../
cd yelp
bash -c 'npm install'
cd ../
cd foursquare
bash -c 'npm install'
cd ../..