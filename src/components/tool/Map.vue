<template>
    <div>
        <baidu-map :center="center" :zoom="zoom" :scroll-wheel-zoom="true"
                   @ready="popoverMapReady"
                   style="height: 400px; width: 100%">
            <bm-scale></bm-scale>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
            <bm-marker :position="center" >
                <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
                    <p>站点地址：{{loc}}</p>
                </bm-info-window>
            </bm-marker>
            <!--<bm-marker v-if="!isLoading" :position="myCenter" >-->
                <!--<bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">-->
                    <!--<p v-if="isLoading">正在定位.....</p>-->
                    <!--<p v-else>我的位置：{{myLocation}}</p>-->
                <!--</bm-info-window>-->
            <!--</bm-marker>-->
        </baidu-map>
    </div>

</template>

<script>
    export default {
        name: "popoverMap",
        props:['location'],
        data(){
            return{
                center: {lng: 0, lat: 0},
                zoom:12,
                loc:'',
                myLocation: '',
                myCenter: {lng: 0, lat: 0},
                show:true,
                map: null,
                isLoading:true
            }
        },
        methods:{
            infoWindowClose () {
                this.show = false
            },
            infoWindowOpen () {
                //这里有个问题纠结了很久，百度的信息窗口默认有个点击其他地方就消失的事件，我没有找到
                //并且信息窗口点击一次显示，一次消失
                //于是我加了一个100毫秒的定时器，保证每次点击地图都可以展示信息窗口
                setInterval(()=>{
                    this.show = true
                },100)
            },
            popoverMapReady({BMap, map}){
                let  _this =this
                this.geoc = new BMap.Geocoder();
                 let data = this.location
                this.loc =data.province + data.city + data.district + data.street + data.streetNumber
                this.center.lng = data.lng
                this.center.lat = data.lat
                let point = new BMap.Point(this.center.lng, this.center.lat);
                let marker = new BMap.Marker(point); // 创建标注
                map.centerAndZoom(point, this.zoom);
                map.addOverlay(marker);
                map.enableScrollWheelZoom(true);
                this.map = map
                let geolocation = new BMap.Geolocation()
                geolocation.getCurrentPosition((r) => {
                    if (r.point) {
                        let markers = new BMap.Marker(r.point)
                        _this.map.addOverlay(markers)
                        _this.map.panTo(r.point)
                        _this.map.centerAndZoom(r.point, _this.zoom)
                        _this.isLoading =false
                        _this.myCenter.lng = r.lng
                        _this.myCenter.lat = r.lat
                    }
                }, { enableHighAccuracy: true })

            },
        },
        created(){
            this.center.lng = this.location.lng
            this.center.lat = this.location.lat
            console.log(this.center)
        }
    }
</script>

<style scoped>

</style>