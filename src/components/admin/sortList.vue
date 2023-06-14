<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="categoryDialog = true">新增分类</el-button>
    </div>
    <el-table :data="categories" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
      <el-table-column prop="description" label="分类描述" align="center"></el-table-column>
      <el-table-column label="分类类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">导航栏分类</span>
          <span v-else-if="scope.row.type === 1">普通分类</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="分类优先级" align="center"></el-table-column>
      <el-table-column prop="countOfSort" label="文章总数" align="center"></el-table-column>
      <el-table-column label="操作" width="380" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editCategory(scope.row)">
            编辑分类
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="sayLabel(scope.row)">
            查看标签
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="insertLabel(scope.row)">
            新增标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                     @click="deleteHandle(scope.row.id, 1)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="!$common.isEmpty(category)" :data="category.labels" border class="table"
              style="margin-top: 40px"
              header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column label="分类名称" align="center">
        <span>{{ category.name }}</span>
      </el-table-column>
      <el-table-column prop="name" label="标签名称" align="center"></el-table-column>
      <el-table-column prop="description" label="标签描述" align="center"></el-table-column>
      <el-table-column prop="countOfLabel" label="文章总数" align="center"></el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editLabel(scope.row)">
            编辑标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                     @click="deleteHandle(scope.row.id, 2)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分类"
               :visible.sync="categoryDialog"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="my-dialog">
        <div class="myCenter">
          <el-radio-group v-model="categoryForHttp.type">
            <el-radio-button :label="0">导航栏分类</el-radio-button>
            <el-radio-button :label="1">普通分类</el-radio-button>
          </el-radio-group>
        </div>
        <el-input placeholder="请输入分类名称" v-model="categoryForHttp.name">
          <template slot="prepend">分类名称</template>
        </el-input>
        <el-input placeholder="请输入分类描述" v-model="categoryForHttp.description">
          <template slot="prepend">分类描述</template>
        </el-input>
        <el-input type="number" placeholder="请输入整数，数字小的在前面"
                  v-model="categoryForHttp.priority">
          <template slot="prepend">分类优先级</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="saveEdit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="标签"
               :visible.sync="labelDialog"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="my-dialog">
        <el-input placeholder="请输入标签名称" v-model="labelForHttp.name">
          <template slot="prepend">标签名称</template>
        </el-input>
        <el-input placeholder="请输入标签描述" v-model="labelForHttp.description">
          <template slot="prepend">标签描述</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="saveLabelEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryDialog: false,
      labelDialog: false,
      categories: [],
      category: {},
      categoryForHttp: {
        id: null,
        name: "",
        description: "",
        type: null,
        priority: null
      },
      labelForHttp: {
        id: null,
        categoryId: null,
        name: "",
        description: ""
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getCategories();
  },
  methods: {
    deleteHandle(id, flag) {
      let url;
      if (flag === 1) {
        url = "/web/category/" + id;
      } else if (flag === 2) {
        url = "/web/label/" + id;
      } else {
        return;
      }
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(this.$constant.baseURL + url)
          .then((res) => {
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            this.getCategories();
            this.category = {};
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消删除!'
        });
      });
    },
    saveEdit() {
      if (this.$common.isEmpty(this.categoryForHttp.type) ||
        this.$common.isEmpty(this.categoryForHttp.priority) ||
        this.$common.isEmpty(this.categoryForHttp.name) ||
        this.$common.isEmpty(this.categoryForHttp.description)) {
        this.$message({
          message: "请完善所有分类信息！",
          type: "error"
        });
        return;
      }


      let httpMethod = null
      if (this.$common.isEmpty(this.categoryForHttp.id)) {
        httpMethod = this.$http.post(this.$constant.baseURL + "/web/category", this.categoryForHttp, true)
      } else {
        httpMethod = this.$http.patch(this.$constant.baseURL + "/web/category/" + this.categoryForHttp.id, this.categoryForHttp, true)
      }

      httpMethod.then((res) => {
        this.$message({
          message: "保存成功！",
          type: "success"
        });
        this.getCategories();
        this.handleClose();
      })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    saveLabelEdit() {
      if (this.$common.isEmpty(this.labelForHttp.name) ||
        this.$common.isEmpty(this.labelForHttp.description)) {
        this.$message({
          message: "请完善所有标签信息！",
          type: "error"
        });
        return;
      }

      let httpMethod = null
      if (this.$common.isEmpty(this.labelForHttp.id)) {
        httpMethod = this.$http.post(this.$constant.baseURL + "/web/label", this.labelForHttp, true)
      } else {
        httpMethod = this.$http.patch(this.$constant.baseURL + "/web/label/" + this.labelForHttp.id, this.labelForHttp, true)
      }

      httpMethod.then((res) => {
        this.$message({
          message: "保存成功！",
          type: "success"
        });
        this.getCategories();
        this.handleClose();
        this.category = {};
      })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    editCategory(category) {
      this.categoryDialog = true;
      this.categoryForHttp.id = category.id;
      this.categoryForHttp.name = category.name;
      this.categoryForHttp.description = category.description;
      this.categoryForHttp.type = category.type;
      this.categoryForHttp.priority = category.priority;
    },
    editLabel(label) {
      this.labelDialog = true;
      this.labelForHttp.id = label.id;
      this.labelForHttp.categoryId = label.categoryId;
      this.labelForHttp.name = label.name;
      this.labelForHttp.description = label.description;
    },
    insertLabel(category) {
      this.labelForHttp.categoryId = category.id;
      this.labelDialog = true;
    },
    handleClose() {
      this.labelForHttp = {
        id: null,
        categoryId: null,
        name: "",
        description: ""
      };
      this.categoryForHttp = {
        id: null,
        name: "",
        description: "",
        type: null,
        priority: null
      };
      this.categoryDialog = false;
      this.labelDialog = false;
    },
    sayLabel(category) {
      this.category = category;
    },
    getCategories() {
      this.$http.post(this.$constant.baseURL + "/web/categories")
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.categories = res.data;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    }
  }
}
</script>

<style scoped>

.my-dialog > div {
  margin: 12px;
}

.my-dialog >>> input::-webkit-inner-spin-button {
  appearance: none;
}
</style>
