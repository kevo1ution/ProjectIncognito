class Character {
  constructor(spriteName, moveDuration, scene, startPos) {
    this.body = scene.add.sprite(startPos.x, startPos.y, spriteName);
    this.currentTween = scene.tweens.add({ duration: 0, targets: this.body });
    this.canPlayTween = true;
    this.moveDuration = moveDuration;
    this.scene = scene;
    scene.anims.create({
      key: "left",
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start: 0,
        end: 3
      }),
      frameRate: 4000 / moveDuration
    });

    scene.anims.create({
      key: "right",
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start: 5,
        end: 8
      }),
      frameRate: 4000 / moveDuration
    });

    scene.anims.create({
      key: "up",
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start: 0,
        end: 3
      }),
      frameRate: 4000 / moveDuration
    });

    scene.anims.create({
      key: "down",
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start: 5,
        end: 8
      }),
      frameRate: 4000 / moveDuration
    });

    scene.anims.create({
      key: "idle",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 4000,
      repeat: -1
    });

    this.body.anims.play("idle", true);
    this.body.on(
      "animationcomplete",
      (animation, frame) => {
        if (animation.key === "idle") {
          return;
        }
        this.body.anims.play("idle", true);
      },
      scene
    );
  }

  // Abstract virtual functions for moving up, down, left, right
  async moveUp(map) {
    if (!this.canPlayTween) {
      return;
    }
    this.canPlayTween = false;
    const targetPos = { x: this.body.x, y: this.body.y - 32 };
    this.currentTween = this.scene.tweens.add({
      targets: this.body,
      duration: this.moveDuration,
      y: targetPos.y,
      onComplete: () => {
        this.canPlayTween = true;
      }
    });
    this.body.anims.play("up", true);
  }
  async moveDown(map) {
    if (!this.canPlayTween) {
      return;
    }
    this.canPlayTween = false;

    const targetPos = { x: this.body.x, y: this.body.y + 32 };

    this.currentTween = this.scene.tweens.add({
      targets: this.body,
      duration: this.moveDuration,
      y: targetPos.y,
      onComplete: () => {
        this.canPlayTween = true;
      }
    });
    this.body.anims.play("down", true);
  }
  async moveLeft(map) {
    if (!this.canPlayTween) {
      return;
    }
    this.canPlayTween = false;
    const targetPos = { x: this.body.x - 32, y: this.body.y };

    this.currentTween = this.scene.tweens.add({
      targets: this.body,
      duration: this.moveDuration,
      x: targetPos.x,
      onComplete: () => {
        this.canPlayTween = true;
      }
    });
    this.body.anims.play("left", true);
  }
  async moveRight(map) {
    if (!this.canPlayTween) {
      return;
    }
    this.canPlayTween = false;
    const targetPos = { x: this.body.x + 32, y: this.body.y };

    this.currentTween = this.scene.tweens.add({
      targets: this.body,
      duration: this.moveDuration,
      x: targetPos.x,
      onComplete: () => {
        this.canPlayTween = true;
      }
    });
    this.body.anims.play("right", true);
  }
}

export default Character;
