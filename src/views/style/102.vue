<template>
    <el-container>
        <el-header style="width: 100%;height: auto;padding: 0;position: relative" class="border">
            <div class="headerImg">
                <el-image style="margin:0;height: 150px;width: 100%" fit="cover" :src="axios.defaults.baseURL+'issue/'+issue.logo"></el-image>
            </div>
            <div class="headerTitle">
                {{issue.title}}
            </div>
            <ul class="headerTitle-menu " ref="columnList">
                <li v-for="item in columns" class="headerTitle-menu-item " @click="getColumnInfo($event,item)"> {{item.name}}</li>
                <li class="headerTitle-menu-item " @click="getColumnInfo($event,null,'article')" >文章</li>
                <li class="headerTitle-menu-item " @click="getColumnInfo($event,null,'album')" >相册</li>
            </ul>
        </el-header>
        <el-container>
            <el-aside style="width:200px;min-height: 300px;max-height: 400px;margin:40px 20px 0 ;;border-radius:20px" >
                <el-row  style="width:80%;height: 40px;margin:20px auto ; line-height:20px;border-bottom: 1px #DCDFE6 solid; ">
                    <el-col>
                        赞助商
                    </el-col>
                </el-row>
                <spon-vue :spons="spons" style="height: auto"></spon-vue>
            </el-aside>
            <el-main style="width: 100%;min-height:700px;border-left:1px #DCDFE6 solid;">
                <div v-if="isAsideContent">
                    <el-row style="height: 50px;border-bottom: 1px #DCDFE6 solid; ">
                        <el-col :span="20" :offset="1" style="margin-top: 12px">
                            <el-page-header @back="goBack" :content="mainContent.data.name+'内容详情'">
                            </el-page-header>
                        </el-col>
                    </el-row>
                    <!--文章-->
                    <div v-if="mainContent.type === 'article'">
                        <!--卡片效果-->
                        <div v-if="articleType === '卡片效果'"  class="column-content-wrapper border">
                            <el-card class="box-card"  style="position: relative">
                                <div slot="header" >
                                    <span>第 <span contenteditable="true">{{articleCurrentPage}}</span>篇(共{{articleTotalPage}}篇)</span>
                                    <el-divider direction="vertical"></el-divider>
                                    <span>标题 ：{{cardTypeArticle.title}}</span>
                                    <div @click="nextPage('next')" class="border " style="width: 35px;height: 35px;border-radius: 50%;position: absolute;right:15px;top: 10px;">
                                        <i class="el-icon-right" style="color:#DCDFE6;font-size: 2em"></i>
                                    </div>
                                    <div @click="nextPage('prev')" class="border " style="width: 35px;height: 35px;border-radius: 50%;position: absolute;left: 15px;top: 10px;">
                                        <i class="el-icon-back" style="color:#DCDFE6;font-size: 2em"> </i>
                                    </div>
                                </div>
                                <div style="margin: 0 60px">
                                    内容 ： <span v-html="cardTypeArticle.content"></span>
                                </div>
                            </el-card>
                        </div>
                        <!--书籍效果-->
                        <div v-else-if="articleType === '书籍效果'"  class="column-content-wrapper">
                            <book :articles="mainContent.data"></book>
                        </div>
                        <!--瀑布流效果-->
                        <div v-else  class="column-content-wrapper ">
                            <div class="column-content-main " style="height: 100%" >

                                <div class="infinite-list-wrapper" style="margin-top:40px; width: 100%">
                                    <div
                                            class="wrapper" style="min-height:500px;display: block;width:100%;margin: 60px auto;"
                                            v-for="(item,index) in articles"
                                            v-infinite-scroll="loadArticles" infinite-scroll-disabled="disabledArticles">
                                        <div class="album" style="height: auto;width: 100%;">
                                            <el-card class="box-card" style="min-height:500px;width: 100%;">
                                                <div slot="header" >
                                                    <span>{{item.title}}</span>
                                                </div>
                                                <el-row>
                                                    <el-col>
                                                        <div v-html="item.content">

                                                        </div>
                                                    </el-col>
                                                </el-row>
                                                <el-row style="position: relative; bottom: 10px">
                                                    <el-col :span="8" :offset="16">
                                                        发布时间:{{item.realseTime}}
                                                    </el-col>
                                                </el-row>
                                            </el-card>
                                        </div>
                                    </div>
                                    <p v-if="articleLoading">加载中...</p>
                                    <p v-if="noMoreArticles">没有更多了</p>
                                </div>
                                <el-backtop target=".infinite-list-wrapper"></el-backtop>
                            </div>
                        </div>
                    </div>
                    <!--栏目-->
                    <div v-else-if="mainContent.type === 'column'">
                        <div class="column-content-wrapper border">
                            <div class="column-content-header border">
                                <div class="column-content-header-item">发布时间：{{mainContent.data.creatTime}}</div>
                            </div>
                            <div class="column-content-main ">
                                <span style="display:block;width: 80%;margin: 20px auto;text-align: left" v-html="mainContent.data.content"></span>
                            </div>
                            <div class="column-content-footer ">
                            </div>
                        </div>

                    </div>
                    <!--相册-->
                    <div v-else >
                        <div class="column-content-wrapper border">
                            <div v-if="isPicture" class="column-content-header border">
                                <el-row>
                                    <el-col :span="4">
                                        <el-tooltip class="item" effect="dark" content="返回相册" placement="top-start">
                                            <i class="el-icon-back" @click="returnAlbum" style="cursor: pointer">返回相册</i>
                                        </el-tooltip>

                                    </el-col>
                                    <el-col :span="8" :offset="3">
                                        <span>{{albumName}}相册 </span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="column-content-main border" >
                                <!--图片-->
                                <div v-if="isPicture" class="infinite-list-wrapper" style="overflow-y:scroll;margin-top: 40px">
                                    <div
                                            class="wrapper"
                                            v-for="(item,index) in pictures"
                                            v-infinite-scroll="loadPicture" infinite-scroll-disabled="disabledPicture">
                                        <div class="album" >
                                            <el-image :preview-src-list="[item.imgUrl+'']" @error="imgErrorHandle" :src="item.imgUrl"
                                                      class="img" fit="container" lazy></el-image>
                                            <span class="albumName">上传时间 ：{{item.uploadTime}}</span>
                                        </div>
                                    </div>
                                    <p v-if="loading">加载中...</p>
                                    <p v-if="noMorePicture">没有更多了</p>
                                </div>
                                <!--相册-->
                                <div v-else class="infinite-list-wrapper" style="overflow-y:scroll;margin-top: 40px">
                                    <div
                                            class="wrapper"
                                            v-for="(item,index) in albums"
                                            v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                                        <div class="album" >
                                            <el-image @error="imgErrorHandle" :src="item.imgUrl"
                                                      class="img" fit="container" @click="viewPicture(item)" lazy></el-image>
                                            <span class="albumName">相册名称：{{item.albumName}}</span>
                                            <span class="albumDesc">描述：{{item.albumDesc}}</span>
                                        </div>
                                    </div>
                                    <p v-if="loading">加载中...</p>
                                    <p v-if="noMore">没有更多了</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <el-row style="height:80px;line-height:80px;font-size: 2em;width: 80%;margin: 10px auto 0;border-bottom: 1px #DCDFE6 solid">
                        <el-col>
                            会议内容
                        </el-col>
                    </el-row>
                    <el-row style="width: 80%;margin: 20px auto;border-bottom: 1px #DCDFE6 solid">
                        <el-col>
                            <span style="text-align: left" v-html="issue.content"></span>
                        </el-col>
                    </el-row>
                    <el-row style="height:20px;width: 80%; margin-top: 10px">
                        <el-col :span="7" :offset="20">
                            地点：{{issue.location.province+issue.location.city+issue.location.district+issue.location.street+issue.location.streetNumber}}
                        </el-col>
                    </el-row>
                    <el-row style="height:30px;width: 80%;margin:10px auto 20px;border-bottom: 1px #DCDFE6 solid">
                        <el-col :span="4" :offset="20">
                            时间：{{issue.holdupTime}}
                        </el-col>
                    </el-row>
                    <el-row style="width: 80%;height:500px;margin:20px auto 0;">
                        <el-col>
                            <Map :location="issue.location"></Map>
                        </el-col>
                    </el-row>
                    <div >

                    </div>
                </div>
            </el-main>
        </el-container>
        <el-footer >
            <div style="width: 100%;height: 50px;margin-top: 30px; line-height: 50px" >
                <span>{{org.name}} 版权所有　© 2005-2020</span>
                <el-divider direction="vertical"></el-divider>
                <span>邮箱：<a style="text-decoration: none;color: black" :href="'mailto:'+org.email">{{org.email}}</a></span>
                <el-divider direction="vertical"></el-divider>
                <span>TEL：{{org.tel}}</span>
                <el-divider direction="vertical"></el-divider>
                <span>关于：{{org.orgDesc}}</span>
            </div>

        </el-footer>
    </el-container>
</template>

<script>
    import Book from '../../components/tool/book'
    import Map from '../../components/tool/Map'
    import SponVue from '../../components/tool/SponVue'
    export default {
        name: "Style102",
        props:['issue','columns','styleLayout','spons','org'],
        components : {
            Book,
            Map,
            SponVue
        },
        data(){
            return {
                mainContent:{
                    type : 'column',
                    data : {}
                },
                cardTypeArticle: {},
                activeStyleLayout : [
                    {color:'white',background:'transparent'},//active
                    {color:'black',background:'transparent'},
                ],
                articles : [],
                albums : [],
                pictures : [],
                isArticle : false,
                isAsideContent : false,
                loading : false,
                isPicture : false,
                articleLoading : false,
                articleTotal:0,
                articleTotalPage:0,
                articleCurrentPage:0,
                articlePageSize:0,
                albumTotal:0,
                albumTotalPage:0,
                albumCurrentPage:0,
                albumPageSize:0,
                pictureTotal:0,
                pictureTotalPage:0,
                pictureCurrentPage:0,
                picturePageSize:0,
                articleType : '',
                albumName : ''
            }
        },
        methods: {
            //tool
            timeFormat(time,index,length){
                let dateee = new Date(time).toJSON();
                let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                date = date.toString()
                return date.substr(index,length);
            },
            imgErrorHandle(e){
                console.log(e)
            },
            pageChange(e){
                console.log(e)
            },
            //main
            getColumnInfo(e,column,type = 'column'){
                let currentTarget = e.target,
                    parent = currentTarget.parentElement,
                    parentChilds = parent.childNodes
                for(let i=0; i < parentChilds.length; i++){
                    if(parentChilds[i] !== currentTarget){
                        parentChilds[i].style.backgroundColor = this.activeStyleLayout[1].background
                        parentChilds[i].style.color = this.activeStyleLayout[1].color
                    }
                }
                currentTarget.style.backgroundColor =  this.activeStyleLayout[0].background
                currentTarget.style.color =  this.activeStyleLayout[0].color
                if(type === 'column'){
                    this.mainContent.data = column
                    this.mainContent.type = 'column'
                    this.isPicture = false
                }else if(type === 'article'){
                    this.mainContent.type = 'article'
                    this.mainContent.data = this.articles
                    this.mainContent.data.name = this.issue.title+'文章'
                    this.isPicture = false
                }else{
                    this.mainContent.type = 'album'
                    this.mainContent.data = this.albums
                    this.mainContent.data.name = '相册'
                }
                this.isAsideContent = true
            },
            goBack(){
                this.mainContent.data = {}
                this.mainContent.type = 'column'
                this.isAsideContent = false
                this.isPicture = false
                this.albumName = ''
                this.articleCurrentPage = 1;
                this.articles = []
                let parentChilds = this.$refs.columnList.childNodes
                for(let i=0; i < parentChilds.length; i++){
                    parentChilds[i].style.backgroundColor = this.activeStyleLayout[1].background
                    parentChilds[i].style.color = this.activeStyleLayout[1].color
                }
            },
            returnAlbum(){
                this.albumName = ''
                this.isPicture = false
            },
            nextPage(type){
                if(type === 'next'){
                    if(this.articleCurrentPage === this.articleTotalPage){
                        this.$message("没有更多了")
                    }else{
                        this.articleCurrentPage++
                        this.getArticles(this.articleCurrentPage)
                    }
                }else{
                    if(this.articleCurrentPage === 1){
                        this.$message("已经是第一个了")
                    }else{
                        this.articleCurrentPage--
                        this.getArticles(this.articleCurrentPage)
                    }
                }
            },
            viewPicture(item){
                this.isPicture = true
                this.loading = false
                this.albumName = item.albumName
                this.getPictures(0,item.albumId)
            },
            //getData
            getArticles(pageNo,pageSize=1){
                let _this = this
                axios.post('/article/getArticles?pageNo='+pageNo+'&pageSize='+pageSize).then(resp => {
                    let data = resp.data.records
                    if(this.articleType === '卡片效果'){
                        _this.cardTypeArticle = data[0]
                    }else if(this.articleType === '瀑布流效果'){
                        _this.articles = _this.articles.concat(data)
                    }else{
                        _this.articles =  data;
                    }
                    console.log(resp.data.records)
                    for(let i=0; i<_this.articles.length;i++){
                        _this.articles[i].holdupTime = _this.timeFormat(_this.articles[i].holdupTime,0,11)
                        _this.articles[i].realseTime = _this.timeFormat(_this.articles[i].realseTime,0,16)
                    }
                    _this.articleTotal = resp.data.total
                    _this.articleTotalPage = resp.data.pages
                    _this.articleCurrentPage = resp.data.current
                    _this.articlePageSize = resp.data.size

                })
            },
            load(){
                this.loading = true
                setTimeout(() => {
                    this.albumCurrentPage+=1;
                    this.getAlbums(this.albumCurrentPage)
                    this.loading = false
                }, 1000)

            },
            loadPicture(){
                this.loading = true
                setTimeout(() => {
                    this.pictureCurrentPage+=1;
                    this.page(this.pictureCurrentPage)
                    this.loading = false
                }, 1000)
            },
            loadArticles(){
                this.articleLoading = true
                setTimeout(() => {
                    this.articleCurrentPage+=1;
                    this.getArticles(this.articleCurrentPage,3)
                    this.articleLoading = false
                    console.log(this.articleCurrentPage)
                }, 1000)
            },
            getAlbums : async function(pageNo,pageSize=10){
                let _this = this
                await axios.post('/album/pageQuery?pageNo='+pageNo+'&pageSize='+pageSize).then(resp => {
                    _this.albums =  resp.data.records
                    for(let i=0; i<_this.albums.length;i++){
                        _this.albums[i].createTime = _this.timeFormat(_this.albums[i].createTime,0,16)
                        _this.albums[i].creatTime = _this.timeFormat(_this.albums[i].creatTime,0,16)
                    }
                    _this.albumTotal = resp.data.total
                    _this.albumTotalPage = resp.data.pages
                    _this.albumCurrentPage = resp.data.current
                    _this.albumPageSize = resp.data.size

                })
                for(let i=0; i<_this.albums.length; i++){
                    await axios.post("/album/getFisrtPicture",{'albumId':_this.albums[i].albumId}).then(resp => {
                        _this.albums[i].imgUrl = axios.defaults.baseURL+'album/'+resp.data.img.imgUrl
                    })
                }
            },
            getPictures : async function(pageNo,id,pageSize=10){
                let _this = this
                await axios.post("/img/pageQuery?pageNo="+pageNo+"&pageSize="+pageSize+"&albumId="+id).then(resp => {
                    _this.pictures =  resp.data.records
                    for(let i=0 ; i < _this.pictures.length;i++){
                        if(_this.pictures[i].imgUrl.indexOf("http:")){
                            _this.pictures[i].imgUrl = axios.defaults.baseURL+"/album/"+_this.pictures[i].imgUrl
                        }
                        _this.pictures[i].uploadTime = _this.timeFormat(_this.pictures[i].uploadTime)
                    }

                    _this.pictureTotal = resp.data.total
                    _this.pictureTotalPage = resp.data.pages
                    _this.pictureCurrentPage = resp.data.current
                    _this.picturePageSize = resp.data.size

                })
                // for(let i=0; i<_this.albums.length; i++){
                //     await axios.post("/album/getFisrtPicture",{'albumId':_this.albums[i].albumId}).then(resp => {
                //         _this.albums[i].imgUrl = axios.defaults.baseURL+'album/'+resp.data.img.imgUrl
                //     })
                // }
            }
        },
        created(){
            this.articleType = this.styleLayout.articleType;
            if(this.articleType === '卡片效果'){
                this.getArticles(0)
            }else if(this.articleType === '书籍效果'){
                this.getArticles(0,5)
            }else{
                this.getArticles(0,6)
            }
            this.getAlbums(0)
        },
    }
</script>

<style scoped>
    .el-container .is-vertical{
        margin: 0 auto;
    }
    .el-main::-webkit-scrollbar{
        width: 0 !important;

    }
    .headerImg{
        position: relative;
        width: 100%;
        height: 150px;
    }
    .headerTitle{
        position: absolute;
        width: auto;
        height: 50px;
        font-size: 2em;
        font-family:"Hiragino Sans GB";
        top: 0;
        left: 10%;
        transform: translate(-10%,60px);
    }
    .headerTitle-menu{
        margin: 0;
        position: absolute;
        width:100%;
        height: 80px;
        display: flex;
        color:black;
        top: 0;
        list-style: none;
        align-items:center;
        justify-content:center;
    }
    .headerTitle-menu-item{
        cursor: pointer ;
        background-color: transparent;
        height: 30px;
        /*border-radius: 10px;*/
        line-height: 30px;
       margin-left: 20px;
    }
    .headerTitle-menu-item :hover{
        background-color: cornflowerblue;
    }

    .column-menu{
        display: block;
        width: 150px;
        height: auto;
        padding: 0;
    }
    .column-item{
        display: block;
        margin:10px auto;
        width: 90%;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        border-radius: 10px;
    }
    .column-item-active{
        background-color:#DCDFE6  !important;
        color: white !important;
    }
    /*main*/
    .column-content-wrapper{
        width: 95%;
        margin: 50px auto ;
        min-width: 400px;
    }
    .column-content-header{
        width: 100%;
        height: 40px;
        line-height: 40px;
    }
    .column-content-header-item{
        width: 155px;
        height: 40px;
        line-height: 40px;
        font-size: 10px;
    }
    .column-content-main{
        width: 100%;
    }
    .column-content-footer{
        width: 100%;
        height: 40px;
    }

    /*album*/
    .wrapper{
        display: inline-flex;
        flex-direction:row;
        position: relative;
        width: 400px;
        height: 300px;
        top: 10px;
        margin-right: 20px;
        margin-left: 20px;
    }
    .album{
        width: 300px;
        height: 200px;
        border: 6px solid white;
        box-shadow: 1px 1px 5px #333333;
        text-align: center;
    }
    .album .img{
        display:inline-flex;
        width: 300px;
        height: 200px;
    }
    .album .albumName{
        display:inline-flex;
        width: 300px;
        height: 20px;
        top: 10px;
        position: relative;
    }
    .album .albumDesc{
        display:inline-flex;
        position: relative;
        width: 300px;
        height: 20px;
        top: 10px;
    }
    .border{
        border: 1px #DCDFE6 solid;
    }
</style>