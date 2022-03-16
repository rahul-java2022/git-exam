const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env'});

const port = process.env.PORT
app.listen(port, () => {
    console.log(`app is running at port ${port}`);
});
// console.log(process.env.DATABASE_LOCAL);
mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser: true,
    useCreateIndex: true,

    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(()=>{
console.log('Database has been configured');
});