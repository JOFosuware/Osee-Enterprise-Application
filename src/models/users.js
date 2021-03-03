const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        trim: true,
        minlength: 8,
        required: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain the word "password"')
            }
        }
    },
    profile: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
}
)

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({username})

    if(!user){
        throw new Error('Unable to find user, enter correct user')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Password incorrect')
    }

    return user
}

userSchema.statics.findUser = async (username) => {
    const user = await User.findOne({username})

    if(!user){
        throw new Error('Unable to find user, enter correct user')
    }

    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, "thisismynewcourse")
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}

userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('Users', userSchema)

module.exports = User