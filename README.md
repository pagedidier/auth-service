# Simple authentification Service

> Didier Page

---

[TOC]

The idea of the project is to provide a generic user authentification service as configurable container that you can run aside your web application.

## Schema

For the first version of the project we will have a basic `userSchema`

```
{
	email: {
    	type: Email,
    	required: '',
    	unique: true,
  	},
  	password: {
    	type: String,
    	required: '',
  	}
  	status: {
    	type: String,
    	enum: ['pending-validate','validate','prending-reset','pending-removed']
    	required: '',
  	}
}
```



## Routes

### Non-authenticated routes

- `POST` `/auth/register`
  - Provide an email-password pair in request body.
  - Generate a validation token and send it by email change status to `pending-validate`
- `POST` `/users/:id/validate`
  - Provide the token in the `req.body`
  - According to the action do it if token is valid
- `POST` `/auth/login`
  - Check the status
    - Return a specific error message, if status different of `validate`
  - Then check email-password
  - return JWT
- `POST` `/users/:id/reset`
  - Change status to reset
  - send link by mail with a validation token
- `POST`  ` /tokens/renow`
  - Should have the old token in `req.body`


### Authenticated routes :

There is a `checkToken()` middleware that verify the presence and the validity of a token. Then in these function we'll check that a user is the owner of the user resource.

- `GET` ` /users/:id`
  - Field password and validations field should be removed from the `res` object
- `PUT` `/users/:id`
- `DELETE` `/users/:id`
  - Send a validation link by email and change status to `prending-removed`

### The validation token 

This token is a JWT with in his payload part, a property for the action to be validate

the token is send by email by GET parameter in the front-end URL.

​	http://front-end.com/validate?token={....}

When the front end will request with`POST` method to route that will create a validation token, it have to provide in `req.bod` object the url.



## Used technologies

- NodeJS and Express
- MongoDB and Mongoose
- JWT
- Nodemail
