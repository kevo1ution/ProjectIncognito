class Character {
  constructor(plrBody, moveDuration, scene) {
    this.body = plrBody;
    this.moveDuration = moveDuration;
    this.scene = scene
  }

  // Abstract virtual functions for moving up, down, left, right
  async moveUp(map) {
    const targetPos = {x: this.body.x, y: this.body.y - 32};

    if(map.hasObstacle(targetPos)){
      
    }
  }
  async moveDown(map) {}
  async moveLeft(map) {}
  async moveRight(map) {}
}

export default Character;
