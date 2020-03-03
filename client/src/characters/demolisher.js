import Character from "./character";

class Demolisher extends Character {
  async move(targetPos, dir, map) {
    const footsteps = this.scene.add.image(
      this.body.x,
      this.body.y,
      "footsteps"
    );
    switch (dir) {
      case "up":
        footsteps.setAngle(-90);
        break;
      case "left":
        footsteps.setAngle(-180);
        break;
      case "down":
        footsteps.setAngle(90);
        break;
    }

    footsteps.setScale(0.03, 0.03);
    footsteps.setDepth(0);
    this.scene.tweens.add({
      alpha: 0,
      targets: footsteps,
      duration: this.moveDuration * 4,
      onComplete: () => {
        footsteps.destroy();
      }
    });

    this.sounds.run.play();
    this.canPlayTween = false;
    this.currentTween = this.scene.tweens.add({
      ...targetPos,
      targets: this.body,
      duration: this.moveDuration,
      onComplete: () => {
        this.canPlayTween = true;
      }
    });
  }

  canMove(map, targetPos, dir) {
    const tile = map.getBlockingTile(targetPos);
    const otherChar = this.characterManager.getCharacterWorldXY(targetPos);
    if (otherChar) {
      return false;
    }

    //check if obstacle, check if obstacle is moveable
    if (tile) {
      if (map.isMoveable(targetPos, dir)) {
        map.moveMoveable(targetPos, dir);
        return true;
      } else {
        return false;
      }
    }

    return true;
  }
}

export default Demolisher;
