const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const User = require(path.join(process.cwd(),'/src/models/users'))
const auth = require(path.join(process.cwd(),'/src/middleware/auth'))


const router = new express.Router()

router.get('/', (req, res) => {
    //res.send('Osee Enterprise Application')
    res.render('index')
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
    //res.send('This is dashboard')
})

//Create users
router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body)
        await user.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

//Upload profile picture
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|)$/)){
            return cb(new Error('Upload a picture of jpg or jpeg or png extentsion'))
        }

        cb(undefined, true)
    }
})
router.post('/upload', auth, upload.single('upload'), async (req, res) => {
    try {
        const user = await User.findUser(req.query.username)
        const buffer = await sharp(req.file.buffer).resize({width: 180, height: 220}).png().toBuffer()
        user.profile = buffer
        await user.save()

        res.send({
            id: user._id
        })
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }
})

router.get('/user/:id/profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.profile){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.profile)
    } catch (e) {
        res.status(404).send()
    }
})

//Authenticate and grant users entry
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        if(user && token){
            res.send({
                message: 'User found',
                token
            })
        }
    } catch (e) {
        res.status(404).send({
            error: e.message
        })
    }
})

//Single device logout
router.get('/dashboard/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.render('index')
    } catch (e) {
        res.status(500).send()
    }
})

//Multiple device logout
router.get('/dashboard/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        
        await req.user.save()
        res.render('index')
    } catch (e) {
        res.status(500).send()
    }
})


//Render Add user page
router.get('/dashboard/adduser', (req, res) => {
    res.render('add-user')
})

//Get the current user info
router.get('/users/me', auth, async (req, res) => {

    res.send({
        username: req.user.username,
        id: req.user._id
    })
})

router.post('/users/new', auth, async (req, res) => {
    try {
        const user = await User.findUser(req.body.username)
        res.send({
            username: user.username
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({
            error: 'Invalid request'
        })
    }

    try {
        const user = await User.findUser(req.query.userid)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.status(201).send()
    } catch (e) {
        res.status(400).send({message: e.message})
    }
})

router.post('/dashboard/me/deleteuser', auth, async (req, res) => {
    try {
        const user = await User.findUser(req.body.username)

        if(!user){
            throw new Error('User does not exist')
        }

        user.remove()

        res.send({
            message: 'User removed successfully'
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router