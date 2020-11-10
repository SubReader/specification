#!/usr/bin/env python3

import os
import json
from flask import Flask, request, send_from_directory
from data import users, movies, subtitles, fingerprints
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)

secret = os.environ.get("SECRET", "secret123")

@app.route("/static/<path:path>")
def static_handler(path):
  return send_from_directory("static", path)

@app.route("/refresh", methods=["POST"])
def refresh_handler():
  data = request.json
  refresh_token = data["refreshToken"]

  token = jwt.decode(refresh_token, secret, algorithm="HS256", verify=True, audience="refreshToken")

  for user in users:
    if user["id"] == token["sub"]:
      expires_in = timedelta(minutes=5)
      expiration_date = datetime.utcnow() + expires_in

      access_token = jwt.encode({
        "email": user["email"],
        "entitlements": user["entitlements"],
        "sub": user["id"],
        "exp": expiration_date,
        "aud": "accessToken"
      }, secret, algorithm="HS256")

      return {
        "accessToken": access_token.decode("utf-8"),
        "expiresIn": expires_in.seconds
      }

  return {
    "error": {
      "message": "Could not refresh token."
    }
  }, 500

@app.route("/authenticate", methods=["POST"])
def authenticate_handler():
  data = request.json
  email, password = data["email"], data["password"]

  for user in users:
    if user["email"] == email and user["password"] == password:
      expires_in = timedelta(minutes=5)
      expiration_date = datetime.utcnow() + expires_in

      access_token = jwt.encode({
        "email": user["email"],
        "entitlements": user["entitlements"],
        "sub": user["id"],
        "exp": expiration_date,
        "aud": "accessToken"
      }, secret, algorithm="HS256")

      refresh_token = jwt.encode({
        "sub": user["id"],
        "aud": "refreshToken"
      }, secret, algorithm="HS256")

      return {
        "refreshToken": refresh_token.decode("utf-8"),
        "accessToken": access_token.decode("utf-8"),
        "expiresIn": expires_in.seconds
      }

  return {
    "error": {
      "message": "Wrong password or user does not exist."
    }
  }, 404


@app.route("/search", methods=["GET"])
def search_handler():
  # Implement better search strategy
  query = request.args.get("query")
  return json.dumps(
    [movie for movie in movies if query in movie["title"]] if query 
    else movies
  )
  

@app.route("/title/<id>", methods=["GET"])
def title_handler(id):
  # Implement find movie in database
  for movie in movies:
    if movie["id"] == id:
      return movie

  return {
    "error": {
      "message": "Title not found"
    }
  }, 404


@app.route("/title/<id>/subtitles", methods=["GET"])
def subtitles_handler(id):
  # Implement find subtitles in database
  for subtitle in subtitles:
    if subtitle["id"] == id:
      return subtitle

  return {
    "error": {
      "message": "Subtitles not found"
    }
  }, 404

@app.route("/title/<id>/fingerprint", methods=["GET"])
def fingerprint_handler(id):
  # Implement find fingerprints in database
  for fingerprint in fingerprints:
    if fingerprint["id"] == id:
      return fingerprint

  return {
    "error": {
      "message": "Fingerprint not found"
    }
  }, 404

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 3000)))