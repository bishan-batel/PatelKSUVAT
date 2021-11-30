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

  this.clone = () => Math.createVector(this.x, this.y);

  return this;
};

// SUVAT
Math.SUVAT = (state) => {
  let { displacement, velInitial, velFinal, acc, time } = state;

  // creates map of which values are missing or not
  const missing = { ...state };
  Object.keys(missing).forEach((k) => (missing[k] = missing[k] === undefined));

  // need 3 or more variables to define rest of system
  const missingCount = Object.keys(missing).reduce(
    (prev, k) => prev + missing[k],
    0
  );

  // if more than 3 missing than error out
  if (missingCount >= 3) {
    return undefined;
  }

  // Calculates other values based on missing

  // Has Displacement
  if (!missing.displacement) {
    // Has Vel Init
    if (!missing.velInitial) {
      if (!missing.velFinal) {
        time = (2 * displacement) / (velInitial + velFinal);
        acc = (velFinal - velInitial) / time;
      } else if (!missing.acc) {
        velFinal = Math.sqrt(velInitial * velInitial + 2 * acc * displacement);
        time = (velFinal - velInitial) / acc;
      } else if (!missing.time) {
        acc = (2 * (displacement - velInitial * time)) / (time * time);
        velFinal = velInitial + acc * time;
      }
      // Has Vel Final
    } else if (!missing.velFinal) {
      if (!missing.acc) {
        velInitial = Math.sqrt(velFinal * velFinal - 2 * acc * displacement);
        time = (velFinal - velInitial) / acc;
      } else if (!missing.time) {
        velInitial = (2 * displacement) / time - velFinal;
        acc = (velFinal - velInitial) / time;
      }
    } else if (!missing.acc) {
      if (!missing.time) {
        velInitial = (displacement - 0.5 * acc * time * time) / time;
        velFinal = velInitial + acc * time;
      }
    }

    // Has Vel Initial
  } else if (!missing.velInitial) {
    // Has Vel Final
    if (!missing.velFinal) {
      if (!missing.acc) {
        time = (velFinal - velInitial) / acc;
        displacement = 0.5 * (velInitial + velFinal) * t;
      } else if (!missing.time) {
        acc = (velFinal - velInitial) / time;
        displacement = 0.5 * (velInitial + velFinal) * t;
      }
    } else if (!missing.acc) {
      if (!missing.time) {
        velInitial = velFinal - acc * time;
        displacement = 0.5 * (velInitial + velFinal) * t;
      }
    }
  }

  return {
    displacement,
    velInitial,
    velFinal,
    acc,
    time,
  };
};
