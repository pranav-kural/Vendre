// reference mongoose
let mongoose = require('mongoose');

// create product schema
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Product name is required'
    },
    condition: {
        type: String,
        required: 'condition is required'
    },
    price: {
        type: Number,
        min: 0.01
    },
    year: {
        type: Number,
        min: 1800
    },
    seller: {
        type: String,
        required: 'A seller name is required'
    }
});

// Make the productSchema public
module.exports = mongoose.model('Product', productSchema);