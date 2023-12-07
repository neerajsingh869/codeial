const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.toggleLike = async (req, res) => {
    const { id, type } = req.query;

    try {
        let deleted = false;
        // find the likeable object
        let likeable = null;
        if (type === 'Post') {
            likeable = await Post.findById(id).populate('likes');
        } else {
            likeable = await Comment.findById(id).populate('likes');
        }

        let existingLike = await Like.findOne({
            user: req.user,
            likeable: id,
            onModel: type
        });

        // if like object already exist in Like collection, delete it
        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();

            // delete it
            await Like.findByIdAndDelete(existingLike.id).exec();
            deleted = true;

        } else {
            // else, create new like
            let newLike = new Like({
                user: req.user,
                likeable: id,
                onModel: type
            });

            newLike = await newLike.save();

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        res.status(200).json({
            message: 'Like toggled successfully!',
            data: {
                deleted
            }
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}