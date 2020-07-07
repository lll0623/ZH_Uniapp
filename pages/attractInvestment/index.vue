<template>
    <div class="attractInvestment-wrapper">
        <div class="top fix">
            <van-search :value="searchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch"><view slot="action" @tap="onSearch">搜索</view></van-search>
        </div>
        <div class="content">
            <ul class="clearfix bgCW top statistics">
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ Data.RowCount | formatMoney(0) }}</p>
                    <p class="fs10 c9 mt4">项目总数</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ Data.TotalArea | formatMoney }}</p>
                    <p class="fs10 c9 mt4">建筑面积(m²)</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ Data.TotalAvgPrice | formatMoney }}</p>
                    <p class="fs10 c9 mt4">平均日单价(元/m²·天)</p>
                </li>
            </ul>
            <ul class="lists">
                <div v-if="listData.length == 0 && isShow" class="cRed tc p20">暂无数据</div>
                <li class="clearfix" @click="goDetailFn(item)" v-for="(item, index) in listData" :key="index">
                    <van-image use-loading-slot lazy-load class="fl image tc" mode="scaleToFill" :src="imageDoin + item.ImageUrl">
                        <van-loading slot="loading" type="spinner" size="20" vertical />
                    </van-image>
                    <div class="fl ml10" style="width: calc(100% - 160px);">
                        <div class="clearfix mb12 mt8">
                            <p class="fl bold fs14">{{ item.ProjectName }}</p>
                            <van-tag class="fl rel tag ml4" type="success">{{ item.ProjectStatus | GetItemsFilter('Ls.Ag.ProjectStatus', globalData.windowData.GetItemsData) }}</van-tag>
                        </div>
                        <div class="clearfix c9 mb12">
                            <p class="fs12 fl">日均价:<span class="cRed fs12">{{ item.AvgPrice }}</span>元</p>
                            <p class="fs12 fr">建筑面积:{{ item.ConstrucArea }}m²</p>
                        </div>
                        <div class="clearfix c9">
                            <p class="fs12 fl">空置房间:{{ item.Vacancy }}/{{ item.NonVacancy }}</p>
                            <p class="fs12 fr"><sapn class="fs12 cBlue">{{ item.AccessNumberTotal }}</sapn>查看</p>
                        </div>
                    </div>
                    <div class="fl tc" v-show="!isTourist" style="width: 50px;" v-if="!!item.IsFavorite" @click.native.stop="isLike(item.ProjectId, item.IsFavorite, index)">
                        <van-icon name="like" color="#1989fa" size="50rpx" />
                        <p class="tc mt8 fs12 cBlue">已收藏</p>
                    </div>
                    <div class="fl tc" v-show="!isTourist" style="width: 50px;" v-else @click.native.stop="isLike(item.ProjectId, item.IsFavorite, index)">
                        <van-icon name="like-o" color="#1989fa" size="50rpx" />
                        <p class="tc mt8 fs12 cBlue">未收藏</p>
                    </div>
                    <div class="clearfix"></div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && listData.length > 0">已全部加载</div>
            </ul>
        </div>
        <div v-show="!isTourist" class="common-add-btn fix bgCBlue tc" @click="goAddProFn"><van-icon name="plus" class="icon cWhite" /></div>
        <div class="common-top-btn fix bgCBlue tc" @click="goTop" v-show="floorstatus"><van-icon name="arrow-up" class="icon cWhite" /></div>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import Toast from '../../static/vant/toast/toast';
import Vue from 'vue';
import { InviteBusinessProjectList, AccessProjectList, FavoriteOrCancel } from '../../utils/http';
export default {
    data() {
        return {
            windowHeight: 0, // 返回顶部
            floorstatus: false, // 返回顶部
            imageDoin: this.globalData.windowData.ImgUrl,
            searchKey: null,
            PageIndex: 1,
            PageSize: 15,
            Data: {},
            listData: [],
            finished: false,
            isShow: false,
            isTourist: this.globalData.windowData.isTourist
        };
    },
    onShow() {
        if (this.globalData.windowData.Pro) {
            this.Refresh();
            this.globalData.windowData.Pro = false;
        }
    },
    created() {
        this.Refresh();
    },
    methods: {
        onChangeSearch(e) {
            // 搜索框值改变事件
            this.searchKey = e.mp.detail;
        },
        onSearch() {
            this.PageIndex = 1;
            this.listData = [];
            this.finished = false;
            this.InviteBusinessProjectListFun();
        },
        goDetailFn(item) {
            // let name = this.globalData.useInfo.WorkerName;
            // let time = Vue.filter('formatTime')(new Date());
            wx.navigateTo({ url: '../attractInvestmentDetail/index?id=' + item.ProjectId });
            // wx.navigateTo({ url: '../attractInvestmentDetail/index?id=' + item.ProjectId+'&isShare=1&workerid='+wx.getStorageSync("WorkerId")+'&name='+name+'&time='+time, });
        },
        goAddProFn() {
            this.globalData.windowData["editProData"] = {};
            wx.navigateTo({ url: '../addPro/index' });
        },
        InviteBusinessProjectListFun() { // 获取招商项目列表数据
            let params = {
                PageIndex: this.PageIndex,
                PageSize: this.PageSize,
                SearchKey: this.searchKey,
                "Sort": {
                    "Field": "CreateTime",
                    "IsASC": false
                }
            }
            if(!this.finished) {
                if (this.globalData.windowData.isTourist) {
                    params["CmpCode"] = this.globalData.windowData.CmpCode;
                    AccessProjectList(params).then(res => {
                        if (res.Status == 200) {
                            let list = res.Data.Data;
                            if (list.length == this.PageSize) {
                                this.PageIndex += 1;
                            } else {
                                this.finished = true;
                            }
                            this.listData = this.listData.concat(list);
                        } else {
                            Toast.fail({
                                message: res.Message,
                                position: 'top',
                                duration: 3000
                            });
                        }
                        this.isShow = true;
                        wx.stopPullDownRefresh();
                    })
                } else {
                    InviteBusinessProjectList(params).then(res => {
                        if (res.Status == 200) {
                            let list = res.Data.Data;
                            if (list.length == this.PageSize) {
                                this.PageIndex += 1;
                            } else {
                                this.finished = true;
                            }
                            this.listData = this.listData.concat(list);
                        } else {
                            Toast.fail({
                                message: res.Message,
                                position: 'top',
                                duration: 3000
                            });
                        }
                        this.isShow = true;
                        wx.stopPullDownRefresh();
                    })
                }
            }
        },
        Refresh() {
            this.finished = false;
            this.PageIndex = 1;
            this.listData = [];
            this.InviteBusinessProjectListFun();
        },
        goTop() {
            if (wx.pageScrollTo) {
                wx.pageScrollTo({
                    scrollTop: 0
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                });
            }
        },
        isLike (id, isTrue, i) {
            this.listData[i].IsFavorite = !isTrue;
            let shoucang = {
                id: id,
                isFavorite: !isTrue,
                refType: 0
            }
            FavoriteOrCancel(shoucang).then(res => {
                if (res.Status == 200) {
                    Toast.success(res.Message);
                } else {
                    Toast.fail(res.Message);
                    this.listData[i].IsFavorite = isTrue;
                }
            })
        }
    },
    // 获取滚动条当前位置
    onPageScroll(e) {
        if (e.scrollTop > this.windowHeight) {
            this.floorstatus = true;
        } else {
            this.floorstatus = false;
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.Refresh();
    },
    onReachBottom() {
        this.InviteBusinessProjectListFun();
    }
};
</script>
<style lang="scss">
.attractInvestment-wrapper {
    .top {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    .content {
        padding-top: 50px;
        ul.statistics {
            margin: 16px;
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
        ul.lists {
            li {
                background: #fff;
                padding: 16px;
                border-bottom: 1px solid #f5f5f5;
                > .image {
                    width: 100px;
                    height: 100px;
                    image {
                        width: 100px;
                        height: 100px;
                        border-radius: 2px;
                    }
                }
                > div {
                    .tag {
                        top: -3px;
                    }
                }
            }
        }
    }
}
</style>
