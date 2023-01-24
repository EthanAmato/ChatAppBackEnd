const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

const server =http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        //telling server which server is sending calls to socket.io server (we r using react so 3000)
        origin: "http://localhost:3000",
        // what methods are allowed?
        methods: ["GET","POST"] 
    },
});

//listen for an event (user connecting)
//listening 4 event with id "connection" and call callback
io.on("connection", (socket) => { //we use socket for listening and dispatching events for a given user / open connection
    console.log("User connected", socket.id)

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room ${data}`)
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data) //emitting data from the backend to room in frontend in form of
                                                            // "receive_message" event type 
    })


    socket.on("disconnect", () => { //good form to have callback upon socket disconnect
        console.log("User Disconnected", socket.id);
    });
});


server.listen(3001, () => {
    console.log(`Server running`)
})