import TextEditor from "./text";
import NumberEditor from "./number";


import {CellType} from "src/types/sheet";

export const EditorMap = {
  [CellType.text]: TextEditor,           // 文本
  [CellType.number]: NumberEditor,       // 数字
}
