const DRAW_LINE_1_DEFAULT = require("../../assets/sounds/draw_line_1_default.wav");
const DRAW_LINE_2 = require("../../assets/sounds/draw_line_2.wav");
const BUBBLE_POP = require("../../assets/sounds/bubble_pop.wav");
const CLICK = require("../../assets/sounds/click.wav");

const SOUNDS_MAP = new Map();
SOUNDS_MAP.set("dwLine1Default", DRAW_LINE_1_DEFAULT);
SOUNDS_MAP.set("dwLine2", DRAW_LINE_2);
SOUNDS_MAP.set("bubble", BUBBLE_POP);
SOUNDS_MAP.set("click", CLICK);

export function getClickSound(key) {
  return SOUNDS_MAP.get(key);
}

export function getSoundByMapName(name) {
  return SOUNDS_DATA.filter((sound) => sound.mapName === name)[0];
}

export const SOUNDS_DATA = [
  {
    name: "Draw Line 1 (Default)",
    mapName: "dwLine1Default",
    file: DRAW_LINE_1_DEFAULT,
  },
  {
    name: "Draw Line 2",
    mapName: "dwLine2",
    file: DRAW_LINE_2,
  },
  {
    name: "Bubble Pop",
    mapName: "bubble",
    file: BUBBLE_POP,
  },
  {
    name: "Click",
    mapName: "click",
    file: CLICK,
  },
  {
    name: "None",
    mapName: "none",
  },
];
