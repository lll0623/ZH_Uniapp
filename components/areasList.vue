<template>
    <div class="areasList">
        <van-cell is-link
                @click="()=>{this.isShowPopup = true}">
            <view slot="title">
                <div class="rel common-required">
                    <span v-if="isBT == 'true'" class="cRed">*</span>
                    <span class="van-cell-text">{{ label }}</span>
                </div>
            </view>
            <view class="textHere">
                <span v-if="chooseAfterData.length == 0">点击选择</span>
                <span v-for="(item, index) in chooseAfterData" :key="index">{{ item.name }}</span>
            </view>
        </van-cell>
        <van-popup 
            class="overflow" :show="isShowPopup"
            position="bottom"
            @close="()=>{this.isShowPopup = false}">
            <van-area
               :loading="loading"
               :area-list="columns"
               @cancel="()=>{this.isShowPopup = false}"
               @confirm="onConFirmFun"
               :value="isVal"
               :title="label" />
        </van-popup>
    </div>
</template>

<script>
    import { GetAreaData } from '../utils/http';
    export default {
        props: ['label', 'isBT', 'isVal', 'isProvince', 'isCity', 'isArea'],
        data() {
            return {
                loading: false,
                isShowPopup: false,
                columns: {},
                chooseAfterData: []
            }
        },
        created() {
            if (JSON.stringify(this.globalData.windowData.AreaList) === '{}') {
                wx.hideLoading();
                this.loading = true;
                GetAreaData({}).then(res => {
                    this.loading = false;
                    if (res.Status == 200) {
                        let province_list = {}, city_list = {}, county_list = {};
                        // 省数据格式
                        if(!!res.Data.Province && res.Data.Province.length > 0) {
                            res.Data.Province.forEach((v, i) => {
                                province_list[v.AreaCode] = v.AreaName;
                            })
                        }
                        // 市数据格式
                        if(!!res.Data.City && res.Data.City.length > 0) {
                            res.Data.City.forEach((v, i) => {
                                city_list[v.AreaCode] = v.AreaName;
                            })
                        }
                        // 区数据格式
                        if(!!res.Data.Area && res.Data.Area.length > 0) {
                            res.Data.Area.forEach((v, i) => {
                                county_list[v.AreaCode] = v.AreaName;
                            })
                        }
                        this.globalData.windowData.AreaList["province_list"] = province_list;
                        this.globalData.windowData.AreaList["city_list"] = city_list;
                        this.globalData.windowData.AreaList["county_list"] = county_list;
                        this.columns = this.globalData.windowData.AreaList;
                    }
                })
            } else {
                this.columns = this.globalData.windowData.AreaList;
            }
        },
        mounted() {
            if (!!this.isProvince) this.chooseAfterData.push({name: this.isProvince});
            if (!!this.isCity) this.chooseAfterData.push({name: this.isCity});
            if (!!this.isArea) this.chooseAfterData.push({name: this.isArea});
        },
        methods: {
            onConFirmFun (value) {
                this.chooseAfterData = value.detail.values;
                this.isShowPopup = false;
                this.$emit("listenTochildEvent", value.detail.values);
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

