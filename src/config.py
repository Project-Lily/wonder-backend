from dotenv import load_dotenv
import os
load_dotenv()

GCP_TEXT2SPEECH_ENDPOINT="https://texttospeech.googleapis.com/v1/text:synthesize"
GCP_TEXT2SPEECH_API_KEY=os.getenv("GCP_TEXT2SPEECH_API_KEY")
GCP_TEXT2SPEECH_HEADER= {
    "Content-Type" : "application/json; charset=utf-8",
    "Authorization" : "Bearer " + GCP_TEXT2SPEECH_API_KEY 
}