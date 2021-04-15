class LevelState{
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
    static temp(){
        var playerPosition = {x:Math.trunc(canvasWidth/2)-230,y:Math.trunc(canvasHeight/2)};
        var playerVelocity = {x:0,y:-3.8};
        var playerMass = 0.2;
        var playerRadius = 4;

        var bodyOfInfluencePosition = {x:Math.trunc(canvasWidth/2)-180,y:Math.trunc(canvasHeight/2)};
        var bodyOfInfluenceMass = 1200;
        var bodyOfInfluenceRadius = 12;

        var targets = [
            createSatTarget(0,-4.8,5,0.01,25,createTarget(canvasWidth/2+220,canvasHeight/2,0,"POINT")),
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
}