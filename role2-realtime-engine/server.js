const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// State: Store rooms, users, and DRAWING HISTORY
let rooms = {}; 

io.on('connection', (socket) => {
    
    socket.on('join_room', ({ roomId, username }) => {
        socket.join(roomId);
        
        if (!rooms[roomId]) {
            rooms[roomId] = {
                room_id: roomId,
                active_users: [],
                canvas_history: [], // <--- Consistency: Saves all previous strokes
                timer: { is_running: false, seconds_left: 1500, type: "pomodoro" }
            };
        }

        const newUser = { id: socket.id, name: username, status: "watching" };
        rooms[roomId].active_users.push(newUser);

        // SYNC STRATEGY: Send the full canvas history to the late-joiner immediately
        socket.emit('room_state_update', rooms[roomId]);
        
        // Update others in the room
        socket.to(roomId).emit('update_user_list', rooms[roomId].active_users);
    });

    // COLLISION HANDLING: Use a unique stroke object
    socket.on('draw_stroke', ({ roomId, stroke }) => {
        if (rooms[roomId]) {
            // Add a timestamp and user ID to handle order (Consistency)
            const enrichedStroke = {
                ...stroke,
                userId: socket.id,
                timestamp: Date.now() 
            };

            // Save to buffer for late joiners
            rooms[roomId].canvas_history.push(enrichedStroke);
            
            // Broadcast to everyone ELSE (Latency: 0ms for the drawer, ~50ms for others)
            socket.to(roomId).emit('receive_stroke', enrichedStroke);
        }
    });

    socket.on('clear_canvas', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].canvas_history = [];
            io.to(roomId).emit('canvas_cleared');
        }
    });

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            rooms[roomId].active_users = rooms[roomId].active_users.filter(u => u.id !== socket.id);
            io.to(roomId).emit('update_user_list', rooms[roomId].active_users);
        }
    });
});

server.listen(3001, () => console.log("ROLE 2 ENGINE: WEEK 2 - CONSISTENCY READY"));