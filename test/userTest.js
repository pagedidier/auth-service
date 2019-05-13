process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

let userId;
let token;

describe('POST: /auth/register', () => {
    it('it should create a new user without error', (done) => {
        const userData = {
            username: "testUser",
            password: "root"
        };
        chai.request(app)
            .post('/auth/register')
            .send(userData)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                userId = res.body.data._id;
                done();
            });
    });
});

describe('POST: /auth/register', () => {
    it('it try to register a user without password', (done) => {
        const userData = {
            username: "testUser"
        };
        chai.request(app)
            .post('/auth/register')
            .send(userData)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(true);
                done();
            });
    });
});

describe('POST: /auth/register', () => {
    it('it try to register a user without username', (done) => {
        const userData = {
            password: "password"
        };
        chai.request(app)
            .post('/auth/register')
            .send(userData)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(true);
                done();
            });
    });
});

describe('POST: /auth/login', () => {
    it('it should log a new user and return a token', (done) => {
        const userData = {
            username: "testUser",
            password: "root"
        };
        chai.request(app)
            .post('/auth/login')
            .send(userData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                token = res.body.token;
                done();
            });
    });
});


describe('GET: /users/id', () => {
    it("Try to get a user but without token", (done) => {
        chai.request(app)
            .get('/users/'+userId)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(true);
                done();
            });
    });
});

describe('GET: /users/id', () => {
    it("Should get a user by his id without error", (done) => {
        chai.request(app)
            .get('/users/'+userId)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                done();
            });
    });
});

describe('DELETE: /users/id', () => {
    it("It should delete user without error", (done) => {
        chai.request(app)
            .delete('/users/'+ userId)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                done();
            });
    });
});


describe('GET: /patate', () => {
    it("It should return an 404 error", (done) => {
        chai.request(app)
            .get('/patate')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(true);
                done();
            });
    });
});
