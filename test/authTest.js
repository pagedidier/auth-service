process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const User = require('../models/userModel');

const app = require('../app');
const configFile = require('../config/config.json');


const should = chai.should();

chai.use(chaiHttp);

const config = configFile[process.env.NODE_ENV];

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.DB_URL}:${config.DB_PORT}+/${config.DB_NAME}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection
  .once('open', () => console.log('Connected!'))
  .on('error', (error) => {
    console.warn('Error : ', error);
  });

const userData = {
  username: 'testUser',
  password: 'password',
};

describe('Tests for /register route', () => {
  afterEach((done) => {
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });


  it('it try to register a user without password', (done) => {
    chai.request(app)
      .post('/auth/register')
      .send({ username: 'testUser' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('error')
          .eq(true);
        done();
      });
  });

  it('it try to register a user without username', (done) => {
    chai.request(app)
      .post('/auth/register')
      .send({ password: 'password' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('error')
          .eq(true);
        done();
      });
  });
  it('it should create a new user without error', (done) => {
    chai.request(app)
      .post('/auth/register')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('error')
          .eq(false);
        done();
      });
  });
});

describe('Tests for /login route', () => {
  describe('With status "validated"', () => {
    beforeEach((done) => {
      const user = new User({ username: 'username', password: bcrypt.hashSync(userData.password, 8), status: 'validated' });
      user.save();
      done();
    });

    it('Try to login without password', () => {
      chai.request(app)
        .post('/auth/login')
        .send({ username: 'username' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('error').eq(true);
        });
    });
    it('Try to login without username', () => {
      chai.request(app)
        .post('/auth/login')
        .send({ password: 'password' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('error').eq(true);
        });
    });
    it('Try to login to an none existing account', () => {
      chai.request(app)
        .post('/auth/login')
        .send({ username: 'idontexist', password: 'password' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('error').eq(true);
        });
    });
    it('Should login a user and return a token', () => {
    });
  });


  describe('With status "pending-validate"', () => {
    beforeEach((done) => {
      const user = new User({ username: 'username', password: bcrypt.hashSync(userData.password, 8), status: 'pending-validate' });
      user.save();
      done();
    });
  });

  describe('With status "pending-reset"', () => {
    beforeEach((done) => {
      const user = new User({ username: 'username', password: bcrypt.hashSync(userData.password, 8), status: 'pending-reset' });
      user.save();
      done();
    });
  });

  describe('With status "pending-removed"', () => {
    beforeEach((done) => {
      const user = new User({ username: 'username', password: bcrypt.hashSync(userData.password, 8), status: 'pending-removed' });
      user.save();
      done();
    });
  });
});
