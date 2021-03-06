import React, { Component } from 'react';

import shapes from './shapes.js';

class Cartogram extends Component {
  constructor(props) {
    super(props);

    this.results = null;

    this.colors = {
      blue: '#2677bb',
      green: '#007500',
      grey: '#a5a6a9',
      red: '#db2f27',
      orange: '#f67944',
      darkGrey: '#0b3536'
    }
  }

  componentWillMount() {
    this.canvas = document.createElement('canvas');
    this.canvas.width  = 840;
    this.canvas.height = 675;
  }

  componentDidMount() {
    this.canvasContainer.appendChild(this.canvas);
  }

  getOptions(shape) {
    let alpha;
    let fill;

    if (this.results && this.results.find(x => x.canton === shape.code.toUpperCase())) {
      const result = this.results.find(x => x.canton === shape.code.toUpperCase());
      const yes = result.yes;
      const no = result.no;

      if (yes > no) {
        fill = this.colors.green;
        alpha = (yes / (yes + no));
      } else {
        fill = this.colors.red;
        alpha = (no / (yes + no));
      }
    } else {
      fill = shape.fill; // set default
      alpha = 1; // set default
    }

    return {
      alpha: alpha,
      fill: fill,
      stroke: this.colors.darkGrey,
      strokeWidth: 2
    }
  }

  drawPath(d, options) {
    const path = new Path2D(d);

    this.fillStyle = options.fill;
    this.fill(path);
    this.stroke(path);
  }

  drawRect(x, y, width, height, options) {
    this.beginPath();
    this.fillStyle = options.fill;
    this.rect(x, y, width, height);
    this.fill();
    this.stroke();
  }

  drawPoly(points, options) {
    this.beginPath();
    this.moveTo(points[0][0],points[0][1]);
    this.lineTo(points[1][0],points[1][1]);
    this.lineTo(points[2][0],points[2][1]);
    this.closePath();
    this.fillStyle = options.fill;
    this.fill();
    this.stroke();
  }

  initDrawing() {
    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const x = shape.x;
      const y = shape.y;
      const type = shape.type;
      const points = shape.points;
      const path = shape.path;
      const width = 100;
      const options = this.getOptions(shape);

      let drawRect = this.drawRect.bind(ctx);
      let drawPoly = this.drawPoly.bind(ctx);
      let drawPath = this.drawPath.bind(ctx);

      ctx.globalAlpha = options.alpha; // this was originally here to set for both rough an regular. Maybe now it should be moved

      if (!this.props.map) {
        switch (type) {
          case 'polygon':
            drawPoly(points, options);
            break;
          case 'rectangle':
            drawRect(x, y, width, 50, { alpha: 1, fill: this.colors.blue, stroke: null, strokeWidth: null });
            break;
          default:
            drawRect(x, y, width, 100, options);
        }
      } else {
        drawPath(path, options);
      }
    }
  }

  render() {
    this.results = this.props.results ? this.props.results : null;
    this.initDrawing();

    return (
      <div ref={canvasContainer => this.canvasContainer=canvasContainer}></div>
    );
  }
}

export default Cartogram;
