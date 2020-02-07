class Character {
  constructor(spriteName, moveDuration, scene, startPos) {
    this.body = scene.add.sprite(startPos.x, startPos.y, spriteName);
    this.moveDuration = moveDuration;
    this.scene = scene
    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers(spriteName, {start: 0, end: 3}),
      frameRate: 4000 / moveDuration,
    })

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers(spriteName, {start: 5, end: 8}),
      frameRate: 4000 / moveDuration,
    })

    scene.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers(spriteName, {start: 0, end: 3}),
      frameRate: 4000 / moveDuration,
    })

    scene.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers(spriteName, {start: 5, end: 8}),
      frameRate: 4000 / moveDuration,
    })

    const animationTest = scene.anims.create({
      key: 'idle',
      frames: [{key: 'dude', frame: 4}],
      frameRate: 4000,
      repeat: -1,
    })

    // console.log(animationTest.onComplete(()=> console.log('testsetset')))
    this.body.anims.play('idle', true)
    this.body.on("animationcomplete", (animation, frame) => {
      if(animation.key === "idle"){
        return;
      }
      this.body.anims.play('idle', true)
    }, scene)
  }

  // Abstract virtual functions for moving up, down, left, right
  async moveUp(map) {
    this.body.anims.play('up', true)
    const targetPos = {x: this.body.x, y: this.body.y - 32};

    //if(map.hasObstacle(targetPos)){
      this.body.x=targetPos.x
      this.body.y=targetPos.y
  //  }
  }
  async moveDown(map) {
    this.body.anims.play('down', true)
    const targetPos = {x: this.body.x, y: this.body.y + 32};

  //  if(map.hasObstacle(targetPos)){
      this.body.x=targetPos.x
      this.body.y=targetPos.y
    //}
  }
  async moveLeft(map) {
    this.body.anims.play('left', true)
    const targetPos = {x: this.body.x - 32, y: this.body.y};

    //if(map.hasObstacle(targetPos)){
      this.body.x=targetPos.x
      this.body.y=targetPos.y
  //  }
  }
  async moveRight(map) {
    this.body.anims.play('right', true)
    const targetPos = {x: this.body.x + 32, y: this.body.y};

      // if(map.hasObstacle(targetPos)){
           this.body.x=targetPos.x
           this.body.y=targetPos.y
      // }}
    }
}

export default Character;
