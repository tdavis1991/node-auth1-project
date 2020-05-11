const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()
const Users = require('../users/user-model')

router.post('/register', (req, res) => {
    const { username, password } = req.body

    const hashPassword = bcrypt.hashSync(password, 10)

    Users.add({
        username, 
        password: hashPassword
    })
        .then(userInfo => {
            console.log('userInfo', userInfo)
            res.status(200).json(userInfo)
        }).catch(err => {
            res.status(500).json({
                message: 'Something went wrong'
            })
        })

})

router.post('/login', (req, res) => {
    const {username, password} = req.body

    Users.findBy({ username }).first()
        .then(user => {
            console.log(user)
            if(user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user

                res.json({message: `Welcome ${user.username}`})
            }else{
                res.status(401).json({message: 'Invalid credentials'})
            }
        }).catch(err => {
            res.status(500).json({
                message: "Something went wrong"
            })
        })
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy((err) => {
            if(err) {
                res.json({message: 'Unable to logout'})
            }else {
                res.status(200).json({message: 'Goodbye'})
            }
        })
    }
})

module.exports = router