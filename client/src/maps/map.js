class Map {
  constructor(mapKey, scene) {
    this.map = scene.make.tilemap({
      key: mapKey,
      tileWidth: 32,
      tileHeight: 32
    });

    this.tileset = this.map.addTilesetImage("tilesBackground");
    let blockIndexCollidable = [290, 276];

    this.backgroundLayer = this.map.createDynamicLayer("backgroundLayer", this.tileset);
    this.blockedLayer = this.map.createDynamicLayer("blockedLayer", this.tileset);
  }

  // hasObstacle(plrX, plrY) {
  //   const tile = blockedLayer.getTileAtWorldXY(plrX, plrY);
  //   const plrPoint = blockedLayer.worldToTileXY(plrX, plrY);

  //   const plrPoints = players.map(plr => {
  //     return blockedLayer.worldToTileXY(plr.x, plr.y);
  //   });

  //   return (
  //     (tile && blockIndexCollidable.includes(tile.index)) ||
  //     plrPoints.some(point => point.x === plrPoint.x && point.y === plrPoint.y)
  //   );
  // }
  // returns true if the arg tile is an obstacle
  isMoveable(tile) {
    return true;
  }
}

export default Map;
