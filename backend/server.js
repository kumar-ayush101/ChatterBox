const express=require('express')
const dotenv = require('dotenv')
dotenv.config({
    path: "./.env"
})
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const http=require('http')
const socketIo=require('socket.io')
const Message=require('./models/Message')
const authRoutes=require('./routes/auth')

const corsOptions = {
    origin: 'https://chatterboxofbaba.netlify.app', 
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true 
};





const app=express();
app.use(cors(corsOptions))
const PORT=5000;
const mongoString = process.env.MONGO_URI;
// console.log(process.env.MONGO_URI)
const server=http.createServer(app);
const io=socketIo(server,{
    cors:{
        origin: 'https://chatterboxofbaba.netlify.app', 
        methods: ['GET', 'POST'],
        credentials: true 
    }
})


mongoose.connect(mongoString,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() =>console.log('Mongodb Connected'))
.catch((err)=>console.log(err))

app.use(cors())
app.use(bodyParser.json())
app.use('/api/auth',authRoutes)
app.use('/uploads',express.static('uploads'))

app.set('io',io)

app.get('/', (req, res) => {
    res.send({
        activeStatus: true, 
        error: false
    });
});

io.on('connection',(socket) =>{
    console.log('New client connected')

    socket.on('join_room',(userId)=>{
        socket.join(userId);
        console.log(`User ${userId} joined room`)
    })

    socket.on('send_message',async(message) =>{
        console.log('Message received on server',message)
        const {from,to,content,timestamp} =message

        if(from && to && content){
            const newMessage=new Message({from,to,content,timestamp})
            await newMessage.save()

            io.to(to).emit('receive_message',message)
        }else{
            console.error('Message is missing from,to,content')
        }
    })

    socket.on('disconnect',()=>{
        console.log('Client disconnected')
    })
})



server.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`)
})