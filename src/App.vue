<template>
  <div id="app">
    <router-view router></router-view>
  </div>

</template>

<script>
export default {
  name: 'app',
  components: {
  },
    data(){
        return {
            ak: "XSdzkf0NfDrhjsltQ2IQGTdA9GBXTr2K",
        }
    },
    created(){
      let _this = this
        axios.post('/style/getStyle').then(resp => {
            if(resp.data.code === '200'){
                let styleStr = JSON.stringify(resp.data.style),
                    style = resp.data.style,
                    layout = JSON.parse(style.layout).Layout,
                    typeInfo = style.layout,
                    arr = [],
                    code,
                    target
                arr.push(layout.indexOf('首页'))
                arr.push(layout.indexOf('栏目'))
                arr.push(layout.indexOf(''))
                code = arr.join('')
                window.sessionStorage.setItem("isSelect",'true')
                window.sessionStorage.setItem('homePageTarget',code)
                window.sessionStorage.setItem('typeInfo',typeInfo)
                _this.$router.push('/homePage')
            }else{
                _this.$message("未设置展示")
            }
        })
    }
}
</script>

<style >
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*overflow-y: hidden;*/
}
#app::-webkit-scrollbar{
    width: 0 !important;
}
body{
    margin:0;
}
body::-webkit-scrollbar{
    width: 0 !important;
}
  #footer{
    position: relative;
    width: 99%;
    bottom:20px;
  }

</style>
