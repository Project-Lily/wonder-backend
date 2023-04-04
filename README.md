# Wonder-Reader
![Logo of a W with braille etched on it](/flask-utils/wonder_logo.png) 

## About
This is the backend repository for Wonder Reader. A simple and affordable braille learning solution. Submitted for GDSC Solution Challenge 2023. 

[![IMAGE ALT TEXT](http://img.youtube.com/vi/Li-c-Ixpmxo/0.jpg)](http://www.youtube.com/watch?v=Li-c-Ixpmxo "Video Title")

## Features
- Text to speech with configurable language using GCP Text-to-speech API
- Socket communication using nodejs server
- Nginx reverse proxy and automatic SSL renewal

## Installation
Populate values from `.env.template` and rename it to `.env`. If you are running on a local environment, change the value of `DOMAIN` to localhost. This will be used by the setup script to create a self-signed certificate on `/etc/letsencrypt`. 

Run these commands below:
```bash
docker-compose -f ./docker-compose.setup.yaml up -d
docker-compose up -d
```

## GCP
These are the list of GCP Services that are used in this project
- [Text-to-Speech](https://cloud.google.com/text-to-speech)
- [Compute Engine](https://cloud.google.com/compute)

