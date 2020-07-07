<template>
    <map
        @click="openMap"
        :longitude="longitude"
        :latitude="latitude"
        :markers="markers"
        :scale="scale"
        :enable-zoom="enableZoom"
        :enable-scroll="enableScroll"
        :style="{'width':width,'height':height}">
    </map>
</template>

<script>
    import QQMapWX from "../utils/qqmap-wx-jssdk.min.js";
    let qqmapsdk;
    export default {
        props: ['address', 'name', 'scale', 'enableZoom', 'enableScroll', 'width', 'height'],
        data() {
            return {
                qqmapsdk,
                longitude: '',
                latitude: '',
                markers: []
            }
        },
        created() {},
        mounted() {
            console.log(this.address)
            setTimeout(()=>{
                let that = this;
                that.qqmapsdk = new QQMapWX({
                    // key: 'QBOBZ-QBSHS-24SO3-6RDLE-KTAJE-GDFYM',
                    key: '7BRBZ-NYAKW-EWZRW-RH654-6I4EO-NXBWG'
                })
                // 调用接口
                that.qqmapsdk.geocoder({
                    address: that.address,
                    success: function (res) {
                        that.latitude = res.result.location.lat;
                        that.longitude = res.result.location.lng;
                        that.markers = [
                            {
                                iconPath: "../static/images/map.png",
                                id: 0,
                                longitude: that.longitude,
                                latitude: that.latitude,
                                width: 30,
                                height: 30,
                                callout: {
                                    content: that.name,
                                    fontSize: 14,
                                    color: '#ffffff',
                                    bgColor: '#1989fa',
                                    padding: 8,
                                    borderRadius: 4,
                                    borderColor: '#1989fa',
                                    boxShadow: '4px 8px 16px #999',
                                    display: "ALWAYS",
                                }
                            }
                        ]
                    },
                    fail: function (res) {},
                })
            }, 500)
        },
        methods: {
            openMap () {
                wx.openLocation({
                    latitude: this.latitude,
                    longitude: this.longitude,
                    scale: 28,
                    name: this.address,
                })
            }
        }
    }
</script>

<style lang="scss">
    .areasList {
        .textHere {
            span + span:before {
                content: "-";
            }
        }
    }
</style>

