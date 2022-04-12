<template>
  <div>
    <el-form-item label-width="120px" label="输出文件格式">
      <el-radio-group v-model="title.type">
        <el-radio v-for="(item, i) in outFileType" :key="i" :label="item">{{ item }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label-width="120px" label="保存路径">
      <el-radio-group v-model="place" class="d-flex ai-center">
        <el-radio v-for="(item, i) in exprortPlace" :key="i" :label="item">{{ item }}</el-radio>
        <el-input v-if="place != '原始文件夹'" @click="setDic" v-model="title.output"> </el-input>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
  import { outFileType, exprortPlace, outPutDto, openUrl } from "../components/tool";
  import { reactive, toRefs, ref, onMounted, PropType, watchEffect } from "vue";

  const place = ref("原始文件夹");
  const { title } = defineProps({
    title: Object as PropType<outPutDto>,
    default: () => {
      return {
        type: "mp4",
        output: "",
      };
    },
  });
  function changePlace() {
    if (place.value == "原始文件夹") {
      title.output = "";
    } else {
      setDic();
    }
  }
  watchEffect(changePlace);
  async function setDic() {
    let res = await window.ipcRenderer.invoke("selectDic");
    //@ts-ignore
    title.output = res;
  }
  onMounted(() => {
    console.info("props------");
  });
  const state = reactive({
    count: 0,
  });
</script>
