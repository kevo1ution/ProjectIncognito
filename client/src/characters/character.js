class Character {
  constructor(spriteName, moveDuration, scene, startPos, characterManager) {
    this.characterManager = characterManager;
    this.body = scene.add.sprite(startPos.x, startPos.y, spriteName);
    this.currentTween = scene.tweens.add({ duration: 0, targets: this.body });
    this.canPlayTween = true;
    this.moveDuration = moveDuration;
    this.scene = scene;

    this.sounds = {
      run: scene.sound.add(spriteName + "run")
    };

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
        this.sounds.run.stop();
        this.body.anims.play("idle", true);
      },
      scene
    );
  }

  async move(targetPos) {
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

  // Abstract virtual functions for moving up, down, left, right
  async moveUp(map) {
    const targetPos = { x: this.body.x, y: this.body.y - 32 };
    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("up", true);
  }
  async moveDown(map) {
    const targetPos = { x: this.body.x, y: this.body.y + 32 };

    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("down", true);
  }
  async moveLeft(map) {
    const targetPos = { x: this.body.x - 32, y: this.body.y };

    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("left", true);
  }
  async moveRight(map) {
    const targetPos = { x: this.body.x + 32, y: this.body.y };
    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("right", true);
  }

  canMove(map, targetPos) {
    const tile = map.getBlockingTile(targetPos);
    const otherChar = this.characterManager.getCharacterWorldXY(targetPos);
    if (otherChar || tile) {
      return false;
    }

    return true;
  }
}

export default Character;
