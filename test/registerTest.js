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


describe('Tests for /register route', () => {
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
  it('it try to register a user without password', (done) => {
    chai.request(app)
      .post('/auth/register')
      .send({ username: 'testUser', email: userData.email })
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
  it('it try to register a user without username', (done) => {
    chai.request(app)
      .post('/auth/register')
      .send({ password: 'password', email: userData.email })
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
  it('it try to register a user without email', (done) => {
    chai.request(app)
      .post('/auth/register')
      .send({ username: userData.username, password: 'password' })
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
  describe('Try register', () => {
    before((done) => {
      userData.hash = bcrypt.hashSync(userData.password, 8);
      const newUser = new User({
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

    it('it should create a new user without error', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send(userData)
        .end((err, res) => {
          expect(res.status)
            .to
            .be
            .eq(201);
          expect(res.body)
            .be
            .a('object');
          expect(res.body)
            .have
            .property('message');
          expect(res.body)
            .have
            .property('error')
            .eq(false);
          done();
        });
    });
  });
  afterEach((done) => {
    mongoose.connection.db.dropDatabase();
    done();
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});
