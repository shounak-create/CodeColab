export const normalizeUserPair = (
    userIdA,
    userIdB
) => {
    const first =
        userIdA.toString();

    const second =
        userIdB.toString();

    if (first < second) {
        return {
            user1: first,
            user2: second,
        };
    }

    return {
        user1: second,
        user2: first,
    };
};