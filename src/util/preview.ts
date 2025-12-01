/**
 * @file 图片预览
 * @author svon.me@gmail.com
 */

import URL from "./url";


export const isImage = function (value?: string): boolean {
  let pathName: string | undefined;
  if (value) {
    try {
      const url = new URL(value);
      pathName = url.pathname;
    } catch (e) {
      // todo
    }
  }
  // 判断文件类型
  if (pathName && /\.(jpg|jpeg|png|gif|webp|bmp|svg)\/?$/i.test(pathName)) {
    return true;
  }
  // todo
  return false;
}

export const isVideo = function (value?: string): boolean {
  const url = new URL(value);
  const pathName = url.pathname;
  // 判断文件类型
  if (pathName && /\.(mp4|webm|ogg|mov|avi|mkv|flv)\/?$/i.test(pathName)) {
    return true;
  }
  // todo
  return false;
}

export const isAudio = function (value?: string): boolean {
  const url = new URL(value);
  const pathName = url.pathname;
  // 判断文件类型
  if (pathName && /\.(mp3|wav|ogg|aac|flac|m4a)\/?$/i.test(pathName)) {
    return true;
  }
  // todo
  return false;
}

export const isWord = function (value?: string): boolean {
  const url = new URL(value);
  const pathName = url.pathname;
  // 判断文件类型
  if (pathName && /\.(doc|docx|docm|txt|pdf|xls|xlsx|csv)\/?$/i.test(pathName)) {
    return true;
  }
  // todo
  return false;
}

export const isZip = function (value?: string): boolean {
  const url = new URL(value);
  const pathName = url.pathname;
  // 判断文件类型
  if (pathName && /\.(zip|tar|gz|7z)\/?$/i.test(pathName)) {
    return true;
  }
  // todo
  return false;
}

export const isView = function (value?: string): boolean {
  if (isImage(value)) {
    return true;
  }
  if (isVideo(value)) {
    return true;
  }
  if (isAudio(value)) {
    return true;
  }
  if (isWord(value)) {
    return true;
  }
  // todo
  return false;
}