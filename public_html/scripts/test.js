/**
 * Test script for seeing if the math script works or not
 */

for (let i = 0; i < 100; i++) {
    // creates undefined state
    const state = {
        displacement: undefined,
        velInitial: undefined,
        velFinal: undefined,
        acc: undefined,
        time: undefined,
    };

    // fills random 3 variables with random 3 values
    while (undefinedCount(state) > 2) {
        state[rand(Object.keys(state))] = Math.random();
    }

    // attempts calculation
    const calc = Math.SUVAT(state);

    // if theres any undefineds then we know it failed
    if (undefinedCount(calc) > 0) {
        Object.keys(state).filter(k => state[k] !== undefined).forEach(k => state[k] = 1)
        throw new Error("failed to calc");
    }
}

function rand(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function undefinedCount(obj) {
    return Object.keys(obj).filter(k => obj[k] === undefined).length;
}