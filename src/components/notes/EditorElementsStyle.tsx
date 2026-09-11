import { ColorValue } from "react-native";

export interface customTextEditorStyle {
  h1?: { fontSize?: number; bold?: boolean };
  h2?: { fontSize: number; bold?: boolean };
  h3?: { fontSize: number; bold?: boolean };
  code?: {
    color?: ColorValue;
    backgroundColor?: ColorValue;
  };
  codeblock?: {
    color?: ColorValue;
    borderRadius: number;
    backgroundColor?: ColorValue;
  };
  ol?: {
     marginLeft?: number;
  }
  
  ul: {
    bulletColor: ColorValue;
     marginLeft?: number;
  };

  ulCheckbox?: {
    boxColor?: ColorValue;
    boxSize?: number;
    gapWidth?: number;
    marginLeft?: number;
  };
}

export const textEditorStyles: customTextEditorStyle = {
  h1: { fontSize: 32, bold: true },
  h2: { fontSize: 24, bold: true },
  h3: { fontSize: 20, bold: true },
  code: { backgroundColor: "#000", color: "#33FF00" },
  codeblock: { backgroundColor: "#000", borderRadius: 3, color: "#33FF00" },
  ul: {
    bulletColor: "#FFF",
  },
  ulCheckbox: {
    boxColor: "#CCC",
    boxSize: 18,
    gapWidth: 12,
  },
};

export const textEditorPreviewStyles: customTextEditorStyle = {
  h1: { fontSize: 16, bold: true },
  h2: { fontSize: 16, bold: true },
  h3: { fontSize: 16, bold: true },
  code: { backgroundColor: "#000", color: "#33FF00" },
  codeblock: { backgroundColor: "#000", borderRadius: 3, color: "#33FF00" },
  ol: {
    marginLeft: 0
  },
  ul: {
    bulletColor: "#FFF",
    marginLeft: 0
  },
  ulCheckbox: {
    boxColor: "#CCC",
    boxSize: 18,
    gapWidth: 12,
    marginLeft: 0,
  },
};
