# Simple authentification Service

> Didier Page

---

The idea of the project is to provide a generic user authentification service as configurable container that you car run aside your web application.

## Used technologies

- NodeJS and Express
- MongoDB and Mongoose
- jwt

## Models

### User

- id
- usernam
- password (hashed)

## JWT payload structure

- id
- username
- expireDate (2 weeks)

## Routes

- `POST` `/v1/auth/register`
- `POST` `/v1/auth/login`
- `GET` ` /v1/users/:id`
- `POST` `/v1/users/:id`
- `DELETE` `/v1/user/:id`

## Realese

### 1.0

#### Fonctionnal requirments

In this realease we should be able to ...

- register a user with username and password
- log the user in with the a jwt
- show/update user's informations
- delete a user

#### Securtity

- [ ] Verify the identity of the client app
- [ ] Only the owner can acces to his data (`GET POST DELETE`)