import path, { resolve } from "path";
import serverDB from "./server/db";

const sourceFolder = __dirname;
const destFolder = process.cwd();

const isLocal = sourceFolder === resolve(`${destFolder}/lib`);

const { getMysqlConfig } = serverDB;
const { mysqlOptions }: any = getMysqlConfig();
const {
  user: mysqlUser,
  password: mysqlPassword,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDatabase,
} = mysqlOptions;

const generationPath = "../generation";
const clientPathSource = "../client";
const clientPath = "./client";
const serverPathSource = "../server";
const serverPath = "./server";
const pagesPathSource = "../pages";
const pagesPath = "./pages";
const publicPathSource = "../public";
const publicPath = "./public";
const scriptsPathSource = "../scripts";
const scriptsPath = "./scripts";
const typesPathSource = "../types";
const typesPath = "./types";
const reduxPath = "/redux";
const servicePath = "/service";
const styledPath = "/styled";
const styledLayoutPath = "/layout";
const utilsPath = "/utils";
const layoutPath = "/layout";
const componentsPath = "/components";
const modulesPath = "/modules";
const apisPath = "/apis";
const sqlPath = "/sql";
const utilsMenuPath = "/menu.tsx";
const reduxReducersPath = "/reducers.ts";
const slbHealthCheckPath = "/slbhealthcheck.html";
const packagePath = "/package.json";
const restPath = "/rest.js";

const sourceGenerationPath = path.join(sourceFolder, generationPath);
const sourceClientPath = path.join(sourceFolder, clientPathSource);
const sourceClientPathGeneration = path.join(sourceGenerationPath, clientPath);
const sourceServerPath = path.join(sourceFolder, serverPathSource);
const sourceServerPathGeneration = path.join(sourceGenerationPath, serverPath);
const sourcePagesPath = path.join(sourceFolder, pagesPathSource);
const sourcePublicPath = path.join(sourceFolder, publicPathSource);
const sourceScriptsPath = path.join(sourceFolder, scriptsPathSource);
const sourceTypesPath = path.join(sourceFolder, typesPathSource);

const destClientPath = path.join(destFolder, clientPath);
const destClientReduxPath = resolve(destClientPath + reduxPath);
const destClientServicePath = resolve(destClientPath + servicePath);
const destClientStyledPath = resolve(destClientPath + styledPath);
const destClientStyledLayoutPath = resolve(destClientStyledPath + styledLayoutPath);
const destClientUtilsPath = resolve(destClientPath + utilsPath);
const destClientLayoutPath = resolve(destClientPath + layoutPath);
const destServerPath = path.join(destFolder, serverPath);
const destServerModulesPath = resolve(destServerPath + modulesPath);
const destServerApisPath = resolve(destServerPath + apisPath);
const destServerSqlPath = resolve(destServerPath + sqlPath);
const destServerUtilsPath = resolve(destServerPath + utilsPath);
const destPagesPath = path.join(destFolder, pagesPath);
const destPublicPath = path.join(destFolder, publicPath);
const destScriptsPath = path.join(destFolder, scriptsPath);
const destTypesPath = path.join(destFolder, typesPath);

const destClientUtilsMenuPath = resolve(destClientUtilsPath + utilsMenuPath);
const destClientReduxReducersAllPath = resolve(destClientReduxPath + reduxReducersPath);
const destPublicHealthCheckPath = resolve(destPublicPath + slbHealthCheckPath);
const destPackagePath = resolve(destFolder + packagePath);
const destServerRestPath = resolve(destServerPath + restPath);

export {
  sourceFolder,
  destFolder,
  isLocal,
  generationPath,
  clientPathSource,
  clientPath,
  serverPathSource,
  serverPath,
  pagesPathSource,
  pagesPath,
  publicPathSource,
  publicPath,
  scriptsPathSource,
  scriptsPath,
  typesPathSource,
  typesPath,
  reduxPath,
  servicePath,
  styledPath,
  styledLayoutPath,
  utilsPath,
  layoutPath,
  componentsPath,
  modulesPath,
  apisPath,
  sqlPath,
  utilsMenuPath,
  reduxReducersPath,
  slbHealthCheckPath,
  packagePath,
  restPath,
  sourceGenerationPath,
  sourceClientPath,
  sourceClientPathGeneration,
  sourceServerPath,
  sourceServerPathGeneration,
  sourcePagesPath,
  sourcePublicPath,
  sourceScriptsPath,
  sourceTypesPath,
  destClientPath,
  destClientReduxPath,
  destClientServicePath,
  destClientStyledPath,
  destClientStyledLayoutPath,
  destClientUtilsPath,
  destClientLayoutPath,
  destServerPath,
  destServerModulesPath,
  destServerApisPath,
  destServerSqlPath,
  destServerUtilsPath,
  destPagesPath,
  destPublicPath,
  destScriptsPath,
  destTypesPath,
  destClientUtilsMenuPath,
  destClientReduxReducersAllPath,
  destPublicHealthCheckPath,
  destPackagePath,
  destServerRestPath,
  mysqlUser,
  mysqlPassword,
  mysqlHost,
  mysqlPort,
  mysqlDatabase,
};
