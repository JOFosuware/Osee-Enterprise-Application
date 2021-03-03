const mongoose = require('mongoose')

const itemsOnCreditSchema = mongoose.Schema({
    serialNumber: {
        type: Number,
        required: true
    },
    items: {
        type: String,
        trim: true,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    clientId: {
        type: Number,
        required: true,
        ref: 'Client'
    }
})

const ItemsOnCredit = mongoose.model('Oncredit', itemsOnCreditSchema)

module.exports = ItemsOnCredit