const graphql = require('graphql')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const Event = require ('../models/events.model')
const User = require ('../models/user.model')



const {GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    
    GraphQLNonNull,
    GraphQLList,
    
    GraphQLInt} 
    =graphql


const EventType= new GraphQLObjectType({
    name:'Event',
    fields:()=>({
        id:{type:GraphQLID},
        country:{type:GraphQLString},
        county:{type:GraphQLString},
        town:{type:GraphQLString},
        venue:{type:GraphQLString},
        event_name:{type:GraphQLString},
        description:{type:GraphQLString},
        guest:{type:GraphQLString},
        url:{type:GraphQLString},
        vip:{type:GraphQLString},
        regular:{type:GraphQLString},
        date:{type:GraphQLString},
        user:{type:UserType,
        
            resolve(parent,args ){
                return User.findById(parent.userid)
            }
        }
    })
})
const UserType= new GraphQLObjectType({
    name:'User',
    fields:()=>({

        id:{type:GraphQLID},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        events:{type:new GraphQLList(EventType),
        
            resolve(parent,args ){
                return User.findById({authorid:parent.id})
            }
        }
       
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        event:{
            type:EventType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                
            //return _.find(events,{id:args.id})
            return Event.findById(args.id)
            }

        },
    
    user:{
        type:UserType,
        args:{id:{type:GraphQLID}},
        resolve(parent,args){
            
        //return _.find(users,{id:args.id})
        return User.findById(args.id)
        }
    },
    events:{
        type:new GraphQLList(EventType),
        resolve(parent,args){
            return Event.find({})
        }
    },
    users:{
        type:new GraphQLList(UserType),
        resolve(parent,args){
            //return users
            return User.find({})
        }
    }
    }
})

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        AddUser:{
            type:UserType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                password:{type:GraphQLNonNull(GraphQLString)},
                

            },
            resolve(parent,args){
                return User.findOne({email: args.email})
                .then( user =>{
                    if (user){
                        throw new Error('User exists already.')
                    }
                    return bcrypt.hash(args.password, 12)
                })
               
                .then(hashedPassword =>{
                    let user=new User({
                        name:args.name,
                        email:args.email,
                        password:hashedPassword,
                        
                    })
                    return user.save()
                })
                .then(result =>{
                    return {... result._doc, password:null}
                })
                
                .catch(err => {
                    throw err;
                })
                
            }
        },

        AddEvent:{
            type:EventType,
            args:{
                country:{type:GraphQLNonNull(GraphQLString)},
                county:{type:GraphQLNonNull(GraphQLString)},
                town:{type:GraphQLNonNull(GraphQLString)},
                venue:{type:GraphQLNonNull(GraphQLString)},
                event_name:{type:GraphQLNonNull(GraphQLString)},
                description:{type:GraphQLNonNull(GraphQLString)},
                guest:{type:GraphQLString},
                url:{type:GraphQLNonNull(GraphQLString)},
                vip:{type:GraphQLString},
                regular:{type:GraphQLString},
                date:{type:GraphQLNonNull(GraphQLString)},

            },
            resolve(parent,args){
                let event=new Event({
                    country:args.country,
                    county:args.county,
                    town:args.town,
                    venue:args.venue,
                    event_name:args.event_name,
                    description:args.description,
                    guest:args.guest,
                    url:args.url,
                    vip:+args.vip,
                    regular:+args.regular,
                    date:args.date,
                })
                return event.save()
            }
        },


    }
})

module.exports = new GraphQLSchema({

    query:RootQuery,
    mutation:Mutation
})