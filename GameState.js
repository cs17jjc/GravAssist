class GameState {
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
                this.currentLevel = LevelState.menu();
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
}