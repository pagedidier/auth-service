const nodemailer = require('nodemailer');


const environment = process.env.NODE_ENV || 'dev';
const configFile = require('../config/config.json');


const config = configFile[environment];


const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: {
    user: config.mail.username,
    pass: config.mail.password,
  },
});

exports.sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};
