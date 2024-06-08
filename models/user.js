const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true

    },
    email: {
        type: String,
        trim: true

    },
    password: {
        type: String,
        trim: true
    },
    gender: {
        type: String,

    },

    dob: {
        type: Date,
        trim: true
    },


    ticket: [Object],

    date: {
        type: Date,
        default: Date.now
    }

})

const User = new mongoose.model('User', UserSchema)
module.exports = User
