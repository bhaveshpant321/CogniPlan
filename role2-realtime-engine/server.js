require('dotenv').config(); 
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const hmssdk = require('@100mslive/server-sdk');

const app = express();
app.use(cors());

// Initialize 100ms SDK using keys from your .env file
const sdk = new hmssdk.SDK(process.env.HMS_ACCESS_KEY, process.env.HMS_SECRET_KEY);

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// State: Store rooms, users, and DRAWING HISTORY
let rooms = {}; 

io.on('connection', (socket) => {
    
    // --- 1. ROOM JOINING LOGIC ---
    socket.on('join_room', ({ roomId, username }) => {
        socket.join(roomId);
        
        if (!rooms[roomId]) {
            rooms[roomId] = {
                room_id: roomId,
                active_users: [],
                canvas_history: [],
                timer: { is_running: false, seconds_left: 1500, type: "pomodoro" }
            };
        }

        const newUser = { id: socket.id, name: username, status: "watching" };
        rooms[roomId].active_users.push(newUser);

        // Sync: Send full state to the new user
        socket.emit('room_state_update', rooms[roomId]);
        
        // Update others in the room
        socket.to(roomId).emit('update_user_list', rooms[roomId].active_users);
        console.log(`👤 ${username} joined room: ${roomId}`);
    });

    // --- 2. WHITEBOARD DRAWING LOGIC ---
    socket.on('draw_stroke', ({ roomId, stroke }) => {
        if (rooms[roomId]) {
            const enrichedStroke = {
                ...stroke,
                userId: socket.id,
                timestamp: Date.now() 
            };

            rooms[roomId].canvas_history.push(enrichedStroke);
            socket.to(roomId).emit('receive_stroke', enrichedStroke);
        }
    });

    socket.on('clear_canvas', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].canvas_history = [];
            io.to(roomId).emit('canvas_cleared');
        }
    });

    // --- 3. WEEK 3: VIDEO SIGNALING LOGIC (Corrected) ---
    socket.on('request_video_token', async ({ roomId, role }) => {
        try {
            // Using getManagementToken for the updated SDK version
            const token = await sdk.getManagementToken({
                room_id: roomId, 
                role: role || 'guest' 
            });

            socket.emit('video_token_received', { token });
            console.log(`🔑 Video Token generated for ${socket.id}`);
        } catch (error) {
            console.error("❌ Video Token Error:", error);
            socket.emit('video_error', { message: "Token generation failed" });
        }
    });

    // --- 4. DISCONNECT CLEANUP ---
    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            rooms[roomId].active_users = rooms[roomId].active_users.filter(u => u.id !== socket.id);
            io.to(roomId).emit('update_user_list', rooms[roomId].active_users);
        }
        console.log(`🔌 User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 ENGINE ACTIVE ON PORT ${PORT}`));