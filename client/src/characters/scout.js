import Character from "./character";
import config from "../config/config";

class Scout extends Character {
  ability(map) {
    if (this.moving) {
      return;
    }

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
    if (this.moving) {
      return;
    }
    this.moving = true;

    const moved = await this.moveOnce(map, dir);
    await this.moveOnce(map, dir);
    if (moved) {
      this.body.anims.play("idle", true);
    }
    this.moving = false;
  }
}

export default Scout;
