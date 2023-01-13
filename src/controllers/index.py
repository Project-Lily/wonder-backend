from flask import Blueprint, render_template, session, redirect, url_for, request
import pytz

bp = Blueprint("index", __name__, url_prefix="/")

@bp.route("/")
def index():
    return
    
