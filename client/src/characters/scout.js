import Character from "./character";
import config from "../config/config";

class Scout extends Character {
  ability() {
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
      this.scene.map.rotateGuardOrTower(pos);
    });
  }

  async move(dir) {
    if (this.moving) {
      return;
    }
    this.moving = true;

    const moved = await this.moveOnce(dir);
    await this.moveOnce(dir);
    if (moved) {
      this.body.anims.play("idle", true);
    }
    this.moving = false;
  }
}

export default Scout;
