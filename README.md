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
    	enum: ['pending-validate','validated','pending-reset','pending-removed']
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
- `POST` `/users/reset`
  - Change status to reset
  - send link by mail with a validation token
- `POST`  ` /tokens/renew`
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

In the payload we will have a property `status` of the status after validation. To deal the "removed" status we will add an event listener on user collection to watch changes and when the status change to "removed" we delete the document.



## Used technologies

- NodeJS and Express
- MongoDB and Mongoose
- JWT
- Nodemail

## Charts

### Register

```flow
st=>start: POST /register {email,password}
validateInfo=>operation: validate info 
returnError=>operation: return error
cond=>condition: Valid
genrateToken=>operation: Generate JWT for validation
saveUser=>operation: Save user with status "validation-pending"
sendMail=>operation: Send validation link by email
e=>end

st->validateInfo->cond
cond(yes)->genrateToken
genrateToken->saveUser
saveUser->sendMail
sendMail->e

cond(no)->returnError->e
```

### Login

```flow
st=>start: POST /login {email,password}
validateInfo=>operation: validate info 
condUserExist=>condition: CheckUser exist

condUserStatusVlidated=>condition: Email validated
condUserPassword=>condition: Check password
returnError=>operation: return error with specific message
genrateToken=>operation: Generate JWT for validation
saveUser=>operation: Save user with status "validation-pending"

returnToken=>operation: Return Token
e=>end

st->condUserExist
condUserExist(no)->returnError
condUserExist(yes)->condUserStatusVlidated
condUserStatusVlidated(yes)->condUserPassword
condUserStatusVlidated(no)->returnError
condUserPassword(yes)->genrateToken
condUserPassword(no)->returnError
genrateToken->returnToken->e
returnError->e

```

### Reset password

```flow
st=>start: POST /users/reset {email}
condEmailExist=>condition: email exist
generateToken=>operation: Generate validation token
changeStatus=>operation: Change user status to "pending-remove"
sendMail=>operation: Send token by email
returnError=>operation: Return error
return=>operation: Return positive response
e=>end

st->condEmailExist
condEmailExist(no)->returnError
condEmailExist(yes)->generateToken->changeStatus
changeStatus->sendMail
sendMail->return->e
returnError->e
```

###  Validate
```flow
st=>start: POST /users/:id/validate {token}
tokenValid=>condition: Token valid
changeStatus=>operation: Change user status
return=>operation: Return positive response

e=>end

st->tokenValid
tokenValid(no)->e
tokenValid(yes)->changeStatus
changeStatus->return
return->e
```

### Renew

```flow
st=>start: POST /tokens/renew {token}
checkSignature=>condition: Token's signature is valid
regenerateToken=>operation: Regenerate token
sendMail=>operation: Send email
return=>operation: Return positive response
returnError=>operation: Return error


e=>end

st->checkSignature
checkSignature(no)->returnError->e
checkSignature(yes)->regenerateToken->sendMail->return
return->e
```
