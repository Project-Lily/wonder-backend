from flask import Blueprint, render_template, session, redirect, url_for, request
import requests
import justext

bp = Blueprint("index", __name__, url_prefix="/")
@bp.route("/", methods=["GET", "POST"])
def index():
    if(request.method == "GET"):
        query_param =  request.args.to_dict()
        url = query_param.get("url")
        print(url)

        response = requests.get(url)
        paragraph = justext.justext(response.content, justext.get_stoplist("English"))
        output = ""
        for i in paragraph:        
            if not i.is_boilerplate:
                output += i.text + " "
    return output
    
