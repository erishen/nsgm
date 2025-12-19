import _ from "lodash";

export const getLocalEnv = () => {
  let env = process.env.NEXT_PUBLIC_ENV || "uat";
  env = env.toLowerCase();
  return env;
};

export const getLocalApiPrefix = () => {
  let protocol = process.env.NEXT_PUBLIC_PROTOCOL || "http";
  let host = process.env.NEXT_PUBLIC_HOST || "localhost";
  let port = process.env.NEXT_PUBLIC_PORT || "3000";
  const prefix = process.env.NEXT_PUBLIC_PREFIX || "";
  const isExport = process.env.NEXT_PUBLIC_IS_EXPORT === "true";

  let localApiPrefix = "";

  if (!isExport) {
    if (typeof window !== "undefined") {
      // 客户端：使用当前页面的 location
      const location = window.location;

      protocol = location.protocol;
      if (protocol.indexOf(":") != -1) {
        protocol = protocol.split(":")[0];
      }
      host = location.hostname;
      port = location.port;
    }
    // 服务器端：直接使用配置中的值，无需额外处理
  }

  // 只在非标准端口时才添加端口号
  const isStandardPort = (protocol === "https" && port === "443") || (protocol === "http" && port === "80") || !port;
  const portStr = isStandardPort ? "" : `:${port}`;
  
  localApiPrefix = `${protocol}://${host}${portStr}${prefix}`;
  return localApiPrefix;
};

export const handleXSS = (content: string) => {
  content = content || "";
  return content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};

export const checkModalObj = (modalObj: {}, ignoreKeys: any = []) => {
  let result: any = null;
  _.each(modalObj, (value: any, key: string) => {
    if (ignoreKeys.length === 0 || (ignoreKeys.length !== 0 && ignoreKeys.join(".").indexOf(key) === -1)) {
      if (_.trim(value) === "") {
        result = {
          key,
          reason: "不能为空",
        };
        return false;
      }
    }
    return true;
  });
  return result;
};

export const getUrlParamByKey = (key: string) => {
  let result = "";
  if (typeof window !== "undefined") {
    const locationHref = window.location.href;
    if (locationHref.indexOf("?") !== -1) {
      const locationHrefArr = locationHref.split("?");
      if (locationHrefArr.length > 1) {
        const paramsStr = locationHrefArr[1];

        let params: any = [];
        if (paramsStr.indexOf("&") !== -1) {
          params = paramsStr.split("&");
        } else {
          params.push(paramsStr);
        }

        _.each(params, (item) => {
          if (item.indexOf("=") !== -1) {
            const itemArr = item.split("=");
            if (itemArr[0] === key) {
              result = itemArr[1];
              return false;
            }
          }
          return true;
        });
      }
    }
  }
  return result;
};
