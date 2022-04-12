export const fileType = ["mp4", "flv", "ts", "mkv", "avi", "wmv"]
export const outFileType = ["mp4", "flv", "ts", "mkv", "avi", "wmv", 'mp3']
// "m3u8"
export const exprortPlace = ["原始文件夹", "自定义文件夹"]
/**
 * 打开本地文件
 * @param path 
 */
export function openPath(path: string) {
    // @ts-ignore
    window.shell.openPath(path)

}

export function openUrl(path: string) {
    // @ts-ignore
    window.shell.openExternal(path)

}

export interface outPutDto {
    type: string,
    output: string,
}

export interface fileListDto {
outpath: string
    name: string,
    path: string,
    id: string,
    status: number,
    filetype: string,
}