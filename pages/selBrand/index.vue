<template>
    <div class="selPerson-wrapper">
        <div class="top fix">
            <van-search :value="searchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>
        <div class="content">
            <van-cell-group>
                <van-cell v-for="(items, indexs) in BrandList" :key="items.Id" clickable :data-index="items.Id" @click="onClick(items)">
                    <view slot="title">
                        <van-image width="50px" height="50px" fit="cover" round class="fl mr8" lazy-load :src="imageDoin + items.Logo" />
                        <div class="fl" style="width: calc(100vw - 150px);">
                            <span class="c3">{{ items.BrandName }}</span>
                            <p class="c6 lineEllips1">{{ items.Format }}</p>
                        </div>
                    </view>
                </van-cell>
            </van-cell-group>
            <div class="tc p20 c9 fs14" v-show="finished && BrandList.length > 0">已全部加载</div>
        </div>
        <div class="fix common-btn-wrap bgCW tr">
            <van-button class="cancel" round type="default" @click="cancel">取消</van-button>
            <van-button class="submit ml12" round type="info" @click="sureClic">新增品牌</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '@/static/vant/toast/toast';
import { BrandLists } from '@/utils/http';
export default {
    data() {
        return {
            imageDoin: this.globalData.windowData.ImgUrl,
            searchKey: null,
            BrandList: [],
            chooseData: [], // 选中品牌
            PageIndex: 1,
            PageSize: 15,
            finished: false
        };
    },
    onShow() {
        this.Refresh();
    },
    methods: {
        onChangeSearch(e) {
            // 搜索框值改变事件
            this.searchKey = e.mp.detail;
        },
        onChange(event) {
            this.value = event.detail;
        },
        onClick(item) {
            this.chooseData.push({
                name: item.BrandName,
                val: item.Id
            });
            this.globalData.windowData['brandId'] = this.chooseData; // 已选的品牌数据存入全局参数以供调用
            wx.navigateBack();
        },
        noop () {},
        onSearch() {
            this.PageIndex = 1;
            this.BrandList = [];
            this.finished = false;
            this.BrandListsFun();
        },
        BrandListsFun() {
            let params = {
                PageIndex: this.PageIndex,
                PageSize: this.PageSize,
                SearchKey: this.searchKey,
                "Sort": {
                    "Field": "CreateTime",
                    "IsASC": false
                }
            };
            if(!this.finished) {
                BrandLists(params).then(res => {
                    if (res.Status == 200) {
                        if (res.Data.MyBrandList.length == this.PageSize) {
                            this.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        this.BrandList = this.BrandList.concat(res.Data.MyBrandList);
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                    wx.stopPullDownRefresh();
                });
            }
        },
        sureClic () {
            wx.navigateTo({ url: '../addBrand/index' });
        },
        cancel () {
            wx.navigateBack();
        },
        Refresh() {
            this.finished = false;
            this.PageIndex = 1;
            this.BrandList = [];
            this.BrandListsFun();
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.Refresh();
    },
    onReachBottom() {
        this.BrandListsFun();
    },
};
</script>
<style lang="scss">
.selPerson-wrapper {
    > .top {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    > .content {
        padding-top: 52px;
        .default-cell {
            .tit {
                line-height: 45px;
            }
            .icon {
                top: 18px;
            }
        }
        padding-bottom: 75px;
        .van-cell__title{
            flex: 12;
        }
        .van-cell__value {
            flex: 1;
        }
    }
    .cancel{
        button {
            width: 80px;
        }
    }
}
</style>
