const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    about: {
        type: String,
        defaultValue: ""
    },
    // confirmed: {
    //     type: Boolean,
    //     required: true,
    //     defaultValue: false
    // },
    // verificationCode: {
    //     type: String
    // },
    profilePicture: {
        type: String,
        defaultValue:""
    },
})

 // static signup method
userSchema.statics.signup = async function(firstName, lastName, username, email, password) {

    // validation
    if (!firstName || !lastName || !username || !email || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is weak')
    }


    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use') 
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const bio = ""
    const avatar = ""

    const user = await this.create({ firstName, lastName, username, email, password: hash, about: bio, profilePicture: avatar })

    // console.log(user)

    return user
}

// static login method
userSchema.statics.login = async function( username, password) {
    if (!username || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ username })

    if (!user) {
        throw Error('Incorrect username') 
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Invalid login credentials')
    }

    // console.log(user)

    return user
}


 module.exports = mongoose.model('User', userSchema)