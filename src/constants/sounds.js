const draw_line_1_default = require("../../assets/sounds/draw_line_1_default.wav");
const draw_line_2 = require("../../assets/sounds/draw_line_2.wav");
const bubble_pop_1 = require("../../assets/sounds/bubble_pop_1.wav");
const bubble_pop_2 = require("../../assets/sounds/bubble_pop_2.wav");
const click_1 = require("../../assets/sounds/click_1.wav");
const click_2 = require("../../assets/sounds/click_2.wav");
const click_3 = require("../../assets/sounds/click_3.wav");
const impact = require("../../assets/sounds/impact.wav");

const soundsMap = new Map();
soundsMap.set("dwLine1Default", draw_line_1_default);
soundsMap.set("dwLine2", draw_line_2);
soundsMap.set("bubble1", bubble_pop_1);
soundsMap.set("bubble2", bubble_pop_2);
soundsMap.set("click1", click_1);
soundsMap.set("click2", click_2);
soundsMap.set("click3", click_3);
soundsMap.set("impact", impact);

export function getSound(key) {
  return soundsMap.get(key);
}

export const soundsData = [
  {
    name: "Draw Line 1 (Default)",
    file: draw_line_1_default,
  },
  {
    name: "Draw Line 2",
    file: draw_line_2,
  },
  {
    name: "Bubble Pop 1",
    file: bubble_pop_1,
  },
  {
    name: "Bubble Pop 2",
    file: bubble_pop_2,
  },
  {
    name: "Click 1",
    file: click_1,
  },
  {
    name: "Click 2",
    file: click_2,
  },
  {
    name: "Click 3",
    file: click_3,
  },
  {
    name: "Impact",
    file: impact,
  },
];
