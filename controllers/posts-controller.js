const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.savePost = async (req, res) => {
    const { content } = req.body;

    try {
        const newPost = new Post({
            content: content,
            user: req.user
        });
        
        let post = await newPost.save();

        post = await Post.findById(post.id).
                                        populate({
                                            path: 'user',
                                            model: 'User',
                                            select: 'name'
                                        }).exec();

        if (req.xhr) {
            return res.status(200).json({
                post: post,
                message: 'Post saved successfully!'
            })
        }

        req.flash('error', 'Post saved successfully!');
        res.redirect('back');
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in saving post');
        res.redirect('back');
    }
}

module.exports.deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        let post = await Post.findById(postId).exec();
    
        if (post) {
            if (req.user.id == post.user) {
                // delete likes
                await Like.deleteMany({ likeable: postId, onModel: 'Post' }).exec();
                // delete likes of post's comment
                await Like.deleteMany({ _id: { $in: post.comments }}).exec();
                
                // delete post
                await Post.findByIdAndDelete(postId).exec();
                
                // delete comments
                await Comment.deleteMany({ post: postId }).exec();

                if (req.xhr) {
                    return res.status(200).json({
                        postId: postId,
                        message: 'Post deleted successfully!'
                    })
                }

                req.flash('success', 'Post deleted successfully!');
            } else {
                req.flash('error', 'Forbidden');
            }
        } else {
            req.flash('error', 'Post does not exists');
        }
        res.redirect('back');
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in deleting post');
        res.redirect('back');
    } 
    
}