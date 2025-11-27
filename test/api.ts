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

export const id = 224;
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
        safeSet(tr, columnId, {
          ...(_.omit(cell, ["cellStyle"])),
          style: style ? JSON.parse(style) : void 0,
        });
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
      ...item,
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