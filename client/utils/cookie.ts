import _ from "lodash";

export const setCookie = (name: string, value: string, cookieExpire: any) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const expiresTime = new Date();
  expiresTime.setTime(currentTime + 60 * 1000 * 60 * 24 * 30);

  if (typeof document !== "undefined") {
    let cookie = `${name}=${window.btoa(encodeURIComponent(value))}`;
    // let cookie = name + '=' + encodeURIComponent(value)
    if (cookieExpire) {
      cookie += `;expires=${cookieExpire}`;
    } else {
      cookie += `;expires=${expiresTime.toUTCString()}`;
    }

    cookie += ";path=/";
    document.cookie = cookie;
  }
};

export const getCookie = (name: string) => {
  let result = "";
  if (typeof document !== "undefined") {
    const cookie = document.cookie;

    const cookieArr = cookie.split("; ");

    _.each(cookieArr, (item) => {
      const itemArr = item.split("=");
      if (name === itemArr[0]) {
        result = decodeURIComponent(window.atob(itemArr[1]));
        return false;
      }
      return true;
    });
  }
  return result;
};

export const delCookie = (name: string) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const expiresTime = new Date();
  expiresTime.setTime(currentTime - 1);

  if (typeof document !== "undefined") {
    document.cookie = `${name}=;expires=${expiresTime.toUTCString()};path=/`;
  }
};
