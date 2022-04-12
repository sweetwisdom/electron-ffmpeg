<template>
  <div class="p-2">
    <div :class="['fileArea', { showFileDrops: showFileDrop }]">
      <!-- 表格 -->
      <el-table tooltip-effect="dark" height="calc(100vh - 250px - 1rem)" style="width: 100%" :data="fileList" stripe>
        <template #empty>
          <p>请将文件拖拽到此处</p>
        </template>
        <el-table-column type="index" label="编号" align="center"> </el-table-column>
        <el-table-column show-overflow-tooltip prop="path" label="文件路径"> </el-table-column>
        <el-table-column label="操作" width="320px">
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
      </el-table>
    </div>
  </div>
  <!-- 文件选择区域 -->
</template>

<script lang="ts" setup>

  import { onMounted, ref } from "vue";
  import { openPath } from "./tool";
  const SUPORT_INPUT_EXT = ["ts", "mp4", "mov", "avi", "mkv"];

  const showFileDrop = ref(false);
  const fileList = ref([]);

  function init() {
    console.log("页面启动了");
    dropFile();
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
      console.log(dropfiles);
      // @ts-ignore
      fileList.value = dropfiles.map((item, key) => ({
        // @ts-ignore
        
        path: item.path,
        id: key,
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
  defineExpose({
    isDrop,
    init,
    removeAll,
    fileList,
  });
  onMounted(init);
</script>

<style scoped>
  .fileArea {
    background: #f5f5f5;

    border-radius: 30px !important;
  }
  .showFileDrops {
    background-color: cornsilk;
    box-shadow: 10px 10px 19px 10px #d0d0d0, -10px -10px 19px #fff;
  }
</style>
