const Comment = require('../models/comment');
const Post = require('../models/post');
const queue = require('../workers/comments-email-worker');
const commentsMailer = require('../mailers/comments-mailer');

module.exports.saveComment = async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user._id;

    try {
        // comments must be created only when user is logged in
        // and post with id exists. Already checked
        // whether user is logged in or not. Now, check whether
        // post exists or not
        let post = await Post.findById(postId).exec();

        if (post) {
            // save comment in comments collection
            const newComment = new Comment({
                content: content,
                user: userId,
                post: postId
            });

            let savedComment = await newComment.save();

            // push new comment id in post
            let postComments = post.comments;
            postComments.push(newComment);
            
            await Post.findByIdAndUpdate(postId, {
                comments: postComments
            }, { new: true }).exec();

            savedComment = await Comment.findById(savedComment.id).
                                                        populate({
                                                            path: 'user',
                                                            model: 'User',
                                                            select: {
                                                                "name": 1,
                                                                "email": 1
                                                            } 
                                                        }).exec();

            let job = queue.create('emails', savedComment).save(error => {
                if (error) {
                    console.log('Error in sending to the queue', error);
                    return;
                }

                console.log(job.id);
            })

            if (req.xhr) {
                return res.status(200).json({
                    comment: savedComment,
                    message: 'Comment saved successfully!'
                })
            }

            req.flash('success', 'Comment saved successfully!');
        } else {
            req.flash('error', 'Post does not exists');
        }
        res.redirect('back');
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in saving comment');
        res.redirect('back');
    } 
}

module.exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    
    try {
        let comment = await Comment.findById(commentId).exec();

        if (comment) {
            if (JSON.stringify(req.user.id) === JSON.stringify(comment.user)) {
                // delete comment
                await Comment.findByIdAndDelete(commentId).exec();
                // delete likes associated with that comment
                await Like.deleteMany({ likeable: commentId, onModel: 'Comment' }).exec();
                let post = await Post.findById(comment.post).exec();
                // remove comment id of delete comment from post
                let newCommentIds = post.comments.filter(oldCommentId => {
                    return JSON.stringify(oldCommentId) !== JSON.stringify(commentId);
                });

                await Post.findByIdAndUpdate(comment.post, { comments: newCommentIds }).exec();

                if (req.xhr) {
                    return res.status(200).json({
                        commentId: commentId,
                        message: 'Comment deleted successfully!'
                    })
                }

                req.flash('success', 'Comment deleted successfully!');
            } else {
                req.flash('error', 'Forbidden');
            }
        } else {
            req.flash('error', 'Comment does not exists');
        }
        res.redirect('back');
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in deleting comment');
        res.redirect('back');
    }
}