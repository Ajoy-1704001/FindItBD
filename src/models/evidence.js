const mongoose = require('mongoose')
const validator = require('validator')

const evidenceSchema = new mongoose.Schema({

    productId:{
        type: String,
        required: true,
    },
    rid:{
        type: String,
    }
}
)

const Evidence = mongoose.model('Evidence',evidenceSchema)

module.exports = Evidence

