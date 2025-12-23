export enum CellType {
  text = 1, // 文本
  number = 2, // 数字
  date = 3, // 日期
  daterange = 4, // 日期范围
  file = 5, // 文件
  image = 6, // 图片
  radio = 7, // 单选
  checkbox = 8, // 多选
  select = 9, // 单选下拉框
  cascader = 10, // 多选下拉框
}

export class OptionKV {
  public dictLabel: string;
  public parent?: string | number;

  constructor(label: string, parent?: string | number) {
    // 名称
    this.dictLabel = label;
    // 如果父元素有值
    if (parent) {
      this.parent = parent;
    }
  }
}

export class Column {
  public type: CellType;         // 单元格类型, 默认文本类型
  public columnId!: string;         // 列ID
  public label: string = "";            // 名称
  public width: number = 210;       // 列宽
  public readOnly: boolean = false; // 是否只读, 默认允许编辑
  public options: OptionKV[] = [];  // 辅助数据列表
  public editor?: string;           // 编辑器组件名称
  public custom?: string;           // 自定义渲染
  constructor(type?: CellType, options?: OptionKV[]) {
    this.type = type || CellType.text;
    this.options = options || [];
  }
}


/**
 * 单元格格式
 * mc_x = 1 表示没有跨列
 * mc_x = 2 表示跨两列
 * mc_x = 0 表示被其它单元格合并
 **/
export class Cell {
  id?: number; // 单元格ID
  columnId!: string; // 列ID
  rowId!: string; // 行ID
  txt?: string; // 单元格数据
  x1?: string; // 列开始
  x2?: string; // 列结束
  y1?: string; // 行开始
  y2?: string; // 行结束
  row?: number;
  column?: number;
  style?: object;
  sheetId?: number | string;
}

export interface RowBasis {
  sort: number;  // 序号
  rowId: string; // 行ID
}

export interface RowCells {
  [key: string]: Cell | number | string | undefined; // 单元格数据
}

/**
 * 行数据
 **/
export type Row = RowBasis & RowCells;

export class EditCellData {
  row!: number;
  column!: number;
  sheetId?: string | number;
  value!: Cell;
}

export interface FillCellOption {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}