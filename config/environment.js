const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production-logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
})

const development = {
    name: 'development',
    session_cookie_secret: 'SECrEt',
    db: 'mongodb://localhost:27017/codeial_dev',
    smtp: {
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                // TODO: replace `user` and `pass` values
                user: "sender-gmail",
                pass: "sender-app-password",
            },
        },
    google_clientID: "xyz",    // TODO put actual value during testing
    google_clientSecret: "xyz",    // TODO put actual value during testing
    google_callbackURL: "http://localhost:3000/users/auth/google/callback",
    jwt_secret: 'secret',
    morgan: {
        mode: 'dev',
        options: {
            stream: accessLogStream
        }
    }
}

const production = {
    name: 'production',
    session_cookie_secret: process.env.CODEIAL_SESSION_COOKIE_SECRET,
    db: process.env.CODEIAL_DB,
    smtp: {
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.CODEIAL_SMTP_USER,
                pass: process.env.CODEIAL_SMTP_PASS,
            },
        },
    google_clientID: process.env.CODEIAL_GOOGLE_CLIENTID,
    google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENTSECRET,
    google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {
            stream: accessLogStream
        }
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) === undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);