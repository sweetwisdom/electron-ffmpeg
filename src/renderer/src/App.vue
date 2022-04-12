<template>
  <div class="p-2">
    <el-form :disabled="isLoading">
      <el-form-item style="height: 40px" class="d-flex ai-center">
        <el-button v-for="(item, i) in workList" :key="i" :icon="item.icon" :onclick="item.work">
          {{ item.name }}
        </el-button>
      </el-form-item>
    </el-form>
    <file-area ref="fileChild"></file-area>

    <footers v-model:title="pageTitle"></footers>
  </div>
</template>

<script lang="ts" setup>
  import footers from "./components/footer.vue";
  import fileArea from "./components/fileArea.vue";
  import { DocumentAdd, Brush, MagicStick, Message, Star, Delete } from "@element-plus/icons-vue";
  import { computed, getCurrentInstance, onMounted, ref, watchEffect } from "vue";
  import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
  import { fileListDto, openPath } from "./components/tool";
  import { type } from "process";

  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const ipcRenderer = window.ipcRenderer;
  const isLoading = ref(false);
  const pageTitle = ref({
    type: "mp4",
    output: "",
  });

  function sgg() {
    fileChild.value.isDrop();
  }
  function removeAll() {
    console.log("111222");

    proxy
      .$confirm("确定要清空文件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        fileChild.value.removeAll();
      })
      .catch(() => {});
  }
  async function beginStart() {
    // console.log("pageTitle", pageTitle.value);
    let fileList: Array<fileListDto> = fileChild.value.fileList;
    console.log(fileList);
    isLoading.value = true;
    for (let index = 0; index < fileList.length; index++) {
      let el = fileList[index];
      let { path, name, filetype, status } = fileList[index];
      el.status = 1;
      let outpath = (pageTitle.value.output ? pageTitle.value.output : path.substring(0, path.indexOf(name))) + name + "." + pageTitle.value.type;
      let info = {
        input: path,
        filetype,
        type: pageTitle.value.type,
        output: outpath,
      };
      if (filetype == pageTitle.value.type) {
        el.status = 2;
        continue;
      }
      let res = await window.ipcRenderer.invoke("merge-merges", info).catch((err) => {
        console.log(err);
      });
      if (res) {
        el.status = 2;
        el.outpath = outpath;
      }
      if (res.msg) {
        console.log(res.msg);
        ElNotification({
          title: res.msg,
          message: res.path || "",
          type: "error",
        });
      }

      //   setTimeout(() => {
      //     el.status = 2;
      //   }, 1000);
      console.log(info);
    }
    isLoading.value = false;
    if (pageTitle.value.output) {
      openPath(pageTitle.value.output);
    }

    // fileList.forEach(({ path, name, filetype, status }) => {
    //   status = 1;
    //   let info = {
    //     input: path,
    //     output: (pageTitle.value.output ? pageTitle.value.output : path.substring(0, path.indexOf(name))) + name + "." + pageTitle.value.type,
    //   };
    //   setTimeout(() => {
    //     status = 2;
    //   }, 1000);
    //   console.log(info);
    // });
    //  开始转换文件

    // let aa = {
    //   input: "",
    //   output: "",
    // };
    // console.log(aa);
    // ipcRenderer.send("merge-merge", aa);
  }

  let fileChild = ref();

  async function OpenVideoDir() {
    let res = await window.ipcRenderer.invoke("selectVidoeFiles");
    let fileList: Array<fileListDto>;
    console.log(res, fileList);
    if (res.length == 0) {
      return;
    }
    function getPath(path: string) {
      let length = path.lastIndexOf("\\") + 1;

      let tem = path.substring(length, path.length);
      tem = tem.split(".");
      return { name: tem[0], filetype: tem[1] };
    }
    fileList = res.map((e, key) => {
      return {
        ...getPath(e),
        path: e,
        id: key,
        status: 0,
      };
    });
    //
    // 父调用字方法
    fileChild.value.changeFile(fileList);
    //  = fileChild.value.fileList
    console.log(fileList);
  }

  const workList = [
    {
      name: "添加文件",
      work: OpenVideoDir,
      icon: DocumentAdd,
      type: "",
    },
    {
      name: "清空文件",
      work: removeAll,
      icon: Brush,
      type: "",
    },
    {
      name: "开始转换",
      work: beginStart,
      icon: MagicStick,
      type: "",
    },
  ];

  onMounted(() => {
    console.log(fileChild.value, "页面启动了");
    ipcRenderer.send("init");

    ipcRenderer.on("merge-merge-result", (event, arg) => {
      console.log(arg);
      if (arg.type == "err") {
        console.log("转换失败");
      }
    });
  });
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>
