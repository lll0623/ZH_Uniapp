<template>
    <div class="selPerson-wrapper">
        <div class="top fix">
            <van-search :value="searchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>
        <div class="content">
            <van-cell class="clearfix default-cell">
                <van-image width="3rem" height="3rem" fit="cover" round class="fl" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <div class="fl">
                    <h4 class="fs14 c3 ml12 tl">渠道</h4>
                    <p class="c6 ml12 tl">共 {{ Total }} 个结果</p>
                </div>
            </van-cell>
            <van-cell-group>
                <van-cell v-for="(items, indexs) in AgentCustList" :key="items.Id" clickable :data-index="items.Id" @click="onClick(items)">
                    <view slot="title">
                        <div class="fl">
                            <span class="c3">{{ items.Name }}</span>
                            <p class="c6 lineEllips1">{{ items.JobTitle }}/{{ items.CompanyName }}</p>
                        </div>
                    </view>
                </van-cell>
            </van-cell-group>
            <div class="tc p20 c9 fs14" v-show="finished && AgentCustList.length > 0">已全部加载</div>
        </div>
        <div class="fix common-btn-wrap bgCW tr">
            <van-button class="cancel" round type="default" @click="cancel">取消</van-button>
            <van-button class="submit ml12" round type="info" @click="sureClic">新增渠道</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '@/static/vant/toast/toast';
import { AgentCustLists } from '@/utils/http';
import { nullToStr } from '../../utils/index.js';
export default {
    data() {
        return {
            imageDoin: this.globalData.windowData.ImgUrl,
            Total: 0,
            searchKey: null,
            AgentCustList: [],
            chooseData: [], // 选中品牌
            PageIndex: 1,
            PageSize: 15,
            finished: false,
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
                name: item.Name,
                val: item.Id
            });
            this.globalData.windowData['AgentId'] = this.chooseData; // 已选的渠道数据存入全局参数以供调用
            wx.navigateBack();
        },
        noop () {},
        onSearch() {
            this.PageIndex = 1;
            this.AgentCustList = [];
            this.finished = false;
            this.AgentCustListsFun();
        },
        AgentCustListsFun() {
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
                AgentCustLists(params).then(res => {
                    if (res.Status == 200) {
                        res.Data = nullToStr(res.Data);
                        this.Total = res.Data.RowCount;
                        if (res.Data.AgentList.length == this.PageSize) {
                            this.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        this.AgentCustList = this.AgentCustList.concat(res.Data.AgentList);
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
            wx.navigateTo({ url: '../addChannel/index' });
        },
        cancel () {
            wx.navigateBack();
        },
        Refresh() {
            this.finished = false;
            this.PageIndex = 1;
            this.AgentCustList = [];
            this.AgentCustListsFun();
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.Refresh();
    },
    onReachBottom() {
        this.AgentCustListsFun();
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
            width: 135px;
        }
    }
}
</style>
