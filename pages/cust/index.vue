<template>
    <div class="cust-wrapper">
        <div class="top fix">
            <van-search :value="searchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>
        <div class="content">
            <ul class="clearfix bgCW top statistics">
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ TotalCust | formatMoney(0) }}</p>
                    <p class="fs10 c9 mt4">我的客户</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ ToTalPrivateCust | formatMoney(0) }}</p>
                    <p class="fs10 c9 mt4">我的私客</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ TotalFavorite | formatMoney(0) }}</p>
                    <p class="fs10 c9 mt4">我的收藏</p>
                </li>
            </ul>
            <!-- 列表 -->
            <ul class="nav clearfix">
                <li :class="navActive === 0 ? 'active' : ''" @click="changeNavFn(0)">全部客户</li>
                <li :class="navActive === 1 ? 'active' : ''" @click="changeNavFn(1)">我的私客</li>
                <li :class="navActive === 2 ? 'active' : ''" @click="changeNavFn(2)">我的收藏</li>
                <li :class="navActive === 3 ? 'active' : ''" @click="changeNavFn(3)">更多筛选</li>
            </ul>
            <ul class="lists" :class="navActive === 0 ? 'block' : 'none'">
                <li class="tc cRed" v-if="CustList.length == 0">暂无数据</li>
                <li @click="goCustDetailFn(item.CustId)" v-for="(item, idx) in CustList" :key="idx">
                    <div class="fl" style="width: calc(100% - 50px);">
                        <div class="clearfix top">
                            <h4 class="fl fs14 c0">{{ item.CustName }}</h4>
                            <div class="fl tag-wrap">
                                <van-tag class="tag" v-if="item.CustStatus != ''" size="medium" type="primary">{{ item.CustStatus }}</van-tag>
                                <van-tag class="tag" v-if="item.IsImPrivateCust" size="medium" type="danger">私客</van-tag>
                                <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                                <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                                <van-tag class="tag" v-if="item.MerchantsType != ''" size="medium" type="warning">{{ item.MerchantsType }}</van-tag>
                            </div>
                        </div>
                        <div class="clearfix mt8 fs14 c9">
                            <p class="fl">{{ item.FormatName }}</p>
                            <p class="fl" v-if="item.Brand !=''">/{{ item.Brand }}</p>
                            <p class="fl" v-if="item.AreaMin !='' || item.AreaMax != ''">/{{ item.AreaMin }}-{{ item.AreaMax }}㎡</p>
                        </div>
                        <div class="clearfix mt8 fs14 c9" v-if="item.JobTitle !='' || item.CustCompany != ''">{{ item.JobTitle }}/{{ item.CustCompany }}</div>
                    </div>
                    <div class="fl tc" style="width: 50px;" v-if="!!item.IsFavorite" @click.native.stop="isLike(item.CustId, item.IsFavorite, idx)">
                        <van-icon name="like" color="#1989fa" size="50rpx" />
                        <p class="tc mt8 fs12 cBlue">已收藏</p>
                    </div>
                    <div class="fl tc" style="width: 50px;" v-else @click.native.stop="isLike(item.CustId, item.IsFavorite, idx)">
                        <van-icon name="like-o" color="#1989fa" size="50rpx" />
                        <p class="tc mt8 fs12 cBlue">未收藏</p>
                    </div>
                    <div class="clearfix"></div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && CustList.length > 0">已全部加载</div>
            </ul>
            <ul class="lists" :class="navActive === 1 ? 'block' : 'none'">
                <li class="tc cRed" v-if="MyPrivateCustList.length == 0">暂无数据</li>
                <li @click="goCustDetailFn(item.CustId)" v-for="(item, idx) in MyPrivateCustList" :key="idx">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.CustName }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.CustStatus != ''" size="medium" type="primary">{{ item.CustStatus }}</van-tag>
                            <van-tag class="tag" v-if="item.IsImPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                            <van-tag class="tag" v-if="item.MerchantsType != ''" size="medium" type="warning">{{ item.MerchantsType }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl">{{ item.FormatName }}</p>
                        <p class="fl" v-if="item.Brand !=''">/{{ item.Brand }}</p>
                        <p class="fl" v-if="item.AreaMin !='' || item.AreaMax != ''">/{{ item.AreaMin }}-{{ item.AreaMax }}㎡</p>
                    </div>
                    <div class="clearfix mt8 fs14 c9" v-if="item.JobTitle !='' || item.CustCompany != ''">{{ item.JobTitle }}/{{ item.CustCompany }}</div>
                </li>
            </ul>
            <ul class="lists" :class="navActive === 2 ? 'block' : 'none'">
                <li class="tc cRed" v-if="MylFavoriteList.length == 0">暂无数据</li>
                <li @click="goCustDetailFn(item.CustId)" v-for="(item, idx) in MylFavoriteList" :key="idx">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.CustName }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.CustStatus != ''" size="medium" type="primary">{{ item.CustStatus }}</van-tag>
                            <van-tag class="tag" v-if="!item.IsImPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                            <van-tag class="tag" v-if="item.MerchantsType != ''" size="medium" type="warning">{{ item.MerchantsType }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl">{{ item.FormatName }}</p>
                        <p class="fl" v-if="item.Brand !=''">/{{ item.Brand }}</p>
                        <p class="fl" v-if="item.AreaMin !='' || item.AreaMax != ''">/{{ item.AreaMin }}-{{ item.AreaMax }}㎡</p>
                    </div>
                    <div class="clearfix mt8 fs14 c9" v-if="item.JobTitle !='' || item.CustCompany != ''">{{ item.JobTitle }}/{{ item.CustCompany }}</div>
                </li>
            </ul>
        </div>
        <!-- 更多筛选 -->
        <van-popup :show="isShow" closeable position="right" custom-style="height: 100%;width:280px;padding-bottom: 60px;" @close="onCloseFilterFn">
            <div class="filter-wrapper">
                <h4 class="abs">数据筛选</h4>
                <div class="content">
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="客户状态" dataList="true" lsCode="CustStatus" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="公私客" dataList="true" lsCode="IsImPrivateCust" /></div>
                    <div class="item" style="height: 90px;">
                        <h4 class="c6 fs14">客源方</h4>
                        <ul class="sel-cust clearfix fl overflowXA" style="max-width: 75%;padding-top: 3px;height: 85px;">
                            <li v-for="(v, i) in CreateUserId" :key="i">
                                <van-image round width="50px" height="50px" :src="v.img" />
                                <p class="fs14 tc mt4 c6 ellipsis">{{ v.name }}</p>
                                <van-icon name="clear" @click="deleteWorker(v.name, v.id)" class="abs icon" />
                            </li>
                        </ul>
                        <ul class="sel-cust fl" style="width: 25%;">
                            <li class="add-btn" @click="goSelPersonFn"><p>+</p></li>
                        </ul>
                    </div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="意向等级" lsCode="Urgency" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="需求面积" lsCode="ConstructionArea" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="业态" lsCode="Format" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="客户来源" lsCode="CustSource" /></div>
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
import { InviteBusinessCustList, FavoriteOrCancel } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
import blockSec from '@/components/blockSec';
let paramsJsonChushi = {
    searchKey: null,
    PageIndex: 1,
    PageSize: 15,
    CustStatus: '', // 客户状态 筛选用
    IsImPrivateCust: '', // 公私客 筛选用
    Urgency: '', // 意向等级 筛选用
    AreaMin: '', // 面积最小值 筛选用
    AreaMax: '', // 面积最大值 筛选用
    FormatCategory: '', // 业态 筛选用
    CustSource: '', // 客户来源 筛选用
    IsFavorite: '', // 是否收藏 筛选用
    MerchantsType: '', // 招商类型 筛选用
    CreateUserId: [], //  // 客源方 筛选用
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
        if (this.globalData.windowData.Cust) {
            this.Refresh();
            this.globalData.windowData.Cust = false;
        }
    },
    data() {
        return {
            windowHeight: 0, // 返回顶部
            floorstatus: false, // 返回顶部
            paramsJsonChushi, // 列表参数初始化
            hackReset: true, // 用于刷新子组件
            TotalCust: 0, // 我的客户数量
            ToTalPrivateCust: 0, // 我的私客数量
            TotalFavorite: 0, // 我的收藏数量
            CreateUserId: [], // 客源方 筛选用
            paramsJson: {
                searchKey: null,
                PageIndex: 1,
                PageSize: 15,
                CustStatus: '', // 客户状态 筛选用
                IsImPrivateCust: '', // 公私客 筛选用
                Urgency: '', // 意向等级 筛选用
                AreaMin: '', // 面积最小值 筛选用
                AreaMax: '', // 面积最大值 筛选用
                FormatCategory: '', // 业态 筛选用
                CustSource: '', // 客户来源 筛选用
                IsFavorite: '', // 是否收藏 筛选用
                MerchantsType: '', // 招商类型 筛选用
                CreateUserId: [], //  // 客源方 筛选用
                Type: 1, // 类别 筛选用 1.招商。2.中介
                Sort: {
                    Field: 'CreateTime',
                    IsASC: false
                }
            },
            finished: false,
            CustList: [], // 全部客户列表数据
            MylFavoriteList: [], // 我的收藏列表数据
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
            this.paramsJson.searchKey = e.mp.detail;
        },
        onSearch() {
            this.paramsJson.PageIndex = 1;
            this.CustList = [];
            this.MylFavoriteList = [];
            this.MyPrivateCustList = [];
            this.finished = false;
            this.InviteBusinessCustListFun();
        },
        listenTochildFun(val, name) {
            // 客户状态筛选
            if (name == 'ConstructionArea') {
                // 面积筛选
                if (val[0].FormatCode == -1) (this.paramsJson.AreaMin = ''), (this.paramsJson.AreaMax = '');
                if (val[0].FormatCode == '0') (this.paramsJson.AreaMin = '0'), (this.paramsJson.AreaMax = '20');
                if (val[0].FormatCode == '1') (this.paramsJson.AreaMin = '20'), (this.paramsJson.AreaMax = '50');
                if (val[0].FormatCode == '2') (this.paramsJson.AreaMin = '50'), (this.paramsJson.AreaMax = '100');
                if (val[0].FormatCode == '3') (this.paramsJson.AreaMin = '100'), (this.paramsJson.AreaMax = '200');
                if (val[0].FormatCode == '4') (this.paramsJson.AreaMin = '200'), (this.paramsJson.AreaMax = '500');
                if (val[0].FormatCode == '5') (this.paramsJson.AreaMin = '500'), (this.paramsJson.AreaMax = '1000');
                if (val[0].FormatCode == '6') (this.paramsJson.AreaMin = '1000'), (this.paramsJson.AreaMax = '');
            } else if (name == 'Format') {
                if (val[0].FormatCode == -1) this.paramsJson.FormatCategory = '';
                else this.paramsJson.FormatCategory = val[0].FormatCode;
            } else {
                if (val[0].FormatCode == -1) this.paramsJson[name] = '';
                else this.paramsJson[name] = val[0].FormatCode;
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
                searchKey: null,
                PageIndex: 1,
                PageSize: 15,
                CustStatus: '', // 客户状态 筛选用
                IsImPrivateCust: '', // 公私客 筛选用
                Urgency: '', // 意向等级 筛选用
                AreaMin: '', // 面积最小值 筛选用
                AreaMax: '', // 面积最大值 筛选用
                FormatCategory: '', // 业态 筛选用
                CustSource: '', // 客户来源 筛选用
                IsFavorite: '', // 是否收藏 筛选用
                MerchantsType: '', // 招商类型 筛选用
                CreateUserId: [], //  // 客源方 筛选用
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
            wx.navigateTo({ url: '../custDetail/index?id=' + id });
        },
        goAddCustFn() {
            this.globalData.windowData["editCustData"] = {};
            wx.navigateTo({ url: '../addCust/index' });
        },
        goSelPersonFn() {
            let CreateUserIdStr = encodeURIComponent(JSON.stringify(this.CreateUserId));
            wx.navigateTo({ url: '../selPerson/index?dataList=' + CreateUserIdStr+'&type=1' });
        },
        // 搜索
        searchFn() {},
        InviteBusinessCustListFun() {
            let params = this.paramsJson;
            params['CreateUserId'] = []; // 置空
            if (!!this.CreateUserId && this.CreateUserId.length > 0) {
                // 客源方参数赋值
                this.CreateUserId.forEach(res => {
                    params['CreateUserId'].push(res.id);
                });
            }
            if (!this.finished) {
                InviteBusinessCustList(params).then(res => {
                    if (res.Status == 200) {
                        if (this.paramsJson.PageIndex == 1) {
                            this.TotalCust = res.Data.TotalCust;
                            this.TotalFavorite = res.Data.TotalFavorite;
                            this.ToTalPrivateCust = res.Data.ToTalPrivateCust;
                        }
                        let CusList = (res.Data.CustList == "") ? [] : res.Data.CustList; // 全部客户列表数据
                        let FavoriteList = (res.Data.MylFavoriteList == "") ? [] : res.Data.MylFavoriteList; // 我的收藏列表数据
                        let PrivateList = (res.Data.MyPrivateCustList == "") ? [] : res.Data.MyPrivateCustList; // 我的私客列表数据
                        if (CusList.length == this.paramsJson.PageSize) {
                            this.paramsJson.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        this.CustList = this.CustList.concat(CusList);
                        this.MylFavoriteList = this.MylFavoriteList.concat(FavoriteList);
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
            this.CustList = [];
            this.MylFavoriteList = [];
            this.MyPrivateCustList = [];
            this.InviteBusinessCustListFun();
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
            this.CustList[i].IsFavorite = !isTrue;
            let shoucang = {
                id: id,
                isFavorite: !isTrue,
                refType: 2
            }
            FavoriteOrCancel(shoucang).then(res => {
                if (res.Status == 200) {
                    Toast.success(res.Message);
                    if (!isTrue) {
                        this.MylFavoriteList.push(this.CustList[i])
                    } else {
                        this.MylFavoriteList = this.MylFavoriteList.filter(res =>{
                            return res.CustId !=id;
                        })
                    }
                    this.TotalFavorite = this.MylFavoriteList.length;
                } else {
                    Toast.fail(res.Message);
                    this.CustList[i].IsFavorite = isTrue;
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
            this.InviteBusinessCustListFun();
        }
    }
};
</script>
<style lang="scss">
.cust-wrapper {
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
                > ul.sel-cust {
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
