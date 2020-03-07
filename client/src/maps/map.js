import config from "../config/config";
import Game from "../Game";

class Map {
  constructor(scene) {
    this.startPos = {};
    this.scene = scene;
  }

  reset() {
    if (this.map) {
      this.map.destroy();
    }
  }

  loadLevel(mapKey) {
    this.reset();

    this.map = this.scene.make.tilemap({
      key: mapKey,
      tileWidth: config.GAME.tileSize.x,
      tileHeight: config.GAME.tileSize.y
    });

    this.tileset = this.map.addTilesetImage("tilesBackground");
    this.layers = {
      background: this.map.createDynamicLayer("backgroundLayer", this.tileset),
      moveable: this.map.createDynamicLayer("moveableLayer", this.tileset),
      blocked: this.map.createDynamicLayer("blockedLayer", this.tileset),
      guard: this.map.createDynamicLayer("guardLayer", this.tileset),
      light: this.map.createDynamicLayer("lightLayer", this.tileset),
      start: this.map.createDynamicLayer("startLayer", this.tileset)
    };

    this.setupLightLayer();
    this.setupStartPos();
    this.scene.scale.resize(
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  lightUp(pos, dir, num, tileIndex) {
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

    for (let x = pos.x; x <= finalPos.x; x++) {
      for (let y = pos.y; y <= finalPos.y; y++) {
        if (this.layers.light.getTileAt(x, y) === null) {
          this.layers.light.putTileAt(tileIndex, x, y);
        }
      }
    }
  }

  setupLightLayer() {
    //clear the previous lights
    this.layers.light.replaceByIndex(config.GAME.tileIndex.light, -1);
    this.layers.light.alpha = 0.5;

    const guardTiles = this.layers.guard.filterTiles(tile => {
      return tile.index === config.GAME.tileIndex.guard;
    });

    const towerTiles = this.layers.guard.filterTiles(tile => {
      return tile.index === config.GAME.tileIndex.tower;
    });

    guardTiles.forEach(tile => {
      this.lightUp(
        { x: tile.x, y: tile.y },
        tile.rotation,
        config.GAME.obstacle.guardSight,
        config.GAME.tileIndex.light
      );
    });

    towerTiles.forEach(tile => {
      this.lightUp(
        { x: tile.x, y: tile.y },
        tile.rotation,
        config.GAME.obstacle.towerSight,
        config.GAME.tileIndex.light
      );
    });
  }

  setupStartPos() {
    this.layers.start.setVisible(false);

    Object.keys(config.GAME.tileIndex.character).forEach(key => {
      const tile = this.layers.start.findTile(
        tile => tile.index === config.GAME.tileIndex.character[key]
      );

      if (tile) {
        this.startPos[key] = { x: tile.x, y: tile.y };
      }
    });
  }

  isGuardedTile(posWorld) {
    return this.layers.light.getTileAtWorldXY(posWorld.x, posWorld.y) !== null;
  }

  rotateGuardOrTower(posWorld) {
    const guardOrTowerTile = this.layers.guard.getTileAtWorldXY(
      posWorld.x,
      posWorld.y
    );
    if (guardOrTowerTile === null) {
      return;
    }

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

    this.setupLightLayer();
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
      y: tile.y + diff.y
    };
    this.scene.tweens.add({
      pixelX: targetPos.x * config.GAME.tileSize.x,
      pixelY: targetPos.y * config.GAME.tileSize.y,
      targets: tile,
      duration,
      onComplete: () => {
        this.layers.moveable.putTileAt(tile.index, targetPos.x, targetPos.y);
        this.layers.moveable.removeTileAt(tile.x, tile.y);
      }
    });
  }
}

export default Map;
