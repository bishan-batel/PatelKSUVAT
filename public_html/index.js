"use strict";

//import $ from "jquery";
//
const TRANSFORMATION_SPEED = 0.1;
const GRAPH_POINT_RADIUS = 1;
const GRAPH_LINE_WIDTH = 4;

const GraphDimension = new (function () {
  this.targetWidth = 15;
  this.targetHeight = 15;

  this.width = 1;
  this.height = 1;

  this.loop = () => {
    this.width = Math.lerp(this.width, this.targetWidth, TRANSFORMATION_SPEED);
    this.height = Math.lerp(
      this.height,
      this.targetHeight,
      TRANSFORMATION_SPEED
    );
    requestAnimationFrame(this.loop);
  };
  this.loop();

  return this;
})();

components.on("graph", "mounted", ({ ele }) => {
  const graph = ele.children[0];

  // gets cursor position in graph to draw on canvas ( draws at end of function )
  let mousePos = { x: 0, y: 0 };

  ele.graphFunc = (x) => x;

  graph.onmousemove = (e) => {
    const offset = $(graph).offset();
    mousePos = {
      x: e.x - offset.left,
      y: e.y - offset.top,
    };
  };
  const grapher = new Grapher(
    // grapher detail
    graph.width,
    // math function to graph
    (x) => ele.graphFunc(x) ?? 0,
    graph
  );

  // sets updater
  ele.updater = (ctx, delta) => {
    ctx.translate(5, -5);

    ctx.fillStyle = getThemeColor(5);

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = getThemeColor(14);
    ctx.textAlign = "center";
    ctx.font = "20px Georgia";
    // Draws gridlines & text
    for (let i = 1; i < GraphDimension.width; i++) {
      let x = graph.width * (i / GraphDimension.width);

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, graph.height);
      ctx.stroke();

      ctx.fillText(i, x, graph.height - 5);
    }

    ctx.font = "20px Georgia";
    for (let i = 1; i < GraphDimension.height; i++) {
      let y = graph.height * (i / GraphDimension.height);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(graph.width, y);
      ctx.stroke();

      ctx.fillText(i, 15, graph.height - y);
    }

    grapher.update(ctx, delta);

    ctx.strokeStyle = getThemeColor(6);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, graph.height);
    ctx.lineTo(graph.height, graph.width);
    ctx.stroke();

    ctx.translate(-5, 5);

    // Draws mouse cursor
    if ($(`#${graph.id}:hover`).length != 0) {
      ctx.strokeStyle = getThemeColor(5);
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  };
});

class Grapher {
  constructor(detail, func, graph) {
    this.func = func;
    this.detail = detail;

    // merges default options with inputted options

    this.canvas = graph;
    this.num = GraphDimension;

    this.points = [];

    // generates points to be used / reused in graph
    for (let i = 0; i <= detail; i++) {
      let x = (i / detail) * this.num.width;
      this.points.push(new Math.Vector2(x, 0));
    }
  }

  pixelPos(p) {
    return new Math.Vector2(
      Math.map(p.x, 0, this.num.width, 0, this.canvas.width),

      // flips mapping to Y cordinate to display right side up on canvas
      this.canvas.height -
        Math.map(p.y, 0, this.num.height, 0, this.canvas.height)
    );
  }

  update(ctx) {
    ctx.strokeStyle = getThemeColor(10);
    ctx.lineWidth = 8;

    this.points = this.points.map((p, i) => {
      let targetX = (i / this.detail) * this.num.width;
      let targetY = this.func(p.x);

      p.x = Math.lerp(p.x, targetX, TRANSFORMATION_SPEED);
      p.y = Math.lerp(p.y, targetY, TRANSFORMATION_SPEED);

      // renders point
      p.pixelPos = this.pixelPos(p);

      //ctx.beginPath();
      //ctx.arc(pixelPos.x, pixelPos.y, GRAPH_POINT_RADIUS, 0, Math.TAU);
      //ctx.stroke();

      return p;
    });

    ctx.lineJoin = "round";
    ctx.lineWidth = GRAPH_LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(({ pixelPos }) => ctx.lineTo(pixelPos.x, pixelPos.y));
    ctx.stroke();
  }
}

const getInputFields = () => [
  $("#displacement"),
  $("#initVel"),
  $("#finalVel"),
  $("#acc"),
  $("#time"),
];

const getInputVals = () =>
  getInputFields()
    // Maps all element's to the input fields values
    .map((query) => query[0].val());

function recalculateSUVAT() {
  const [displacement, velInitial, velFinal, acc, time] = getInputVals();

  const state = Math.SUVAT({
    displacement,
    velInitial,
    velFinal,
    acc,
    time,
  });
  console.table(state);

  if (state === undefined) {
  } else {
    getInputFields().forEach((field, i) => {
      if (field[0].isLocked()) return;
      field[0].setVal(state[Object.keys(state)[i]]);
    });
  }
}
