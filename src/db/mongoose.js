const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/osee-pos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch((e) => {
    console.log(e.message)
})