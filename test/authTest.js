process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const should = chai.should();


chai.use(chaiHttp);

let userId;

describe('POST: /auth/register', () => {
    it('it should create a new user without error', (done) => {
        const userData = {
            username: "testAuth",
            password: "root"
        };
        chai.request(app)
            .post('/auth/register')
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
    chai.request(app).delete('/users/'+ userId);
});
