const User = require('../models/user');
const ResetPassowrdUser = require('../models/resetPasswordUser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const resetPasswordMailer = require('../mailers/reset-password-mailer');
const crypto = require('crypto');
const Friendship = require('../models/friendship');

module.exports.profile = async (req, res) => {
    const { userId } = req.params;
    
    try {
        let user = await User.findById(userId).exec();

        let isFriend = false;
        let loggedInUser = await User.findById(req.user.id).
                                        populate('friendships')
                                        .exec();

        let friendIdx = loggedInUser.friendships.findIndex(friendship => JSON.stringify(friendship.toUser) === JSON.stringify(userId));

        if (friendIdx !== -1) {
            isFriend = true;
        }
        
        if (user) {
            res.render('user-profile', {
                title: 'User Profile',
                profileUser: user,
                isFriend
            })
        } else {
            res.render('user-profile', {
                title: 'User Profile'
            })
        }
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in rendering profile page');
        res.redirect('/');
    }
}

module.exports.updateProfile = (req, res) => {
    User.upload(req, res, async function (error) {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.error("Multer error occurred while uploading...");
          console.error(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          console.error(error);
        }
    
        // Everything went fine.
        const { userId } = req.params;
        
        try {
            if (userId === req.user.id) {
                let user = await User.findById(userId);
                user.name = req.body.username;

                // store avatar location in database if file is uploaded
                if (req.file) {

                    // if avatar and file already exists, then remove them
                    
                    if (user.avatar) {
                        const doesFileExists = fs.existsSync(path.join(__dirname, '..', user.avatar));

                        if (doesFileExists) {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                
                await user.save();

                req.flash('success', 'Profile updated successfully!');
                res.redirect('back');
            } else {
                req.flash('error', 'Unathorized');
                res.redirect('back');
            }
        } catch (error) {
            console.error(error.stack);
            req.flash('error', 'Error in updating profile');
            res.redirect('/');
        }
    })
}

// action (route handler) for rendering reset password page
module.exports.resetPassword = (req, res) => {
    const { accessToken } = req.query;

    res.render('reset-password', {
        title: 'Codeial | Reset Password',
        accessToken
    })
}

// action (route handler) for updating user's password
module.exports.updatePassword = async (req, res) => {
    const { accessToken } = req.query;

    try {
        const { password, confirm_password } = req.body;

        if (password !== confirm_password) {
            req.flash('error', 'Password is not same');
            res.redirect(`/users/reset-password?accessToken=${ accessToken }`);
            return;
        }

        // change isValid flag so that user's can't reset password again from mail link
        let updatedResetUser = await ResetPassowrdUser.findByIdAndUpdate(req.resetPasswordUser.id, { isValid: false }, { new: true });

        let updatedUser = await User.findByIdAndUpdate(req.resetPasswordUser.user, { password }, { new: true });
        
        req.flash('success', 'Password resetted successfully!');
        res.redirect('/users/signin');
    } catch (error) {
        console.error(error.stack);
        req.flash('error', "Error in updating user's password");
        res.redirect('/');
    }
}

// action (route handler) for rendering forgot password page
module.exports.forgotPassword = (req, res) => {
    res.render('forgot-password', {
        title: 'Codeial | Forgot Password'
    });
}

// action (route handler) to send user mail to reset password
module.exports.startResetPasswordProcess = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email }).exec();
        
        if (user) {
            let resetUser = await ResetPassowrdUser.findOne({ user: user.id }).exec();

            let newResetPassowrdUser = null;
            if (resetUser) {
                newResetPassowrdUser = await ResetPassowrdUser.findByIdAndUpdate(resetUser.id, { isValid: true }, { new: true });
            } else {
                newResetPassowrdUser = new ResetPassowrdUser({
                    user: user,
                    accessToken: crypto.randomBytes(20).toString('hex'),
                    isValid: true
                });

                newResetPassowrdUser = await newResetPassowrdUser.save();
            }

            newResetPassowrdUser = await ResetPassowrdUser.findById(resetUser.id).
                                                                            populate({
                                                                                path: 'user',
                                                                                model: 'User',
                                                                                select: {
                                                                                    "name": 1,
                                                                                    "email": 1
                                                                                } 
                                                                            }).exec();


            resetPasswordMailer.resetPassword(newResetPassowrdUser);

            req.flash('success', 'Reset password mail sent!');
            res.redirect('back');
        } else {
            req.flash('error', 'User does not exists.');
            res.redirect('/users/signup');
        }
    } catch (error) {
        console.error(error.stack);
        req.flash('error', "Error in resetting user's password");
        res.redirect('/');
    }

}

// action (route handler) for rendering signup page
module.exports.signup = (req, res) => {
    res.render('user-signup', {
        title: 'Codial | Sign Up'       
    });
}

// action (route handler) for rendering signin page
module.exports.signin = (req, res) => {
    res.render('user-signin', {
        title: 'Codial | Sign In'       
    });
}

// action (route handler) for creating user
module.exports.create = async (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'Password is not same');
        res.redirect('back');
        return;
    }

    const { email, password, name } = req.body;

    try {
        let user = await User.findOne({ email }).exec();
        
        if (user) {
            req.flash('error', 'User already exists');
            res.redirect('back');
        } else {
            const newUser = new User({
                email,
                password,
                name
            });

            await newUser.save();

            req.flash('success', 'User sign-up successful!');
            res.redirect('/users/signin');
        }
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in signing up the user');
        res.redirect('/');
    }
}   

// action (route handler) for starting user's session
module.exports.startSession = (req, res) => {
    req.flash('success', 'Logged in successfully!');
    res.redirect('/');
}

module.exports.endSession = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully!');
        res.redirect('/');
    })
}

// action (route handler) for adding user as friend
module.exports.addFriend = async (req, res) => {
    let user = req.user;
    let { friendId } = req.params;

    try {
        let newFriendship = new Friendship({
            fromUser: user,
            toUser: friendId
        });

        newFriendship = await newFriendship.save();

        let loggedInUser = await User.findById(req.user.id).
                                            populate('friendships').exec();

        if (loggedInUser) {
            loggedInUser.friendships.push(newFriendship._id);

            await User.findByIdAndUpdate(req.user.id, { friendships: loggedInUser.friendships }, { new: true }).exec();
        }

        req.flash('success', 'Friend added successfully!');
        res.redirect('back');
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in adding friend');
        res.redirect('back');
    }
}

// action (router handler) for removing friend from friend-list
module.exports.removeFriend = async (req, res) => {
    let user = req.user;
    let { friendId } = req.params;

    try {
        let friendshipToRemove = await Friendship.findOne({
            fromUser: user.id,
            toUser: friendId
        }).exec();

        await Friendship.findByIdAndDelete(friendshipToRemove.id);

        let loggedInUser = await User.findById(user.id).
                                        populate('friendships').exec();
                                    
        if (loggedInUser) {
            let updatedFriendships = loggedInUser.friendships.filter(friendshipObject => friendshipObject.id !== friendshipToRemove.id);

            await User.findByIdAndUpdate(req.user.id, { friendships: updatedFriendships }, { new: true }).exec();
        }
        
        req.flash('success', 'Friend removed successfully!');
        res.redirect('back');
    } catch (error) {
        console.error(error.stack);
        req.flash('error', 'Error in removing friend');
        res.redirect('back');
    }
}