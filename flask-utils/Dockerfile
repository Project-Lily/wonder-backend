FROM python:3.8-slim-buster
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]