const nodemailer = require('../config/nodemailer');

exports.newComment = async (comment) => {
    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/comments-mail-template.ejs');

    try {
        let info = await nodemailer.transporter.sendMail({
            from: '"Neeraj Singh" <sender-gmail>', // sender address
            to: comment.user.email, // list of receivers
            subject: "New comment published!", // Subject line
            html: htmlString, // html body
          });

        console.log('Message sent', info);
    } catch (error) {
        console.error('Error in sending mail', error);
    }
}