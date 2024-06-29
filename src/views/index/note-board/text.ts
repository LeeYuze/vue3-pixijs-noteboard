import { Text, TextStyle } from "pixi.js";

export const CreateText = () => {
  const fontSize = 14;
  const style = new TextStyle({
    fill: 0x4ca486,
    fontFamily: `OpenSans, Arial, sans-serif, "Noto Sans Hebrew", "Noto Sans", "Noto Sans JP", "Noto Sans KR"`,
    fontSize,
    lineHeight: 1.2 * fontSize,
  });
  const text = new Text({
    text: "床前明月光\n疑是地上霜123\n举头望明月\n低头思故乡",
    style,
  });
  text.cursor = "pointer";
  text.interactive = true;
  return text;
};
