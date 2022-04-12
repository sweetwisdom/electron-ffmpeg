
import { ipcMain, app, dialog } from 'electron'
const spawn = require("cross-spawn");
// var spawn = require("child_process").spawn;
const child_process = require("child_process");
let fs = require("fs")

import { MERGE_CONFIG_TOOL_PATH, fileType, appPath, asarPath } from './const'

const os = require("os");


export function initIpc() {
    let lastChildProcess;

    // 开始写逻辑代码
    ipcMain.handle('selectDic', async (event, arg) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(
            {
                title: "请选择要导入的视频",
                properties: ['openDirectory']
            }

        )

        return filePaths[0] ? filePaths[0] + "\\" : ''


    })

    // 开始写逻辑代码
    ipcMain.handle('selectVidoeFiles', async (event, arg) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(
            {
                title: "请选择导出视频位置",
                properties: ["openFile", "multiSelections"],
                filters: [{
                    name: "视频格式", extensions: fileType
                }]
            }

        )

        return filePaths || []
    })
    ipcMain.handle("merge-merges", async (event, arg) => {
        return await new Promise((resolve, reject) => {

            if (lastChildProcess) {
                lastChildProcess.kill();
                lastChildProcess = null;
            }

            let cmd = "ffmpeg";
            let env = {
                ...process.env,
                PATH: "/usr/local/bin:" + child_process.execSync("echo $PATH").toString(),
            };
            function hasFile(path: string) {
                return fs.existsSync(path)

            }

            if (os.platform() == "win32") {
                cmd = MERGE_CONFIG_TOOL_PATH;

            }



            let cmder = ["-y", "-i", `concat:${arg.input}`, "-c", "copy", arg.output]
            if (arg.filetype == 'wmv' || arg.type == 'wmv' || arg.type == 'mp3') {
                // cmder = [ "-i", arg.input, '-threads',5,'-preset','ultrafast',arg.output]
                cmder = ["-i", arg.input, arg.output]
                // 判断文件是否存在
                // if (hasFile(arg.output)) {
                //     resolve({
                //         msg: '目标文件已存在,请手动删除', path: arg.output
                //     })

                //     return
                // }
            }
            lastChildProcess = spawn(cmd, cmder, {
                env: env,


            });

            lastChildProcess.stdout.on("data", (data) => {
                console.log('456');

                // event.reply("merge-merge-result", {
                //     type: "stdout",
                //     data: data.toString(),
                // });
            });
            lastChildProcess.stderr.on("data", (data) => {
                console.log('123');

                // event.reply("merge-merge-result", {
                //     type: "stderr",
                //     data: data.toString(),
                // });
            });
            lastChildProcess.on('close', () => {
                resolve(true)
                console.log('over');


            })
            lastChildProcess.on("error", (data) => {
                console.log(data.toString());
                resolve(false)
                // event.reply("merge-merge-result", {
                //     type: "err",
                //     data: data.toString(),
                // });
            });
        })

    });

    ipcMain.on("merge-merge", (event, arg) => {
        if (lastChildProcess) {
            lastChildProcess.kill();
            lastChildProcess = null;
        }

        let cmd = "ffmpeg";
        let env = {
            ...process.env,
            PATH: "/usr/local/bin:" + child_process.execSync("echo $PATH").toString(),
        };

        if (os.platform() == "win32") {
            cmd = MERGE_CONFIG_TOOL_PATH;
        }


        lastChildProcess = spawn(cmd, ["-y", "-i", `concat:${arg.input}`, "-c", "copy", arg.output], {
            env: env,
        });

        lastChildProcess.stdout.on("data", (data) => {
            event.reply("merge-merge-result", {
                type: "stdout",
                data: data.toString(),
            });
        });
        lastChildProcess.stderr.on("data", (data) => {
            event.reply("merge-merge-result", {
                type: "stderr",
                data: data.toString(),
            });
        });
        lastChildProcess.on("error", (data) => {
            console.log(data.toString());

            event.reply("merge-merge-result", {
                type: "err",
                data: data.toString(),
            });
        });
    });
    ipcMain.on('init', (event, arg) => {
        event.reply("merge-merge-result", {
            type: "path",
            data: MERGE_CONFIG_TOOL_PATH,
            appPath,
            asarPath


        });
    })

}