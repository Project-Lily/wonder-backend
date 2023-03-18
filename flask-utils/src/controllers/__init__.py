from src.controllers import index

def register_all_blueprints(app):
    app.register_blueprint(index.bp)
    # app.register_blueprint(testing.bp)

    @app.errorhandler(404)  
    def page404(e):
        return "404"