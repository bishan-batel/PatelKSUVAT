"use strict";

// New math constant
Math.TAU = Math.PI * 2;

// Linear Inteporlation
Math.lerp = (from, to, a) => from + (to - from) * a;

// Maping a value in one range to another
Math.map = (o, oMin, oMax, tMin, tMax) => ((o - oMin) / oMax + tMin) * tMax;

Math.Vector2 = function (x, y) {
    this.x = x ?? 0;
    this.y = y ?? 0;

    this.lerp = ({x, y}, a) => {
        this.x = Math.lerp(this.x, x, a);
        this.y = Math.lerp(this.y, y, a);
    };

    return this;
};

// SUVAT
Math.SUVAT = (state) => {
    let {displacement, velInitial, velFinal, acc, time} = state;

    // calculates key from what variables are undefiend
    // ex. system with displacement & acc missing the key would be "displacement acc"
    const key = Object
        .keys(state)
        .filter(k => state[k] === undefined)
        .reduce((prev, k) => prev + " " + k, "")
        .trim();

    // bases calculate depending on whats missing
    switch (key) {
        case "acc time": {
            time = (2 * displacement) / (velInitial + velFinal);
            acc = (velFinal - velInitial) / time;
            break;
        }
        case "velFinal time": {
            velFinal = Math.sqrt(velInitial * velInitial + 2 * acc * displacement);
            time = (velFinal - velInitial) / acc;
            break;
        }
        case "velFinal acc": {
            acc = (2 * (displacement - velInitial * time)) / (time * time);
            velFinal = velInitial + acc * time;
            break;
        }
        case "velInitial time": {
            velInitial = Math.sqrt(velFinal * velFinal - 2 * acc * displacement);
            time = (velFinal - velInitial) / acc;
            break;
        }
        case "velInitial acc": {
            velInitial = (2 * displacement) / time - velFinal;
            acc = (velFinal - velInitial) / time;
            break;
        }
        case "displacement time": {
            time = (velFinal - velInitial) / acc;
            displacement = 0.5 * (velInitial + velFinal) * time;
            break;
        }
        case "displacement acc": {
            acc = (velFinal - velInitial) / time;
            displacement = 0.5 * (velInitial + velFinal) * time;
            break;
        }
        case "displacement velInitial": {
            velInitial = velFinal - acc * time;
            displacement = 0.5 * (velInitial + velFinal) * time;
            break;
        }
        case "velInitial velFinal": {
            velInitial = (displacement - 0.5 * acc * time) / time;
            velFinal = velInitial + acc * time;
            break;
        }
        case "displacement velFinal": {
            velFinal = velInitial + acc * time;
            displacement = 0.5 * (velInitial + velFinal) * time;
            break;
        }
        case "displacement": {
            displacement = 0.5 * (velInitial + velFinal) * time;
            break;
        }
        case "velInitial": {
            velInitial = (displacement - 0.5 * acc * time) / time;
            break;
        }
        case "velFinal": {
            velFinal = velInitial + acc * time;
            break;
        }
        case "acc": {
            acc = (velFinal - velInitial) / time;
            break;
        }
        case "time": {
            time = (2 * displacement) / (velInitial + velFinal);
            break;
        }
        // any other key means it is impossible to solve
        case "":
        default:
            console.log('Failed to solve ' + key);
            return undefined;

    }

    return {
        displacement, velInitial, velFinal, acc, time,
    };
};
