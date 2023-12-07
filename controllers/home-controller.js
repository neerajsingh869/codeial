const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.home = async (req, res) => {
    try {
        let posts = await Post.find({}).
                                sort('-createdAt').
                                populate({
                                    path: 'user',
                                    model: 'User',
                                    select: 'name'
                                }).populate({
                                    path: 'comments',
                                    populate: {
                                        path: 'user',
                                        model: 'User',
                                        select: 'name'
                                    },
                                    populate: {
                                        path: 'likes',
                                        model: 'Like',
                                    }
                                }).populate({
                                    path: 'likes'
                                }).exec();
        
        let users = await User.find({}).exec();

        let currentUserDetails = null;

        if (req.user) {
            currentUserDetails = await User.findById(req.user.id).
                                            populate({
                                                path: 'friendships',
                                                populate: {
                                                    path: 'toUser',
                                                    model: 'User',
                                                    select: 'name'
                                                }
                                            }).exec();
        }

        res.render('home', {
            title:'Codeial',
            posts: posts,
            users: users,
            friends: (currentUserDetails === null) ? [] : currentUserDetails.friendships
        })
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in rendering home page');
        res.redirect('/');
    }
}