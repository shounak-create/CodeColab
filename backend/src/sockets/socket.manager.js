const connectedUsers = new Map();

export const addUserSocket = (
    userId,
    socketId
) => {
    const sockets =
        connectedUsers.get(userId) || new Set();

    sockets.add(socketId);

    connectedUsers.set(
        userId,
        sockets
    );
};

export const removeUserSocket = (
    userId,
    socketId
) => {
    const sockets =
        connectedUsers.get(userId);

    if (!sockets) {
        return;
    }

    sockets.delete(socketId);

    if (sockets.size === 0) {
        connectedUsers.delete(userId);
    }
};

export const getUserSockets = (
    userId
) => {
    return connectedUsers.get(userId) || new Set();
};

export const isUserOnline = (
    userId
) => {
    const sockets =
        connectedUsers.get(userId);

    return Boolean(
        sockets && sockets.size > 0
    );
};

export const getOnlineUserIds = () => {
    return [
        ...connectedUsers.keys(),
    ];
};