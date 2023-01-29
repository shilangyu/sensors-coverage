class Sensor {
  static {
    this.drawRadius = 2;
    this.drawColor;
    this.broadcastColor;
    this.coverageColor;
  }

  constructor(pos) {
    this.pos = pos;
  }
}

let sensors = [];
const broadcastRadius = document.querySelector("#broadcast-radius");
const coverageRadius = document.querySelector("#coverage-radius");

const SIZE = { x: 700, y: 400 };

function setup() {
  createCanvas(SIZE.x, SIZE.y);

  const handleSliderChange =
    (id) =>
    ({ target: { value } }) => {
      document.querySelector(`#${id}-value`).innerText = value;
    };
  broadcastRadius.addEventListener(
    "input",
    handleSliderChange("broadcast-radius")
  );
  coverageRadius.addEventListener(
    "input",
    handleSliderChange("coverage-radius")
  );

  Sensor.drawColor = color("black");
  Sensor.broadcastColor = color(103, 157, 245, 100);
  Sensor.coverageColor = color(130, 245, 216, 100);

  document.querySelector("#legend-broadcast").style.backgroundColor =
    Sensor.broadcastColor.toString();
  document.querySelector("#legend-coverage").style.backgroundColor =
    Sensor.coverageColor.toString();
  document.querySelector("#save-sensors").addEventListener("click", () => {
    saveJSON(
      {
        broadcast_radius: +broadcastRadius.value,
        coverage_radius: +coverageRadius.value,
        sensors: sensors.map((e) => ({ x: e.pos.x, y: e.pos.y })),
      },
      "sensors.json"
    );
  });
  document.querySelector("#load-sensors").addEventListener("click", () => {
    document.querySelector("#load-sensors-input").click();
  });
  document
    .querySelector("#load-sensors-input")
    .addEventListener("change", ({ target: { files } }) => {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = JSON.parse(e.target.result);
          broadcastRadius.value = data.broadcast_radius;
          coverageRadius.value = data.coverage_radius;
          handleSliderChange("broadcast-radius")({
            target: { value: data.broadcast_radius },
          });
          handleSliderChange("coverage-radius")({
            target: { value: data.coverage_radius },
          });
          sensors = data.sensors.map((e) => new Sensor(createVector(e.x, e.y)));
        };
        reader.readAsText(file);
      }
    });
}

function draw() {
  background(220);

  fill(Sensor.broadcastColor);
  noStroke();
  for (const sensor of sensors) {
    circle(sensor.pos.x, sensor.pos.y, broadcastRadius.value * 2);
  }

  fill(Sensor.coverageColor);
  noStroke();
  for (const sensor of sensors) {
    circle(sensor.pos.x, sensor.pos.y, coverageRadius.value * 2);
  }

  fill(Sensor.drawColor);
  stroke(Sensor.drawColor);
  for (const sensor of sensors) {
    circle(sensor.pos.x, sensor.pos.y, Sensor.drawRadius * 2);
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
  if (
    movedSensor === undefined &&
    mouseY >= 0 &&
    mouseY < SIZE.y &&
    mouseX >= 0 &&
    mouseX < SIZE.x
  ) {
    sensors.push(new Sensor(createVector(mouseX, mouseY)));
  }
  movedSensor = undefined;
}

function mouseDragged() {
  if (movedSensor === undefined) return;

  movedSensor.pos = createVector(mouseX, mouseY);

  return false;
}
