const mongoose = require('mongoose')
const Schema = mongoose.Schema



const eventSchema = new Schema({
    country:String,
    county:String,
    town:String,
    venue:String,
    event_name:String,
    description:String,
    guest:String,
    url:{
        type:String,
        default:"none",
        required:true
    },
    ImageData:{
        type:String,
        required:true
    },
    vip:String,
    regular:String,
    date:String,
    userid:String,

},
{timestamps:true}
)
module.exports = mongoose.model('Event',eventSchema)