const mongoose = require('mongoose')

const schema = mongoose.Schema;

const UserSchema = new schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        minLength:5,
        required: true
    },
    profilePic:{
        type: String,
        default: '',
    },
    followers:{
        type: [String],
        default: [],
    },
    following:{
        type: [String],
        default: [],
    },
    bio:{
        type: String,
        default: '',
    }
},{
    timestamps: true,
})

const user = mongoose.model('user', UserSchema)

module.exports = user;