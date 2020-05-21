# SubReader Endpoint Specification v1.0

## About SubReader

SubReader helps dyslexics enjoy foreign language movies by providing spoken subtitles in an individual and discreet manner. By connecting a pair of earplugs to the phone, through which the subtitles will be read aloud, the dyslexic is able to participate in movie nights, cinema trips etc. on the same behalf as non-dyslexics.

## Introduction

This document describes the endpoint necessary for integration with the SubReader app. It uses standard `REST` practices and is not dependent on any language specific features in order to be easily implemented in existing backends.

This first revision does not consider synchronization of the reading of subtitles with the video playback.

## General

Optional field names are indicated by the `?` postfix.

## Authentication: `POST` `/authenticate`

If authentication is required in order to access certain content, the user should be able to authenticate by issuing a `POST` request to the `/authenticate` endpoint with the following JSON body:

```json
{
	"username": <Email or Username: String>,
	"password": <Password: String>
}
```

Upon successful authentication the server should respond with a `200` status code and the following JSON body:

```json
{
  "accessToken": {
    "expiresIn?": <Seconds: Number>,
    "value": <JWT: String>
  },
  "refreshToken?": {
    "expiresIn?": <Seconds: Number>,
    "value": <JWT: String>
  }
}
```

In case the user cannot be authenticated (Eg. the user has entered the wrong credentials) the server should respond with a status code `404` and the following JSON body:

```json
{
  "error": {
    "code?": <Error code: Number>,
    "message": <Error Message: String>
  }
}
```

After authenticating the client will use the `Authorization` header to authorize access with the server:

```http
  Authorization: Bearer <JWT Access Token>
```

If the client requests an endpoint or resource which requires that the user is authenticated without specifying the `Authorization` header, the server should respond with a `401` status code.

If the user is succesfully authenticated, but does not have access to the request endpoint or resource, the server should respond with a `403` status code.

## Refresh access: `POST` `/refresh`

In order to refresh the access token, the client has to send a `POST` request with the following body:

```json
{
  "refreshToken": <JWT Refresh token: String>
}
```

If the access token is successfully refreshed, the server should respond with:

```json
{
  "accessToken": {
    "expiresIn?": <Seconds: Number>,
    "value": <JWT: String>
  }
}
```

## Search: `GET` `/search?query=<Search query: String>`

The server should respond with the following JSON body:

```json
{
  "results": [
    {
      "type": "movie" | "series",
      "id": <Unique ID>,
      "imdb_id?": <Unique ID>,
      "title": <Movie or Series title: String>,
      "poster": "https://cdn.example.net/poster.png",
    },
    {
      "type": "movie" | "episode",
      "id": <Unique ID>,
      "imdb_id?": <Unique ID>,
      "title": <Movie or Series title: String>,
      "poster": "https://cdn.example.net/poster.png",
    },
    ...
  ]
}
```

## Get title information `GET` `/title/<ID>`

If the ID is of a movie or episode, the server should respond with the following JSON body:

```json
{
  "type": "movie" | "episode",
  "id": <Unique ID>,
  "imdb_id": <Unique ID>,
  "title": <Movie or Episode title: String>,
  "poster": "https://cdn.example.net/poster.png",
  "description?": <Description: String>,
  "subtitles": [
    {
      "language": "da",
      "srt": "https://cdn.example.net/da.srt"
    },
    {
      "language": "sv",
      "srt": "https://cdn.example.net/sv.srt"
    }
  ]
}
```

If the ID instead belongs to a series the server should return:

```json
{
  "type": "series",
  "id": <Unique ID>,
  "imdb_id": <Unique ID>,
  "title": <Series title: String>,
  "poster": "https://cdn.example.net/poster.png",
  "seasons": [
    {
      "type": "season",
      "id": <Unique ID>,
      "imdb_id?": <Unique ID>,
      "title": <Season title: String>,
      "episodes": [
        {
          "type": "episode",
          "id": <Unique ID>,
          "imdb_id?": <Unique ID>,
          "title": <Episode title: String>,
          "description?": <Description of Series: String>,
        }
      ]
    }
  ]
}
```
