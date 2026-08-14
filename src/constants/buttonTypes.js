const exampleImgDefault = require("../../assets/images/add_neum.png");
const exampleImgCustom = require("../../assets/images/color_picker.webp");

export const ADD_BUTTON_TYPES = [
  {
    name: "Default",
    settingsName: "default",
    imgSrc: exampleImgDefault,
  },
  {
    name: "Custom",
    settingsName: "custom",
    imgSrc: exampleImgCustom,
  },
];

export function getAddBtnBySettingsName(name) {
  return ADD_BUTTON_TYPES.find((btn) => btn.settingsName === name);
}
