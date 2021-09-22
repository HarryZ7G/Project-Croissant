import { io } from 'socket.io-client';
const ENDPOINT = `/`;
const socket = io(ENDPOINT, {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Credentials": "true",
  },
  transports: ['websocket']
});

export default socket;