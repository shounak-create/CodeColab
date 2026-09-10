export const normalizeMemberPair = (
    userIdA,
    userIdB
) => {
    const first = userIdA.toString();
    const second = userIdB.toString();

    if (first < second) {
        return [first, second];
    }

    return [second, first];
};