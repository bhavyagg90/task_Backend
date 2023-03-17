const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.body.token || req.query.tokens
    // console.log(token);
    try {
        if (!token) {
            return res.status(403).json({ message: "A token is required for authentication" })
        }
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        if (decoded) {
            req.user = decoded
            // console.log("decoded", decoded);
            return next();
        }
        else {
            return res.status(401).json("Invalid Token")
        }
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }


}

module.exports = { verifyToken }