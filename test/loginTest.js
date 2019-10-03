process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

const app = require('../app');
const configFile = require('../config/config.json');

chai.use(chaiHttp);

const { expect } = chai;
const { should } = chai;
const config = configFile[process.env.NODE_ENV];
const userData = {
  username: 'testUserLogin',
  password: 'password',
  email: 'test@test.com',
  hash: '',
};


describe('Tests for /login route', () => {
  before((done) => {
    mongoose.connect(`mongodb://${config.DB_URL}:${config.DB_PORT}+/${config.DB_NAME}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      done();
    });
  });
  describe('User: "pending-validate"', () => {
    beforeEach((done) => {
      userData.hash = bcrypt.hashSync(userData.password, 8);
      newUser = new User({
        username: userData.username,
        email: userData.email,
        password: userData.hash,
        status: 'pending-validate',
      });
      newUser.save((err) => {
        if (err) console.log(err);
      });
      done();
    });

    it('Should not login a user and return a error message', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({ username: userData.username, password: userData.password })
        .end((err, res) => {
          expect(res.status)
            .to
            .be
            .eq(400);
          expect(res.body)
            .be
            .a('object');
          expect(res.body)
            .have
            .property('message');
          expect(res.body)
            .have
            .property('error')
            .eq(true);
          done();
        });
    });
  });
  describe('User: "validated"', () => {
    let newUser;
    before((done) => {
      userData.hash = bcrypt.hashSync(userData.password, 8);
      newUser = new User({
        username: userData.username,
        email: userData.email,
        password: userData.hash,
        status: 'validated',
      });
      newUser.save((err) => {
        if (err) console.log(err);
        done();
      });
    });

    it('Should login a user and return a token', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({ username: userData.username, password: userData.password })
        .end((err, res) => {
          expect(res.status)
            .to
            .be
            .eq(200);
          expect(res.body)
            .be
            .a('object');
          expect(res.body)
            .have
            .property('token');
          expect(res.body)
            .have
            .property('error')
            .eq(false);
          done();
        });
    });
  });
  describe('User: "pending-reset"', () => {
    beforeEach((done) => {
      userData.hash = bcrypt.hashSync(userData.password, 8);
      newUser = new User({
        username: userData.username,
        email: userData.email,
        password: userData.hash,
        status: 'pending-reset',
      });
      newUser.save((err) => {
        if (err) console.log(err);
      });
      done();
    });

    it('Should not login a user and return a error message', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({ username: userData.username, password: userData.password })
        .end((err, res) => {
          expect(res.status)
            .to
            .be
            .eq(400);
          expect(res.body)
            .be
            .a('object');
          expect(res.body)
            .have
            .property('message');
          expect(res.body)
            .have
            .property('error')
            .eq(true);
          done();
        });
    });
  });
  describe('User: "pending-removed"', () => {
    beforeEach((done) => {
      userData.hash = bcrypt.hashSync(userData.password, 8);
      newUser = new User({
        username: userData.username,
        email: userData.email,
        password: userData.hash,
        status: 'pending-removed',
      });
      newUser.save((err) => {
        if (err) console.log(err);
      });
      done();
    });

    it('Should not login a user and return a error message', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({ username: userData.username, password: userData.password })
        .end((err, res) => {
          expect(res.status)
            .to
            .be
            .eq(400);
          expect(res.body)
            .be
            .a('object');
          expect(res.body)
            .have
            .property('message');
          expect(res.body)
            .have
            .property('error')
            .eq(true);
          done();
        });
    });
  });
  afterEach(done => {
    mongoose.connection.db.dropDatabase();
    done();
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});
