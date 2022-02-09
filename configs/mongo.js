const mongoose = require('mongoose')

exports.init = () => {
    mongoose.connect(process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true })
    let db = mongoose.connection

    db.on('error', console.error.bind(console, 'Database connect Error!'))
    db.once('open', () => {
        console.log('Database is Connected')
    })

}
