const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

const authorize = (allowedRoles)=>{
    return (req,res,next)=>{
        try {
           const tocken = req.headers.authorization.split(' ')[1];
           const decoded = jwt.verify(tocken,JWT_SECRET);
           req.user = decoded;
           if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied. You do not have permission.' });
            }
            next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(401).json({ message: 'Unauthorized. Invalid or missing token.' });
        }
    }

};

module.exports = authorize;