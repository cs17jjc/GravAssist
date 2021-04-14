function nestedCopy(array) {
  return JSON.parse(JSON.stringify(array));
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function rgbToHexAlpha(r, g, b, a) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
}
function calcDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
function addVector(v1, v2) {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}
function calcForce(distance, pmass, boimass) {
  return (0.5 * pmass * boimass) / Math.pow(distance, 2);
}
function calcAngle(ppos, boipos) {
  const deltaX = boipos.x - ppos.x;
  const deltaY = boipos.y - ppos.y;
  return Math.atan2(deltaY, deltaX);
}
function calcComponents(force, angle) {
  return { x: force * Math.cos(angle), y: force * Math.sin(angle) };
}
function copyVector(v) {
  return { x: v.x, y: v.y };
}
function angleMagVector(angle, magnitude) {
  return { x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude };
}
function calcRadiAngleForTrajectory(playerPos, playerVel, playerMass, boiPos, boiMass,other, n) {
  var radiAngle = [];
  var ppos = copyVector(playerPos);
  var pvel = copyVector(playerVel);
  for (var i = 0; i < n; i++) {
    const dist = calcDistance(ppos, boiPos);
    const angle = calcAngle(ppos, boiPos);
    const ra = { r: dist, a: angle };
    radiAngle.push(ra);
    const force = calcForce(dist, playerMass, boiMass);
    var forceVec = calcComponents(force, angle);
    other.forEach(o => {
      const distO = calcDistance(ppos, {x:o.x,y:o.y});
      const angleO = calcAngle(ppos, {x:o.x,y:o.y});
      const forceO = calcForce(distO, playerMass, o.m);
      forceVec = addVector(forceVec,calcComponents(forceO,angleO));
    });
    pvel = addVector(pvel, { x: forceVec.x / playerMass, y: forceVec.y / playerMass });
    ppos = addVector(ppos, pvel);
  }
  return radiAngle;
}
function drawRectCenter(ctx, x, y, w, h) {
  ctx.rect(x - w / 2, y - h / 2, w, h);
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function createParticle(pos, xdir, ydir) {
  var pObj = { x: pos.x, y: pos.y, xvel: 0, yvel: 0, life: 255, lifeDec: Math.max(50, Math.random() * 60) };
  pObj.xvel = xdir * Math.max(5, Math.random() * 20);
  pObj.yvel = ydir * Math.max(5, Math.random() * 20);
  return pObj;
}
function createTarget(x, y, radius, type) {
  return { x: x, y: y, r: radius, type: type, completed: false };
}
function createRandomPointTarget(cent, min, max, minR, maxR) {
  var randRadius = getRandomArbitrary(minR, maxR);
  var randAngle = Math.random() * 2 * Math.PI;
  var randDist = getRandomArbitrary(min + randRadius, max - randRadius);
  return { x: cent.x + Math.cos(randAngle) * randDist, y: cent.y + Math.sin(randAngle) * randDist, r: randRadius, type: "POINT", completed: false };
}
function createTimeTarget(time, pointTargets) {
  return { pointTargets: pointTargets, type: "TIMED", time: time, startTime: 0, completed: false };
}
function createRock(x, y, vx, vy, r, mass) {
  return { x: x, y: y, xvel: vx, yvel: vy, r: r, m: mass, g: createRockGraphics(r) };
}
function createSatTarget(vx, vy, r, mass, maxFuel, targetPoint) {
  return { xvel: vx, yvel: vy, r: r, m: mass, p: targetPoint, fuel: 0, maxFuel: maxFuel, type: "SAT" };
}
function createMenuTarget(x, y, r, label) {
  return { x: x, y: y, r: r, type: "MENU", label: label, completed: false };
}
function createAtractor(x,y,r,m){
  return { x: x, y: y, r: r, m:m};
}
function createRockGraphics(radius) {
  var bgCanv = document.createElement("canvas");
  bgCanv.width = radius * 2;
  bgCanv.height = radius * 2;
  var bgCtx = bgCanv.getContext("2d");

  bgCtx.fillStyle = rgbToHex(255, 153, 0);
  bgCtx.strokeStyle = rgbToHex(204, 102, 0);

  bgCtx.beginPath();
  bgCtx.arc(radius, radius, radius, 0, Math.PI * 2);
  bgCtx.fill();
  bgCtx.stroke();

  return bgCanv;
}
function createPlanetGraphics(radius) {
  var bgCanv = document.createElement("canvas");
  bgCanv.width = radius * 2;
  bgCanv.height = radius * 2;
  var bgCtx = bgCanv.getContext("2d");

  bgCtx.fillStyle = rgbToHex(0, 0, 255);
  bgCtx.beginPath();
  bgCtx.arc(radius, radius, radius, 0, 2 * Math.PI);
  bgCtx.fill();

  bgCtx.save();
  bgCtx.strokeStyle = rgbToHex(0, 255, 0);
  bgCtx.strokeWidth = 5;
  bgCtx.translate(radius, radius);


  var height = Math.random() * (radius * 0.2) + radius * 0.8;
  for (var a = 0; a < Math.PI * 2; a += 0.1) {
    if (a > 0.2 && a < 2) {
      height = radius;
    }
    const bottomPoint = angleMagVector(a, radius);
    const topPoint = angleMagVector(a, height);
    bgCtx.beginPath();
    bgCtx.moveTo(bottomPoint.x, bottomPoint.y);
    bgCtx.lineTo(topPoint.x, topPoint.y);
    bgCtx.closePath();
    bgCtx.stroke();
    height = Math.random() * (radius * 0.32) + radius * 0.7;
  }

  bgCtx.restore();

  bgCtx.fillStyle = rgbToHex(255, 255, 255);
  bgCtx.beginPath();
  bgCtx.arc(radius, radius, radius * 0.4, 0, 2 * Math.PI);
  bgCtx.fill();

  return bgCanv;
}
function makeTimeString(timeDelta) {
  var timer = Math.trunc((timeDelta) / 1000);
  var minutes = parseInt(timer / 60, 10);
  var seconds = parseInt(timer % 60, 10);
  var milliseconds = Math.trunc(((timeDelta - timer) / 1000 - Math.trunc((timeDelta - timer) / 1000)) * 1000);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milliseconds = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
  return minutes + ":" + seconds + ":" + milliseconds;
}
function drawTextOvergray(ctx) {
  ctx.fillStyle = rgbToHexAlpha(0, 0, 0, 150);
  ctx.fillRect(0, canvasHeight * 0.72, canvasWidth, canvasHeight);
}
function makePlaylist(){
  return [LevelState.menu(), LevelState.tutorial1(), LevelState.tutorial2(), LevelState.tutorial3(), LevelState.tutorial4(), LevelState.tutorial5(), LevelState.level1(), LevelState.tutorial6(), LevelState.level2(), LevelState.level3(), LevelState.level4(), LevelState.level5(), LevelState.level6(), LevelState.level7(),LevelState.level8(),LevelState.level9(),LevelState.level10(),LevelState.level11(),LevelState.level12(),LevelState.level13(),LevelState.tfp()];
}