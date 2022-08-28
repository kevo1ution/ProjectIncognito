import Character from "./character";
import config from "../config/config";
import * as Promise from "bluebird";
Promise.config({ cancellation: true });

class Recon extends Character {
  constructor(spriteName, moveDuration, scene, startPos, characterManager) {
    super(spriteName, moveDuration, scene, startPos, characterManager);

    this.scanPromise = null;
  }

  setupAnimations() {
    const spriteName = this.spriteName;
    const scene = this.scene;
    const moveDuration = this.moveDuration;
    scene.anims.create({
      key: spriteName + "left",
      frames: [
        { key: spriteName, frame: 9 },
        { key: spriteName, frame: 11 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "right",
      frames: [
        { key: spriteName, frame: 8 },
        { key: spriteName, frame: 10 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "up",
      frames: [
        { key: spriteName, frame: 4 },
        { key: spriteName, frame: 5 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "down",
      frames: [
        { key: spriteName, frame: 1 },
        { key: spriteName, frame: 2 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "idle",
      frames: [{ key: spriteName, frame: 0 }],
      frameRate: 4000,
      repeat: -1,
    });
  }

  startScan() {
    const scene = this.scene;
    const body = this.body;
    let curPromise = null;
    let active = true;
    let arc = scene.add.arc(body.x, body.y);

    async function setupRadar() {
      while (active) {
        arc.setStrokeStyle(5, 0x101010, 1);
        arc.setRadius(9);
        curPromise = new Promise((res, rej, onCancel) => {
          const pulseDate = new Date().getTime();
          let radarTween = scene.tweens.add({
            radius:
              config.GAME.tileSize.x * config.GAME.characters.recon.viewRadius,
            strokeAlpha: 0,
            targets: arc,
            duration: config.GAME.characters.recon.viewRadiusExpansionTime,
            onUpdate: () => {
              scene.map.lightupGuards(
                { x: body.x, y: body.y },
                arc.radius,
                pulseDate
              );
              arc.setPosition(body.x, body.y);
            },
            onComplete: () => {
              if (!radarTween) {
                return;
              }
              radarTween.remove();
              res();
            },
          });

          onCancel(() => {
            radarTween.remove();
          });
        });

        await curPromise;
      }
    }

    this.scanPromise = new Promise((res, rej, onCancel) => {
      setupRadar();
      onCancel(() => {
        if (curPromise) {
          curPromise.cancel();
        }
        active = false;
        arc.destroy();
      });
    });
  }

  onToggle(active) {
    if (active) {
      this.startScan();
    } else {
      if (this.scanPromise) {
        this.scanPromise.cancel();
      }
      this.scene.map.setupLightLayer();
    }
  }
}

export default Recon;
