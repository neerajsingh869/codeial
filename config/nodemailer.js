const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');
const env = require('../config/environment');

const transporter = nodemailer.createTransport(env.smtp);

const renderTemplate = (data, relativePath) => {
    let mailHTML;

    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        (error, template) => {
            if (error) {
                console.error('Error while rendering mail template', error);
                return;
            }

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter, renderTemplate
}