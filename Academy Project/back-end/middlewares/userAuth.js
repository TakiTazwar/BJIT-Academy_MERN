const jwt = require('jsonwebtoken');
const { failed } = require('../utils/message');
const HTTP_STATUS = require('../utils/httpStatus');

const checkAuth = (req, res, next) => {
    if (req.get('authorization')) 
    {
        const token = req.get('authorization').split(' ')[1];
        try {
            const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = {
                _id: decodedData._id,
                email: decodedData.email,
                userType: decodedData.userType,
                verify:decodedData.verify
            }
            next();
        } catch (error) {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed("Token Verification Failed"));
        }
        
    } else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failed('Unauthorized request'));
    }
}
const isAdmin = (req, res, next) => {
    if (req.user.userType.toString()==="admin") {
        next();
    } else {
        return res.status(HTTP_STATUS.FORBIDDEN).send(failed('You are forbidden for that request'));
    }
}

module.exports = {
    checkAuth,
    isAdmin
}