const jwt = require('jsonwebtoken')
const { model } = require('../models/users')
const User = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = req.query.authorization
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.render('error')
    }
}

module.exports = auth