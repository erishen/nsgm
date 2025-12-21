import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

type ResponseData = {
  name: string;
  returnCode: number;
  userAttr?: {
    displayName: string;
    username?: string;
  };
  cookieValue?: string;
  cookieExpire?: number;
  message?: string;
};

const getLoginCredentials = () => {
  const username = process.env.LOGIN_USERNAME || "admin";
  const passwordHash = process.env.LOGIN_PASSWORD_HASH;

  console.warn("[SSO] getLoginCredentials - username:", username);
  console.warn(
    "[SSO] getLoginCredentials - passwordHash from env:",
    passwordHash ? `${passwordHash.substring(0, 20)}...` : "undefined"
  );

  if (!passwordHash) {
    console.warn("[SSO] ⚠️  警告: LOGIN_PASSWORD_HASH 环境变量未设置，使用默认密码哈希");
    return {
      username,
      passwordHash: "$2b$10$K5O.TJLKGPmKGHJK8KzN5u8qUYKzq5vLcXlP7vGUzq5vLcXlP7vGUz",
    };
  }

  console.warn("[SSO] getLoginCredentials - final passwordHash:", `${passwordHash.substring(0, 20)}...`);
  return { username, passwordHash };
};

const validateCredentials = async (inputUsername: string, inputPassword: string): Promise<boolean> => {
  const { username, passwordHash } = getLoginCredentials();

  if (inputUsername !== username) {
    return false;
  }

  try {
    return await bcrypt.compare(inputPassword, passwordHash);
  } catch (error) {
    console.warn("[SSO] 密码验证失败:", error);
    return false;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    res.status(405).json({
      name: "ticketCheck",
      returnCode: -1,
      message: "Method not allowed",
    });
    return;
  }

  const { name } = req.query;

  console.warn("[SSO] ticketCheck called, name:", name);

  try {
    if (!name || typeof name !== "string") {
      throw new Error("Invalid name parameter");
    }

    // 使用 Buffer 解码 Base64 字符串，然后使用 decodeURIComponent 处理特殊字符
    const decodedBase64 = Buffer.from(name, "base64").toString("utf-8");
    console.warn("[SSO] Decoded Base64:", decodedBase64);

    const decodedName = decodeURIComponent(decodedBase64);
    console.warn("[SSO] Decoded name:", decodedName);

    const [inputUsername, inputPassword] = decodedName.split(",");
    console.warn("[SSO] Input username:", inputUsername, "password length:", inputPassword?.length);

    const { username: expectedUsername, passwordHash } = getLoginCredentials();
    console.warn("[SSO] Expected username:", expectedUsername, "passwordHash length:", passwordHash?.length);

    const isValid = await validateCredentials(inputUsername, inputPassword);
    console.warn("[SSO] Credentials valid:", isValid);

    if (isValid) {
      console.warn("[SSO] Login successful for user:", inputUsername);
      res.status(200).json({
        name: "ticketCheck",
        returnCode: 0,
        userAttr: {
          displayName: "System Admin",
          username: inputUsername,
        },
        cookieValue: `login_cookie_${Date.now()}`,
        cookieExpire: 7200000, // 2小时
      });
    } else {
      console.warn(`[SSO] 登录失败 - 用户名: ${inputUsername}, 时间: ${new Date().toISOString()}`);

      res.status(200).json({
        name: "ticketCheck",
        returnCode: -1,
        message: "用户名或密码错误",
      });
    }
  } catch (error) {
    console.warn("[SSO] 登录验证出错:", error);
    res.status(500).json({
      name: "ticketCheck",
      returnCode: -1,
      message: "服务器内部错误",
    });
  }
}
