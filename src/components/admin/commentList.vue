<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-select v-if="isBoss" v-model="pagination.type" placeholder="评论来源类型" style="margin-right: 10px">
        <el-option key="1" label="文章评论" value="article"></el-option>
        <el-option key="2" label="树洞留言" value="message"></el-option>
      </el-select>
      <el-input class="my-input" type="number" style="width: 140px;margin-right: 10px" v-model="pagination.source"
                placeholder="评论来源标识"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchComments()">搜索</el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
    </div>
    <el-table :data="comments" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="source" label="评论来源标识" align="center"></el-table-column>
      <el-table-column prop="type" label="评论来源类型" align="center"></el-table-column>
      <el-table-column prop="member.nickname" label="发表用户" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center"></el-table-column>
      <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
      <el-table-column prop="info" label="评论额外信息" align="center"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next"
                     :current-page="pagination.page"
                     :page-size="pagination.size"
                     :total="pagination.total"
                     @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        //isBoss: this.$store.state.currentAdmin.isBoss,
        isBoss: true,
        pagination: {
          page: 1,
          size: 10,
          total: 0,
          source: null,
          type: "",
          include: ["member"]
        },
        comments: []
      }
    },
    watch: {},
    created() {
      this.getComments();
    },
    methods: {
      clearSearch() {
        this.pagination = {
          page: 1,
          size: 10,
          total: 0,
          source: null,
          type: ""
        }
        this.getComments();
      },
      getComments() {
        this.$http.get(this.$constant.baseURL + "/web/comments", this.pagination, true)
          .then((res) => {
            if (!this.$common.isEmpty(res)) {
              this.comments = res.data;
              this.pagination.total = res.meta.total;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      handlePageChange(val) {
        this.pagination.page = val;
        this.getComments();
      },
      searchComments() {
        this.pagination.total = 0;
        this.pagination.page = 1;
        this.getComments();
      },
      handleDelete(item) {
        this.$confirm('删除评论后，所有该评论的回复均不可见。确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.delete(this.$constant.baseURL + "/web/comment/" + item.id)
            .then((res) => {
              this.pagination.page = 1;
              this.getComments();
              this.$message({
                message: "删除成功！",
                type: "success"
              });
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
      }
    }
  }
</script>

<style scoped>

  .pagination {
    margin: 20px 0;
    text-align: right;
  }

  .my-input >>> input::-webkit-inner-spin-button {
    appearance: none;
  }
</style>
