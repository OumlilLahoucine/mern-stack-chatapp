# Realtime Chat Application - Frontend

This project is the frontend of a Realtime Chat Web Application built with React and Vite. It features real-time messaging, invitations, typing status, message status, online state, and search functionalities for friends and recent chats.

## Screenshots

### Desktop

![Screen 1](./screenshots/screen1-desktop.png)
![Screen 2](./screenshots/screen2-desktop.png)

### Mobile

![Screen 1](./screenshots/screen1-mobile.jpeg)
![Screen 2](./screenshots/screen2-mobile.jpeg)

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
