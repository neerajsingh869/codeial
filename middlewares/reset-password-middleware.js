const ResetPassowrdUser = require('../models/resetPasswordUser');

module.exports.verifyAccessToken = async (req, res, next) => {
    const { accessToken } = req.query;

    try {
        let resetPasswordUser = await ResetPassowrdUser.findOne({ accessToken }).exec();
        if (!resetPasswordUser.isValid) {
            req.flash('error', 'Access Token expired!');
            res.redirect('/');
            return;
        }

        req.resetPasswordUser = resetPasswordUser;
        next();
    } catch (error) {
        console.error(error.stack);
        req.flash('error', "Error in verifying access token.");
        res.redirect('/');
    }
}