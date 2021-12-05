"use strict";

// gets all input fields in order
const getInputFields = () => [$("#displacement"), $("#initVel"), $("#finalVel"), $("#acc"), $("#time"),];

const getInputVals = () => getInputFields()
    // Maps all element's to the input fields values
    .map((query) => query[0].val());

const clearErrorArtifacts = () => {
    getInputFields().forEach((field) => field.removeClass("incomplete"));
    $("#error-msg").text("");
}

$("#recalculate").on("click", () => {
    clearErrorArtifacts();

    // Get inputted values
    const [displacement, velInitial, velFinal, acc, time] = getInputVals();

    // Attempt to calculate state
    const state = Math.SUVAT({
        displacement, velInitial, velFinal, acc, time,
    });

    // if failed to calculate
    if (state === undefined) {
        // display error
        $("#error-msg").text("Please unlock & enter 3 or move values of the system");


        // highlight incomplete fields`
        getInputFields()
            // filters out any field that is filled out
            .filter(([field]) => field.val() === undefined)
            // for all fields that are missing a valid input, add a shake animation
            .forEach((field) => {
                field[0].setTab("");
                field.addClass("incomplete");
                field.addClass("shake");

                // timeout to remove shake animation, this is used over traditional animation duration
                // to allow for continuous shaking when the user clicks the button multiple times
                setTimeout(() => field.removeClass("shake"), 200);
            });

        return;
    }

    // Set values
    getInputFields().forEach((field, i) => {
        field[0].setTab(state[Object.keys(state)[i]]);
        field[0].setVal(state[Object.keys(state)[i]]);
    });

    // Updates graph function
    window.graphFunc = (x) => state.velInitial * x + 0.5 * state.acc * x * x;
});
