import Character from "./character";
import config from "../config/config";

class Scout extends Character {
  ability(map) {
    const guardsPositions = [
      { x: this.body.x + config.GAME.tileSize.x, y: this.body.y },
      { x: this.body.x - config.GAME.tileSize.x, y: this.body.y },
      { x: this.body.x, y: this.body.y + config.GAME.tileSize.y },
      { x: this.body.x, y: this.body.y - config.GAME.tileSize.y }
    ];

    guardsPositions.forEach(pos => {
      map.rotateGuardOrTower(pos);
    });
  }

  async move(map, dir) {
    const moved = await this.moveOnce(map, dir);
    await this.moveOnce(map, dir);
    if (moved) {
      this.body.anims.play("idle", true);
    }    
  }
}

export default Scout;
