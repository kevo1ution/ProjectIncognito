import Character from "./character";
import config from "../config/config";
class Demolisher extends Character {
  deadlyMove(targetPos) {
    if (
      this.scene.map.isHole(targetPos) ||
      this.scene.map.isCracked(targetPos)
    ) {
      return config.GAME.characters.death.FALL;
    }

    return this.scene.map.isGuardedTile(targetPos);
  }

  canMove(targetPos, dir) {
    const map = this.scene.map;
    const tile = map.getBlockingTile(targetPos);
    const otherChar = this.characterManager.getCharacterWorldXY(targetPos);
    if (otherChar) {
      return false;
    }

    //check if obstacle, check if obstacle is moveable
    if (tile) {
      if (map.isMoveable(targetPos, dir)) {
        map.moveMoveable(targetPos, dir, this.moveDuration);
        return true;
      } else {
        return false;
      }
    }

    return true;
  }
}

export default Demolisher;
