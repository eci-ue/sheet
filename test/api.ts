// @ts-ignore
import * as _ from "lodash-es";
import {Axios, AxiosResponse} from "axios";
import safeGet from "@fengqiaogang/safe-get";
import safeSet from "@fengqiaogang/safe-set";

const axios = new Axios({
  baseURL: "/api"
});

const toJson = function<T>(res: AxiosResponse): T | undefined {
  let data = res.data;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  return safeGet<T>(data, "data");
}

export const id = 226;

export const getColumnList = async function<T>(): Promise<T | undefined> {
  const res = await axios.get("/eci-comic/project/settingCollectionTable/getFSHeaderInfo", {
    params: {
      collectionManageId: id
    },
    responseType: "json",
  });
  return toJson<T>(res);
}

export const toRowList = function<T>(array: T[] = []): T[] {
  const list: T[] = [];
  for (const item of array) {
    const tr = _.omit(item as object, ["tableList"]) as object;
    const row = safeGet<object[]>(item, "tableList") || [];
    for (const cell of row) {
      const text = safeGet<string>(cell, "txt");
      const columnId = safeGet<string>(cell, "columnId")!;
      if (columnId) {
        safeSet(tr, columnId, text);
        safeSet(tr, `${columnId}_cell`, cell);
      }
    }
    list.push(tr as T);
  }
  return list;
}

export const getRowList = async function<T>(): Promise<T[]> {
  const res = await axios.get("/eci-comic/project/settingCollectionTable/getFSDataInfo", {
    params: {
      collectionManageId: id
    },
    responseType: "json",
  });
  const list = toJson<T[]>(res);
  return toRowList<T>(list);
}