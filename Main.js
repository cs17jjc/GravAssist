var graphics;
var gameState;
var inputs;
function setup(){
    createCanvas(960,540);
    graphics = createGraphics(960,540);
    gameState = GameState.initial();

    inputs = Inputs.attachInputs(Inputs.empty());
    document.addEventListener('keydown', (e) => {
        inputs = Inputs.update(inputs,e.key,true);
    });
    document.addEventListener('keyup', (e) => {
        inputs = Inputs.update(inputs,e.key,false);
    });
}

function draw(){
    background(0);
    gameState = GameState.update(gameState,Inputs.getInputs(inputs));
    GameState.draw(gameState);
}