"use strict";

components.graph = function ({ graphid }) {
  // default graph options
  const graph = $(this).children().first()[0];
  graph.id = graphid;

  this.updater = () => {};

  const ctx = graph.getContext("2d");

  graph.width = 500;
  graph.height = 500;

  // clear background
  this.clearBackground = () => {
    ctx.fillStyle = getThemeColor(1);
    ctx.fillRect(0, 0, graph.width, graph.height);
  };

  const update = (delta) => {
    this.clearBackground();
    this.updater(ctx, delta);
  };

  // starts animation loop for update function
  this.loop = (past = Date.now()) => {
    // calcualtes delta time since last frame for smoother animations
    const now = Date.now();
    const delta = now - past;
    update(delta * 0.01); // converts delta time to seconds for easier use
    requestAnimationFrame(() => this.loop(now));
  };
  this.loop();
};
