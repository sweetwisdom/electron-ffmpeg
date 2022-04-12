<template>
  <div class="p-2">
    <!-- <el-button @click="beginStart"> sasdas</el-button> -->
    <div :class="['fileArea', { showFileDrops: showFileDrop }]">
      <!-- 表格 -->
      <el-table tooltip-effect="dark" height="calc(100vh - 230px - 1rem)" style="width: 100%" :row-class-name="tableRowClassName" :data="fileList">
        <template #empty>
          <p>请将文件拖拽到此处</p>
          <div class="text-center">特别鸣谢:vue3 + vite + element-plus <el-button type="text" @click="openUrl('https://www.bilibili.com/video/BV1TR4y137ZX')"> 使用说明</el-button> <el-button type="text" @click="openUrl('https://space.bilibili.com/329962610')"> 关于我</el-button></div>
        </template>

        <el-table-column type="index" width="80px" label="编号" align="center"> </el-table-column>

        <el-table-column show-overflow-tooltip prop="name" label="文件名称"> </el-table-column>
        <el-table-column label="类型" width="120px" prop="filetype" align="center"> </el-table-column>

        <el-table-column label="操作" width="180px">
          <template #default="{ row, $index }">
            <el-button type="text" @click="openPath(row.path)"> 📂 </el-button>
            <el-button type="text" @click="moveUp($index)"> ⬆️ </el-button>
            <el-button type="text" @click="moveDown($index)"> ⬇️ </el-button>

            <el-popconfirm @confirm="deleteFile($index)" title="确定要删除此项吗?">
              <template #reference>
                <el-button type="text">🗑️</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" width="200px" label="状态">
          <template #default="{ row }">
            <el-button v-if="row.status == 2" type="text" @click="openPath(row.outpath)"> <span>转换完成</span> ✅</el-button>
            <span v-else type="text" :loading="row.status == 1">{{ filText(row.status) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- 文件选择区域 -->
</template>

<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { openPath, fileType as SUPORT_INPUT_EXT, openUrl } from "./tool";
  //   const SUPORT_INPUT_EXT = ["ts", "mp4", "mov", "avi", "mkv"];

  const showFileDrop = ref(false);
  const fileList = ref([]);

  function init() {
    console.log("页面启动了");
    dropFile();
  }
  // 过滤文字
  function filText(val) {
    return ["待转换", "转换中", "转换完毕"][val];
  }
  function tableRowClassName({ row }) {
    if (row.status === 1) {
      return "working-row";
    } else if (row.status === 2) {
      return "success-row";
    }
    return "";
  }
  //   拖动文件
  function dropFile() {
    window.addEventListener(
      "dragenter",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        showFileDrop.value = true;
      },
      false
    );
    window.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showFileDrop.value = false;
      if (!e.dataTransfer) {
        return;
      }
      const dropfiles = [];
      console.log(e.dataTransfer.items);
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        let item = e.dataTransfer.items[i];
        if (item.kind === "file") {
          // @ts-ignore
          let filename = item.getAsFile().name;
          let ext = filename.substr(filename.lastIndexOf(".") + 1);
          console.log(ext);

          //   debugger;
          //   视频格式
          SUPORT_INPUT_EXT.includes(ext) && dropfiles.push(item.getAsFile());
        }
      }

      // @ts-ignore
      fileList.value = dropfiles.map((item, key) => ({
        // @ts-ignore
        name: item.name.split(".")[0],
        path: item.path,
        id: key,
        status: 0, // 0 代处理  1 进行中  2 已完成
        filetype: item.name.split(".")[1],
      }));

      console.log(fileList.value);

      // 设置编码格式
    });
    window.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  }
  function isDrop() {
    showFileDrop.value = !showFileDrop.value;
    //  打开目录
    // window.shell.openPath("D:\\phpstudy_pro\\WWW");
  }
  /**
   * 删除文件
   */
  function deleteFile(id: any) {
    let fileLists: Array<any> = fileList.value;
    fileLists.splice(id, 1);
  }
  /**
   * 上移
   */
  function moveUp(index: number) {
    let fileLists: Array<any> = fileList.value;
    if (index != 0) {
      fileLists[index] = fileLists.splice(index - 1, 1, fileLists[index])[0];
    } else {
      fileLists.push(fileLists.shift());
    }
  }
  /**
   * 下移
   */
  function moveDown(index: number) {
    let fileLists: Array<any> = fileList.value;
    if (index != fileLists.length - 1) {
      fileLists[index] = fileLists.splice(index + 1, 1, fileLists[index])[0];
    } else {
      fileLists.unshift(fileLists.splice(index, 1)[0]);
    }
  }
  function removeAll() {
    fileList.value = [];
  }
  function changeFile(fileLIst) {
    fileList.value = fileLIst;
  }
  defineExpose({
    isDrop,
    init,
    removeAll,
    fileList,
    changeFile,
  });
  onMounted(init);
</script>

<style>
  .fileArea {
    background: #f5f5f5;

    border-radius: 30px !important;
  }
  .showFileDrops {
    background-color: cornsilk;
    box-shadow: 10px 10px 19px 10px #d0d0d0, -10px -10px 19px #fff;
  }
  .el-table .working-row {
    /* --el-table-tr-bg-color: #41a6ee5b; */
    background-size: 25px 25px;
    /* color: white; */
    background-image: linear-gradient(135deg, #30b1fc3a 0%, #30b1fc3a 25%, white 25%, white 50%, #30b1fc3a 50%, #30b1fc3a 75%, white 75%, white 100%);

    animation: move 0.3s linear infinite;
  }
  .el-table .success-row {
    --el-table-tr-bg-color: #12d06863;
  }
  @keyframes move {
    0% {
    }
    100% {
      background-position: 60px 0;
    }
  }
</style>
