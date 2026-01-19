/**
 * @file URL 解析
 * @author svon.me@gmail.com
 **/

import URLParse from "url-parse";

// @ts-ignore
class URL extends URLParse {
  constructor(value?: string) {
    // @ts-ignore
    super(value);
  }
}

export default URL;