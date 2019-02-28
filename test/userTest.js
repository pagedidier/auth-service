process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const should = chai.should();


chai.use(chaiHttp);

let userId;

describe('POST: /users/', () => {
    it('it should create a new user without error', (done) => {
        const userData = {
            username: "test",
            password: "root"
        };
        chai.request(app)
            .post('/users')
            .send(userData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.should.have.property('error').eq(false);
                userId = res.body.data._id;
                done();
            });
    });
});

describe('GET: /users/id', () => {
    it("Should get a user by his id without error", (done) => {
        chai.request(app)
            .get('/users/'+userId)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.should.have.property('error').eq(false);
                done();
            });
    });
});

describe('DELETE /users/id', () => {
    it("It should delete user without error", (done) => {
        chai.request(app)
            .delete('/users/'+ userId)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                done();
            });
    });
});

/*describe('/POST app', () => {
    it('it sould post the app info', (done) => {
        const application = {
            name: "test",
            description: "Lorem ipsum dolo machin truc"
        }
        chai.request(app)
            .post('/app')
            .send(application)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                done();
            });
    });
});

describe('/POST APP', () => {
    it('it sould post the app info with invalid argument', (done) => {
        const application = {
            description: "Lorem ipsum dolo machin truc"
        }
        chai.request(app)
            .post('/app')
            .send(application)
            .end((err, res) => {
                console.log(res.status);
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            });
    });
});*/

/*
describe('/PUT/:id user', () => {
    it("should update the app info", (done) => {
        const application = {
            name: "test 2",
            description: "Lorem ipsum dolo machin truc chouette"
        }
        const appId = 1;

        chai.request(app)
            .put('/app/'+ appId)
            .send(application)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                done();
            });
    });
});

describe('/DELETE/:id user', () => {
    it("should delete the app", (done) => {
        const appId=1;
        chai.request(app)
            .delete('/app/'+ appId)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('error').eq(false);
                done();
            });
    });
});*/
