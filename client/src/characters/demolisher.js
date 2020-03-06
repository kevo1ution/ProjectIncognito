import Character from "./character";

class Demolisher extends Character {
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
