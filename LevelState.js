class LevelState{
    constructor(id,playerPos,playerVel,playerMass,playerRadius,playerFuel,boiPos,boiMass,boiRadius,targets,otherSats){
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
        
        this.otherSatalites = otherSats;
    }

    static tutorial1(){

        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 10};
        var playerVelocity = {x:0,y:0};
        var playerMass = 0.1;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:-10,y:-10};
        var bodyOfInfluenceMass = 0;
        var bodyOfInfluenceRadius = 1;

        var targets = [
            createTarget(canvasWidth*0.5-60,canvasHeight*0.5,10,"POINT",false),
            createTarget(canvasWidth*0.5+60,canvasHeight*0.5,10,"POINT",false),
            createTarget(canvasWidth*0.5,canvasHeight*0.5-60,10,"POINT",false),
            createTarget(canvasWidth*0.5,canvasHeight*0.5+60,10,"POINT",false),
            createTarget(0,0,0,"END")];

        return new LevelState(0,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[]);
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

        return new LevelState(1,playerPosition,playerVelocity,playerMass,playerRadius,50,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[]);
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

        return new LevelState(2,playerPosition,playerVelocity,playerMass,playerRadius,100,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[]);
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

        return new LevelState(3,playerPosition,playerVelocity,playerMass,playerRadius,50,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[]);
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

        var sats = [createSat(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) - 70,3,0,5,0.2)];
        return new LevelState(4,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,sats);
    }
    static tutorial6(){

        var playerPosition = {x:Math.trunc(canvasWidth/2)+65,y:Math.trunc(canvasHeight/2)};
        var playerVelocity = {x:0,y:-3.2};
        var playerMass = 0.2;
        var playerRadius = 8;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1100;
        var bodyOfInfluenceRadius = 20;

        var timedTarget = createTimeTarget(12_000,[
            createTarget(canvasWidth*0.4,canvasHeight/2,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight*0.67,15,"POINT",false),
            createTarget(canvasWidth*0.6,canvasHeight/2,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight*0.32,15,"POINT",false)
        ]);

        var targets = [
            timedTarget,
            createTarget(0,0,0,"END")];

        return new LevelState(5,playerPosition,playerVelocity,playerMass,playerRadius,10,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,[]);
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
        
        var sats = [createSat(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) - 90,2,0,5,0.2)];
        return new LevelState(6,playerPosition,playerVelocity,playerMass,playerRadius,200,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,sats);
    }
    static level2(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:4,y:0};
        var playerMass = 0.4;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 2000;
        var bodyOfInfluenceRadius = 12;

        var timedTarget1 = createTimeTarget(8_000,[
            createTarget(canvasWidth/2,canvasHeight/2 - 150,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2 + 50,15,"POINT",false),
        ]);
        var timedTarget2 = createTimeTarget(16_000,[
            createTarget(canvasWidth/2,canvasHeight/2 - 150,15,"POINT",false),
            createTarget(canvasWidth/2 - 150,canvasHeight/2,15,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2 + 150,15,"POINT",false),
            createTarget(canvasWidth/2 + 150,canvasHeight/2,15,"POINT",false)
        ]);

        var targets = [
            timedTarget1,
            timedTarget2,
            createTarget(0,0,0,"END")];
        
        var sats = [createSat(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) + 180,-1,0,5,1)];
        return new LevelState(7,playerPosition,playerVelocity,playerMass,playerRadius,100,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,sats);
    }
    static level3(){
        var playerPosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2) + 50};
        var playerVelocity = {x:2.8,y:0};
        var playerMass = 0.2;
        var playerRadius = 5;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2),y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 800;
        var bodyOfInfluenceRadius = 20;

        var timedTarget = createTimeTarget(18_000,[
            createTarget(canvasWidth/2,canvasHeight/2 + 100,10,"POINT",false),
            createTarget(canvasWidth/2 + 100,canvasHeight/2,10,"POINT",false),
            createTarget(canvasWidth/2,canvasHeight/2 - 100,10,"POINT",false),
            createTarget(canvasWidth/2 - 100,canvasHeight/2,10,"POINT",false),
        ]);

        var targets = [
            createTarget(canvasWidth/2 - 100,canvasHeight/2,10,"POINT",false),
            timedTarget,
            createTarget(0,0,0,"END")];
        
        var sats = [createSat(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) - 150,1,0,5,0.5)];
        return new LevelState(8,playerPosition,playerVelocity,playerMass,playerRadius,30,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,sats);
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
        
        //var sats = [createSat(Math.trunc(canvasWidth/2),Math.trunc(canvasHeight/2) - 150,1.2,0,5,0.5)];
        var sats = [];
        return new LevelState(-1,playerPosition,playerVelocity,playerMass,playerRadius,30,bodyOfInfluencePosition,bodyOfInfluenceMass,bodyOfInfluenceRadius,targets,sats);
    }

    update(inputs){
        if(this.startTime == null){
            this.startTime = Date.now();
        }
        if(!this.crashed && !this.escaped && !this.completed){

            this.updatePlayerMovement(inputs);
            

            this.particles.forEach(p => {
                p.life -= p.lifeDec;
            });
            this.particles = this.particles.filter(p => p.life > 0);
            this.particles.forEach(p => {
                p.x += p.xvel;
                p.y += p.yvel;
            });
            this.otherSatalites.forEach(s => {
                
                const distance = calcDistance({x:s.x,y:s.y},this.bodyOfInfluencePosition);
                const gForceMagnitute = calcForce(distance,s.m,this.bodyOfInfluenceMass);
                const angle = calcAngle({x:s.x,y:s.y},this.bodyOfInfluencePosition);
                const force = calcComponents(gForceMagnitute,angle);
                const accel = {x:force.x/s.m,y:force.y/s.m};

                s.xvel += accel.x;
                s.yvel += accel.y;

                s.x += s.xvel;
                s.y += s.yvel;
            });

            if(this.targets[0].type == "TIMED" && this.targets[0].startTime != null){
                if(this.targets[0].startTime + this.targets[0].time < Date.now()){
                    this.targets[0].startTime = null;
                    this.targets[0].pointTargets.forEach(p => {p.completed = false});
                }
                if(this.targets[0].pointTargets.filter(p => !p.completed).length == 0){
                    this.targets[0].completed = true;
                }
            }
            if(this.targets[0].completed == true){
                this.targets.shift();
            }
            if(this.targets.length == 1){
                this.completed = true;
                this.endTime = Date.now();
            }
            this.planetRotation += this.planetRotationSpeed;
        }
    }

    updatePlayerMovement(inputs){
        var force = {x:0,y:0};

        const distance = calcDistance(this.playerPosition,this.bodyOfInfluencePosition);
        const gForceMagnitute = calcForce(distance,this.playerMass,this.bodyOfInfluenceMass);
        this.playerAngle = calcAngle(this.playerPosition,this.bodyOfInfluencePosition);

        force = addVector(force,calcComponents(gForceMagnitute,this.playerAngle));
        
        if(inputs.includes("UP") && this.playerFuel > 0 && this.id != -1){
            force.y -= 0.01;
            this.particles.push(createParticle(this.playerPosition,0,1));
            this.playerFuel = Math.max(0,this.playerFuel-this.fuelConsumption);
        }
        if(inputs.includes("DOWN") && this.playerFuel > 0 && this.id != -1){
            force.y += 0.01;
            this.particles.push(createParticle(this.playerPosition,0,-1));
            this.playerFuel = Math.max(0,this.playerFuel-this.fuelConsumption);
        }
        if(inputs.includes("LEFT") && this.playerFuel > 0 && this.id != -1){
            force.x -= 0.01;
            this.particles.push(createParticle(this.playerPosition,1,0));
            this.playerFuel = Math.max(0,this.playerFuel-this.fuelConsumption);
        }
        if(inputs.includes("RIGHT") && this.playerFuel > 0 && this.id != -1){
            force.x += 0.01;
            this.particles.push(createParticle(this.playerPosition,-1,0));
            this.playerFuel = Math.max(0,this.playerFuel-this.fuelConsumption);
        }

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
        }
        this.otherSatalites.forEach(s => {
            if(calcDistance({x:s.x,y:s.y},this.playerPosition) <= s.r + this.playerRadius){
                this.crashed = true;
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
            }
        }
        if(this.targets[0].type == "TIMED"){
            var nextTarget = this.targets[0].pointTargets.filter(p => !p.completed)[0];
            if(nextTarget != null){
                if(calcDistance(this.playerPosition,{x:nextTarget.x,y:nextTarget.y}) <= this.playerRadius + nextTarget.r){
                    nextTarget.completed = true;
                    if(nextTarget == this.targets[0].pointTargets[0]){
                        this.targets[0].startTime = Date.now();
                    }
                }
            }
        }

        this.playerPosition.x += this.playerVelocity.x;
        this.playerPosition.y += this.playerVelocity.y;
    }
}