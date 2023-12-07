const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async (req, res) => {

    const posts = await Post.find({}).
                                    populate({
                                        path: 'user',
                                        model: 'User',
                                        select: 'name'
                                    }).exec();

    res.status(200).json({
        data: {
            posts
        }
    })
}

module.exports.destroy = async (req, res) => {
    const { postId } = req.params;

    try {
        let post = await Post.findById(postId).exec();
    
        if (post) {
            // check for user's authorization
            if (post.user == req.user.id) {
                // delete post
                await Post.findByIdAndDelete(postId).exec();
                // delete comments
                await Comment.deleteMany({ post: postId }).exec();

                return res.status(200).json({
                    postId: postId,
                    message: 'Post deleted successfully!'
                })
            } else {
                return res.status(403).json({
                    message: 'You cannot delete this post'
                })
            }
            
        }

        return res.status(400).json({
            message: 'Post does not exists'
        })
    } catch (error) {
        console.error(error.stack);

        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}