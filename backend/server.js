const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/Message');
const authRoutes = require('./routes/auth');

dotenv.config({
    path: "./.env"
});

const corsOptions = {
    origin: 'https://chatterboxofbaba.netlify.app', // frontend URL
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true 
};

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for PORT
const mongoString = process.env.MONGO_URI;

const server = http.createServer(app);
const io = socketIo(server, {
    cors: corsOptions // Use the same CORS options here
});

// MongoDB connection
mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Middleware setup
app.use(cors(corsOptions)); // Only use your custom CORS options
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
    res.send({
        activeStatus: true, 
        error: false
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('send_message', async (message) => {
        console.log('Message received on server', message);
        const { from, to, content, timestamp } = message;

        if (from && to && content) {
            const newMessage = new Message({ from, to, content, timestamp });
            await newMessage.save();

            io.to(to).emit('receive_message', message);
        } else {
            console.error('Message is missing from, to, content');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
