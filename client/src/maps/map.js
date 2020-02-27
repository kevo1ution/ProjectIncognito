class Map {
  constructor(mapKey, scene) {
    this.map = scene.make.tilemap({
      key: mapKey,
      tileWidth: 32,
      tileHeight: 32
    });

    this.tileset = this.map.addTilesetImage("tilesBackground");
    this.blockIndexCollidable = [290, 276];
    this.backgroundLayer = this.map.createDynamicLayer(
      "backgroundLayer",
      this.tileset
    );
    this.blockedLayer = this.map.createDynamicLayer(
      "blockedLayer",
      this.tileset
    );
    this.guardLayer = this.map.createDynamicLayer("guardLayer", this.tileset);
    this.lightLayer = this.map.createDynamicLayer("lightLayer", this.tileset);

    this.guardMap = {}

    this.lightLayer.alpha = 0.2
  }

  isGuardedTile(targetPos) {
    return this.lightLayer.getTileAtWorldXY(targetPos.x, targetPos.y)
  }

  rotateGuard(){
    
  }

  getBlockingTile(targetPos) {
    return (
      this.blockedLayer.getTileAtWorldXY(targetPos.x, targetPos.y) ||
      this.guardLayer.getTileAtWorldXY(targetPos.x, targetPos.y)
    );
  }

  isMoveable(tile) {
    return false;
  }
}

export default Map;
