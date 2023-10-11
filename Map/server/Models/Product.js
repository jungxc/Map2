const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: String,
    detail: {
        type: String
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.model('products', productSchema)