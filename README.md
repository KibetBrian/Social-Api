### Social Media API
This is a RESTful backend application for a typical social media application. It supports a variety of user activities such as account creation, making posts, updating accounts etc.
It uses mongdb for data persistence.

## Local Setup

### Requirements

- Node.js version 16 or higher
- Docker and Docker Compose

## Steps to run the application

### Clone the application
```
git clone git@github.com:KibetBrian/Social-media-node-typescript-api.git

```
### CD into the app and create a .env file similar to sample.env
```
GOOGLE_CLIENT_ID=Your OAuth 2.0 client id from the Google
GOOGLE_CLIENT_SECRET=Your OAuth 2.0 client secret from the Google
COOKIE_PRIVATE_KEY=your cookie private key
MONGO_URI=mongodb://localhost:27017

```


### Run the application

```
Social-media-node-typescript-api && docker compose up

```


