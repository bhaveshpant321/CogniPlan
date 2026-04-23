# CogniPlan Role 2: Real-Time Engine

This folder contains the real-time synchronization backend service for CogniPlan. It is built with Node.js, Express, Socket.io, and the 100ms server SDK. The engine enables live room state management, whiteboard collaboration, user presence tracking, and video token provisioning.

## Overview

The real-time engine supports:

- Room creation and join flow using Socket.io rooms
- User presence and active user list synchronization
- Whiteboard stroke broadcasting and canvas clearing
- Video token generation through 100ms server SDK
- Environment configuration via `.env`

## Folder Contents

### `package.json`

Defines the project dependencies and scripts:

- `express`: Web server framework
- `socket.io`: Real-time WebSocket communication
- `socket.io-client`: Client library for connecting to Socket.io servers
- `cors`: Cross-origin middleware for browser clients
- `dotenv`: Loads environment variables from `.env`
- `@100mslive/server-sdk`: 100ms server SDK for video token generation
- `nodemon`: Dev dependency for automatic server restarts

Scripts:

- `start`: Runs `node server.js`
- `dev`: Runs `nodemon server.js`

### `server.js`

The main backend server file. This is the core of the real-time engine.

Responsibilities:

- Load environment variables with `dotenv`
- Create an Express app and enable CORS
- Set up an HTTP server and Socket.io server
- Initialize 100ms SDK using `HMS_ACCESS_KEY` and `HMS_SECRET_KEY`
- Handle incoming socket connections and room events

Socket event handling:

1. `join_room`
   - Adds a socket to a room
   - Creates room state if it does not exist
   - Tracks active users and sends the current room state back to the joining user
   - Broadcasts updated user list to others in the same room

2. `draw_stroke`
   - Receives drawing stroke data from a client
   - Stores stroke in `rooms[roomId].canvas_history`
   - Broadcasts the new stroke to other users in the room

3. `clear_canvas`
   - Clears the room's canvas history
   - Broadcasts `canvas_cleared` to all users in the room

4. `request_video_token`
   - Uses the 100ms SDK to generate a management token for video or room access
   - Emits `video_token_received` with the generated token
   - Sends `video_error` if token generation fails

5. `disconnect`
   - Removes the disconnected socket from all room active user lists
   - Broadcasts updated user lists to remaining room members

Server config:

- Default port: `3001` if `PORT` is not provided
- CORS origin is currently set to `http://localhost:3000`

### `utils.js`

Contains shared helper utilities for the engine.

Current exports:

- `throttle(func, delay)`:
  - Limits how often a function may execute
  - Useful for reducing frequent broadcast or draw updates to avoid too much traffic
  - Returns a wrapper that only runs `func` once per `delay` milliseconds

Note: This helper is currently implemented but not yet imported or used in `server.js`.

### `.env.example`

Provides the required environment variables for the server:

- `HMS_ACCESS_KEY`: 100ms API access key
- `HMS_SECRET_KEY`: 100ms API secret key

Copy `.env.example` to `.env` and replace the placeholder values with valid 100ms credentials before running the server.

### `.gitignore`

Ignored files and folders for this node service, typically including:

- `node_modules/`
- `.env`
- `npm-debug.log`
- `dist/` or build artifacts if present

### `.env`

Local environment variable overrides. Should contain secrets and is not committed to source control.

## How it works together

1. A client connects to the Socket.io server in `server.js`.
2. The client sends `join_room` with `roomId` and `username`.
3. The server creates or restores room state in the `rooms` object.
4. The server sends the room state to the joining client and notifies other clients.
5. Drawing events are synchronized across clients using `draw_stroke` and `receive_stroke`.
6. The canvas is cleared for all clients using `clear_canvas`.
7. Video access is enabled by requesting a token from the 100ms server SDK.

## Running the service

1. Install dependencies:

```powershell
cd "c:\Users\Muneef Khan\Desktop\New folder (2)\CogniPlan\role2-realtime-engine"
npm install
```

2. Create `.env` from `.env.example`:

```powershell
copy .env.example .env
```

3. Start the server:

```powershell
npm run start
```

4. For development with auto-reload:

```powershell
npm run dev
```

## Notes

- The engine currently stores room state in memory only, so it is not persistent across restarts.
- The current CORS setting is limited to `http://localhost:3000`; update this if the client runs from a different origin.
- If you want to use `utils.throttle`, import it in `server.js` and apply it to event handlers like `draw_stroke`.

## File Roles Summary

- `package.json`: Dependency and script configuration
- `server.js`: Real-time API, room management, socket event handling, 100ms video token generation
- `utils.js`: Helper utilities for throttling and later reuse
- `.env.example`: Example environment variable file for 100ms credentials
- `.gitignore`: Ignored local files and folders for Git
- `.env`: Local environment variables (not committed)
- `README.md`: This documentation file
- `selfnotes.md`: Developer notes summarizing progress and next tasks
