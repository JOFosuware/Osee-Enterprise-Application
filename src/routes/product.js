const express = require('express')
const path = require('path')
const Product = require(path.join(process.cwd(), '/src/models/product'))
const auth = require(path.join(process.cwd(),'/src/middleware/auth'))

const router = new express.Router()

router.post('/dashboard/me/newproduct', auth, async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send({message: e.message})
    }
})

router.get('/dashboard/me/createproduct', auth, (req, res) => {
    res.render('create-product')
})

router.get('/dashboard/me/updateproduct', auth, (req, res) => {
    res.render('update-product')
})

//Search a product by a serial number
router.post('/dashboard/me/searchproduct', auth, async (req, res) => {
    try {
        const product = await Product.findOne(req.body)
        res.send(product)
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

router.post('/dashboard/me/updateproduct', auth, async (req, res) => {
    try {
        const prod = await Product.updateOne({serial: req.query.serial}, req.body)
        const product = await Product.findOne({serial: req.query.serial})
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

router.post('/dashboard/me/removeproduct', auth, async (req, res) => {
    try {
        const product = await Product.findOne(req.body)
        if(!product){
            throw new Error('Product does not exist')
        }
        res.send(product)
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

router.post('/dashboard/me/deleteProduct', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete(req.body)
        if(!product){
            throw new Error('Product does not exist')
        }
        res.send({
            message: `deleted`,
            product: product.description
        })
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

module.exports = router