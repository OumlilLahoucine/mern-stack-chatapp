# Realtime Chat Application - Backend

This project is the backend of a Realtime Chat Web Application built with Express and Socket.io. It manages real-time messaging, invitations, typing status, message status, online state, and search functionalities for friends and recent chats.

This version (v1.0.0) includes text messaging only. Photos, audio recordings, and videos will be included in upcoming releases

## Features

- Realtime messaging
- Realtime invitations
- Typing state indication
- Message status (sent, delivered, seen)
- Online state and last connection time
- Search for new friends
- Search for recent chats

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/OumlilLahoucine/mern-stack-chatapp
   cd server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `config.env` file and add your MongoDB URI and other environment variables:

   ```env
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN='YOUR-FRONTEND-URL'
   USERNAME='MONGODB-USERNAME'
   CONNEXION_STRING='MONGODB-CONNEXION-STRING'
   JWT_SECRET='RANDOM-JWT-SECRET(32 characters)'
   JWT_EXPIRES_IN=1d
   ```

4. Start the server:
   ```sh
   npm start
   ```
