process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config.json');


const User = require('../models/userModel');

const app = require('../app');
const configFile = require('../config/config.json');

chai.use(chaiHttp);

const { expect } = chai;
const { should } = chai;
const config = configFile[process.env.NODE_ENV];
const userData = {
  id: '',
  username: 'testUserLogin',
  password: 'password',
  email: 'test@test.com',
  hash: '',
};
describe('Tests for the validation route', () => {
  beforeEach((done) => {
    mongoose.connect(`mongodb://${config.DB_URL}:${config.DB_PORT}+/${config.DB_NAME}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      userData.hash = bcrypt.hashSync(userData.password, 8);
      const newUser = new User({
        username: userData.username,
        email: userData.email,
        password: userData.hash,
        status: 'validated',
      });
      newUser.save((err) => {
        if (err) console.log(err);
        done();
      });
      userData.id = newUser._id;
    });
  });
  it('Try to validate without token in body', (done) => {
    chai.request(app)
      .post(`/users/${userData.id}/validate`)
      .send()
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
  it('Try to validate with a non-valid signature token', (done) => {
    const token = jwt.sign({ nextStatus: 'validated' }, 'wrongSecret', { expiresIn: '1d' });
    chai.request(app)
      .post(`/users/${userData.id}/validate`)
      .send({ token })
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
  it('Try to validate with a outdated token', (done) => {
    const token = jwt.sign({ nextStatus: 'validated', exp: Math.floor(Date.now() / 1000) - (60 * 60),  }, secret);
    chai.request(app)
      .post(`/users/${userData.id}/validate`)
      .send({ token })
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
  describe('Validate a new registered user', () => {
    it('Should change status of the user', (done) => {
      const token = jwt.sign({ nextStatus: 'validated' }, secret, { expiresIn: '1d' });
      chai.request(app)
        .post(`/users/${userData.id}/validate`)
        .send({ token })
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
