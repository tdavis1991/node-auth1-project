const bcrypt = require('bcryptjs')

module.exports = (req, res, next) => {
    console.log('session', req.session)

    next()
}