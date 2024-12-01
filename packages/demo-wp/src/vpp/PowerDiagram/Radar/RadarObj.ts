import * as d3 from 'd3';
import Bearings from './Bearings';
import Canvas from './Canvas';
import Circles from './Circles';
import Contacts from './Contacts';
import { tState } from './Model';
import Scan from './Scan';

class Radar {
  canvas: Canvas;
  circles: Circles;
  scanLine: Scan;
  bearings: Bearings;
  contacts: Contacts;

  constructor() {
    this.canvas = new Canvas();
    this.circles = new Circles();
    this.scanLine = new Scan();
    this.bearings = new Bearings();
    this.contacts = new Contacts();
  }

  update(state: tState) {
    const { container, rotationSpeed } = state;
    const { contacts, scanLine } = this;

    this.canvas.update(state);
    this.circles.update(state);
    this.scanLine.update(state);
    this.bearings.update(state);
    this.contacts.update(state);

    let angle = 0;
    function onTick() {
      if (!container) return;
      angle = (angle + rotationSpeed) % 360; // Increment angle
      contacts.onTick(container, angle);
      scanLine.onTick(container, angle);
    }

    d3.interval(onTick, 1000 / 60); // Adjust for smoother animation
  }
}

export default Radar;
