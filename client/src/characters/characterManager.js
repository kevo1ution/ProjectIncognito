import Character from "./character.js";

class CharacterManager {
  constructor(scene) {
    this.characters = [
      new Character("dude", 300, scene, { x: 32 + 16, y: 32 + 16 }, this),
      new Character("dude", 300, scene, { x: 32 * 2 + 16, y: 32 + 16 }, this),
      new Character("dude", 300, scene, { x: 32 + 16, y: 32 * 2 + 16 }, this)
    ];
    this.curCharIndex = 0;
    this.curChar = this.characters[0];
  }

  toggleCharacter() {
    this.curCharIndex++;
    this.curCharIndex = this.curCharIndex % 3; //1 % 3 = 1
    this.curChar = this.characters[this.curCharIndex];
  }

  getCharacterWorldXY(targetPos) {
    return this.characters.find(character => {
      return (
        character.body.x === targetPos.x && character.body.y === targetPos.y
      );
    });
  }

  getCurrentCharacter() {
    return this.curChar;
  }
}

export default CharacterManager;
