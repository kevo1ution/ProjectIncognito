class Character {
  constructor(plrBody, moveDuration, scene) {
    this.body = plrBody;
    this.moveDuration = moveDuration;
    this.scene = scene
  }

  // Abstract virtual functions for moving up, down, left, right
  async moveUp(map) {
    const targetPos = {x: this.body.x, y: this.body.y - 32};

    //if(map.hasObstacle(targetPos)){
      this.body.x=targetPos.x
      this.body.y=targetPos.y
  //  }
  }
  async moveDown(map) {
    const targetPos = {x: this.body.x, y: this.body.y + 32};

  //  if(map.hasObstacle(targetPos)){
      this.body.x=targetPos.x
      this.body.y=targetPos.y
    //}
  }
  async moveLeft(map) {
    const targetPos = {x: this.body.x - 32, y: this.body.y};

    //if(map.hasObstacle(targetPos)){
      this.body.x=targetPos.x
      this.body.y=targetPos.y
  //  }
  }
  async moveRight(map) {
    const targetPos = {x: this.body.x + 32, y: this.body.y};

      // if(map.hasObstacle(targetPos)){
           this.body.x=targetPos.x
           this.body.y=targetPos.y
      // }}
    }
}

export default Character;
