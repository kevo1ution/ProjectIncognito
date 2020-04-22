import Phaser from "phaser";
import config from "../config/config";

class Map {
  constructor(scene) {
    this.startPos = {};
    this.scene = scene;
    this.guardRevealPos = false;
    this.sounds = {
      terrainBreaking: scene.sound.add("terrainBreaking", {
        volume: 0.1,
      }),
      rotateEnemy: scene.sound.add("rotateEnemy")
    };
  }

  reset() {
    if (this.map) {
      this.map.destroy();
    }
  }

  loadLevel(mapKey) {
    this.reset();

    this.level = mapKey;
    this.map = this.scene.make.tilemap({
      key: mapKey,
      tileWidth: config.GAME.tileSize.x,
      tileHeight: config.GAME.tileSize.y,
    });

    this.tileset = this.map.addTilesetImage("tilesBackground");
    this.layers = {
      background: this.map.createDynamicLayer("backgroundLayer", this.tileset),
      moveable: this.map.createDynamicLayer("moveableLayer", this.tileset),
      blocked: this.map.createDynamicLayer("blockedLayer", this.tileset),
      guard: this.map.createDynamicLayer("guardLayer", this.tileset),
      cracked: this.map.createDynamicLayer("crackedLayer", this.tileset),
      light: this.map.createDynamicLayer("lightLayer", this.tileset),
      win: this.map.createDynamicLayer("winLayer", this.tileset),
      start: this.map.createDynamicLayer("startLayer", this.tileset),
    };

    this.setupLightLayer();
    this.setupStartPos();
    this.scene.scale.resize(this.map.widthInPixels, this.map.heightInPixels);

    this.scene.characterManager.setupCharacters();
  }

  lightUp(pos, dir, num, tileIndex, alpha = 1) {
    const finalPos = { ...pos };
    switch (dir) {
      case 0: // right
        pos.x++;
        finalPos.x += num;
        break;
      case Math.PI / 2: // down
        pos.y++;
        finalPos.y += num;
        break;
      case Math.PI: // left
        pos.x -= num;
        finalPos.x--;
        break;
      case (Math.PI * 3) / 2: // up
        pos.y -= num;
        finalPos.y--;
        break;
      default:
        throw Error("Invalid direction!");
    }

    let isPlrSeen = false;

    for (let x = pos.x; x <= finalPos.x; x++) {
      for (let y = pos.y; y <= finalPos.y; y++) {
        isPlrSeen =
          isPlrSeen || this.scene.characterManager.getCharacterXY({ x, y });
        if (this.layers.light.getTileAt(x, y) === null) {
          this.layers.light.putTileAt(tileIndex, x, y);
        }

        const lightTile = this.layers.light.getTileAt(x, y);
        if (lightTile) {
          lightTile.setAlpha(alpha);
        }
      }
    }

    return isPlrSeen;
  }

  setupLightLayer() {
    //clear the previous lights
    this.layers.light.replaceByIndex(config.GAME.tileIndex.light, -1);
    this.layers.light.alpha = 0.5;

    const guardTiles = this.layers.guard.filterTiles((tile) => {
      return tile.index === config.GAME.tileIndex.guard;
    });

    const towerTiles = this.layers.guard.filterTiles((tile) => {
      return tile.index === config.GAME.tileIndex.tower;
    });

    let isPlrSeen = false;
    guardTiles.forEach((tile) => {
      let alpha = 0;

      tile.setAlpha(alpha);

      isPlrSeen =
        isPlrSeen ||
        this.lightUp(
          { x: tile.x, y: tile.y },
          tile.rotation,
          config.GAME.obstacle.guardSight,
          config.GAME.tileIndex.light,
          alpha
        );
    });

    towerTiles.forEach((tile) => {
      isPlrSeen =
        isPlrSeen ||
        this.lightUp(
          { x: tile.x, y: tile.y },
          tile.rotation,
          config.GAME.obstacle.towerSight,
          config.GAME.tileIndex.light
        );
    });

    return isPlrSeen;
  }

  setupStartPos() {
    this.layers.start.setVisible(false);

    Object.keys(config.GAME.tileIndex.character).forEach((key) => {
      const tile = this.layers.start.findTile(
        (tile) => tile.index === config.GAME.tileIndex.character[key]
      );

      if (tile) {
        this.startPos[key] = { x: tile.x, y: tile.y };
      }
    });
  }

  isHole(posWorld) {
    const tile = this.layers.cracked.getTileAtWorldXY(posWorld.x, posWorld.y);
    return tile && tile.index === config.GAME.tileIndex.cracked.hole;
  }

  isCracked(posWorld) {
    const tile = this.layers.cracked.getTileAtWorldXY(posWorld.x, posWorld.y);
    return tile && tile.index === config.GAME.tileIndex.cracked.weak;
  }

  isGuardedTile(posWorld) {
    return this.layers.light.getTileAtWorldXY(posWorld.x, posWorld.y) !== null;
  }

  isWin(posWorld) {
    return this.layers.win.getTileAtWorldXY(posWorld.x, posWorld.y) !== null;
  }

  rotateGuardOrTower(posWorld) {
    const guardOrTowerTile = this.layers.guard.getTileAtWorldXY(
      posWorld.x,
      posWorld.y
    );
    if (guardOrTowerTile === null) {
      return;
    }

    this.sounds.rotateEnemy.play();
    if (guardOrTowerTile.index === config.GAME.tileIndex.guard) {
      guardOrTowerTile.rotation +=
        config.GAME.characters.scout.guardAndTowerRotation;
      guardOrTowerTile.rotation %= Math.PI * 2;
    } else if (guardOrTowerTile.index === config.GAME.tileIndex.tower) {
      guardOrTowerTile.rotation +=
        config.GAME.characters.scout.guardAndTowerRotation;
      guardOrTowerTile.rotation %= Math.PI * 2;
    } else {
      throw Error(
        "Invalid guard or tower tile index detected: " + guardOrTowerTile.index
      );
    }

    const isPlrSeen = this.setupLightLayer();

    if (isPlrSeen) {
      this.scene.events.emit("lose");
    }
  }

  lightupGuards(posWorld, radius, pulseDate) {
    const map = this;
    const guardTiles = map.layers.guard.filterTiles((tile) => {
      return tile.index === config.GAME.tileIndex.guard;
    });

    guardTiles.forEach((tile) => {
      const tileWorldPos = map.layers.guard.tileToWorldXY(tile.x, tile.y);
      const xdiff = tileWorldPos.x - posWorld.x;
      const ydiff = tileWorldPos.y - posWorld.y;
      const distFromGuard = Math.sqrt(xdiff * xdiff + ydiff * ydiff);

      if (pulseDate !== tile.lastPulse && distFromGuard <= radius) {
        if (tile.currentTween) {
          tile.currentTween.remove();
        }

        tile.lastPulse = pulseDate;
        tile.setAlpha(1);
        tile.currentTween = map.scene.tweens.add({
          targets: tile,
          alpha: 0,
          duration: config.GAME.characters.recon.guardFadeTime,
          ease: Phaser.Math.Easing.Expo,
          onUpdate: () => {
            map.lightUp(
              { x: tile.x, y: tile.y },
              tile.rotation,
              config.GAME.obstacle.guardSight,
              config.GAME.tileIndex.light,
              tile.alpha
            );
          },
          onComplete: () => {
            tile.currentTween.remove();
            tile.currentTween = null;
          },
        });
      }
    });
  }

  breakWeakTerrain(posWorld) {
    this.sounds.terrainBreaking.play({
      seek: 0.4,
    });
    this.layers.cracked.removeTileAtWorldXY(posWorld.x, posWorld.y);
    this.layers.cracked.putTileAtWorldXY(
      config.GAME.tileIndex.cracked.hole,
      posWorld.x,
      posWorld.y
    );
  }

  getBlockingTile(posWorld) {
    return (
      this.layers.blocked.getTileAtWorldXY(posWorld.x, posWorld.y) ||
      this.layers.guard.getTileAtWorldXY(posWorld.x, posWorld.y) ||
      this.layers.moveable.getTileAtWorldXY(posWorld.x, posWorld.y)
    );
  }

  isMoveable(posWorld, direction) {
    const obstacle = this.layers.moveable.getTileAtWorldXY(
      posWorld.x,
      posWorld.y
    );

    const nextPos = { ...posWorld };

    switch (direction) {
      case config.GAME.characters.move.RIGHT:
        nextPos.x += config.GAME.tileSize.x;
        break;
      case config.GAME.characters.move.DOWN:
        nextPos.y += config.GAME.tileSize.y;
        break;
      case config.GAME.characters.move.LEFT:
        nextPos.x -= config.GAME.tileSize.x;
        break;
      case config.GAME.characters.move.UP:
        nextPos.y -= config.GAME.tileSize.y;
        break;
      default:
        throw new Error("Invalid Direction!");
    }

    return (
      obstacle !== null &&
      this.getBlockingTile(nextPos) === null &&
      this.scene.characterManager.getCharacterWorldXY(nextPos) == null
    );
  }

  moveMoveable(posWorld, direction, duration) {
    if (!this.isMoveable(posWorld, direction)) {
      throw new Error("Trying to move obstacle that is not moveable");
    }

    let diff;
    switch (direction) {
      case config.GAME.characters.move.RIGHT:
        diff = { x: 1, y: 0 };
        break;
      case config.GAME.characters.move.DOWN:
        diff = { x: 0, y: 1 };
        break;
      case config.GAME.characters.move.LEFT:
        diff = { x: -1, y: 0 };
        break;
      case config.GAME.characters.move.UP:
        diff = { x: 0, y: -1 };
        break;
      default:
        throw new Error("Invalid Direction!");
    }

    const tile = this.layers.moveable.getTileAtWorldXY(posWorld.x, posWorld.y);
    const targetPos = {
      x: tile.x + diff.x,
      y: tile.y + diff.y,
    };
    const moveTween = this.scene.tweens.add({
      pixelX: targetPos.x * config.GAME.tileSize.x,
      pixelY: targetPos.y * config.GAME.tileSize.y,
      targets: tile,
      duration,
      onComplete: () => {
        moveTween.remove();
        this.layers.moveable.putTileAt(tile.index, targetPos.x, targetPos.y);
        this.layers.moveable.removeTileAt(tile.x, tile.y);
      },
    });
  }
}

export default Map;
