import os
from flask import Flask
from src import controllers

def create_app(conf=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='yodalaya',
    )

    if conf: app.config.from_mapping(conf)
        
    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
        
    controllers.register_all_blueprints(app)

    return app

app = create_app()