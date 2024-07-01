# Realtime Chat Application - Frontend

This project is the frontend of a Realtime Chat Web Application built with React and Vite. It features real-time messaging, invitations, typing status, message status, online state, and search functionalities for friends and recent chats.

## Screenshots

### Desktop

<img src="../screenshots/screen1-desktop.png" alt="Screen 1 - desktop" style='border:2px solid black'/>
<img src="../screenshots/screen1-desktop.png" alt="Screen 1 - desktop" style='border:2px solid black'/>

### Mobile

<div style='dispay:flex;gap:50'>
<img src="../screenshots/screen1-mobile.jpeg" alt="Screen 1 - mobile" width="300" style='border:2px solid black'/>
<img src="../screenshots/screen2-mobile.jpeg" alt="Screen 2 - mobile" width="300" style='border:2px solid black'/>
</div>

## Features

- Realtime messaging
- Realtime invitations
- Typing state indication
- Message status (sent, delivered, seen)
- Online state and last connection time
- Search for new friends
- Search for recent chats

## Tech Stack

- React
- Vite
- Socket.io-client

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd client
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Configuration

Make sure to set the correct backend API URL in the `.env` file (Create this file first).

    ```env
    REACT_APP_PROXY=YOUR-BACKEND-API-URL
    ```
