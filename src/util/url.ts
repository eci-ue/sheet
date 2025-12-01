/**
 * @file URL 解析
 * @author svon.me@gmail.com
 **/

import URLParse from "url-parse";

class URL extends URLParse {
  constructor(value?: string) {
    super(value);
  }
}

export default URL;