import Character from "./character";

class Scout extends Character {
  constructor(spriteName, moveDuration, scene, startPos, characterManager) {
  super(spriteName, moveDuration, scene, startPos, characterManager);
  scene.anims.create({
    key: "scoutLeft",
    frames: scene.anims.generateFrameNumbers(spriteName, {
      start: 4,
      end: 7
    }),
    frameRate: 4000 / moveDuration
  });
  scene.anims.create({
    key: "scoutRight",
    frames: scene.anims.generateFrameNumbers(spriteName, {
      start: 8,
      end: 11
    }),
    frameRate: 4000 / moveDuration
  });
  scene.anims.create({
    key: "scoutUp",
    frames: scene.anims.generateFrameNumbers(spriteName, {
      start: 12,
      end: 15
    }),
    frameRate: 4000 / moveDuration
  });
  scene.anims.create({
    key: "scoutDown",
    frames: scene.anims.generateFrameNumbers(spriteName, {
      start: 0,
      end: 3
    }),
    frameRate: 4000 / moveDuration
  });
  scene.anims.create({
    key: "scoutIdle",
    frames: [{ key: "man", frame: 0 }],
    frameRate: 4000,
    repeat: -1
  });
  this.body.anims.play("scoutIdle", true);
  this.body.on(
    "animationcomplete",
    (animation, frame) => {
      if (animation.key === "scoutIdle") {
        return;
      }
      this.body.anims.play("scoutIdle", true);
    },
    scene
  );
  }

  // Abstract virtual functions for moving up, down, left, right
  async moveUp(map) {
      let targetPos = { x: this.body.x, y: this.body.y - 64 };
      let firstPos = { x: this.body.x, y: this.body.y - 32 };

  // if it cannot move one space then it just returns
      if(!this.canPlayTween || !this.canMove(map, firstPos)){
        return
      }
  // if it can move 2 spaces then it'll move just one space
      else if (!this.canPlayTween || !this.canMove(map, targetPos)) {
        targetPos = firstPos
      }

      this.canPlayTween = false;
      this.currentTween = this.scene.tweens.add({
        targets: this.body,
        duration: this.moveDuration,
        y: targetPos.y,
        onComplete: () => {
          this.canPlayTween = true;
        }
      });
      this.body.anims.play("scoutUp", true);
    }


  async moveDown(map) {
      let targetPos = { x: this.body.x, y: this.body.y + 64 };
      let firstPos = { x: this.body.x, y: this.body.y + 32 };

      // if it can't move one spaces then it'll just return
      if(!this.canPlayTween || !this.canMove(map, firstPos)){
        return
      }
      // if it can't move two spaces then it'll just move one space
      else if (!this.canPlayTween || !this.canMove(map, targetPos)) {
        targetPos = firstPos
      }

      this.canPlayTween = false;
      this.currentTween = this.scene.tweens.add({
        targets: this.body,
        duration: this.moveDuration,
        y: targetPos.y,
        onComplete: () => {
          this.canPlayTween = true;
        }
      });
      this.body.anims.play("scoutDown", true);
  }

  async moveLeft(map) {
      let targetPos = { x: this.body.x - 64, y: this.body.y};
      let firstPos = {x: this.body.x - 32, y: this.body.y};


      if(!this.canPlayTween || !this.canMove(map, firstPos)){
        return
      }

      else if (!this.canPlayTween || !this.canMove(map, targetPos)) {
        targetPos = firstPos
      }

      this.canPlayTween = false;
      this.currentTween = this.scene.tweens.add({
        targets: this.body,
        duration: this.moveDuration,
        x: targetPos.x,
        onComplete: () => {
          this.canPlayTween = true;
        }
      });
      this.body.anims.play("scoutLeft", true);

    }

  async moveRight(map) {
    let targetPos = { x: this.body.x + 64, y: this.body.y};
    let firstPos = { x: this.body.x + 32, y: this.body.y};
    console.log(targetPos);
    console.log(firstPos);
    //it is pulling the title info of the skipped tile between char and targetPos
    if(!this.canPlayTween || !this.canMove(map, firstPos)){
      return
    }

    else if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      targetPos = firstPos
    }

  this.canPlayTween = false;
    this.currentTween = this.scene.tweens.add({
      targets: this.body,
      duration: this.moveDuration,
      x: targetPos.x,
      onComplete: () => {
        this.canPlayTween = true;
      }
    });
    this.body.anims.play("scoutRight", true);
  }
}

export default Scout;
