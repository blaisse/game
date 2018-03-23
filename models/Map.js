const mongoose = require('mongoose');
const { Schema } = mongoose;

const mapSchema = new Schema({
    size: Number,//2 => 2x2, 3 => 3x3
    map: Object,
    name: String
});

const modelClass = mongoose.model('maps', mapSchema);