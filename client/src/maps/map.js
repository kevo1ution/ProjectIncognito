import config from "../config/config";
import Game from "../Game";

class Map {
  constructor(mapKey, scene) {
    this.map = scene.make.tilemap({
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
      light: this.map.createDynamicLayer("lightLayer", this.tileset)
    };

    this.guardMap = {};
    this.layers.light.alpha = 0.5;

    this.setupLightLayer();

    this.lightUp = this.lightUp.bind(this);
    this.setupLightLayer = this.setupLightLayer.bind(this);
    this.rotateGuardOrTower = this.rotateGuardOrTower.bind(this);
    this.getBlockingTile = this.getBlockingTile.bind(this);
    this.isMoveable = this.isMoveable.bind(this);
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
    this.layers.light.replaceByIndex(327, -1);

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
      throw Error("Invalid guard or tower tile index detected!");
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
      case "right":
        nextPos.x += config.GAME.tileSize.x;
        break;
      case "down":
        nextPos.y += config.GAME.tileSize.y;
        break;
      case "left":
        nextPos.x -= config.GAME.tileSize.x;
        break;
      case "up":
        nextPos.y -= config.GAME.tileSize.y;
        break;
      default:
        throw new Error("Invalid Direction!");
    }

    return obstacle !== null && this.getBlockingTile(nextPos) === null;
  }

  moveMoveable(posWorld, direction) {
    if (!this.isMoveable(posWorld, direction)) {
      throw new Error("Trying to move obstacle that is not moveable");
    }

    let diff;
    switch (direction) {
      case "right":
        diff = { x: 1, y: 0 };
        break;
      case "down":
        diff = { x: 0, y: 1 };
        break;
      case "left":
        diff = { x: -1, y: 0 };
        break;
      case "up":
        diff = { x: 0, y: -1 };
        break;
      default:
        throw new Error("Invalid Direction!");
    }

    const tile = this.layers.moveable.getTileAtWorldXY(posWorld.x, posWorld.y);
    this.layers.moveable.putTileAt(tile, tile.x + diff.x, tile.y + diff.y);
    this.layers.moveable.removeTileAt(tile.x, tile.y);
  }
}

export default Map;
