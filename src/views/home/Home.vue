<template>
    <el-container>
        <el-main style="width: 100vw;height: 100vh;">
            <Style012 style="width: 100%; height: 100%" v-if="code ==='012'" :issue="issue" :columns="columns" :styleLayout="styleLayout" :spons="spons"></Style012>
            <Style021 style="width: 100%; height: 100%" v-if="code ==='021'" :issue="issue" :columns="columns" :styleLayout="styleLayout" :spons="spons"></Style021>
            <Style102 style="width: 100%; height: 100%" v-if="code ==='102'" :issue="issue" :columns="columns" :styleLayout="styleLayout" :spons="spons"></Style102>
            <Style201 style="width: 100%; height: 100%" v-if="code ==='120'" :issue="issue" :columns="columns" :styleLayout="styleLayout" :spons="spons"></Style201>
        </el-main>
    </el-container>
</template>

<script>
    import LogOutComp from '../../components/logOutComp'
    import Style012 from  '../style/012'
    import Style021 from  '../style/021'
    import Style102 from  '../style/102'
    import Style201 from  '../style/201'
    export default {
        name: "Home",
        components : {
            LogOutComp,
            Style012,
            Style021,
            Style102,
            Style201

        },
        data(){
            return{
                code:'',
                issue : null,
                columns : null,
                spons : null,
                styleLayout : null
            }
        },
        methods : {
            //tool
            timeFormat(time,index,length){
                let dateee = new Date(time).toJSON();
                let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                date = date.toString()
                return date.substr(index,length);
            },
            getIssue(){
                let _this = this
                axios.post('/issue/getIssue').then(resp => {
                    let data = resp.data.columns

                    data.holdupTime = _this.timeFormat(data.holdupTime,0,11)
                    data.location = JSON.parse(data.location)
                    _this.issue =  data
                })
            },
            getColumns(){
                let _this = this
                axios.post('/colum/getColumns').then(resp => {
                    let data = resp.data.columns
                    for(let i=0; i<data.length;i++){
                        data[i].creatTime = _this.timeFormat(data[i].creatTime,0,16)
                    }
                    _this.columns = data
                })
            },
            getSpons(){
                let _this = this
                axios.post('/spon/getColumns').then(resp => {
                    let data = resp.data.spons
                    for(let i=0; i<data.length;i++){
                        data[i].logoUrl = axios.defaults.baseURL + 'sponIcon/' +data[i].logoUrl
                    }
                    _this.spons = data
                })
            }
        },
        created(){
            this.code = window.sessionStorage.getItem("homePageTarget");
            this.getIssue()
            this.getColumns();
            this.styleLayout = JSON.parse(window.sessionStorage.getItem("typeInfo"));
            this.getSpons()
        }
    }
</script>

<style scoped>
    .el-main{
        padding: 0 ;
    }
    .el-main::-webkit-scrollbar{
        width: 0 !important;
    }
    .logout{
        position: absolute;
        top: 4px;
        right: 2%;
    }

</style>