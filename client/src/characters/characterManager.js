import Demolisher from "./demolisher";
import Recon from "./recon";
import Scout from "./scout";
import config from "../config/config";

const nameToClass = {
  demolisher: Demolisher,
  recon: Recon,
  scout: Scout
};

class CharacterManager {
  constructor(scene, map) {
    this.characters = [];
    this.curCharIndex = 0;

    this.setupCharacters(scene, map);
  }

  setupCharacters(scene, map) {
    Object.keys(nameToClass).forEach(charName => {
      const pos = map.startPos[charName];
      if (pos) {
        this.characters.push(
          new nameToClass[charName](
            charName,
            300,
            scene,
            {
              x: (pos.x + 0.5) * config.GAME.tileSize.x,
              y: (pos.y + 0.5) * config.GAME.tileSize.y
            },
            this
          )
        );
      }
    });
  }

  toggleCharacter() {
    this.curCharIndex++;
    this.curCharIndex = this.curCharIndex % this.characters.length; //1 % 3 = 1
  }

  getCharacterWorldXY(targetPos) {
    return this.characters.find(character => {
      return (
        character.body.x === targetPos.x && character.body.y === targetPos.y
      );
    });
  }

  getCurrentCharacter() {
    return this.characters[this.curCharIndex];
  }
}

export default CharacterManager;
