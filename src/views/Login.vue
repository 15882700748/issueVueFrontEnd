<template>
   <div class="background">
      <transition v-if="!isLogin">
         <div id="ruleForm" >
            <loginComp @setLoginStatus="getLoginStatus"></loginComp>
         </div>
      </transition>

      <transition v-else :duration="8000" name="bounce" enter-active-class="bounceInLeft" leave-active-class="bouceOutRight">
         <div  style="position: absolute;width: 800px;left: 50%;top: 10%;transform: translate(-50%,-10%)">
            <div style="color: white;position: relative;left: 720px;width: 50px;top: 40px;z-index: 1" >
               <el-row>
                  <el-col :span="2">
                     <el-tooltip class="item" effect="dark" content="注销" placement="top">
                        <i class="el-icon-circle-close logout " @click="logout">退出</i>
                     </el-tooltip>
                  </el-col>
               </el-row>
            </div>
            <div >
               <issue-select></issue-select>
            </div>
         </div>
      </transition>

   </div>
</template>

<script>
    import  LogOutComp from '../components/logOutComp'
    import LoginComp from '../components/loginComp'
    import IssueSelect from '../components/issueSelect'
    export default {
        name: "Login",
        components : {
            LoginComp,
            IssueSelect,
            LogOutComp,
        },
        data(){
           return {
               identifyCodeSrc:'',
               ruleForm:{
                   code:''
               },
               isLogin:false
           }
        },
        methods: {
            logout(){
                window.sessionStorage.removeItem('token')
                window.sessionStorage.removeItem('isLogin')
                this.$message({
                    message:"退出成功",
                    type: "success"
                })
                window.location.reload()
            },
            /**
             * 窗口代码
             * @param {Boolean} bRefresh 是否刷新
             */
            getIdentifyingCode: function (bRefresh) {
                let identifyCodeSrc = axios.defaults.baseURL+"getVerify";
                if (bRefresh) {
                    identifyCodeSrc =  axios.defaults.baseURL+"/getVerify?" + Math.random();
                }
                let objs = document.getElementById("imgIdentifyingCode");
                objs.src = identifyCodeSrc;
            },
            getLoginStatus(val){
                this.isLogin = true
            }
        },
        created(){
            let status = window.sessionStorage.getItem("isLogin")
            this.isLogin = status === 'true'
            this.identifyCodeSrc = axios.defaults.baseURL+"/getVerify"
        }
    }
</script>

<style scoped>
   #ruleForm{
      width: 350px;
      height: 450px;
      position: absolute;
      left: 80%;
      top: 25%;
      transform: translate(-80%,-25%);
   }
   .logout{
      cursor: pointer;
      width: 50px;
   }
   .background{
      width: 100%;
      height: 97vh;
      background-image: url("https://192.168.43.25:8888/imgs/download.jpg");
      background-repeat: no-repeat;
      background-size: 100% 100%  ;
   }
</style>