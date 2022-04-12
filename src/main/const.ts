const path = require("path");
const { app } = require("electron");

export const appPath = app.getAppPath();


export const asarPath =
    appPath.indexOf("app.asar") > -1
        ? appPath.substring(0, appPath.indexOf("app.asar"))
        : appPath;


const isDevelopment = process.env.NODE_ENV !== "production";
export let MERGE_CONFIG_TOOL_PATH = path.join(appPath, isDevelopment ? "./public/tool.exe" : "../public/tool.exe")
export let MERGE_CONFIG_ICO = path.join(asarPath, "./public/icon/32.ico")
export const fileType = ["mp4", "flv", "ts", "mkv", "avi", "wmv"]