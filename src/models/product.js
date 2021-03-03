const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    serial: {
        type: Number,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    quantity: {
        type: Number,
        trim: true,
        required: true
    }
})

const Product = mongoose.model('Products', productSchema)

module.exports = Product