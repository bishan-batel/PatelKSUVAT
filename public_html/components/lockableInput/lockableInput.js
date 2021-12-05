"use strict";
//import $ from "jquery";

components.lockableInput = function ({label, unit}) {
    this.label = label;
    this.unit = unit;

    const lockableInput = $(this).children(".lockableInput").first();
    const field = lockableInput.children(".lockableInput-input").first();
    this.tab = $(this).children().first().children().first();
    //this.tab.text("");

    // assign component parameters to elements
    lockableInput.children(".lockableInput-label").text(label);
    lockableInput.children(".lockableInput-unit").text(`${unit}`);

    // sets value of fields
    this.setVal = (n) => {
        field[0].value = `${n}`;
        field[0].defaultValue = n;
    };

    // sets tab value
    this.setTab = (v) => {
        const msg = `${v}`;
        this.tab.text(msg);

        if (msg.trim() === "")
            this.classList.add("lockable-input-empty");
        else
            this.classList.remove("lockable-input-empty");
    }
    this.setTab("");

// function to get the value of the text;
    this.val = () => {
        if (this.isLocked()) return undefined;
        const val = parseFloat(field.val());

        if (isNaN(val)) {
            // converts NaN to undefined because that is generally easier to deal with
            return undefined;
        }
        return val;
    };

    const lock = lockableInput.children(".lockableInput-lock");
    const lockIcon = lock.children("i");

    field[0].disabled = lockIcon[0].classList.contains("fi-sr-Lock");

// Locked means that the field is disabled
    this.isLocked = () => field[0].disabled;

// defines & calls immediately
    this.toggleLock = () => {
        field[0].disabled = !field[0].disabled;

        // toggles 'locked'
        lockableInput.toggleClass("locked");

        // switches between icons
        lockIcon.toggleClass("fi-sr-Lock");
        lockIcon.toggleClass("fi-sr-Unlock");

        field[0].defaultValue = "";
        if (!this.isLocked()) {
            field[0].value = "";
        }
        this.onToggle?.call();
    };

    this.toggleLock();
    this.toggleLock();

    lock.on("click", () => this.toggleLock());

    return this;
};
