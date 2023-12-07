const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({ email }).exec();

        if (!user || password !== user.password) {
            return res.status(403).json({
                message: 'Invalid username or password'
            });
        }

        res.status(200).json({
            message: 'Sign in successful! Please save your token safely.',
            data: {
                /*
                    data must be object literal if you want to expire token
                    https://stackoverflow.com/questions/35131333/jsonwebtoken-sign-fails-with-expiresin-option-set
                */
                token: jwt.sign(user.toJSON(), 'secret', { expiresIn: '1h' })
            }
        })
    } catch (error) {
        console.error(error.stack);

        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}