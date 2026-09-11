import { io } from "socket.io-client";

const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTllNTQ3MTg2YThlMmI0MmIwNzI3NGEiLCJpYXQiOjE3ODkwOTg0MTcsImV4cCI6MTc4OTA5OTMxN30.FBE3n5f9b5iXCgfbLWIIa9m1ODOZowGLGpjdAZHmBnA";

const socket = io(
    "http://localhost:5000",
    {
        auth: {
            token: accessToken,
        },
    }
);

socket.on(
    "connect",
    () => {
        console.log(
            "Connected:",
            socket.id
        );
    }
);

socket.on(
    "socket:connected",
    (data) => {
        console.log(
            "Server confirmation:",
            data
        );
    }
);

socket.on(
    "connect_error",
    (error) => {
        console.error(
            "Connection error:",
            error.message
        );
    }
);

socket.on(
    "disconnect",
    (reason) => {
        console.log(
            "Disconnected:",
            reason
        );
    }
);