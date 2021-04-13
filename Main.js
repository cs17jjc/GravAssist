var c = document.getElementById("canvas");
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



function draw(ctx){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    gameState.update(inputs.getInputs());
    ctx.save();
    gameState.draw(ctx);
    ctx.restore();
}


setInterval(() => draw(ctx),50);
