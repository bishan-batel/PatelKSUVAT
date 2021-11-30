"use strict";

const THEME_SWITCH_DURATION = 200;

const themes = {
  dark: [
    "#2e3440",
    "#3b4252",
    "#434c5e",
    "#4c566a",
    "#d8dee9",
    "#eceff4",
    "#8fbcbb",
    "#88c0d0",
    "#81a1c1",
    "#5e81ac",
    "#bf616a",
    "#d08770",
    "#ebcb8b",
    "#a3be8c",
    "#b48ead",
    "none",
  ],
  light: [
    "#eceff4",
    "#d8dee9",
    "#8fbcbb",
    "#2e3440",
    "#3b4252",
    "#88c0d0",
    "#434c5e",
    "#4c566a",
    "#81a1c1",
    "#5e81ac",
    "#bf616a",
    "#d08770",
    "#ebcb8b",
    "#a3be8c",
    "#b48ead",
    "url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.nordangliaeducation.com%2Fresources%2Fus%2F_filecache%2F88a%2F2ae%2F21982-cropped-w220-h240-of-1-FFFFFF-ansari-mansoor-adult-1677.jpg&f=1&nofb=1)",
  ],
};

// gets theme stored in local storage, if not set then defaults to dark
function getTheme() {
  return localStorage.getItem("theme") ?? "dark";
}

function getThemeColor(i) {
  return getThemeColors()[i];
}

function getThemeColors() {
  return themes[getTheme()];
}

function setTheme() {
  getThemeColors()
    // for each theme color set the corresponding property in CSS
    .forEach((color, i) =>
      // sets color property
      $("body").css(`--color${i}`, color)
    );
}

function toggleTheme() {
  localStorage.setItem("theme", getTheme() == "dark" ? "light" : "dark");
  setTheme();
}

setTheme();

// sets transition in JS to prevent inintial flash
setTimeout(THEME_SWITCH_DURATION, () =>
  $("body").css("transition", `all ${THEME_SWITCH_DURATION}ms ease-in-out`)
);
