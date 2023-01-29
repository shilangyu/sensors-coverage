class Sensor {
  static {
    this.broadcastRadius = 50;
    this.coverageRadius = 70;
    this.drawRadius = 3;
    this.drawColor;
    this.broadcastColor;
    this.coverageColor;
  }

  constructor(pos) {
    this.pos = pos;
  }
}

const sensors = [];

function setup() {
  createCanvas(700, 400);
  Sensor.drawColor = color("black");
  Sensor.broadcastColor = color(103, 157, 245, 50);
  Sensor.coverageColor = color(130, 245, 216, 50);

  document.querySelector("#legend-broadcast").style.backgroundColor =
    Sensor.broadcastColor.toString();
  document.querySelector("#legend-coverage").style.backgroundColor =
    Sensor.coverageColor.toString();
  document.querySelector("#save-sensors").addEventListener("click", () => {
    saveJSON(
      {
        broadcast_radius: Sensor.broadcastRadius,
        coverage_radius: Sensor.coverageRadius,
        sensors: sensors.map((e) => ({ x: e.pos.x, y: e.pos.y })),
      },
      "sensors.json"
    );
  });
}

function draw() {
  background(220);

  fill(Sensor.drawColor);
  stroke(Sensor.drawColor);
  for (const sensor of sensors) {
    circle(sensor.pos.x, sensor.pos.y, Sensor.drawRadius);
  }

  fill(Sensor.broadcastColor);
  noStroke();
  for (const sensor of sensors) {
    circle(sensor.pos.x, sensor.pos.y, Sensor.broadcastRadius);
  }

  fill(Sensor.coverageColor);
  noStroke();
  for (const sensor of sensors) {
    circle(sensor.pos.x, sensor.pos.y, Sensor.coverageRadius);
  }
}

let movedSensor;
function mousePressed() {
  if (sensors.length === 0) return;

  const mousePos = createVector(mouseX, mouseY);

  let closest = sensors[0];
  let d = mousePos.dist(closest.pos);
  for (let i = 1; i < sensors.length; i++) {
    const curr = mousePos.dist(sensors[i].pos);
    if (curr < d) {
      d = curr;
      closest = sensors[i];
    }
  }

  if (d < 50) {
    movedSensor = closest;
  }
}
function mouseReleased() {
  if (movedSensor === undefined) {
    sensors.push(new Sensor(createVector(mouseX, mouseY)));
  }
  movedSensor = undefined;
}

function mouseDragged() {
  if (movedSensor === undefined) return;

  movedSensor.pos = createVector(mouseX, mouseY);

  return false;
}
