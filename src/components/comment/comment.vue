<template>
  <div>
    <!-- 评论框 -->
    <div style="margin-bottom: 40px">
      <div class="comment-head">
        <i class="el-icon-edit-outline" style="font-weight: bold;font-size: 22px;"></i> 留言
      </div>
      <div>
        <!-- 文字评论 -->
        <div v-show="!isGraffiti">
          <commentBox @showGraffiti="isGraffiti = !isGraffiti"
                      @submitComment="submitComment">
          </commentBox>
        </div>
        <!-- 画笔 -->
        <!--        <div v-show="isGraffiti">-->
        <!--          <graffiti @showComment="isGraffiti = !isGraffiti"-->
        <!--                    @addGraffitiComment="addGraffitiComment">-->
        <!--          </graffiti>-->
        <!--        </div>-->
      </div>
    </div>

    <!-- 评论内容 -->
    <div v-if="comments.length > 0">
      <!-- 评论数量 -->
      <div class="commentInfo-title">
        <span style="font-size: 1.15rem">Comments | </span>
        <span>{{ total }} 条留言</span>
      </div>
      <!-- 评论详情 -->
      <div id="comment-content" class="commentInfo-detail"
           v-for="(item, index) in comments"
           :key="index">
        <!-- 头像 -->
        <el-avatar shape="square" class="commentInfo-avatar" :size="35" :src="item.member.avatar"></el-avatar>

        <div style="flex: 1;padding-left: 12px">
          <!-- 评论信息 -->
          <div style="display: flex;justify-content: space-between">
            <div>
              <span class="commentInfo-username">{{ item.member.nickname }}</span>
              <span class="commentInfo-master" v-if="item.member.id === member.id">主人翁</span>
              <span class="commentInfo-other">{{ $common.getDateDiff(item.createdAt) }}</span>
            </div>
            <div class="commentInfo-reply" @click="replyDialog(item)">
              <span v-if="item.children.length > 0">{{ item.children.length }} </span><span>回复</span>
            </div>
          </div>
          <!-- 评论内容 -->
          <div class="commentInfo-content">
            <span v-html="item.content"></span>
          </div>
          <!-- 回复模块 -->
          <div v-if="!$common.isEmpty(item.comments) && !$common.isEmpty(item.comments.data)">
            <div class="commentInfo-detail" v-for="(child, i) in item.comments.data" :key="i">
              <!-- 头像 -->
              <el-avatar shape="square" class="commentInfo-avatar" :size="30" :src="child.member.avatar"></el-avatar>

              <div style="flex: 1;padding-left: 12px">
                <!-- 评论信息 -->
                <div style="display: flex;justify-content: space-between">
                  <div>
                    <span class="commentInfo-username-small">{{ child.member.nickname }}</span>
                    <span class="commentInfo-master" v-if="child.member.id === member.id">主人翁</span>
                    <span class="commentInfo-other">{{ $common.getDateDiff(child.createdAt) }}</span>
                  </div>
                  <div>
                    <span class="commentInfo-reply" @click="replyDialog(item, child)">回复</span>
                  </div>
                </div>
                <!-- 评论内容 -->
                <div class="commentInfo-content">
                  <template v-if="
                  child.parent
                  && child.parent.id !== item.id
                  && child.parent.member.id !== child.member.id
                  ">
                    <span style="color: var(--blue)">@{{ child.parent.member.nickname }} </span>:
                  </template>
                  <span v-html="child.content"></span>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div class="pagination-wrap" v-if="item.comments.data.length < item.comments.total">
              <div class="pagination"
                   @click="toChildPage(item)">
                展开
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <proPage :page="pagination.page"
               :size="pagination.size"
               :total="pagination.total"
               :buttonSize="6"
               :color="$constant.commentPageColor"
               @toPage="toPage">
      </proPage>
    </div>

    <div v-else class="myCenter" style="color: var(--greyFont)">
      <i>来发第一个留言啦~</i>
    </div>

    <el-dialog title="留言"
               :visible.sync="replyDialogVisible"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitReply">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const graffiti = () => import( "./graffiti");
const commentBox = () => import( "./commentBox");
const proPage = () => import( "../common/proPage");

export default {
  components: {
    graffiti,
    commentBox,
    proPage
  },
  props: {
    source: {
      type: Number
    },
    type: {
      type: String
    },
    member: {
      type: Object
    }
  },
  data() {
    return {
      isGraffiti: false,
      total: 0,
      replyDialogVisible: false,
      original: {},
      parent: {},
      comments: [],
      pagination: {
        page: 1,
        size: 5,
        total: 0,
        source: this.source,
        type: this.type,
        commentId: 0,
        include: ["member", "parent", "children"]
      }
    };
  },

  computed: {},

  created() {
    this.getComments(this.pagination);
    this.getTotal();
  },
  methods: {
    toPage(page) {
      this.pagination.page = page;
      window.scrollTo({
        top: document.getElementById('comment-content').offsetTop
      });
      this.getComments(this.pagination);
    },
    getTotal() {
      this.$http.get(this.$constant.baseURL + "/web/comments/list", {source: this.source, type: this.type})
        .then((res) => {
          if (!this.$common.isEmpty(res)) {
            this.total = res.length;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    toChildPage(child) {
      child.comments.page += 1;
      this.pagination.page = child.comments.page
      this.pagination.commentId = child.id
      this.getComments(this.pagination, child, true);
    },
    emoji(comments, flag) {
      comments.forEach(c => {
        c.content = c.content.replace(/\n/g, '<br/>');
        c.content = this.$common.faceReg(c.content);
        c.content = this.$common.pictureReg(c.content);
        if (flag) {
          // 如果下级评论存在则对该评论添加 comments 属性
          if (!this.$common.isEmpty(c.children) && c.children.length > 0) {
            if (c.children.length > 5) {
              this.pagination.commentId = c.id
              this.getComments(this.pagination, c, true)
            } else {
              c.comments = {
                data: c.children,
                page: 1,
                total: c.children.length
              }
              this.emoji(c.comments.data, false)
            }
          }
        }
      });
    },
    getComments(pagination, children = {}, isToPage = false) {
      this.$http.get(this.$constant.baseURL + "/web/comments", pagination)
        .then((res) => {
          if (!this.$common.isEmpty(res) && !this.$common.isEmpty(res.data)) {
            if (this.$common.isEmpty(children)) {
              this.comments = res.data;
              pagination.total = res.meta.total;
              this.emoji(this.comments, true);
            } else {
              children.comments = children.comments ? children.comments : this.$set(children,'comments',{data: [], records: []})
              if (isToPage === false) {
                children.comments.records = res.data;
              } else {
                children.comments.records = children.comments.records.concat(res.data);
              }
              // 深拷贝records 到 data 中,true - 深拷贝, false - 浅拷贝
              children.comments.data = $.extend(true,[], children.comments.records)
              children.comments.total = res.meta.total;
              children.comments.page = res.meta.current_page;
              this.emoji(children.comments.data, false);
            }
          }
          this.clearPagination()
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    addGraffitiComment(graffitiComment) {
      this.submitComment(graffitiComment);
    },
    submitComment(content) {
      let comment = {
        source: this.source,
        type: this.type,
        content: content
      };

      this.$http.post(this.$constant.baseURL + "/web/comment", comment)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '保存成功！'
          });
          this.getComments(this.pagination);
          this.getTotal();
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    submitReply(content) {
      let comment = {
        source: this.source,
        type: this.type,
        content: content,
        commentId: this.original.id,
        parentId: this.parent ? this.parent.id : 0,
      };

      let currentComment = {}
      for(let c of this.comments) {
        if(c.id === this.original.id) {
          currentComment = c;
        }
      }

      this.$http.post(this.$constant.baseURL + "/web/comment", comment)
        .then((res) => {
          this.pagination.commentId = currentComment.id
          this.getComments(this.pagination, currentComment);
          console.log(currentComment.comments)
          this.getTotal();
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
      this.handleClose();
    },
    replyDialog(comment, parent = null) {
      this.original = comment;
      this.parent = parent;
      this.replyDialogVisible = true;
    },
    handleClose() {
      this.replyDialogVisible = false;
      this.original = {};
      this.parent = {};
    },
    clearPagination() {
      this.pagination = {
        page: 1,
        size: 5,
        total: 0,
        source: this.source,
        type: this.type,
        commentId: 0,
        include: ["member", "parent", "children"]
      }
    }
  }
}
</script>

<style scoped>

.comment-head {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin: 40px 0 20px 0;
  user-select: none;
  color: var(--themeBackground);
}

.commentInfo-title {
  margin-bottom: 20px;
  color: var(--greyFont);
  user-select: none;
}

.commentInfo-detail {
  display: flex;
}

.commentInfo-avatar {
  border-radius: 5px;
}

.commentInfo-username {
  color: var(--orangeRed);
  font-size: 16px;
  font-weight: 600;
  margin-right: 5px;
}

.commentInfo-username-small {
  color: var(--orangeRed);
  font-size: 14px;
  font-weight: 600;
  margin-right: 5px;
}

.commentInfo-master {
  color: var(--green);
  border: 1px solid var(--green);
  border-radius: 0.2rem;
  font-size: 12px;
  padding: 2px 4px;
  margin-right: 5px;
}

.commentInfo-other {
  font-size: 12px;
  color: var(--greyFont);
  user-select: none;
}

.commentInfo-reply {
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  color: var(--white);
  background: var(--themeBackground);
  border-radius: 0.2rem;
  padding: 3px 6px;
}

.commentInfo-content {
  margin: 15px 0 25px;
  padding: 18px 20px;
  background: var(--content);
  border-radius: 12px;
  color: var(--black);
  word-break: break-word;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.pagination {
  padding: 6px 20px;
  border: 1px solid var(--lightGray);
  border-radius: 3rem;
  color: var(--greyFont);
  user-select: none;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
}

.pagination:hover {
  border: 1px solid var(--themeBackground);
  color: var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}
</style>
