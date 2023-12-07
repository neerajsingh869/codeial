const queue = require('../config/kue');
const commentsMailer = require('../mailers/comments-mailer');

// create process for job
queue.process('emails', (job, done) => {
    console.log('email workers are processing the job', job.data);

    commentsMailer.newComment(job.data);

    done();
});

module.exports = queue;