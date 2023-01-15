const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const { width, height } = canvas.getBoundingClientRect();

const viewport = {
  width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0) * 0.9,
  height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.9
};

const R = viewport.width > viewport.height
      ? (viewport.height / 2) * 0.8
      : (viewport.width / 2) * 0.8;

let points = [];

let count_points = 100;
let mf = 2;
let delay = 30

let is_animation = false;
let animation_interval;

const count_points_range = document.getElementById("count_points")
const count_points_span = document.getElementById("count_points_span")

count_points_range.addEventListener("input", (e) => {
  count_points = +e.target.value;
  count_points_span.innerText = count_points;
  cardioid();
})

const mf_range = document.getElementById("mf")
const mf_span = document.getElementById("mf_span")

mf_range.addEventListener("input", (e) => {
  mf = +e.target.value;
  mf_span.innerText = mf;
  cardioid();
})

const is_animation_checkbox = document.getElementById("is_animation")
is_animation_checkbox.addEventListener('change', (e) => {
  is_animation = e.target.checked;
  animation();  
})

const to_center = (_x, _y) => [_x + width / 2, _y + height / 2];
const length_line = (x1, y1, x2, y2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2);
const get_angle = ((x1, y1, x2, y2) => Math.abs(Math.atan2(y2 - y1, x2  - x1) * 57.2957)*2);

const animation = () => {
  if (is_animation) {
    animation_interval = setInterval(() => {
      if (mf > mf_range.max) return;
      mf += 0.01;
      mf_range.value = Math.floor(mf * 1000) / 1000;
      mf_span.innerText = Math.floor(mf * 1000) / 1000;
      cardioid();
    }, delay)
  }
  else {
    clearInterval(animation_interval)
  }
}

const cardioid = () => {
  ctx.clearRect(0, 0, width, height);
  points = [];
  
  ctx.beginPath();
  ctx.arc(width/2, height/2, R, 0, Math.PI * 2, true);
  ctx.stroke(); // may be commented
  
  for (let angle = 0; angle < 360; angle += 360 / count_points) {
    let x = Math.cos(angle * Math.PI / 180) * R;
    let y = Math.sin(-angle * Math.PI / 180) * R;
    ([x, y] = to_center(x, y));
    points.push([x, y])
  }

  for (let i = 0; i < count_points; i++) {
    let index = Math.floor(i * mf) % count_points;  
    ctx.beginPath(); // may be commented
    ctx.strokeStyle = `hsl(${get_angle(points[i][0], points[i][1], points[index][0], points[index][1])}, ${70}%, ${50}%)`
    ctx.moveTo(points[i][0], points[i][1]);
    ctx.lineTo(points[index][0], points[index][1]);
    ctx.stroke();
  }
}

window.addEventListener("load", () => {
  count_points_range.value = count_points;
  count_points_span.innerText = count_points;
  mf_range.value = mf;
  mf_span.innerText = mf;
  is_animation_checkbox.checked = is_animation = true;
  cardioid()
  animation()
})