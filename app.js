var express = require('express');
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
 , expressSession = require('express-session')
 , passport = require('passport')
 , database = require('./Mongo/database')
 , app = express()
 , morgan = require('morgan')
 , config = require('./config')
 , mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json())
app.use(morgan('dev'))
app.set('jwt-secret',config.secret)
app.use('/api',require('./route/index'))
app.get('/',function(req,res){
    res.send('Hello jwt');
})

app.listen(config.server_port,function(){
    console.log('Port on');
})

mongoose.connect(config.db_url)
const db = mongoose.connection
db.on('error', console.error)
db.once('open', ()=>{
    console.log('connected to mongodb server')
})

const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if(user.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        }, 
                        secret, 
                        {
                            expiresIn: '7d',
                            issuer: 'velopert.com',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token) 
                        })
                })
                return p
            } else {
                throw new Error('login failed')
            }
        }
    }
    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }
    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }
    // find the user
    User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}



exports.check = (req, res) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
        res.json({
            success: true,
            info: token
        })
    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then(respond).catch(onError)
}