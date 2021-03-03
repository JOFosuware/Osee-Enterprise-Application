const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
    clientId: {
        type: Number,
        required: true,
        unique: true
    },
    cName: {
        type: String,
        trim: true,
        required: true,
    },
    cImage: {
        type: Buffer
    },
    cNumber: {
        type: Number,
        required: true
    },
    cResidence: {
        type: String,
        trim: true,
        required: true
    },
    cLandmark: {
        type: String,
        trim: true,
        required: true
    },
    cLocation: {
        type: String,
        trim: true,
        required: true
    },
    clientIdType: {
        type: String,
        trim: true
    },
    clientIdImage: {
        type: Buffer
    },
    wName: {
        type: String,
        trim: true,
        required: true
    },
    wNumber: {
        type: Number,
        required: true
    },
    wImage: {
        type: Buffer
    },
    total: {
        type: Number
    },
    deposit: {
        type: Number
    },
    balance: {
        type: Number
    },
    signedOn: {
        type: Date
    },
    status: {
        type: String,
        trim: true,
        required: true
    }
})

clientSchema.virtual('itemsPurchased',{
    ref: 'Oncredit',
    localField: 'clientId',
    foreignField: 'clientId'
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client