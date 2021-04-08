class LevelState{
    static tileSize = 20;
    constructor(tiles,position){
        this.tiles = tiles;
        this.width = tiles.length;
        this.height = tiles[0].length;
        this.playerPosition = position;
        this.playerVelocity = createVector(0,0,0);
        this.playerAcceleration = createVector(0,0,0);
    }

    static blank(width,height,position){
        const sideWall = R.repeat(Tile.wall(),height);
        const topWall = R.append(Tile.wall(),R.prepend(Tile.wall(),R.repeat(Tile.air(),height-2)));
        const map = R.append(sideWall,R.prepend(sideWall,R.repeat(topWall,width-2)));
        return new LevelState(map,position);
    }

    static setPlayerAcceleration(levelState, acceleration){
        var newLevelState = R.clone(levelState);
        newLevelState.playerAcceleration = acceleration;
        return newLevelState;
    }

    static updateLevelState(levelState, inputsArr){
        var newLevelState = R.clone(levelState);

        newLevelState.playerAcceleration = createVector(0,0,0);
        if(inputsArr.includes("UP")){newLevelState.playerAcceleration.add(createVector(0,-5))}
        if(inputsArr.includes("DOWN")){newLevelState.playerAcceleration.add(createVector(0,5))}
        if(inputsArr.includes("RIGHT")){newLevelState.playerAcceleration.add(createVector(5,0))}
        if(inputsArr.includes("LEFT")){newLevelState.playerAcceleration.add(createVector(-5,0))}

        newLevelState.playerVelocity.x += newLevelState.playerAcceleration.x;
        newLevelState.playerVelocity.y += newLevelState.playerAcceleration.y;

        newLevelState.playerVelocity.x *= 0.8;
        newLevelState.playerVelocity.y *= 0.8;

        const nextPosition = createVector(newLevelState.playerPosition.x + newLevelState.playerVelocity.x,
                                          newLevelState.playerPosition.y + newLevelState.playerVelocity.y);
        
        const playerTileX = Math.trunc(levelState.playerPosition.x / LevelState.tileSize);
        const playerTileY = Math.trunc(levelState.playerPosition.y / LevelState.tileSize);
        const nextPlayerTileX = Math.trunc(nextPosition.x / LevelState.tileSize);
        const nextPlayerTileY = Math.trunc(nextPosition.y / LevelState.tileSize);
    

        if(newLevelState.tiles[playerTileX][nextPlayerTileY].isWall){
            newLevelState.playerVelocity.y = 0;
        }
        if(newLevelState.tiles[nextPlayerTileX][playerTileY].isWall){
            newLevelState.playerVelocity.x = 0;
        }
        

        newLevelState.playerPosition = createVector(newLevelState.playerPosition.x + newLevelState.playerVelocity.x,
                                                    newLevelState.playerPosition.y + newLevelState.playerVelocity.y);
        
        return newLevelState;
    }
}

class Tile{
    constructor(isWall,isOpaque,waterLevel){
        this.isWall = isWall;
        this.isOpaque = isOpaque;
        this.waterLevel = waterLevel;
    }
    static wall(){
        return new Tile(true,true,0);
    }
    static window(){
        return new Tile(true,false,0);
    }
    static air(){
        return new Tile(false,false,0);
    }
}