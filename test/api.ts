import * as _ from "lodash-es";
import {Axios, AxiosResponse} from "axios";
import safeGet from "@fengqiaogang/safe-get";
import safeSet from "@fengqiaogang/safe-set";

const axios = new Axios({
  baseURL: "/api/eci-comic"
});

const toJson = function <T>(res: AxiosResponse): T | undefined {
  let data = res.data;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  return safeGet<T>(data, "data");
}

export const id = 223;
export const sheetKey = "collectionManageId";

export const getColumnList = async function <T>(): Promise<T | undefined> {
  const res = await axios.get("/project/settingCollectionTable/getFSHeaderInfo", {
    params: {
      [sheetKey]: id
    },
    responseType: "json",
  });
  return toJson<T>(res);
}

export const toRowList = function <T>(array: T[] = []): T[] {
  const list: T[] = [];
  for (const item of array) {
    const tr = _.omit(item as object, ["tableList"]) as object;
    const row = safeGet<object[]>(item, "tableList") || [];
    for (const cell of row) {
      const style = safeGet<string>(cell, "cellStyle");
      const columnId = safeGet<string>(cell, "columnId")!;
      if (columnId) {
        const data = {
          ...(_.omit(cell, ["cellStyle"])),
          style: style ? JSON.parse(style) : void 0,
        };
        safeSet(tr, columnId, data);
      }
    }
    list.push(tr as T);
  }
  return list;
}

export const getRowList = async function <T>(): Promise<T[]> {
  const res = await axios.get("/project/settingCollectionTable/getFSDataInfo", {
    params: {
      [sheetKey]: id
    },
    responseType: "json",
  });
  const list = toJson<T[]>(res);
  return toRowList<T>(list);
}

export const updateCells = async function (list: object[] = []): Promise<boolean> {
  const data: object[] = [];
  for (const item of list) {
    const style = safeGet<object>(item, "style") || {};
    data.push({
      ...(_.omit(item, ["style"])),
      [sheetKey]: id,
      cellStyle: JSON.stringify(style),
    })
  }
  const res = await axios.post("/project/settingCollectionTable/insertOrUpdate", JSON.stringify(data), {
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return res.status >= 200 && res.status <= 300;
}

export const addColumn = async function (column: object = {}, columnId?: string, direction: number = 1): Promise<boolean> {
  const options = safeGet<object[]>(column, "options") || [];
  const data = {...column, [sheetKey]: id, options: JSON.stringify(options)};
  const res = await axios.post("/project/settingCollectionTable/addColumn", JSON.stringify(data), {
    params: columnId ? {columnId, direction} : {},
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status >= 200 && res.status <= 300;
}

export const removeColumn = async function(columnId: string): Promise<boolean> {
  const data = {
    [sheetKey]: id,
    columnId,
  };
  const res = await axios.delete("/project/settingCollectionTable/deleteColumn", {
    params: data,
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status >= 200 && res.status <= 300;
}

export const updateColumn = async function(data: object): Promise<boolean> {
  const res = await axios.put("/project/settingCollectionTable/changeFSHeaderInfo", JSON.stringify(data), {
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status >= 200 && res.status <= 300;
}

export const addRow = async function(count: number = 1, direction: number = 1, rowId?: string): Promise<boolean> {
  let params: object;
  if (rowId) {
    if (count < 0) {
      // 向上添加
      params = { [sheetKey]: id, cnt: 1, direction: count, rowId };
    } else {
      // 向下添加
      params = { [sheetKey]: id, cnt: 1, direction: Math.abs(count), rowId };
    }
  } else {
    // 末尾添加
    params = { [sheetKey]: id, cnt: Math.abs(count) };
  }
  const res = await axios.post("/project/settingCollectionTable/addRow", JSON.stringify({}), {
    params,
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status >= 200 && res.status <= 300;
}

export const removeRow = async function(rowIds: string[]): Promise<boolean> {
  const data = {
    [sheetKey]: id, rowIds
  };
  const res = await axios.post("/project/settingCollectionTable/deleteRow", JSON.stringify(data), {
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status >= 200 && res.status <= 300;
}

export const moveColumn = async function(source: string, target: string): Promise<boolean> {
  const params = {
    [sheetKey]: id, source, target
  };
  const res = await axios.put("/project/settingCollectionTable/moveColumn", JSON.stringify({}), {
    params,
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status >= 200 && res.status <= 300;
}

export const moveRow = async function(source: string, target: string): Promise<boolean> {
  const params = {
    [sheetKey]: id, source, target
  };
  const res = await axios.put("/project/settingCollectionTable/moveRow", JSON.stringify({}), {
    params,
    responseType: "json",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status >= 200 && res.status <= 300;
}