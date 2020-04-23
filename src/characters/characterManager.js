import Demolisher from "./demolisher";
import Recon from "./recon";
import Scout from "./scout";
import config from "../config/config";

class CharacterManager {
  constructor(scene) {
    this.loadedCharacters = {};
    this.characters = [];
    this.curCharIndex = 0;
    this.scene = scene;
    this.sounds = {
      changeCharacters: scene.sound.add("rotateEnemy"),
    };    

    this.loadCharacters();
  }

  reset() {
    Object.keys(this.loadedCharacters).forEach((charName) => {
      this.loadedCharacters[charName].disable();
    });
  }

  loadCharacters() {
    const scene = this.scene;
    this.loadedCharacters = {
      demolisher: new Demolisher(
        "demolisher",
        300,
        scene,
        {
          x: 100,
          y: 500,
        },
        this
      ),
      recon: new Recon(
        "recon",
        300,
        scene,
        {
          x: 0,
          y: 0,
        },
        this
      ),
      scout: new Scout(
        "scout",
        300,
        scene,
        {
          x: 0,
          y: 0,
        },
        this
      ),
    };

    this.reset();
  }

  setupCharacters() {
    this.reset();

    const scene = this.scene;
    const map = scene.map;
    this.characters = [];
    Object.keys(this.loadedCharacters).forEach((charName) => {
      const pos = map.startPos[charName];
      if (pos) {
        const char = this.loadedCharacters[charName];
        this.characters.push(char);
        char.body.x = (pos.x + 0.5) * config.GAME.tileSize.x;
        char.body.y = (pos.y + 0.5) * config.GAME.tileSize.y;
        char.enable();
      }
    });

    this.getCurrentCharacter().onToggle(true);
  }

  didWin() {
    return this.characters.length === 0;
  }

  removeCharacterInLineup(character) {
    this.characters = this.characters.filter((char) => char !== character);
    this.curCharIndex %= this.characters.length;
    character.disable();
  }

  toggleCharacter() {
    const lastIndex = this.curCharIndex;
    this.curCharIndex++;
    this.curCharIndex = this.curCharIndex % this.characters.length;

    if (lastIndex !== this.curCharIndex) {
      this.characters[lastIndex].onToggle(false);
      this.getCurrentCharacter().onToggle(true);
    }

    // effects
    this.sounds.changeCharacters.play();

    const charBody = this.getCurrentCharacter().body;
    const yoffset = config.GAME.tileSize.y / 1.5;
    const arrow = this.scene.add.image(
      charBody.x,
      charBody.y - yoffset,
      "downarrow"
    );
    arrow.setScale(0.3, 0.3);
    arrow.setDepth(1000);

    const arrowTween = this.scene.tweens.add({
      alpha: 1,
      targets: arrow,
      duration: 1000,
      onUpdate: () => {
        arrow.x = charBody.x;
        arrow.y = charBody.y - yoffset;
      },
      onComplete: () => {
        arrowTween.remove();
        arrow.destroy();
      },
    });
  }

  getCharacterXY(targetPos) {
    return this.characters.find((character) => {
      const tilePos = this.scene.map.map.worldToTileXY(
        character.body.x,
        character.body.y
      );
      return tilePos.x === targetPos.x && tilePos.y === targetPos.y;
    });
  }

  getCharacterWorldXY(targetPos) {
    return this.characters.find(
      (character) =>
        character.body.x === targetPos.x && character.body.y === targetPos.y
    );
  }

  getCurrentCharacter() {
    return this.characters[this.curCharIndex];
  }
}

export default CharacterManager;
