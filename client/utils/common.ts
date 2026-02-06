import _ from "lodash";

export const getLocalEnv = () => {
  // 安全地访问 process.env，避免在浏览器中直接访问 process 对象
  let env = "uat";
  try {
    if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ENV) {
      env = process.env.NEXT_PUBLIC_ENV;
    }
  } catch {
    // 在浏览器环境中 process 可能未定义，使用默认值
  }
  return env.toLowerCase();
};

export const getLocalApiPrefix = () => {
  // 安全地访问 process.env
  let protocol = "http";
  let host = "localhost";
  let port = "3000";
  let prefix = "";
  let isExport = false;

  try {
    if (typeof process !== "undefined" && process.env) {
      protocol = process.env.NEXT_PUBLIC_PROTOCOL || protocol;
      host = process.env.NEXT_PUBLIC_HOST || host;
      port = process.env.NEXT_PUBLIC_PORT || port;
      prefix = process.env.NEXT_PUBLIC_PREFIX || "";
      isExport = process.env.NEXT_PUBLIC_IS_EXPORT === "true";
    }
  } catch {
    // 在浏览器环境中 process 可能未定义，使用默认值
  }

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

export const handleXSS = (content: any) => {
  if (content === null || content === undefined) {
    return "";
  }
  const str = String(content);
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
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
