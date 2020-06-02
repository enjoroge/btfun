const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const schema = require('./schema/schema')
const mongoose =require('mongoose')
//const ImageeRouter = express.Router()
//const multer = require('multer')

//const storage =multer.diskStorage({
   // destination:function(req,file,cb){
  //      cd(null,Date.now() + file.originalname)
//    }
//})
//const fileFilter =(req,file,cd) =>{
//    if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/png'){
 //       cb(null,true);
//
 //   }else{
 //       cb(null,false)
 //   }
//
//const upolad = multer({
 //   storage:storage,
// //   limits: {
//        filesSize:1024*1024 * 5
 //   },
 //   fileFilter:1024*1024 * 5
//})



const app = express()
//allow cross-origin request
app.use(cors())

//app.use('/uploads',express.static('uploads'))
//app.use(bodyParser.jon({limit:'50mb'}))
//app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
//app.use(cookieParser())
//app.use(express.static(path.join(__dirname,'public')))
//app.use('/image',ImageeRouter)

app.use('/graphql', graphqlHTTP({
schema,
graphiql:true
}))

mongoose.connect('mongodb+srv://ernest:brendakungu@jamba-pogb3.mongodb.net/btbtfun?retryWrites=true&w=majority')
mongoose.connection.once('open',()=>{
    console.log('Connection to database successful')
})
app.listen(5000,()=>{
    console.log('Now listenning on port 4000')
})