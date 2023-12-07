const nodemailer = require('../config/nodemailer');

exports.resetPassword = async (resetPasswordUser) => {
    let htmlString = nodemailer.renderTemplate({ resetPasswordUser }, '/reset-password-mail-template.ejs');

    try {
        let info = await nodemailer.transporter.sendMail({
            from: '"Neeraj Singh" <sender-gmail>', // sender address
            to: resetPasswordUser.user.email, // list of receivers
            subject: "Codeial | Link to Reset Password", // Subject line
            html: htmlString, // html body
          });

        console.log('Message sent', info);
    } catch (error) {
        console.error('Error in sending mail', error);
    }
}