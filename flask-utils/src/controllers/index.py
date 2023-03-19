from flask import Blueprint, render_template, session, redirect, url_for, request
import requests
import justext

from ..config import GCP_TEXT2SPEECH_API_KEY
from google.cloud import texttospeech

bp = Blueprint("index", __name__)
@bp.route("/", methods=["GET", "POST"])
def index():
    if(request.method == "GET"):
        query_param =  request.args.to_dict()
        url = query_param.get("url")

        if(url is None):
            return "Please provide a url"

        output = ""
        response = requests.get(url)
        paragraph = justext.justext(response.content, justext.get_stoplist("English"))
        for i in paragraph:        
            if not i.is_boilerplate:
                output += i.text + " "
    return output


@bp.route("/text2speech", methods=["POST"])
def textToSpeech():
    if(request.method == "POST"):
        query_param =  request.json
        print(query_param)
        text = query_param.get("text")
        print(text)

        client = texttospeech.TextToSpeechClient(client_options={"api_key" : GCP_TEXT2SPEECH_API_KEY})
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="id-ID", ssml_gender=texttospeech.SsmlVoiceGender.FEMALE, name="id-ID-Standard-D"
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
        with open("output.mp3", "wb") as out:
            out.write(response.audio_content)
            return response.audio_content
    return "Error"