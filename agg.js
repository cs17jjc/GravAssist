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
  bgCtx.strokeWidth = 10;
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
}class LevelState{
    constructor(id,playerPos,playerVel,playerMass,playerRadius,playerFuel,boiPos,boiMass,boiRadius,targets,rocks,attractors){
        this.id = id;

        this.playerPosition = playerPos;
        this.playerVelocity = playerVel;
        this.playerAcceleration = {x:0,y:0};
        this.playerMass = playerMass;
        this.playerRadius = playerRadius;
        this.playerAngle;
        this.maxPlayerFuel = playerFuel;
        this.playerFuel = playerFuel;
        this.fuelConsumption = 0.5;

        this.particles = [];

        this.crashed = false;
        this.escaped = false;
        this.completed = false;

        this.bodyOfInfluencePosition = boiPos;
        this.bodyOfInfluenceMass = boiMass;
        this.bodyOfInfluenceRadius = boiRadius;
        this.planetRotation = 0;
        this.planetRotationSpeed = 0.01;
        this.planetGraphics = createPlanetGraphics(boiRadius);

        this.startTime;
        this.endTime;

        this.targets = targets;
        this.currentTargets = [];
        this.maxTarget = targets.length-1;
        
        this.rocks = rocks;

        this.attractors = attractors;
    }

    static tutorial1(){

        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var playerVelocity = {x:0,y:0};
        var playerMass = 0.1;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:-10,y:-10};
        var bodyOfInfluenceMass = 0;
        var bodyOfInfluenceRadius = 1;

        var targets = [
            createTarget(canvasWidth*0.5-90,canvasHeight*0.5,10,"POINT",false),
            createTarget(canvasWidth*0.5+90,canvasHeight*0.5,10,"POINT",false),
            createTarget(canvasWidth*0.5,canvasHeight*0.5-90,10,"POINT",false),
            createTarget(canvasWidth*0.5,canvasHeight*0.5+90,10,"POINT",false),
            createTarget(0,0,0,"END")];

        return new LevelState(0,playerPosition,playerVelocity,playerMass,playerRadius,250,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static tutorial2(){

        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:3,y:0};
        var playerMass = 0.8;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 15;

        var targets = [
            createTarget(canvasWidth/2,canvasHeight/2 - 100,10,"POINT",false),
            createTarget(0,0,0,"END")];

        return new LevelState(1,playerPosition,playerVelocity,playerMass,playerRadius,50,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static tutorial3(){

        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:3,y:0};
        var playerMass = 0.8;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 15;

        var targets = [
            createTarget(canvasWidth/2,canvasHeight/2 - 220,10,"POINT",false),
            createTarget(0,0,0,"END")];

        return new LevelState(2,playerPosition,playerVelocity,playerMass,playerRadius,100,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static tutorial4(){

        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:3,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1000;
        var bodyOfInfluenceRadius = 20;

        var targets = [
            createTarget(canvasWidth*0.3,canvasHeight/2,10,"POINT",false),
            createTarget(canvasWidth*0.4,canvasHeight/2,10,"POINT",false),
            createTarget(0,0,0,"END")];

        return new LevelState(3,playerPosition,playerVelocity,playerMass,playerRadius,50,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static tutorial5(){

        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:3,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1000;
        var bodyOfInfluenceRadius = 20;

        var targets = [
            createTarget(canvasWidth*0.7,canvasHeight/2,15,"POINT",false),
            createTarget(canvasWidth*0.58,canvasHeight*0.48,10,"POINT",false),

            createTarget(canvasWidth/2,canvasHeight*0.7,12,"POINT",false),
            createTarget(canvasWidth*0.48,canvasHeight*0.58,8,"POINT",false),

            createTarget(0,0,0,"END")];

        var rocks = [createRock(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) - 70,3,0,5,0.2)];
        return new LevelState(4,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,[]);
    }
    static level1(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:3,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 15;

        var targets = [
            createRandomPointTarget(bodyOfInfluencePosition,80,150,15,20),
            createRandomPointTarget(bodyOfInfluencePosition,80,150,15,20),
            createRandomPointTarget(bodyOfInfluencePosition,80,150,15,20),
            createTarget(0,0,0,"END")];
        
        var rocks = [createRock(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) - 90,2,0,5,0.2)];
        return new LevelState(5,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,[]);
    }
    static tutorial6(){

        var playerPosition = {x:Math.trunc(canvasWidth/2)+65,y:Math.trunc(canvasHeight/2)};
        var playerVelocity = {x:0,y:-3.2};
        var playerMass = 0.2;
        var playerRadius = 8;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1100;
        var bodyOfInfluenceRadius = 20;

        var timedTarget = createTimeTarget(12000,[
            createTarget(canvasWidth*0.4,canvasHeight/2,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight*0.67,15,"POINT",false),
            createTarget(canvasWidth*0.6,canvasHeight/2,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight*0.32,15,"POINT",false)
        ]);

        var targets = [
            timedTarget,
            createTarget(0,0,0,"END")];

        return new LevelState(6,playerPosition,playerVelocity,playerMass,playerRadius,10,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static level2(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:4,y:0};
        var playerMass = 0.4;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 2000;
        var bodyOfInfluenceRadius = 12;

        var timedTarget1 = createTimeTarget(8000,[
            createTarget(canvasWidth/2,canvasHeight/2 - 150,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2 + 50,15,"POINT",false),
        ]);
        var timedTarget2 = createTimeTarget(16000,[
            createTarget(canvasWidth/2,canvasHeight/2 - 150,15,"POINT",false),
            createTarget(canvasWidth/2 - 150,canvasHeight/2,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2 + 150,15,"POINT",false),
            createTarget(canvasWidth/2 + 150,canvasHeight/2,15,"POINT",false)
        ]);

        var targets = [
            timedTarget1,
            timedTarget2,
            createTarget(0,0,0,"END")];
        
        var rocks = [createRock(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) + 180,-1,0,5,1)];
        return new LevelState(7,playerPosition,playerVelocity,playerMass,playerRadius,100,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,[]);
    }
    static level3(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 20;

        var timedTarget = createTimeTarget(18000,[
            createTarget(canvasWidth/2,canvasHeight/2 + 100,10,"POINT",false),
            createTarget(canvasWidth/2 + 100,canvasHeight/2,10,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2 - 100,10,"POINT",false),
            createTarget(canvasWidth/2 - 100,canvasHeight/2,10,"POINT",false),
        ]);

        var targets = [
            createTarget(canvasWidth/2 - 100,canvasHeight/2,10,"POINT",false),
            timedTarget,
            createTarget(0,0,0,"END")];
        
        var rocks = [createRock(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) - 150,1,0,5,0.5)];
        return new LevelState(8,playerPosition,playerVelocity,playerMass,playerRadius,30,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,[]);
    }
    static level4(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:3.3,y:0};
        var playerMass = 0.4;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1200;
        var bodyOfInfluenceRadius = 20;

        var timedTarget = createTimeTarget(13000,[
            createTarget(canvasWidth/2-80,canvasHeight/2,13,"POINT",false),
            createTarget(canvasWidth/2+80,canvasHeight/2,13,"POINT",false),
            createTarget(canvasWidth/2 - 180,canvasHeight/2,13,"POINT",false),
        ]);

        var targets = [
            createTarget(canvasWidth/2 + 180,canvasHeight/2,13,"POINT",false),
            timedTarget,
            createTarget(0,0,0,"END")];
        
        return new LevelState(9,playerPosition,playerVelocity,playerMass,playerRadius,250,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static level5(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 15;

        var targets = [
            createSatTarget(2.2,0,5,0.2,30,createTarget(canvasWidth/2,canvasHeight/2 + 80,15,"POINT")),
            createTarget(0,0,0,"END")];
        
        return new LevelState(10,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static level6(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 80};
        var playerVelocity = {x:3,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1500;
        var bodyOfInfluenceRadius = 15;

        var targets = [
            createSatTarget(4.2,0,5,0.2,30,createTarget(canvasWidth/2,canvasHeight/2 + 40,15,"POINT")),
            createSatTarget(2.2,0,5,0.2,30,createTarget(canvasWidth/2,canvasHeight/2 + 120,15,"POINT")),
            createTarget(0,0,0,"END")];
        
        return new LevelState(11,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static level7(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 15;

        var timedTarget = createTimeTarget(12000,[
            createTarget(canvasWidth/2+80,canvasHeight/2,13,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2+50,13,"POINT",false),
            createTarget(canvasWidth/2-80,canvasHeight/2,13,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2-140,13,"POINT",false)
        ]);

        var targets = [
            createTarget(canvasWidth/2,canvasHeight/2-140,15,"POINT"),
            timedTarget,
            createSatTarget(0,-1.5,5,0.2,50,createTarget(canvasWidth/2 - 140,canvasHeight/2,15,"POINT")),
            createTarget(0,0,0,"END")];
        
        return new LevelState(12,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static level8(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 15;

        var targets = [
            createSatTarget(0,2.2,5,0.2,50,createTarget(canvasWidth/2 - 80,canvasHeight/2,15,"POINT")),
            createSatTarget(0,1.8,5,0.2,50,createTarget(canvasWidth/2 + 130,canvasHeight/2,15,"POINT")),
            createTarget(0,0,0,"END")];
        
        return new LevelState(13,playerPosition,playerVelocity,playerMass,playerRadius,450,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static level9(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 4;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1200;
        var bodyOfInfluenceRadius = 12;

        var targets = [
            createSatTarget(-1.4,0,5,0.2,100,createTarget(canvasWidth/2,canvasHeight/2-190,13,"POINT")),
            createTarget(0,0,0,"END")];
        
        var rocks = [createRock(canvasWidth/2,canvasHeight/2 + 300,-0.5,0,6,1.5)];
        return new LevelState(14,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,[]);
    }
    static level10(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 4;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1200;
        var bodyOfInfluenceRadius = 12;

        var targets = [
            createSatTarget(0,-1.8,5,0.2,25,createTarget(canvasWidth/2 + 140,canvasHeight/2,10,"POINT")),
            createSatTarget(0,+3,5,0.2,25,createTarget(canvasWidth/2 - 80,canvasHeight/2,8,"POINT")),
            createTarget(0,0,0,"END")];
        
        var rocks = [createRock(canvasWidth/2 + 100,canvasHeight/2,0,-1.8,7,2),
                     createRock(canvasWidth/2,canvasHeight/2 - 200,0.9,0,5,1.5),];
        return new LevelState(15,playerPosition,playerVelocity,playerMass,playerRadius,300,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,[]);
    }
    static level11(){
        var playerPosition = {x:Math.trunc(canvasWidth/2)-40,y:Math.trunc(canvasHeight/2)};
        var playerVelocity = {x:0,y:-3};
        var playerMass = 0.2;
        var playerRadius = 4;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2)-100,y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1200;
        var bodyOfInfluenceRadius = 12;

        var targets = [
            createTarget(canvasWidth/2 + 150,canvasHeight/2,10,"POINT"),
            createTarget(0,0,0,"END")];

        var atract = [
            createAtractor(Math.trunc(canvasWidth/2)+100,Math.trunc(canvasHeight/2),10,1000)
        ];

        return new LevelState(16,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],atract);
    }
    static level12(){
        var playerPosition = {x:Math.trunc(canvasWidth/2)+140,y:Math.trunc(canvasHeight/2)};
        var playerVelocity = {x:0,y:-3.8};
        var playerMass = 0.2;
        var playerRadius = 4;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2)-100,y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1200;
        var bodyOfInfluenceRadius = 12;

        var timedTarget = createTimeTarget(12000,[
            createTarget(canvasWidth/2-140,canvasHeight/2,10,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2,10,"POINT",false),
            createTarget(canvasWidth/2 + 140,canvasHeight/2,10,"POINT",false),
        ]);

        var targets = [
            createTarget(canvasWidth/2,canvasHeight/2,10,"POINT"),
            timedTarget,
            createTarget(0,0,0,"END")];

        var atract = [
            createAtractor(Math.trunc(canvasWidth/2)+100,Math.trunc(canvasHeight/2),10,1200)
        ];

        var rocks = [
            createRock(canvasWidth/2,canvasHeight/2,0,-1.8,7,2)
        ];

        return new LevelState(17,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,atract);
    }
    static level13(){
        var playerPosition = {x:Math.trunc(canvasWidth/2)-230,y:Math.trunc(canvasHeight/2)};
        var playerVelocity = {x:0,y:-3.8};
        var playerMass = 0.2;
        var playerRadius = 4;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2)-180,y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1200;
        var bodyOfInfluenceRadius = 12;

        var targets = [
            createSatTarget(0,-4.8,5,0.01,25,createTarget(canvasWidth/2+220,canvasHeight/2,8,"POINT")),
            createTarget(0,0,0,"END")];

        var atract = [
            createAtractor(Math.trunc(canvasWidth/2)+180,Math.trunc(canvasHeight/2),13,1200)
        ];

        var rocks = [];
        return new LevelState(18,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,rocks,atract);
    }
    static menu(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)+40};
        var playerVelocity = {x:0,y:0};
        var playerMass = 0.1;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:-10,y:-10};
        var bodyOfInfluenceMass = 0;
        var bodyOfInfluenceRadius = 1;

        var targets = [createMenuTarget(canvasWidth/2,canvasHeight/2 - 50,30,"PLAY"),
                       createMenuTarget(canvasWidth/2 + 80,canvasHeight/2 - 50,20,"NEXT"),
                       createMenuTarget(canvasWidth/2 - 80,canvasHeight/2 - 50,20,"PREV"),
                        createTarget(0,0,0,"END")];
        
        return new LevelState(-2,playerPosition,playerVelocity,playerMass,playerRadius,999999999999999,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }
    static tfp(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 20;

        var targets = [
            createTarget(0,0,0,"END"),
            createTarget(0,0,0,"END")];
        
        return new LevelState(-1,playerPosition,playerVelocity,playerMass,playerRadius,30,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[],[]);
    }

    update(inputs,soundToggle){
        if(this.startTime == null){
            this.startTime = Date.now();
        }
        if(!this.crashed && !this.escaped && !this.completed){

            this.updatePlayerMovement(inputs,soundToggle);
            

            this.particles.forEach(p => {
                p.life -= p.lifeDec;
            });
            this.particles = this.particles.filter(p => p.life > 0);
            this.particles.forEach(p => {
                p.x += p.xvel;
                p.y += p.yvel;
            });
            this.rocks.forEach(s => {
                
                const distance = calcDistance({x:s.x,y:s.y},this.bodyOfInfluencePosition);
                const gForceMagnitute = calcForce(distance,s.m,this.bodyOfInfluenceMass);
                const angle = calcAngle({x:s.x,y:s.y},this.bodyOfInfluencePosition);
                var force = calcComponents(gForceMagnitute,angle);
                this.attractors.forEach(a => {
                    const distanceTarget = calcDistance({x:s.x,y:s.y},{x:a.x,y:a.y});
                    const gForceMagnituteTarget = calcForce(distanceTarget,s.m,a.m);
                    const playerAngleTarget = calcAngle({x:s.x,y:s.y},{x:a.x,y:a.y});
                    force = addVector(force,calcComponents(gForceMagnituteTarget,playerAngleTarget));
                });
                const accel = {x:force.x/s.m,y:force.y/s.m};

                s.xvel += accel.x;
                s.yvel += accel.y;

                s.x += s.xvel;
                s.y += s.yvel;
            });

            if(this.targets[0].type=="SAT"){
                var t = this.targets[0];

                const distance = calcDistance({x:t.p.x,y:t.p.y},this.bodyOfInfluencePosition);
                const gForceMagnitute = calcForce(distance,t.m,this.bodyOfInfluenceMass);
                const angle = calcAngle({x:t.p.x,y:t.p.y},this.bodyOfInfluencePosition);
                var force = calcComponents(gForceMagnitute,angle);
                this.attractors.forEach(a => {
                    const distanceTarget = calcDistance({x:t.p.x,y:t.p.y},{x:a.x,y:a.y});
                    const gForceMagnituteTarget = calcForce(distanceTarget,t.m,a.m);
                    const playerAngleTarget = calcAngle({x:t.p.x,y:t.p.y},{x:a.x,y:a.y});
                    force = addVector(force,calcComponents(gForceMagnituteTarget,playerAngleTarget));
                });
                const accel = {x:force.x/t.m,y:force.y/t.m};

                t.xvel += accel.x;
                t.yvel += accel.y;

                t.p.x += t.xvel;
                t.p.y += t.yvel;

                if(t.p.completed){
                    if(t.fuel < t.maxFuel && this.playerFuel >= 1){
                        if(t.fuel % 4 == 0){
                            zzfx(...[soundToggle ? 1.03 : 0,0,406,.02,.02,.05,,1.3,.2,,,,,,-0.2,,,.39]).start();
                        }
                        t.fuel += 1;
                        this.playerFuel -= 1;
                    }
                }
                if(t.fuel >= t.maxFuel){
                    t.completed = true;
                }
                

            }

            if(this.targets[0].type == "TIMED" && this.targets[0].startTime != null){
                if(this.targets[0].startTime + this.targets[0].time < Date.now()){
                    this.targets[0].startTime = null;
                    this.targets[0].pointTargets.forEach(p => {p.completed = false});
                }
                if(this.targets[0].pointTargets.filter(p => !p.completed).length == 0){
                    this.targets[0].completed = true;
                }
            }

            if(this.targets[0].completed == true && this.id != -2){
                this.targets.shift();
            }
            if(this.targets.length == 1){
                this.completed = true;
                this.endTime = Date.now();
            }
            this.planetRotation += this.planetRotationSpeed;
        }
    }

    updatePlayerMovement(inputs,soundToggle){
        var force = {x:0,y:0};

        const distance = calcDistance(this.playerPosition,this.bodyOfInfluencePosition);
        const gForceMagnitute = calcForce(distance,this.playerMass,this.bodyOfInfluenceMass);
        this.playerAngle = calcAngle(this.playerPosition,this.bodyOfInfluencePosition);

        force = addVector(force,calcComponents(gForceMagnitute,this.playerAngle));

        this.attractors.forEach(a => {
            const distanceTarget = calcDistance(this.playerPosition,{x:a.x,y:a.y});
            const gForceMagnituteTarget = calcForce(distanceTarget,this.playerMass,a.m);
            const playerAngleTarget = calcAngle(this.playerPosition,{x:a.x,y:a.y});

            if(distanceTarget < a.r + this.playerRadius){
                this.crashed = true;
                zzfx(...[soundToggle ? 0.8 : 0,,977,,.3,.81,3,3.75,.5,,,,.06,.3,-12,.2,.35,.78,]).start();
            }

            force = addVector(force,calcComponents(gForceMagnituteTarget,playerAngleTarget));
        });
        
        var consumption = 0;
        if(inputs.includes("UP") && this.playerFuel > 0 && this.id != -1){
            force.y -= 0.01;
            this.particles.push(createParticle(this.playerPosition,0,1));
            consumption += this.fuelConsumption;
        }
        if(inputs.includes("DOWN") && this.playerFuel > 0 && this.id != -1){
            force.y += 0.01;
            this.particles.push(createParticle(this.playerPosition,0,-1));
            consumption += this.fuelConsumption;
        }
        if(inputs.includes("LEFT") && this.playerFuel > 0 && this.id != -1){
            force.x -= 0.01;
            this.particles.push(createParticle(this.playerPosition,1,0));
            consumption += this.fuelConsumption;
        }
        if(inputs.includes("RIGHT") && this.playerFuel > 0 && this.id != -1){
            force.x += 0.01;
            this.particles.push(createParticle(this.playerPosition,-1,0));
            consumption += this.fuelConsumption;
        }
        if(consumption > 0){
            zzfx(...[soundToggle ? 0.1 : 0,,1e3,,.07,,4,.16,32,,209,.05,,,32]).start();
        }
        this.playerFuel = Math.max(0,this.playerFuel-consumption);

        this.playerAcceleration.x = force.x/this.playerMass;
        this.playerAcceleration.y = force.y/this.playerMass;

        this.playerVelocity = addVector(this.playerVelocity,this.playerAcceleration)

        var nextPosition = {x:this.playerPosition.x + this.playerVelocity.x,y:this.playerPosition.y + this.playerVelocity.y};

        var nextDist = calcDistance(nextPosition,this.bodyOfInfluencePosition)
        if(nextDist <= this.playerRadius + this.bodyOfInfluenceRadius){
            this.playerVelocity = {x:(distance-this.bodyOfInfluenceRadius-this.playerRadius)*Math.cos(this.playerAngle),
                                  y:(distance-this.bodyOfInfluenceRadius-this.playerRadius)*Math.sin(this.playerAngle)};
        }
        if(nextDist <= this.playerRadius + this.bodyOfInfluenceRadius){
            this.crashed = true;
            this.crashed = true;
            zzfx(...[soundToggle ? 0.8 : 0,,977,,.3,.81,3,3.75,.5,,,,.06,.3,-12,.2,.35,.78,]).start();
        }
        this.rocks.forEach(s => {
            if(calcDistance({x:s.x,y:s.y},this.playerPosition) <= s.r + this.playerRadius){
                this.crashed = true;
                zzfx(...[soundToggle ? 0.8 : 0,,977,,.3,.81,3,3.75,.5,,,,.06,.3,-12,.2,.35,.78,]).start();
            }
        })
        if(nextPosition.x < 0 || nextPosition.x > canvasWidth || nextPosition.y < 0 || nextPosition.y > canvasHeight){
            this.escaped = true;
        }
        if(distance < this.nextDist){
            this.currentMinRadius = nextDist;
        }
        if(distance > this.nextDist){
            this.currentMaxRadius = nextDist;
        }
        if(this.targets[0].type == "POINT"){
            if(calcDistance(this.playerPosition,{x:this.targets[0].x,y:this.targets[0].y}) <= this.playerRadius + this.targets[0].r){
                this.targets[0].completed = true;
                zzfx(...[soundToggle ? 0.4 : 0,,432,.03,.36,.16,,.75,.5,,700,.1,.06,,,,.03,.79,.08]).start();
            }
        }
        if(this.id==-2){
            this.targets.filter(t => t.type=="MENU").forEach(t => {
                t.completed = calcDistance(this.playerPosition,{x:t.x,y:t.y}) <= this.playerRadius + t.r
            });
        }
        if(this.targets[0].type == "TIMED"){
            var nextTarget = this.targets[0].pointTargets.filter(p => !p.completed)[0];
            var nextTargetIndex = this.targets[0].pointTargets.indexOf(nextTarget);
            if(nextTarget != null){
                if(calcDistance(this.playerPosition,{x:nextTarget.x,y:nextTarget.y}) <= this.playerRadius + nextTarget.r){
                    nextTarget.completed = true;
                    zzfx(...[soundToggle ? 0.4 : 0,,432 + (50*nextTargetIndex),.03,.36,.16,,.75,.5,,700,.1,.06,,,,.03,.79,.08]).start();
                }
            }
            var firstTarget = this.targets[0].pointTargets[0];
            if(calcDistance(this.playerPosition,{x:firstTarget.x,y:firstTarget.y}) <= this.playerRadius + firstTarget.r){
                this.targets[0].startTime = Date.now();
                this.targets[0].pointTargets.forEach(p => p.completed = p == firstTarget);
            }
        }
        if(this.targets[0].type == "SAT"){
            if(calcDistance(this.playerPosition,{x:this.targets[0].p.x,y:this.targets[0].p.y}) <= this.playerRadius + this.targets[0].p.r){
                this.targets[0].p.completed = true;
            } else {
                this.targets[0].p.completed = false;
            }
        }

        this.playerPosition.x += this.playerVelocity.x;
        this.playerPosition.y += this.playerVelocity.y;
    }
}class GameState {
    constructor(levels, background) {
        this.levels = levels;
        this.shiftedLevels = [];
        this.selection = null;
        this.currentLevel = this.levels.shift();
        this.background = background;
    }
    static initial() {
        var bgCanv = document.createElement("canvas");
        bgCanv.width = canvasWidth;
        bgCanv.height = canvasHeight;
        var bgCtx = bgCanv.getContext("2d");
        bgCtx.fillStyle = rgbToHex(0, 0, 0);
        bgCtx.fillRect(0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < 100; i++) {
            var r = Math.random() > 0.5 ? 1 : 0;
            var b = Math.random() > 0.5 ? 1 : 0;
            var g = Math.random() > 0.5 && (r == 1 || b == 1) ? 1 : 0;

            if (!(r || b)) {
                r = 1;
                g = 1;
                b = 1;
            }

            bgCtx.fillStyle = rgbToHex(255 * r, 255 * g, 255 * b);
            bgCtx.beginPath();
            bgCtx.arc(Math.random() * canvasWidth, Math.random() * canvasHeight, Math.random() * 2, 0, Math.PI * 2);
            bgCtx.fill();
        }
        //return new GameState([LevelState.tutorial1(),LevelState.tutorial2(), LevelState.tutorial3(), LevelState.tutorial4(), LevelState.level1()], bgCanv);
        //return new GameState(startPlaylist, bgCanv);
        var plst = makePlaylist();
        //var plst = [LevelState.level10(),LevelState.tfp()];
        return new GameState(plst, bgCanv);
    }

    updateLevelState(inputArr,soundToggle) {
        this.currentLevel.update(inputArr,soundToggle);
    }

    update(inputsArr,soundToggle) {
        if (inputsArr.includes("SPACE")) {
            if (this.currentLevel.completed && this.currentLevel.id != -2) {
                this.currentLevel = this.levels.shift();
            }
        }
        if (this.currentLevel.id == -2) {
            var selection = this.currentLevel.targets.filter(t => t.type == "MENU" && t.completed)[0];
            if (selection != null && this.selection == null) {
                switch (selection.label) {
                    case "PLAY":
                        this.currentLevel = this.levels.shift();
                        break;
                    case "NEXT":
                        if(this.levels.length > 2){
                            this.shiftedLevels.unshift(this.levels.shift());
                        }
                        break;
                    case "PREV":
                        if(this.shiftedLevels.length > 0){
                            this.levels.unshift(this.shiftedLevels.shift());
                        }
                        break;
                }
            }
            this.selection = selection;
        }
        if (inputsArr.includes("ESC")) {
            this.levels = makePlaylist();
            this.shiftedLevels = [];
            this.currentLevel = this.levels.shift();
        }
        if (inputsArr.includes("RESTART")) {
            switch (this.currentLevel.id) {
                case 0:
                    this.currentLevel = LevelState.tutorial1();
                    break;
                case 1:
                    this.currentLevel = LevelState.tutorial2();
                    break;
                case 2:
                    this.currentLevel = LevelState.tutorial3();
                    break;
                case 3:
                    this.currentLevel = LevelState.tutorial4();
                    break;
                case 4:
                    this.currentLevel = LevelState.tutorial5();
                    break;
                case 5:
                    this.currentLevel = LevelState.level1();
                    break;
                case 6:
                    this.currentLevel = LevelState.tutorial6();
                    break;
                case 7:
                    this.currentLevel = LevelState.level2();
                    break;
                case 8:
                    this.currentLevel = LevelState.level3();
                    break;
                case 9:
                    this.currentLevel = LevelState.level4();
                    break;
                case 10:
                    this.currentLevel = LevelState.level5();
                    break;
                case 11:
                    this.currentLevel = LevelState.level6();
                    break;
                case 12:
                    this.currentLevel = LevelState.level7();
                    break;
                case 13:
                    this.currentLevel = LevelState.level8();
                    break;
                case 14:
                    this.currentLevel = LevelState.level9();
                    break;
                case 15:
                    this.currentLevel = LevelState.level10();
                    break;
                case 16:
                    this.currentLevel = LevelState.level11();
                    break;
                case 17:
                    this.currentLevel = LevelState.level12();
                    break;
                case 18:
                    this.currentLevel = LevelState.level13();
                    break;
            }
        }
        this.updateLevelState(inputsArr,soundToggle);
    }

    drawSat(ctx, pos, angle, size) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        ctx.fillStyle = rgbToHex(80, 80, 80);
        ctx.beginPath();
        drawRectCenter(ctx, 0, 0, size * 0.5, size * 2.5);
        ctx.fill();

        ctx.fillStyle = rgbToHex(150, 150, 150);
        ctx.strokeStyle = rgbToHex(20, 20, 20);
        ctx.beginPath();
        drawRectCenter(ctx, 0, 0, size, size);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = rgbToHex(80, 80, 200);
        ctx.beginPath();
        drawRectCenter(ctx, 0, size * 2.5, size * 1.5, size * 2.5);
        ctx.fill();
        ctx.beginPath();
        drawRectCenter(ctx, 0, -size * 2.5, size * 1.5, size * 2.5);
        ctx.fill();

        ctx.restore();
    }

    drawFuel(ctx, max, current, minimum) {
        var g = 1;
        var r = 0;
        if (current == 0 || current < minimum) {
            g = 0;
            r = 1;
        }
        ctx.strokeStyle = rgbToHex(255 * r, 255 * g, 0);
        const x = canvasWidth * 0.9;
        const y = canvasHeight * 0.05;
        const width = canvasWidth * 0.05;
        const height = canvasHeight * 0.2;

        const percentLeft = current / max;

        ctx.textAlign = "center";
        ctx.font = "13px Courier New";
        ctx.fillStyle = rgbToHex(255 * r, 255 * g, 0);
        ctx.fillText("Fuel", x + width / 2, y - 10);

        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = rgbToHex(100 * r, 100 * g, 0);
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = rgbToHex(255 * r, 255 * g, 0);
        ctx.fillRect(x, y + (height * (1 - percentLeft)), width, height * percentLeft);

        if (minimum != 0) {
            const minimumPercent = minimum / max;
            ctx.fillStyle = rgbToHexAlpha(0, 0, 0, 120);
            ctx.fillRect(x, y + (height * (1 - minimumPercent)), width, 5);
        }
    }

    drawTimedTarget(ctx,target){
        for (var i = 0; i < target.pointTargets.length; i++) {
            var p = target.pointTargets[i];
            if (i == 0 && p.completed == true) {
                ctx.fillStyle = rgbToHexAlpha(255, 0, 0, 150);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = rgbToHexAlpha(0, 255, 0, 255);
                ctx.beginPath();
                var r = (1 - ((Date.now() - target.startTime) / target.time)) * p.r;
                ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                if (p.completed) {
                    ctx.fillStyle = rgbToHexAlpha(0, 255, 0, 150);
                } else {
                    ctx.fillStyle = rgbToHexAlpha(255, 0, 0, 150);
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.textAlign = "center";
            ctx.font = "15px Courier New";
            ctx.fillStyle = rgbToHex(0, 0, 0);
            ctx.fillText(i + 1, p.x, p.y + 5);
        }
    }

    draw(ctx) {

        ctx.drawImage(this.background, 0, 0);

        var points = 100;
        var ra = calcRadiAngleForTrajectory(this.currentLevel.playerPosition, this.currentLevel.playerVelocity, this.currentLevel.playerMass, this.currentLevel.bodyOfInfluencePosition, this.currentLevel.bodyOfInfluenceMass,this.currentLevel.attractors,points);
        for (var i = 1; i < points; i++) {
            var pos = angleMagVector(ra[i].a + Math.PI, ra[i].r);
            pos = addVector(pos, this.currentLevel.bodyOfInfluencePosition);

            var g = 1;
            var r = 0;
            if (this.currentLevel.id == 1 || this.currentLevel.id == 2) {
                const angle = calcAngle(pos, this.currentLevel.bodyOfInfluencePosition);
                if (angle < -0.8 && angle > -Math.PI + 0.8) {
                    g = 0;
                    r = 1;
                }
            }
            if (this.currentLevel.id == 3) {
                const angle = calcAngle(pos, this.currentLevel.bodyOfInfluencePosition) + 2;
                if (angle > 4.5 && angle < Math.PI * 2) {
                    g = 0;
                    r = 1;
                }
                if (angle > -2 && angle < -0.5) {
                    g = 0;
                    r = 1;
                }
            }
            if (this.currentLevel.id == 7) {
                if (this.currentLevel.targets.length == 3) {
                    const angle = calcAngle(pos, this.currentLevel.bodyOfInfluencePosition);
                    if (angle < -0.8 && angle > -Math.PI + 0.8) {
                        g = 0;
                        r = 1;
                    }
                }
                if (this.currentLevel.targets.length == 2) {
                    const angle = calcAngle(pos, this.currentLevel.bodyOfInfluencePosition);
                    if (angle > 0.8 && angle < 0.3) {
                        g = 0;
                        r = 1;
                    }
                }
            }

            ctx.fillStyle = rgbToHex(255 * r, 255 * g, 0);
            var size = 5 * (1 - (i / points));
            ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
        }
        this.currentLevel.attractors.forEach(a => {
            ctx.fillStyle = rgbToHex(100, 100, 100);
            ctx.strokeStyle = rgbToHex(50, 50, 50);
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        this.currentLevel.rocks.forEach(s => {
            const angle = calcAngle({ x: s.x, y: s.y }, this.currentLevel.bodyOfInfluencePosition);
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(angle);
            ctx.drawImage(s.g, -s.r / 2, -s.r / 2);
            ctx.restore();
        });

        this.currentLevel.particles.forEach(p => {
            ctx.fillStyle = rgbToHexAlpha(255, 255, 255, p.life);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5 * (p.life / 255), 0, Math.PI * 2);
            ctx.fill();
        });

        this.drawSat(ctx, this.currentLevel.playerPosition, this.currentLevel.playerAngle, this.currentLevel.playerRadius);

        if (this.currentLevel.id == -2) {
            ctx.textAlign = "center";
            this.currentLevel.targets.filter(t => t.type == "MENU").forEach(t => {
                ctx.fillStyle = rgbToHex(t.completed ? 0 : 220, t.completed ? 220 : 0, 0);
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.r, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = rgbToHex(0, 0, 0);
                ctx.font = Math.trunc(t.r*0.8).toString() +  "px Courier New";
                ctx.fillText(t.label, t.x, t.y + 6);
            });
        }

        if (this.currentLevel.targets[0].type == "POINT") {
            ctx.fillStyle = rgbToHexAlpha(0, 255, 0, 150);
            ctx.beginPath();
            ctx.arc(this.currentLevel.targets[0].x, this.currentLevel.targets[0].y, this.currentLevel.targets[0].r, 0, 2 * Math.PI);
            ctx.fill();
        } else if (this.currentLevel.targets[0].type == "TIMED") {
            this.drawTimedTarget(ctx,this.currentLevel.targets[0]);
        } else if (this.currentLevel.targets[0].type == "SAT") {
            var t = this.currentLevel.targets[0];
            const angle = calcAngle({ x: t.p.x, y: t.p.y }, this.currentLevel.bodyOfInfluencePosition);
            this.drawSat(ctx, { x: t.p.x, y: t.p.y }, angle, t.r);
            ctx.fillStyle = rgbToHexAlpha(255, 0, 0, 150);
            ctx.beginPath();
            ctx.arc(t.p.x, t.p.y, t.p.r, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = rgbToHexAlpha(0, 255, 0, 150);
            ctx.beginPath();
            ctx.arc(t.p.x, t.p.y, t.p.r * (t.fuel / t.maxFuel), 0, 2 * Math.PI);
            ctx.fill();
        }


        ctx.translate(this.currentLevel.bodyOfInfluencePosition.x, this.currentLevel.bodyOfInfluencePosition.y);
        ctx.rotate(this.currentLevel.planetRotation);
        ctx.drawImage(this.currentLevel.planetGraphics, -this.currentLevel.bodyOfInfluenceRadius, -this.currentLevel.bodyOfInfluenceRadius);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.textAlign = "center";
        ctx.font = "19px Courier New";
        switch (this.currentLevel.id) {
            case 0:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                ctx.fillText("Move to each green target to advance.", canvasWidth * 0.5, canvasHeight * 0.8);
                ctx.fillText("Press R to restart if you run out of fuel.", canvasWidth * 0.5, canvasHeight * 0.84);
                break;
            case 1:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                ctx.fillText("Moving right in the red area will increase your height.", canvasWidth * 0.5, canvasHeight * 0.8);
                ctx.fillText("Keep moving until the green arrow ends up inside the target.", canvasWidth * 0.5, canvasHeight * 0.84);
                break;
            case 2:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                ctx.fillText("It may take more than one orbit to reach the desired height.", canvasWidth * 0.5, canvasHeight * 0.8);
                break;
            case 3:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                if (this.currentLevel.targets.length == 3) {
                    ctx.fillText("Move in the same direction you're traveling to increase height.", canvasWidth * 0.5, canvasHeight * 0.8);
                } else if (this.currentLevel.targets.length == 2) {
                    ctx.fillText("Move in the opposite direction to decrease height.", canvasWidth * 0.5, canvasHeight * 0.8);
                }
                break;
            case 4:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                ctx.fillText("Make sure not to hit the asteroid!.", canvasWidth * 0.5, canvasHeight * 0.8);
                break;
            case 6:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                ctx.fillText("Timed targets require you reach each target before the timer runs out.", canvasWidth * 0.5, canvasHeight * 0.8);
                ctx.fillText("By moving down at target 1 you can nudge your trajectory to cover all targets.", canvasWidth * 0.5, canvasHeight * 0.84);
                break;
            case 10:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                ctx.fillText("Perform a fuel transfer by matching the orbit of the highlighted satellite.", canvasWidth * 0.5, canvasHeight * 0.8);
                ctx.fillText("To catch up to the satellite, aim your trajectory slightly lower than it.", canvasWidth * 0.5, canvasHeight * 0.84);
                ctx.fillText("The dark bar on the fuel gauge show the minimum fuel needed for every satellite.", canvasWidth * 0.5, canvasHeight * 0.88);
                break;
            case 11:
                drawTextOvergray(ctx);
                ctx.fillStyle = rgbToHex(0, 255, 0);
                if (this.currentLevel.targets.length == 3) {
                    ctx.fillText("Orbits closer to the planet are quicker.", canvasWidth * 0.5, canvasHeight * 0.8);
                } else if (this.currentLevel.targets.length == 2) {
                    ctx.fillText("Orbits further away are slower.", canvasWidth * 0.5, canvasHeight * 0.8);
                }
                break;
            case 12:
                if (this.currentLevel.targets.length == 3) {
                    drawTextOvergray(ctx);
                    ctx.fillStyle = rgbToHex(0, 255, 0);
                    ctx.fillText("Reverse your orbit by moving up and right at target 4.", canvasWidth * 0.5, canvasHeight * 0.8);
                }
                break;
        }

        if (this.currentLevel.crashed || this.currentLevel.escaped || this.currentLevel.completed) {
            ctx.fillStyle = rgbToHexAlpha(0, 0, 0, 100);
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        if (this.currentLevel.id >= 0) {
            var minFuel = 0;
            this.currentLevel.targets.filter(t => t.type == "SAT" && !t.completed).forEach(t => minFuel = minFuel + (t.maxFuel - t.fuel));
            this.drawFuel(ctx, this.currentLevel.maxPlayerFuel, this.currentLevel.playerFuel, minFuel);

            ctx.font = "20px Courier New";
            ctx.textAlign = "left";
            ctx.fillStyle = rgbToHex(0, 220, 0);
            ctx.fillText("Level: " + this.currentLevel.id, 20, 40);

            if (this.currentLevel.endTime == null) {
                ctx.fillText(makeTimeString(Date.now() - this.currentLevel.startTime), 20, 70);
                ctx.fillText("Targets: " + Math.abs(this.currentLevel.targets.length - 1 - this.currentLevel.maxTarget) + "/" + this.currentLevel.maxTarget, 20, 100);
            } else {
                ctx.font = "25px Courier New";
                ctx.textAlign = "center";
                ctx.fillText(makeTimeString(this.currentLevel.endTime - this.currentLevel.startTime), canvasWidth * 0.5, canvasHeight * 0.4);
            }
        } else if (this.currentLevel.id == -2) {
            if (!this.currentLevel.completed) {
                ctx.textAlign = "center";
                ctx.fillStyle = rgbToHex(0, 220, 0);
                ctx.font = "80px Courier New";
                ctx.save();
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowColor = rgbToHex(0, 50, 0);
                ctx.fillText("GravAssist", canvasWidth / 2, canvasHeight * 0.2);
                ctx.restore();
                ctx.font = "20px Courier New";
                ctx.save();
                ctx.translate(this.currentLevel.playerPosition.x, this.currentLevel.playerPosition.y);
                ctx.fillText("D", 40, 0);
                ctx.fillText("W", 0, -40);
                ctx.fillText("A", -40, 0);
                ctx.fillText("S", 0, +40);
                ctx.restore();
                ctx.fillText("Level:" + this.levels[0].id, canvasWidth / 2, canvasHeight * 0.32);
                ctx.fillText("Press escape to reset/return to the menu.", canvasWidth / 2, canvasHeight * 0.9);
            }
        } else if (this.currentLevel.id == -1) {
            ctx.textAlign = "center";
            ctx.font = "50px Courier New";
            ctx.fillStyle = rgbToHex(0, 220, 0);
            ctx.fillText("Thanks for playing!", canvasWidth / 2, canvasHeight * 0.2);
        }




        if (this.currentLevel.crashed) {
            ctx.textAlign = "center";
            ctx.font = "50px Courier New";
            ctx.fillStyle = rgbToHex(0, 220, 0);
            ctx.fillText("Payload Destroyed", canvasWidth / 2, canvasHeight * 0.2);
            ctx.font = "30px Courier New";
            ctx.fillText("Press R to restart.", canvasWidth / 2, canvasHeight * 0.3);
        }
        if (this.currentLevel.escaped) {
            if(this.currentLevel.id == -2){
                this.levels = makePlaylist();
                this.shiftedLevels = [];
                this.currentLevel = this.levels.shift();
            } else {
                ctx.textAlign = "center";
                ctx.font = "50px Courier New";
                ctx.fillStyle = rgbToHex(0, 220, 0);
                ctx.fillText("Payload Lost", canvasWidth / 2, canvasHeight * 0.2);
                ctx.font = "30px Courier New";
                ctx.fillText("Press R to restart.", canvasWidth / 2, canvasHeight * 0.3);
            }
        }
        if (this.currentLevel.completed) {
            ctx.textAlign = "center";
            ctx.font = "50px Courier New";
            ctx.fillStyle = rgbToHex(0, 220, 0);
            ctx.fillText("All targets completed!", canvasWidth / 2, canvasHeight * 0.2);
            ctx.font = "30px Courier New";
            ctx.fillText("Press space to continue.", canvasWidth / 2, canvasHeight * 0.3);
        }
    }
}class Inputs{
    constructor(currentStates,namesKeycode){
        this.currentStates = currentStates;
        this.prevStates = [];
        this.namesKeycode = namesKeycode;
    }
    static empty(){
        return new Inputs(new Map(), new Map());
    }
    attachInput(name,keyCode){
        this.namesKeycode.set(name,keyCode);
        this.currentStates.set(keyCode,false);
    }
    update(keyCode,value){
        this.currentStates.set(keyCode,value);
    }
    attachInputs(){
        this.attachInput("UP",'w');
        this.attachInput("DOWN",'s');
        this.attachInput("LEFT",'a');
        this.attachInput("RIGHT",'d');
        this.attachInput("SPACE",' ');
        this.attachInput("RESTART",'r');
        this.attachInput("ESC",'Escape');
        this.attachInput("MUTE",'m');
    }
    getInputs(){
        const nameKeys = Array.from(this.namesKeycode.keys());
        const namesValue = nameKeys.map(n => {return {name:n,value:this.currentStates.get(this.namesKeycode.get(n))}});
        return namesValue.filter(nv => {return nv.value}).map(nv => {return nv.name});
    }
}
//zzfx
zzfx=(...t)=>zzfxP(zzfxG(...t))
zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination);return e}
zzfxG=(a=1,t=.05,h=220,M=0,n=0,s=.1,i=0,r=1,o=0,z=0,e=0,f=0,m=0,x=0,b=0,d=0,u=0,c=1,G=0,I=zzfxR,P=99+M*I,V=n*I,g=s*I,j=G*I,k=u*I,l=2*Math.PI,p=(a=>0<a?1:-1),q=P+j+V+g+k,v=(o*=500*l/I**2),w=(h*=(1+2*t*Math.random()-t)*l/I),y=p(b)*l/4,A=0,B=0,C=0,D=0,E=0,F=0,H=1,J=[])=>{for(;C<q;J[C++]=F)++E>100*d&&(E=0,F=A*h*Math.sin(B*b*l/I-y),F=p(F=i?1<i?2<i?3<i?Math.sin((F%l)**3):Math.max(Math.min(Math.tan(F),1),-1):1-(2*F/l%2+2)%2:1-4*Math.abs(Math.round(F/l)-F/l):Math.sin(F))*Math.abs(F)**r*a*zzfxV*(C<P?C/P:C<P+j?1-(C-P)/j*(1-c):C<P+j+V?c:C<q-k?(q-C-k)/g*c:0),F=k?F/2+(k>C?0:(C<q-k?1:(C-q)/k)*J[C-k|0]/2):F),A+=1-x+1e9*(Math.sin(C)+1)%2*x,B+=1-x+1e9*(Math.sin(C)**2+1)%2*x,h+=o+=500*z*l/I**3,H&&++H>f*I&&(h+=e*l/I,w+=e*l/I,H=0),m&&++D>m*I&&(h=w,o=v,D=1,H=H||1);return J};
zzfxV=0.5
zzfxR=44100
zzfxX=new(top.AudioContext||webkitAudioContext);
//zzfxM
zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}

let s = (snd) => zzfx(...snd).start();
var gArr = (n) => Array.from(new Array(n).keys());
//Music
//Generate drum patterns
var drm = [gArr(18).map(i => i == 2 ? 15 : 0),gArr(18).map(i => i == 2 ? 15 : 0),gArr(18).map(i => i == 10 ? 15 : i == 0 ? 1 : 0),gArr(18).map(i => i == 0 ? 2 : (i % 4 == 0 && i != 12) ? 15 : 0)];
drm[1][14] = 15;
//Generate note patterns
var mkEch = (n) => gArr(18).map(i => i == 0 ? 3 : [2,6,10,14].includes(i) ? n + [0,0.1,0.5,0.7][[2,6,10,14].indexOf(i)] : i == 1 ? -0.1 : 0);
var Ech = [mkEch(18),mkEch(22),mkEch(24),mkEch(30)];
//Generate song pattern
var wrp = (n) => n - (Math.trunc(n/4)*4);
var ptrn = gArr(4).map(i => i < 8 ? wrp(i) : i < 16 ? 4 + wrp(i) : 8 + wrp(i));
var song = [
[
[,0,86,,,,,.7,,,,.5,,6.7,1,.05],             //Kick
[.7,0,270,,,.12,3,1.65,-2,,,,,4.5,,.02],    //Snare
[.4,0,2200,,,.04,3,2,,,800,.02,,4.8,,.01,.1],  //Hi-hat
[,0,130.81 ,,,1] //Echo Synth
],
[[Ech[0]],[Ech[1]],[Ech[2]],[Ech[3]]],
ptrn,100];var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var canvasWidth = c.width;
var canvasHeight = c.height;
var gameState = GameState.initial();
var inputs = Inputs.empty();
inputs.attachInputs();

document.addEventListener('keydown', (e) => {
    inputs.update(e.key,true);
});
document.addEventListener('keyup', (e) => {
    inputs.update(e.key,false);
});

let mySongData = zzfxM(...song);
let myAudioNode = zzfxP(...mySongData);
myAudioNode.loop = true;
myAudioNode.start();
var musicToggle = true;
var soundToggle = true;


function draw(ctx){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    gameState.update(inputs.getInputs(),soundToggle);
    ctx.save();
    gameState.draw(ctx);
    ctx.restore();
    ctx.font = "15px Courier New";
    ctx.fillStyle = rgbToHex(0,220,0);
    ctx.fillText("Toggle M",canvasWidth*0.01,canvasHeight*0.92);
    if(soundToggle){
        ctx.font = "23px Courier New";
        ctx.fillText("🔊",canvasWidth*0.01,canvasHeight*0.98);
    }
    if(musicToggle){
        ctx.font = "40px Courier New";
        ctx.fillText("♬",canvasWidth*0.05,canvasHeight*0.98);
    }
    
    
    

    if(!inputs.prevStates.includes("MUTE") && inputs.getInputs().includes("MUTE")){
        if(musicToggle && soundToggle){
            soundToggle = !soundToggle;
        } else if(musicToggle && !soundToggle){
            musicToggle = !musicToggle;
        } else if(!musicToggle && !soundToggle){
            soundToggle = !soundToggle;
        } else if(!musicToggle && soundToggle){
            musicToggle = !musicToggle;
        }

        if(!musicToggle){
            myAudioNode.disconnect();
        } else {
            myAudioNode.connect(zzfxX.destination);
        }
    }
    inputs.prevStates = inputs.getInputs();
}


setInterval(() => draw(ctx),50);
