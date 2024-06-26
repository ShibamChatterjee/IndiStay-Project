const express = require('express')
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const { saveRedirectUrl } = require('../middleware')
const router = express.Router()
const userController = require('../controllers/users')

router.get("/signup", userController.renderSignupForm)

router.post("/signup",wrapAsync(userController.signup))

router.get("/login",userController.renderLoginForm)


//passport.authenticate() is a middleware used to authenicate before login
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: '/login', failureFlash:true}),userController.login)

router.get("/logout",userController.logout)
module.exports = router