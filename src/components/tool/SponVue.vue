<template>
    <div style="display: flex;width:100%;height: auto;flex-wrap:wrap">
        <div  v-for="item in spons" style="width: 50px;height: 50px;margin: 30px 20px 0">
            <el-tooltip  effect="dark" :content="'赞助商：'+item.sponName" placement="top">
                <el-link :href="item.site">
                    <el-image fit="cover" :src="item.logoUrl" style="width: 50px;height: 50px;border-radius:50%;"></el-image>
                </el-link>

            </el-tooltip>
        </div>

    </div>
</template>

<script>
    export default {
        name: "SponVue",
        props : ['spons'],
        data() {
          return {

          }
        },
        methods : {

        },
    }
</script>

<style scoped>

</style>