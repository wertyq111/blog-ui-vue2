<template>
  <div>
    <!-- 登陆和注册 -->
    <div v-if="$common.isEmpty(currentMember)"
         class="myCenter in-up-container my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                lazy
                :src="$constant.two_poem_image[Math.floor(Math.random() * $constant.two_poem_image.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="in-up" id="loginAndRegist">
        <div class="form-container sign-up-container">
          <div class="myCenter">
            <h1>注册</h1>
            <input v-model="username" type="text" maxlength="30" placeholder="用户名">
            <input v-model="password" type="password" maxlength="30" placeholder="密码">
            <input v-model="phone" type="email" placeholder="手机号">
            <input v-model="code" type="text" placeholder="验证码">
            <a style="margin: 0" href="#" @click="changeDialog('手机验证码')">获取验证码</a>
            <button @click="regist()">注册</button>
          </div>
        </div>
        <div class="form-container sign-in-container">
          <div class="myCenter">
            <h1>登录</h1>
            <input v-model="username" type="text" placeholder="用户名/邮箱/手机号">
            <input v-model="password" type="password" placeholder="密码">
            <a href="#" @click="changeDialog('找回密码')">忘记密码？</a>
            <button @click="login()">登录</button>
          </div>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel myCenter overlay-left">
              <h1>已有帐号？</h1>
              <p>请登录🚀</p>
              <button class="ghost" @click="signIn()">登录</button>
            </div>
            <div class="overlay-panel myCenter overlay-right">
              <h1>没有帐号？</h1>
              <p>立即注册吧😃</p>
              <button class="ghost" @click="signUp()">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div v-else class="user-container myCenter my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                lazy
                :src="$constant.two_poem_image[Math.floor(Math.random() * $constant.two_poem_image.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="shadow-box-mini user-info" style="display: flex">
        <div class="user-left">
          <div>
            <el-avatar class="user-avatar" @click.native="changeDialog('修改头像')" :size="60"
                       :src="currentMember.avatar"></el-avatar>
          </div>
          <div class="myCenter" style="margin-top: 12px">
            <div class="user-title">
              <div>用户名：</div>
              <div>手机号：</div>
              <div>邮箱：</div>
              <div>性别：</div>
              <div>简介：</div>
            </div>
            <div class="user-content">
              <div>
                <el-input maxlength="30" v-model="currentMember.nickname"></el-input>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentMember.phone)">
                  {{ currentMember.phone }} <span class="changeInfo"
                                                @click="changeDialog('修改手机号')">修改（功能未接入）</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定手机号')">绑定手机号（功能未接入）</span>
                </div>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentMember.email)">
                  {{ currentMember.email }} <span class="changeInfo" @click="changeDialog('修改邮箱')">修改</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定邮箱')">绑定邮箱</span></div>
              </div>
              <div>
                <el-radio-group v-model="currentMember.gender">
                  <el-radio :label="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                  <el-radio :label="1" style="margin-right: 10px">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-input v-model="currentMember.intro"
                          maxlength="300"
                          :rows="3"
                          type="textarea"
                          show-word-limit>
                </el-input>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px">
            <proButton :info="'提交'"
                       @click.native="submitUserInfo()"
                       :before="$constant.before_color_2"
                       :after="$constant.after_color_2">
            </proButton>
          </div>
        </div>
        <div class="user-right">

        </div>
      </div>
    </div>


    <el-dialog :title="dialogTitle"
               :visible.sync="showDialog"
               width="30%"
               :before-close="clearDialog"
               :append-to-body="true"
               :close-on-click-modal="false"
               center>
      <div class="myCenter" style="flex-direction: column">
        <div>
          <div v-if="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号'">
            <div style="margin-bottom: 5px">手机号：</div>
            <el-input v-model="phone"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱'">
            <div style="margin-bottom: 5px">邮箱：</div>
            <el-input v-model="email"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改头像'">
            <uploadPicture :prefix="'userAvatar'" @addPicture="addPicture" :maxSize="1"
                           :maxNumber="1"></uploadPicture>
          </div>
          <div v-else-if="dialogTitle === '找回密码'">
            <div class="myCenter" style="margin-bottom: 12px">
              <el-radio-group v-model="passwordFlag">
                <el-radio :label="1" style="margin-right: 10px">手机号</el-radio>
                <el-radio :label="2">邮箱</el-radio>
              </el-radio-group>
            </div>
            <div v-if="passwordFlag === 1">
              <div style="margin-bottom: 5px">手机号：</div>
              <el-input v-model="phone"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input maxlength="30" v-model="password"></el-input>
            </div>
            <div v-else-if="passwordFlag === 2">
              <div style="margin-bottom: 5px">邮箱：</div>
              <el-input v-model="email"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input maxlength="30" v-model="password"></el-input>
            </div>
          </div>
          <div v-else-if="dialogTitle === '手机验证码'">
              <div style="margin-bottom: 5px">手机号： {{ phone }}</div>
              <div style="margin-top: 10px;margin-bottom: 5px">
                验证码： <el-input class="register-input" v-model="captcha_code"/>
                <img :src="captcha" alt="" class="register-captcha" @click="changeCode"/>
              </div>
          </div>
        </div>
        <div style="display: flex;margin-top: 30px" v-if="dialogTitle === '手机验证码'">
          <proButton :info="codeString"
                     @click.native="getPhoneCode()"
                     :before="$constant.before_color_1"
                     :after="$constant.after_color_1"
                     style="margin-right: 20px">
          </proButton>
        </div>

        <div style="display: flex;margin-top: 30px" v-else-if="dialogTitle !== '修改头像'">
          <proButton :info="'提交'"
                     @click.native="submitDialog()"
                     :before="$constant.before_color_2"
                     :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const proButton = () => import( "./common/proButton");
const uploadPicture = () => import( "./common/uploadPicture");

export default {
  components: {
    proButton,
    uploadPicture
  },
  data() {
    return {
      currentMember: this.$store.state.currentMember,
      username: "",
      password: "",
      phone: "",
      email: "",
      avatar: "",
      showDialog: false,
      // 手机验证码key
      mobile_key: "",
      code: "",
      dialogTitle: "",
      codeString: "获取手机验证码",
      passwordFlag: null,
      intervalCode: null,
      // 验证码base64数据
      captcha: "",
      // 验证码key
      captcha_key: "",
      // 验证码 code
      captcha_code: "",
    }
  },
  computed: {},
  mounted() {
    this.changeCode()
  },
  methods: {
    /* 更换图形验证码 */
    changeCode() {
      if(this.phone) {
        // 这里演示的验证码是后端返回base64格式的形式, 如果后端地址直接是图片请参考忘记密码页面
        this.$http.post('/captcha', {'phone': this.phone}).then(res => {
          console.log(res)
          if (res) {
            this.captcha = res.captcha_image_content
            this.captcha_key = res.captcha_key
          } else {
            this.$message.error(res.message)
          }
        }).catch((e) => {
          let errorResponse = e.response.data
          this.$message.error(errorResponse.message);
        });
      }
    },
    addPicture(res) {
      this.avatar = res;
      this.submitDialog()
    },
    signUp() {
      document.querySelector("#loginAndRegist").classList.add('right-panel-active');
    },
    signIn() {
      document.querySelector("#loginAndRegist").classList.remove('right-panel-active');
    },
    login() {
      if (this.$common.isEmpty(this.username) || this.$common.isEmpty(this.password)) {
        this.$message({
          message: "请输入账号或密码！",
          type: "error"
        });
        return;
      }

      let user = {
        username: this.username.trim(),
        password: this.password.trim()
      };
      console.log(user)

      this.$http.post(this.$constant.baseURL + "/user/login", user, false, false)
        .then((res) => {
          if (!this.$common.isEmpty(res)) {
            this.$store.commit("loadCurrentMember", res.member);
            localStorage.setItem("userToken", res.accessToken);
            this.username = "";
            this.password = "";
            this.$router.push({path: '/'});
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    regist() {
      if (this.$common.isEmpty(this.username) || this.$common.isEmpty(this.password)) {
        this.$message({
          message: "请输入用户名或密码！",
          type: "error"
        });
        return;
      }

      if (this.dialogTitle === "邮箱验证码" && this.$common.isEmpty(this.email)) {
        this.$message({
          message: "请输入邮箱！",
          type: "error"
        });
        return false;
      }

      if (this.$common.isEmpty(this.code)) {
        this.$message({
          message: "请输入验证码！",
          type: "error"
        });
        return;
      }

      if (this.username.indexOf(" ") !== -1 || this.password.indexOf(" ") !== -1) {
        this.$message({
          message: "用户名或密码不能包含空格！",
          type: "error"
        });
        return;
      }

      let user = {
        username: this.username.trim(),
        verification_code: this.code.trim(),
        verification_key: this.mobile_key.trim(),
        password: this.password.trim()
      };

      if (this.dialogTitle === "手机验证码") {
        user.phone = this.phone;
      }

      this.$http.post(this.$constant.baseURL + "/user/register", user)
        .then((res) => {
          if (!this.$common.isEmpty(res)) {
            this.$message({
              message: "注册成功",
              type: "success"
            });
            this.$store.commit("loadCurrentMember", res.member);
            localStorage.setItem("userToken", res.accessToken);
            this.username = "";
            this.password = "";
            this.$router.push({path: '/'});
            let userToken = this.$common.encrypt(localStorage.getItem("userToken"));
            window.open(this.$constant.imBaseURL + "?userToken=" + userToken);
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    submitUserInfo() {
      if (!this.checkParameters()) {
        return;
      }

      let user = {
        username: this.currentMember.username,
        gender: this.currentMember.gender
      };

      if (!this.$common.isEmpty(this.currentMember.introduction)) {
        user.introduction = this.currentMember.introduction.trim();
      }

      this.$confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        this.$http.post(this.$constant.baseURL + "/user/updateUserInfo", user)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.$store.commit("loadCurrentMember", res);
              this.currentMember = this.$store.state.currentMember;
              this.$message({
                message: "修改成功！",
                type: "success"
              });
            }
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
          message: '已取消保存!'
        });
      });
    },
    checkParams(params) {
      if (this.dialogTitle === "修改手机号" || this.dialogTitle === "绑定手机号" || (this.dialogTitle === "找回密码" && this.passwordFlag === 1)) {
        params.flag = 1;
        if (this.$common.isEmpty(this.phone)) {
          this.$message({
            message: "请输入手机号！",
            type: "error"
          });
          return false;
        }
        if (!(/^1[345789]\d{9}$/.test(this.phone))) {
          this.$message({
            message: "手机号格式有误！",
            type: "error"
          });
          return false;
        }
        params.place = this.phone;
        return true;
      } else if (this.dialogTitle === "修改邮箱" || this.dialogTitle === "绑定邮箱" || this.dialogTitle === "邮箱验证码" || (this.dialogTitle === "找回密码" && this.passwordFlag === 2)) {
        params.flag = 2;
        if (this.$common.isEmpty(this.email)) {
          this.$message({
            message: "请输入邮箱！",
            type: "error"
          });
          return false;
        }
        if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(this.email))) {
          this.$message({
            message: "邮箱格式有误！",
            type: "error"
          });
          return false;
        }
        params.place = this.email;
        return true;
      }
      return false;
    },
    checkParameters() {
      if (this.$common.isEmpty(this.currentMember.username)) {
        this.$message({
          message: "请输入用户名！",
          type: "error"
        });
        return false;
      }

      if (this.currentMember.username.indexOf(" ") !== -1) {
        this.$message({
          message: "用户名不能包含空格！",
          type: "error"
        });
        return false;
      }
      return true;
    },
    changeDialog(value) {
      if (value === "手机验证码") {
        if (this.$common.isEmpty(this.phone)) {
          this.$message({
            message: "请输入手机号！",
            type: "error"
          });
          return false;
        }
        // 邮箱验证
        // if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(this.email))) {
        //   this.$message({
        //     message: "邮箱格式有误！",
        //     type: "error"
        //   });
        //   return false;
        // }

        // 手机号验证
        if (!(/^1[3456789]\d{9}$/).test(this.phone)) {
          this.$message({
            message: "手机号码无效!",
            type: "error"
          });
          return false;
        }
      }

      this.dialogTitle = value;
      this.showDialog = true;
    },
    submitDialog() {
      if (this.dialogTitle === "修改头像") {
        if (this.$common.isEmpty(this.avatar)) {
          this.$message({
            message: "请上传头像！",
            type: "error"
          });
        } else {
          let user = {
            avatar: this.avatar.trim()
          };

          this.$http.post(this.$constant.baseURL + "/member/avatar", user)
            .then((res) => {
              if (!this.$common.isEmpty(res)) {
                this.$store.commit("loadCurrentMember", res);
                this.currentMember = this.$store.state.currentMember;
                this.clearDialog();
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
              }
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }
      } else if (this.dialogTitle === "修改手机号" || this.dialogTitle === "绑定手机号" || this.dialogTitle === "修改邮箱" || this.dialogTitle === "绑定邮箱") {
        this.updateSecretInfo();
      } else if (this.dialogTitle === "找回密码") {
        if (this.passwordFlag !== 1 && this.passwordFlag !== 2) {
          this.$message({
            message: "请选择找回方式！",
            type: "error"
          });
        } else {
          this.updateSecretInfo();
        }
      } else if (this.dialogTitle === "手机验证码") {
        this.showDialog = false;
      }
    },
    updateSecretInfo() {
      if (this.$common.isEmpty(this.code)) {
        this.$message({
          message: "请输入验证码！",
          type: "error"
        });
        return;
      }
      if (this.$common.isEmpty(this.password)) {
        this.$message({
          message: "请输入密码！",
          type: "error"
        });
        return;
      }
      let params = {
        code: this.code.trim(),
        password: this.$common.encrypt(this.password.trim())
      };
      if (!this.checkParams(params)) {
        return;
      }

      if (this.dialogTitle === "找回密码") {
        this.$http.post(this.$constant.baseURL + "/user/updateForForgetPassword", params, false, false)
          .then((res) => {
            this.clearDialog();
            this.$message({
              message: "修改成功，请重新登陆！",
              type: "success"
            });
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      } else {
        this.$http.post(this.$constant.baseURL + "/user/updateSecretInfo", params, false, false)
          .then((res) => {
            if (!this.$common.isEmpty(res)) {
              this.$store.commit("loadCurrentMember", res);
              this.currentMember = this.$store.state.currentMember;
              this.clearDialog();
              this.$message({
                message: "修改成功！",
                type: "success"
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }
    },
    getPhoneCode() {
      if (this.dialogTitle === "手机验证码") {
        // 获取验证码
        let params = {
          'captcha_key': this.captcha_key,
          'captcha_code': this.captcha_code
        };
        if (this.$common.isEmpty(this.captcha_code)) {
          this.$message({
            message: "图片验证码不能为空!",
            type: "error"
          });
          return false;
        }

        let url;
        if (this.dialogTitle === "找回密码" || this.dialogTitle === "手机验证码") {
          url = "/verification-code/send";
        }

        console.log(params)

        this.$http.post(this.$constant.baseURL + url, params)
          .then((res) => {
            console.log(res)
            this.mobile_key = res.key
            this.$message({
              message: "验证码已发送，请注意查收！",
              type: "success"
            });
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
        this.codeString = "30";
        this.intervalCode = setInterval(() => {
          if (this.codeString === "0") {
            clearInterval(this.intervalCode)
            this.codeString = "验证码";
          } else {
            this.codeString = (parseInt(this.codeString) - 1) + "";
          }
        }, 1000);
      } else {
        this.$message({
          message: "请稍后再试！",
          type: "warning"
        });
      }
    },
    clearDialog() {
      this.password = "";
      this.phone = "";
      this.email = "";
      this.avatar = "";
      this.showDialog = false;
      this.code = "";
      this.dialogTitle = "";
      this.passwordFlag = null;
    }
  }
}
</script>

<style scoped>

.in-up-container {
  height: 100vh;
  position: relative;
}

.in-up {
  opacity: 0.9;
  border-radius: 10px;
  box-shadow: 0 15px 30px var(--miniMask), 0 10px 10px var(--miniMask);
  position: relative;
  overflow: hidden;
  width: 750px;
  max-width: 100%;
  min-height: 450px;
  margin: 10px;
}

.in-up p {
  font-size: 14px;
  letter-spacing: 1px;
  margin: 20px 0 30px 0;
}

.in-up a {
  color: var(--black);
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.form-container {
  position: absolute;
  height: 100%;
  transition: all 0.5s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
}

.form-container div {
  background: var(--white);
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
}

.form-container input {
  background: var(--maxLightGray);
  border-radius: 2px;
  border: none;
  padding: 12px 15px;
  margin: 10px 0;
  width: 100%;
  outline: none;
}

.in-up button {
  border-radius: 2rem;
  border: none;
  background: var(--lightRed);
  color: var(--white);
  font-size: 16px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 2px;
  cursor: pointer;
}

.in-up button:hover {
  animation: scale 0.8s ease-in-out;
}

.in-up button.ghost {
  background: transparent;
  border: 1px solid var(--white);
}

.sign-up-container button {
  margin-top: 20px;
}

.overlay-container {
  position: absolute;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

.overlay {
  background: var(--gradualRed);
  color: var(--white);
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
}

.overlay-panel {
  position: absolute;
  top: 0;
  flex-direction: column;
  height: 100%;
  width: 50%;
  transition: all 0.5s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateY(0);
}

.overlay-left {
  transform: translateY(-20%);
}

.in-up.right-panel-active .sign-in-container {
  transform: translateY(100%);
}

.in-up.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.in-up.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
}

.in-up.right-panel-active .overlay {
  transform: translateX(50%);
}

.in-up.right-panel-active .overlay-left {
  transform: translateY(0);
}

.in-up.right-panel-active .overlay-right {
  transform: translateY(20%);
}

.user-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.user-info {
  width: 80%;
  z-index: 10;
  margin-top: 70px;
  height: calc(100vh - 90px);
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.user-left {
  width: 50%;
  background: var(--maxMaxWhiteMask);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 20px;
}

.user-right {
  width: 50%;
  background: var(--maxWhiteMask);
  padding: 20px;
}

.user-title {
  text-align: right;
  user-select: none;
}

.user-content {
  text-align: left;
}

.user-title div {
  height: 55px;
  line-height: 55px;
  text-align: center;
}

.user-content > div {
  height: 55px;
  display: flex;
  align-items: center;
}

.user-content >>> .el-input__inner, .user-content >>> .el-textarea__inner {
  border: none;
  background: var(--whiteMask);
}

.user-content >>> .el-input__count {
  background: var(--transparent);
  user-select: none;
}

.changeInfo {
  color: var(--white);
  font-size: 0.75rem;
  cursor: pointer;
  background: var(--themeBackground);
  padding: 3px;
  border-radius: 0.2rem;
  user-select: none;
}

@media screen and (max-width: 920px) {
  .user-info {
    width: 90%;
  }

  .user-left {
    width: 100%;
  }

  .user-right {
    display: none;
  }
}

/** 注册 **/
.register-input {
  width:50%
}
.register-captcha {
  height: 38px;
  width: 102px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  text-align: center;
  cursor: pointer;
  vertical-align:middle;
}

.register-captcha:hover {
  opacity: .75;
}
</style>
