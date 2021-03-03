const express = require('express')
const path = require('path')
const multer = require('multer')
const sharp = require('sharp')
const Client = require(path.join(process.cwd(), '/src/models/client'))
const ItemsOnCredit = require(path.join(process.cwd(), '/src/models/purchasedItems'))
const auth = require(path.join(process.cwd(), '/src/middleware/auth'))

const router = new express.Router()

router.post('/dashboard/me/newcontract', auth, async (req, res) => {
    try {
        const client = await Client.create(req.body)
        res.status(201).send(client)
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

//Set and process client contract picture
const client = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|)$/)){
            return cb(new Error('Upload a picture of jpg or jpeg or png extentsion'))
        }

        cb(undefined, true)
    }
})

router.post('/dashboard/me/client/picture', auth, client.single('clientimage'), async (req, res) => {
    try {
        const client = await Client.findOne({clientId: req.query.clientid})
        const buffer = await sharp(req.file.buffer).resize({width: 180, height: 220}).png().toBuffer()

        if(!client){
            throw Error('Clients was not found')
        }

        client.cImage = buffer
        await client.save()
        res.send({
            clientId: client.clientId
        })
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

//Fetch client picture
router.get('/client/:id/picture', async (req, res) => {
    try {
        const client = await Client.findOne({clientId: req.params.id})

        if(!client || !client.cImage){
            throw Error('Client cannot be found')
        }

        res.set('Content-Type', 'image/png')
        res.send(client.cImage)
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

//Process client's id information
const idCard = multer({
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

router.post('/dashboard/me/client/id', auth, idCard.single('idimage'), async (req, res) => {
    try {
        const client = await Client.findOne({clientId: req.query.clientid})
        const buffer = await sharp(req.file.buffer).resize({width: 320, height: 200}).png().toBuffer()
        const {cardtype} = req.body

        if(!client){
            throw Error('Client does not exist')
        }

        client.clientIdType = cardtype
        client.clientIdImage = buffer
        await client.save()
        res.send({
            clientId: client.clientId
        })
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

router.get('/client/:id/id', async (req, res) => {
    try {
        const client = await Client.findOne({clientId: req.params.id})

        if(!client){
            throw Error('Client does not exist')
        }

        res.set('Content-Type', 'image/png')
        res.send(client.clientIdImage)
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

//Process witness's picture for storage
const witnessPicture = multer({
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

router.post('/dashboard/me/client/witness/picture', auth, witnessPicture.single('witnessimage'), async (req, res) => {
    try {
        const client = await Client.findOne({clientId: req.query.clientid})
        const buffer = await sharp(req.file.buffer).resize({width: 180, height: 220}).png().toBuffer()

        if(!client){
            throw Error('Client does not exist')
        }

        client.wImage = buffer
        await client.save()

        res.send({clientId: client.clientId})
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

//Fetch witness picture
router.get('/witness/:id/picture', async (req, res) => {
    try {
        const client = await Client.findOne({clientId: req.params.id})

        if(!client || !client.wImage){
            throw Error('Client or witness image does not exist')
        }

        res.set('Content-Type', 'image/png')
        res.send(client.wImage)
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

//Process and store items purchased by client
router.post('/dashboard/me/client/items', auth, async (req, res) => {
    try {
        const docs = req.body
        if(docs.length === 1){
            const items = await ItemsOnCredit.create(docs[0])
            
            if(!items)
                throw Error('Bad request')
        }else{
            const items = await ItemsOnCredit.create(docs)
            
            if(!items)
                throw Error('Bad request')
        }

        res.send()
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

//Update the client info with the purchase accounts
router.post('/dashboard/me/client/purchase/accounts', auth, async (req, res) => {
    const {total, deposit, balance, signedOn} = req.body
    try {
        const client = await Client.findOne({clientId: req.query.clientid})

        if(!client)
            throw Error('Bad request')

        client.total    = total
        client.deposit  = deposit
        client.balance  = balance
        client.signedOn = signedOn
        await client.save()
        await client.populate('itemsPurchased').execPopulate()

        res.send({
            client,
            items: client.itemsPurchased
        })
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

module.exports = router