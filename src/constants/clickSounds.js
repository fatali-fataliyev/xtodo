const DRAW_LINE_1_DEFAULT = require("../../assets/click_sounds/draw_line_1_default.wav");
const DRAW_LINE_2 = require("../../assets/click_sounds/draw_line_2.wav");
const BUBBLE_POP_1 = require("../../assets/click_sounds/bubble_pop_1.wav");
const BUBBLE_POP_2 = require("../../assets/click_sounds/bubble_pop_2.wav");
const CLICK_1 = require("../../assets/click_sounds/click_1.wav");
const CLICK_2 = require("../../assets/click_sounds/click_2.wav");
const CLICK_3 = require("../../assets/click_sounds/click_3.wav");
const IMPACT = require("../../assets/click_sounds/impact.wav");

const SOUNDS_MAP = new Map();
SOUNDS_MAP.set("dwLine1Default", DRAW_LINE_1_DEFAULT);
SOUNDS_MAP.set("dwLine2", DRAW_LINE_2);
SOUNDS_MAP.set("bubble1", BUBBLE_POP_1);
SOUNDS_MAP.set("bubble2", BUBBLE_POP_2);
SOUNDS_MAP.set("click1", CLICK_1);
SOUNDS_MAP.set("click2", CLICK_2);
SOUNDS_MAP.set("click3", CLICK_3);
SOUNDS_MAP.set("impact", IMPACT);

export function getClickSound(key) {
  return SOUNDS_MAP.get(key);
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
    name: "Bubble Pop 1",
    mapName: "bubble1",
    file: BUBBLE_POP_1,
  },
  {
    name: "Bubble Pop 2",
    mapName: "bubble2",
    file: BUBBLE_POP_2,
  },
  {
    name: "Click 1",
    mapName: "click1",
    file: CLICK_1,
  },
  {
    name: "Click 2",
    mapName: "click2",
    file: CLICK_2,
  },
  {
    name: "Click 3",
    mapName: "click3",
    file: CLICK_3,
  },
  {
    name: "Impact",
    mapName: "impact",
    file: IMPACT,
  },
];