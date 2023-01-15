<template>
  <div class="short-link">
    <div class="sl-top">
      <div>
        <span>路径查询：</span>
        <el-input
          v-model.trim="queryText"
          placeholder="请输入查询关键字"
          style="width: 200px"
          clearable
          @input="queryChangeDebounce"
        ></el-input>
      </div>
      <div>
        <el-button type="primary" @click="addShortLink">新增短链接</el-button>
      </div>
    </div>
    <el-table
      :data="tableData.list"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="shortLink" label="短链接路径" />
      <el-table-column prop="redirect" label="重定向 URL" />
      <el-table-column prop="createDate" label="创建时间" />\
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" text @click="editShortLink(scope.$index)">
            修改
          </el-button>
          <el-button type="primary" text @click="deleteShortLink(scope.$index)">
            删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-if="showEditDialog"
      v-model="showEditDialog"
      title="短链接配置"
      @close="form.isEdit = false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="shortLink" label="短链接">
          <el-input v-model="form.shortLink" />
        </el-form-item>
        <el-form-item prop="redirect" label="重定向地址">
          <el-input v-model="form.redirect" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button type="primary" @click="saveShortLink">保存</el-button>
          <el-button @click="showEditDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";
import type { FormRules } from "element-plus";
import axios from "@/utils/axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { debounce } from "lodash-es";
import { usePagination } from "@/composition/usePagination";

const queryText = ref("");
const queryChange = () => {
  // queryText.value
  console.log("queryChange", queryText.value);
  resetPage();
  getList();
};

const queryChangeDebounce = debounce(queryChange, 300);

const addShortLink = () => {
  console.log("addShortLink");
  showEditDialog.value = true;
  form.isEdit = false;
};

const loading = ref(false);
const getList = async () => {
  try {
    loading.value = true;
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep, test loading
    const res = await axios.get("/shortLink/list", {
      params: {
        queryText: queryText.value,
        currentPage: currentPage.value,
        pageSize: pageSize.value,
      },
    });
    console.log(res);
    tableData.total = res.data?.total || 0;
    tableData.list = res.data?.list || [];

    tableData.list = tableData.list.map((item: any) => {
      return item; // TODO: 处理数据
    });
    window.scrollTo(0, 0); // 分页后，滚动到顶部
  } catch (e) {
    console.error(e);
    ElMessage.error((e as Error).message);
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  getList();
});

const showEditDialog = ref(false);
const form = reactive({
  shortLink: "",
  redirect: "",
  isEdit: false,
});
const rules = reactive<FormRules>({
  shortLink: [
    { required: true, message: "请输入短链接", trigger: "change" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  redirect: [
    { required: true, message: "请输入重定向地址", trigger: "change" },
  ],
});

const formRef = ref();
const saveLoading = ref(false);
const saveShortLink = () => {
  console.log("saveShortLink", form);
  formRef.value.validate(async (valid: any) => {
    if (!valid) {
      return;
    }
    // rules 验证成
    console.log("submit!");
    try {
      saveLoading.value = true;
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep, test loading
      let apiLink = form.isEdit ? "/shortLink/edit" : "/shortLink/add";
      const res = await axios.post(apiLink, form);
      console.log(res);
      showEditDialog.value = false;
      ElMessage.success(form.isEdit ? "修改成功！" : "添加成功！");
      getList(); // 刷新列表
      Object.assign(form, {
        shortLink: "",
        redirect: "",
        isEdit: false,
      });
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error).message);
    } finally {
      saveLoading.value = false;
    }
  });
};

const editShortLink = (index: any) => {
  console.log("editShortLink", index);
  showEditDialog.value = true;
  Object.assign(form, { ...(tableData.list[index] || {}), isEdit: true });
};

const deleteShortLink = async (index: any) => {
  console.log("deleteShortLink", index);
  try {
    await ElMessageBox.confirm("您确认要删除该短链接配置吗？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep, test loading
      const res = await axios.post("/shortLink/del", {
        _id: tableData.list[index]?._id,
      });
      console.log(res);
      ElMessage.success("删除成功！");
      getList(); // 刷新列表
    } catch (e) {
      ElMessage.error((e as Error).message);
    }
  } catch (e) {
    console.log(e);
  }
};

const {
  currentPage,
  pageSize,
  tableData,
  handleSizeChange,
  handleCurrentChange,
  resetPage,
} = usePagination({
  sizeChange: () => getList(),
  currentChange: () => getList(),
});
</script>

<style lang="scss" scoped>
.sl-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
