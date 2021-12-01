"use strict";
//import $ from "jquery";

components.lockableInput = function ({ label, unit }) {
  this.label = label;
  this.unit = unit;

  const lockableInput = $(this).children().first();
  const field = lockableInput.children(".lockableInput-input").first();

  lockableInput.children(".lockableInput-label").text(label);
  lockableInput.children(".lockableInput-unit").text(`${unit}`);

  this.setVal = (n) => {
    field[0].value = `${n}`;
    field[0].defaultValue = n;
  };

  this.val = () => {
    if (this.isLocked()) return undefined;
    const val = parseFloat(field.val());
    return isNaN(val) ? undefined : val;
  };

  const lock = lockableInput.children(".lockableInput-lock");
  const lockIcon = lock.children("i");

  field[0].disabled = lockIcon[0].classList.contains("fi-sr-Lock");

  this.isLocked = () => field[0].disabled;

  // defines & calls immediately
  this.toggleLock = () => {
    field[0].disabled = !field[0].disabled;
    lockableInput.toggleClass("locked");
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
