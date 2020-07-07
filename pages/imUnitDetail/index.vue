<template>
    <div class="imUnitDetail-wrapper">
        <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000" indicator-active-color="#1989fa">
            <block v-for="(item, index) in imageLists" :index="index" :key="key">
                <swiper-item><image :src="imageDoin + item.PicAddr" class="slide-image" mode="scaleToFill" /></swiper-item>
            </block>
        </swiper>
        <div class="top bgCW mb16">
            <div class="clearfix mb12 fir-wrap">
                <h4 class="fs16 bold c0 fl">{{ name }}({{ Entity.UnitStatus | GetItemsFilter('Ls.Ag.Vacancy', globalData.windowData.GetItemsData) }})</h4>
            </div>
            <ul class="clearfix bgCW top statistics">
                <li class="tc fl rel">
                    <p class="fs16 cRed">{{ Entity.ConstructionArea | formatMoney(2) }}</p>
                    <p class="fs10 c9 mt4">面积(㎡)</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 cRed">{{ Entity.DailyRent | formatMoney(2) }}</p>
                    <p class="fs10 c9 mt4">日单价</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 cRed">{{ Entity.DecoRate | GetItemsFilter('Ls.Ag.DecoRate', globalData.windowData.GetItemsData) }}</p>
                    <p class="fs10 c9 mt4">装修</p>
                </li>
            </ul>
            <div class="mt12">
                <van-icon class="fl mr8 cBlue" name="location-o" />
                <h4 class="fl c3 fs14">{{ Entity.ProjectAddress }}</h4>
                <view class="clearfix"></view>
            </div>
            <map-wx
                v-if="hackReset"
                class="mt12 block"
                :address="Entity.ProjectAddress"
                :name="name"
                :scale="16"
                :enable-zoom="false"
                :enable-scroll="false"
                width="100%"
                height="400rpx"
                />
        </div>
        <van-tabbar @change="onChangeTabbar">
            <van-tabbar-item icon="edit">编辑房间</van-tabbar-item>
            <van-tabbar-item icon="delete">删除房间</van-tabbar-item>
        </van-tabbar>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
import Toast from '../../static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
import mapWx from '@/components/mapWx';
import { GetImUnitDetail, DelImunit, GetImUnitInfo } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
export default {
    components: {
        mapWx
    },
    data() {
        return {
            id: '', // 房源id
            hackReset: true, // 用于刷新子组件
            name: '', // 项目名称
            imageLists: [], // 轮播图
            imageDoin: this.globalData.windowData.ImgUrl,
            Entity: {}, // 主体信息
            reason: '', // 删除理由
        };
    },
    onShow() {
        this.id = this.$root.$mp.query.id; // 房源id
        this.name = this.$root.$mp.query.name; // 项目名称
        this.GetImUnitDetailFun(); // 房间详情
        this.hackReset = false;
        this.$nextTick(() => {
            this.hackReset = true;
        });
    },
    methods: {
        getReason (val) {
            this.reason = val.detail;
        },
        GetImUnitDetailFun () {
            let params = {
                Id: this.id
            }
            GetImUnitDetail(params).then(res => {
                if (res.Status == 200) {
                    res.Data = nullToStr(res.Data);
                    // 招商房源编辑数据赋值
                    this.globalData.windowData["editImUnit"] = res.Data;
                    // 轮播图
                    if (res.Data.Pics && res.Data.Pics.length>0) this.imageLists = res.Data.Pics;
                    this.Entity = res.Data;
                    this.GetImUnitInfoFun();
                } else {
                    Toast.fail({
                        message: res.Message,
                        position: 'top',
                        duration: 3000
                    });
                }
            })
        },
        // tabbar
        onChangeTabbar(event) {
            var url = '../addFollowUp/index';
            if (event.mp.detail === 0) {
                // 写跟进
                url = '../addImUnit/index';
            } else if (event.mp.detail === 1) {
                Dialog.confirm({
                    title: '删除房间',
                    message: '是否确认删除该房间？'
                }).then(() => {
                    this.DelImunitFun();
                }).catch(() => {
                    // on cancel
                });
                return;
            }
            wx.navigateTo({ url: url });
        },
        // 删除客户
        DelImunitFun() {
            let params = {
                Id: this.id,
            }
            DelImunit(params).then(res => {
                if (res.Status == 200) {
                    Toast.success(res.Message);
                    this.globalData.windowData["imUnit"] = true;
                    setTimeout(()=>{
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2000);
                } else {
                    this.delDialog = false;
                    Toast.fail(res.Message);
                }
            })
        },
        GetImUnitInfoFun () { // 房态图数据
            GetImUnitInfo({Id: this.Entity.ProjectId}).then(res => {
                if (res.Status == 200 && res.Data) {
                    this.globalData.windowData["HomeTreeList"] = nullToStr(res.Data.TreeList);
                } else {
                    Toast.fail(res.Message);
                }
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.imUnitDetail-wrapper {
    padding-bottom: 60px;
    swiper {
        image {
            width: 100%;
            height: 100%;
        }
    }
    ul.statistics {
        border-top: 1px solid #f5f5f5;
        padding: 12px 0;
        width: calc(100% - 32px);
        li {
            width: 33%;
            &:after {
                content: '';
                display: block;
                position: absolute;
                width: 1px;
                height: 70%;
                right: 0;
                top: 15%;
                background: #f5f5f5;
            }
            &:last-child:after {
                display: none;
            }
        }
    }
    > .top {
        padding: 16px;
        .fir-wrap {
            .tags-wrap {
                top: -1px;
                .tag {
                    margin-left: 8px;
                }
            }
            > .btn {
                top: 2px;
                .rel {
                    top: 2px;
                }
            }
        }
    }
}
</style>
