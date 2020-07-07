<template>
    <div class="channel-wrapper">
        <div class="top fix">
            <van-search :value="SearchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>
        <div class="content">
            <ul class="clearfix bgCW top statistics">
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ MyAgent| formatMoney(0) }}</p>
                    <p class="fs10 c9 mt4">我的渠道</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ MyPrivateCust| formatMoney(0) }}</p>
                    <p class="fs10 c9 mt4">我的私客</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ MyFavorite | formatMoney(0) }}</p>
                    <p class="fs10 c9 mt4">我的收藏</p>
                </li>
            </ul>
            <!-- 列表 -->
            <ul class="nav clearfix">
                <li :class="navActive === 0 ? 'active' : ''" @click="changeNavFn(0)">全部渠道</li>
                <li :class="navActive === 1 ? 'active' : ''" @click="changeNavFn(1)">我的私客</li>
                <li :class="navActive === 2 ? 'active' : ''" @click="changeNavFn(2)">我的收藏</li>
                <li :class="navActive === 3 ? 'active' : ''" @click="changeNavFn(3)">更多筛选</li>
            </ul>
            <ul class="lists" :class="navActive === 0 ? 'block' : 'none'">
                <li class="tc cRed" v-if="AgentList.length == 0">暂无数据</li>
                <li @click="goCustDetailFn(item.Id)" v-for="(item, idx) in AgentList" :key="idx">
                    <div class="fl" style="width: calc(100% - 50px);">
                        <div class="clearfix top">
                            <h4 class="fl fs14 c0">{{ item.Name }}</h4>
                            <div class="fl tag-wrap">
                                <van-tag class="tag" v-if="item.AgentStatus != ''" size="medium" type="primary">{{ item.AgentStatus }}</van-tag>
                                <van-tag class="tag" v-if="item.IsPrivateCust" size="medium" type="danger">私客</van-tag>
                                <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                                <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                            </div>
                        </div>
                        <div class="clearfix mt8 fs14 c9">
                            <p class="fl" v-if="item.JobTitle !=''">{{ item.JobTitle }}</p>
                            <p class="fl" v-if="item.CompanyName !=''">/{{ item.CompanyName }}</p>
                        </div>
                    </div>
                    <div class="fl tc" style="width: 50px;" v-if="!!item.IsFavorite" @click.native.stop="isLike(item.Id, item.IsFavorite, idx)">
                        <van-icon name="like" color="#1989fa" size="50rpx" />
                        <p class="tc mt8 fs12 cBlue">已收藏</p>
                    </div>
                    <div class="fl tc" style="width: 50px;" v-else @click.native.stop="isLike(item.Id, item.IsFavorite, idx)">
                        <van-icon name="like-o" color="#1989fa" size="50rpx" />
                        <p class="tc mt8 fs12 cBlue">未收藏</p>
                    </div>
                    <div class="clearfix"></div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && AgentList.length > 0">已全部加载</div>
            </ul>
            <ul class="lists" :class="navActive === 1 ? 'block' : 'none'">
                <li class="tc cRed" v-if="MyPrivateCustList.length == 0">暂无数据</li>
                <li @click="goCustDetailFn(item.CustId)" v-for="(item, idx) in MyPrivateCustList" :key="idx">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.Name }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.AgentStatus != ''" size="medium" type="primary">{{ item.AgentStatus }}</van-tag>
                            <van-tag class="tag" v-if="item.IsPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl" v-if="item.JobTitle !=''">{{ item.JobTitle }}</p>
                        <p class="fl" v-if="item.CompanyName !=''">/{{ item.CompanyName }}</p>
                    </div>
                </li>
            </ul>
            <ul class="lists" :class="navActive === 2 ? 'block' : 'none'">
                <li class="tc cRed" v-if="MyFavoriteList.length == 0">暂无数据</li>
                <li @click="goCustDetailFn(item.CustId)" v-for="(item, idx) in MyFavoriteList" :key="idx">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.Name }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.AgentStatus != ''" size="medium" type="primary">{{ item.AgentStatus }}</van-tag>
                            <van-tag class="tag" v-if="item.IsPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl" v-if="item.JobTitle !=''">{{ item.JobTitle }}</p>
                        <p class="fl" v-if="item.CompanyName !=''">/{{ item.CompanyName }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 更多筛选 -->
        <van-popup :show="isShow" closeable position="right" custom-style="height: 100%;width:280px;padding-bottom: 60px;" @close="onCloseFilterFn">
            <div class="filter-wrapper">
                <h4 class="abs">数据筛选</h4>
                <div class="content">
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="渠道状态" dataList="true" lsCode="CustStatus" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="公私客" dataList="true" lsCode="IsImPrivateCust" /></div>
                    <div class="item" style="height: 90px;">
                        <h4 class="c6 fs14">客源方</h4>
                        <ul class="sel-Channel clearfix fl overflowXA" style="max-width: 75%;padding-top: 3px;height: 85px;">
                            <li v-for="(v, i) in CreateUserId" :key="i">
                                <van-image round width="50px" height="50px" :src="v.img" />
                                <p class="fs14 tc mt4 c6 ellipsis">{{ v.name }}</p>
                                <van-icon name="clear" @click="deleteWorker(v.name, v.id)" class="abs icon" />
                            </li>
                        </ul>
                        <ul class="sel-Channel fl" style="width: 25%;">
                            <li class="add-btn" @click="goSelPersonFn"><p>+</p></li>
                        </ul>
                    </div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="渠道类型" lsCode="AgentType" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="渠道来源" lsCode="Source" /></div>
                </div>
            </div>
            <div class="fix submit-wrap clearfix bgCW">
                <div class="fl btn cBlue" @click="resert">重置</div>
                <div class="fl btn bgCBlue cWhite" @click="search">确定</div>
            </div>
        </van-popup>
        <div class="common-add-btn fix bgCBlue tc" @click="goAddCustFn"><van-icon name="plus" class="icon cWhite" /></div>
        <div class="common-top-btn fix bgCBlue tc" @click="goTop" v-show="floorstatus"><van-icon name="arrow-up" class="icon cWhite" /></div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '../../static/vant/toast/toast';
import { AgentCustLists, FavoriteOrCancel } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
import blockSec from '@/components/blockSec';
let paramsJsonChushi = {
    SearchKey: null,
    PageIndex: 1,
    PageSize: 15,
    AgentStatus: '', // 渠道状态 筛选用
    AgentType: '', // 渠道类型
    CreateUserId: [], //  // 客源方 筛选用
    AgentSource: '', // 渠道来源 筛选用
    IsPrivateCust: '', // 公私客 筛选用
    IsFavorite: '', // 是否收藏 筛选用
    Type: 1, // 类别 筛选用
    Sort: {
        Field: 'CreateTime',
        IsASC: false
    }
};
export default {
    components: {
        blockSec
    },
    onShow() {
        // 客源方是否有选人的数据
        if (!!this.globalData.windowData.CreateUserId && this.globalData.windowData.CreateUserId.length > 0) {
            this.CreateUserId = this.globalData.windowData.CreateUserId;
        }
        if (this.globalData.windowData.Channel) {
            this.Refresh();
        }
    },
    data() {
        return {
            windowHeight: 0, // 返回顶部
            floorstatus: false, // 返回顶部
            paramsJsonChushi, // 列表参数初始化
            hackReset: true, // 用于刷新子组件
            MyAgent: 0, // 我的渠道数量
            MyPrivateCust: 0, // 我的私客数量
            MyFavorite: 0, // 我的收藏数量
            CreateUserId: [], // 客源方 筛选用
            paramsJson: {
                SearchKey: null,
                PageIndex: 1,
                PageSize: 15,
                AgentStatus: '', // 渠道状态 筛选用
                AgentType: '', // 渠道类型
                IsPrivateCust: '', // 公私客 筛选用
                AgentSource: '', // 渠道来源 筛选用
                IsFavorite: '', // 是否收藏 筛选用
                CreateUserId: [], //  // 客源方 筛选用
                Type: 1, // 类别 筛选用 1.招商。2.中介
                Sort: {
                    Field: 'CreateTime',
                    IsASC: false
                }
            },
            finished: false,
            AgentList: [], // 全部渠道列表数据
            MyFavoriteList: [], // 我的收藏列表数据
            MyPrivateCustList: [], // 我的私客列表数据
            navActive: 0,
            isShow: false
        };
    },
    created() {
        this.windowHeight = wx.getSystemInfoSync().windowHeight;
        this.Refresh();
    },
    methods: {
        onChangeSearch(e) {
            // 搜索框值改变事件
            this.paramsJson.SearchKey = e.mp.detail;
        },
        onSearch() {
            this.paramsJson.PageIndex = 1;
            this.AgentList = [];
            this.MyFavoriteList = [];
            this.MyPrivateCustList = [];
            this.finished = false;
            this.AgentCustListsFun();
        },
        listenTochildFun(val, name) {
            // 渠道状态筛选
            if (val[0].FormatCode == -1) {
                if (name == 'CustStatus') {
                    this.paramsJson['AgentStatus'] = '';
                } else if (name == 'IsImPrivateCust') {
                    this.paramsJson['IsPrivateCust'] = '';
                } else if (name == 'Source') {
                    this.paramsJson['AgentSource'] = '';
                } else {
                    this.paramsJson[name] = '';
                }
            } else {
                if (name == 'CustStatus') {
                    this.paramsJson['AgentStatus'] = val[0].FormatCode;
                } else if (name == 'IsImPrivateCust') {
                    this.paramsJson['IsPrivateCust'] = val[0].FormatCode;
                } else if (name == 'Source') {
                    this.paramsJson['AgentSource'] = val[0].FormatCode;
                } else {
                    this.paramsJson[name] = val[0].FormatCode;
                }
            }
        },
        resert() {
            // 筛选重置
            this.hackReset = false;
            this.$nextTick(() => {
                this.hackReset = true;
            });
            this.CreateUserId = [];
            this.globalData.windowData.CreateUserId = [];
            this.paramsJson = {
                SearchKey: null,
                PageIndex: 1,
                PageSize: 15,
                AgentStatus: '', // 渠道状态 筛选用
                AgentType: '', // 渠道类型
                CreateUserId: [], //  // 客源方 筛选用
                AgentSource: '', // 渠道来源 筛选用
                IsPrivateCust: '', // 公私客 筛选用
                IsFavorite: '', // 是否收藏 筛选用
                Type: 1, // 类别 筛选用
                Sort: {
                    Field: 'CreateTime',
                    IsASC: false
                }
            }; // 参数初始化
            this.Refresh();
        },
        search() {
            // 筛选搜索
            this.Refresh();
        },
        deleteWorker(name, id) {
            // 删除选择的员工
            this.CreateUserId = this.CreateUserId.filter(res => {
                return res.id != id;
            });
            this.globalData.windowData.CreateUserId = this.CreateUserId;
        },
        changeNavFn(type) {
            if (type === 3) {
                this.isShow = true;
                return false;
            }
            this.navActive = type;
        },
        onCloseFilterFn() {
            this.isShow = false;
        },
        goCustDetailFn(id) {
            wx.navigateTo({ url: '../channelDetail/index?id=' + id });
        },
        goAddCustFn() {
            this.globalData.windowData["editChannelData"] = {};
            wx.navigateTo({ url: '../addChannel/index' });
        },
        goSelPersonFn() {
            let CreateUserIdStr = encodeURIComponent(JSON.stringify(this.CreateUserId));
            wx.navigateTo({ url: '../selPerson/index?dataList=' + CreateUserIdStr+'&type=1' });
        },
        // 搜索
        searchFn() {},
        AgentCustListsFun() {
            let params = this.paramsJson;
            params['CreateUserId'] = []; // 置空
            if (!!this.CreateUserId && this.CreateUserId.length > 0) {
                // 客源方参数赋值
                this.CreateUserId.forEach(res => {
                    params['CreateUserId'].push(res.id);
                });
            }
            if (!this.finished) {
                AgentCustLists(params).then(res => {
                    if (res.Status == 200) {
                        if (this.paramsJson.PageIndex == 1) {
                            this.MyAgent= res.Data.MyAgent;
                            this.MyFavorite = res.Data.MyFavorite;
                            this.MyPrivateCust= res.Data.MyPrivateCust;
                        }
                        let CusList = (res.Data.AgentList == "") ? [] : res.Data.AgentList; // 全部渠道列表数据
                        let FavoriteList = (res.Data.MyFavoriteList == "") ? [] : res.Data.MyFavoriteList; // 我的收藏列表数据
                        let PrivateList = (res.Data.MyPrivateCustList == "") ? [] : res.Data.MyPrivateCustList; // 我的私客列表数据
                        if (CusList.length == this.paramsJson.PageSize) {
                            this.paramsJson.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        this.AgentList = this.AgentList.concat(CusList);
                        this.MyFavoriteList = this.MyFavoriteList.concat(FavoriteList);
                        this.MyPrivateCustList = this.MyPrivateCustList.concat(PrivateList);
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
        Refresh() {
            this.finished = false;
            this.paramsJson.PageIndex = 1;
            this.AgentList = [];
            this.MyFavoriteList = [];
            this.MyPrivateCustList = [];
            this.AgentCustListsFun();
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
            this.AgentList[i].IsFavorite = !isTrue;
            let shoucang = {
                id: id,
                isFavorite: !isTrue,
                refType: 3
            }
            FavoriteOrCancel(shoucang).then(res => {
                if (res.Status == 200) {
                    Toast.success(res.Message);
                    if (!isTrue) {
                        this.MyFavoriteList.push(this.AgentList[i])
                    } else {
                        this.MyFavoriteList = this.MyFavoriteList.filter(res =>{
                            return res.Id !=id;
                        })
                    }
                    this.MyFavorite = this.MyFavoriteList.length;
                } else {
                    Toast.fail(res.Message);
                    this.AgentList[i].IsFavorite = isTrue;
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
        if (this.navActive == 0) {
            this.AgentCustListsFun();
        }
    }
};
</script>
<style lang="scss">
.channel-wrapper {
    > .top {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    > .content {
        padding-top: 50px;
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
        // nav
        ul.nav {
            border-bottom: 1px solid #f5f5f5;
            background: #fff;
            li {
                float: left;
                padding: 12px 0;
                color: #666;
                font-size: 14px;
                border-bottom: 2px solid #fff;
                width: calc(100% / 4);
                text-align: center;
                &.active {
                    color: #1989fa;
                    border-color: #1989fa;
                }
            }
        }
        // 列表
        ul.lists {
            li {
                background: #fff;
                border-bottom: 1px solid #f5f5f5;
                padding: 16px;
                .top {
                    .tag-wrap {
                        position: relative;
                        top: -1px;
                        .tag {
                            margin-left: 8px;
                        }
                    }
                }
            }
        }
    }
    .filter-wrapper {
        padding: 0 12px;
        position: relative;
        height: 100%;
        overflow-y: auto;
        > h4 {
            padding: 0px 0;
        }
        .content {
            padding: 30px 0 0;
            .item {
                margin-bottom: 8px;
                > h4 {
                    padding: 8px 0;
                }
                > ul.sel-Channel{
                    > li {
                        position: relative;
                        float: left;
                        margin-right: 8px;
                        .ellipsis {
                            width: 50px;
                        }
                        > .icon {
                            top: -2px;
                            right: -2px;
                            color: #ee0a24;
                        }
                        &.add-btn {
                            margin-right: 0;
                            height: 50px;
                            width: 50px;
                            p {
                                font-size: 30px;
                                border-radius: 100%;
                                text-align: center;
                                border: 1px solid #1989fa;
                                color: #1989fa;
                                height: 100%;
                                line-height: 45px;
                            }
                        }
                        image {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}
</style>
