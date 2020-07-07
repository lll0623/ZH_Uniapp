<template>
    <div class="index-wrapper bgF5 rel">
        <ul class="bgF5 fast-enter">
            <li @click="fastEnterFn('../attractInvestment/index', 'navigate')">
                <van-icon name="shop" color="#da9d40" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">招商项目</p>
            </li>
            <li @click="fastEnterFn('../cust/index', 'navigate')">
                <van-icon name="friends" color="#da8684" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">客户</p>
            </li>
            <li @click="fastEnterFn('../channel/index', 'navigate')">
                <van-icon name="exchange" color="#1989fa" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">渠道</p>
            </li>
            <li @click="fastEnterFn('../brand/index', 'navigate')">
                <van-icon name="diamond" color="#33967a" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">品牌</p>
            </li>
            <li @click="fastEnterFn('../report/index', 'navigate')">
                <van-icon name="comment-circle" color="#55d641" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">预约报备</p>
            </li>
            <li @click="fastEnterFn('../Reception/index', 'navigate')">
                <van-icon name="browsing-history" color="#1989fa" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">带看</p>
            </li>
            <li @click="fastEnterFn('../imUnit/index', 'navigate')">
                <van-icon name="wap-home" color="#1a73af" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">房源列表</p>
            </li>
            <li class="clearfix" @click="nomore()">
                <van-icon name="apps-o" color="#b3b3b3" size="60rpx" />
                <p class="mt4 fs12 c1c ellipsis">更多</p>
            </li>
        </ul>
        <!-- main-content -->
        <div class="main-content">
            <!-- 筛选条件 -->
            <div class="screenTitle bgCW">
                <div class="fl typeBtn">
                    <span v-for="(v, i) in typeData" :key="i" @click="changeType(v)" :class="{ active: v.val == screenType ? true : false, fs14: true }">{{ v.text }}</span>
                </div>
                <div class="fr rightBtn">
                    <van-dropdown-menu overlay class="bgF5">
                        <van-dropdown-item id="screenTime" :value="screenTime" @change="timeFun" :options="timeData" popup-style="z-index: 120" />
                        <van-dropdown-item id="screenRtype" :value="screenRtype" @change="RtypeFun" :options="RtypeData" />
                    </van-dropdown-menu>
                </div>
                <div class="clearfix"></div>
            </div>
            <!-- 名称内容 -->
            <div class="item" v-for="(v, i) in tableList" :key="i" v-if="i < 5">
                <div class="clearfix top">
                    <div class="bold fs14 fl">名称：{{ v.Name }}</div>
                </div>
                <ul class="content clearfix">
                    <li class="fl tc">
                        <p class="c6 fs12">客户新增</p>
                        <p class="fs12 cBlue mb10" @click="moreList(v.AddCustIdList, 1)">{{ v.AddCustSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">客户跟进</p>
                        <p class="fs12 mb10">{{ v.AddCustFollowUpSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">品牌新增</p>
                        <p class="fs12 cBlue mb10" @click="moreList(v.AddBrandList, 5)">{{ v.AddBrandSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">品牌跟进</p>
                        <p class="fs12 mb10">{{ v.AddBrandFollowUpSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">访客</p>
                        <p class="fs12 cBlue mb10" @click="moreList(v.AddShareIdList, 6)">{{ v.AddShareSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">报备新增</p>
                        <p class="fs12 cBlue mb10" @click="moreList(v.AddBookList, 3)">{{ v.AddBookSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">意向新增</p>
                        <p class="fs12 mb10">{{ v.AddIntentionSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">带看新增</p>
                        <!-- <p class="fs12 cBlue mb10" @click="moreList(v.AddReceptionList, 2)">{{ v.AddReceptionSum }}</p> -->
                        <p class="fs12 mb10">{{ v.AddReceptionSum }}</p>
                    </li>
                    <li class="fl tc">
                        <p class="c6 fs12">重点报备</p>
                        <p class="fs12 cBlue mb10" @click="moreList(v.AddEmphasisList, 3)">{{ v.AddEmphasisSum }}</p>
                    </li>
                </ul>
            </div>
            <div class="cBlue tc fs12 mt8" v-if="tableList.length > 5 && ishow" @click="seeMore">查看更多>></div>

            <div class="shareDiv mt8">
                <div class="title bgCW">
                    <span class="fl fs16 bold">谁看过我的分享</span>
                    <!-- <span class="fr cBlue fs12">查看全部</span> -->
                    <span class="clearfix"></span>
                </div>
                <div class="content">
                    <van-cell-group>
                        <div class="tc cRed p8" v-if="shareList.length == 0">暂无数据</div>
                        <van-cell v-for="(item, index) in shareList" :key="index" @click="goDetailFn(item)" v-if="index < 5">
                            <view slot="title">
                                <!-- <van-image width="50px" height="50px" fit="cover" round class="fl mr8" lazy-load :src="item.AccessPeopleHeadPic" /> -->
                                <van-image width="50px" height="50px" fit="cover" @click.native.stop="thisPeople(item)" round class="fl mr8" lazy-load :src="item.AccessPeopleHeadPic" />
                                <div class="fl" style="width: calc(100vw - 150px);">
                                    <div style="width: 100%;">
                                        <div class="c3 fl">
                                            <span class="bold">{{ item.AccessPeopleName }}</span>
                                            <span class="cBlue ml10" @click.native.stop="clickPhone(item.AccessPeoplePhone)">{{ item.AccessPeoplePhone }}</span>
                                        </div>
                                        <div class="c3 fr rel">
                                            <van-icon name="eye-o" class="fs16" />
                                            <span>{{ item.AccessSum }}次</span>
                                            <van-icon
                                                class="fs26 abs cBlue"
                                                style="left: 45px;top: -5px;"
                                                name="phone-o"
                                                v-if="item.AccessPeoplePhone && item.AccessPeoplePhone != ''"
                                                @click.native.stop="clickPhone(item.AccessPeoplePhone)"
                                            />
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <p class="c6 lineEllips2">{{ item.CreateTime | formatTime }} 看过：{{ item.AccessContent }}</p>
                                </div>
                            </view>
                            <van-icon slot="right-icon" name="arrow" class="custom-icon" />
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
            <div class="cBlue tc fs12 mt8" v-if="shareList.length > 5 && ishow2" @click="seeMore2">查看更多>></div>
        </div>
        <!-- <div class="block" @click="getWxCode">  获取指定页面二维码</div> -->
        <!-- <image :src="'data:image/png;base64,' + imgUrl" /> -->
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
        <!-- 更多数据 我的 部门 机构 -->
        <van-popup :show="isShow" position="right" custom-style="height: 100%;width:100%;padding-bottom: 60px;">
            <div class="filter-wrapper">
                <div class="item" v-for="(v, i) in tableList" :key="i">
                    <div class="clearfix top">
                        <div class="bold fs14 fl">名称：{{ v.Name }}</div>
                    </div>
                    <ul class="content clearfix">
                        <li class="fl tc">
                            <p class="c6 fs12">客户新增</p>
                            <p class="fs12 cBlue mb10" @click="moreList(v.AddCustIdList, 1)">{{ v.AddCustSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">客户跟进</p>
                            <p class="fs12 mb10">{{ v.AddCustFollowUpSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">品牌新增</p>
                            <p class="fs12 cBlue mb10" @click="moreList(v.AddBrandList, 5)">{{ v.AddBrandSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">品牌跟进</p>
                            <p class="fs12 mb10">{{ v.AddBrandFollowUpSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">访客</p>
                            <p class="fs12 cBlue mb10" @click="moreList(v.AddShareIdList, 6)">{{ v.AddShareSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">报备新增</p>
                            <p class="fs12 cBlue mb10" @click="moreList(v.AddBookList, 3)">{{ v.AddBookSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">意向新增</p>
                            <p class="fs12 mb10">{{ v.AddIntentionSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">带看新增</p>
                            <!-- <p class="fs12 cBlue mb10" @click="moreList(v.AddReceptionList, 2)">{{ v.AddReceptionSum }}</p> -->
                            <p class="fs12 mb10">{{ v.AddReceptionSum }}</p>
                        </li>
                        <li class="fl tc">
                            <p class="c6 fs12">重点报备</p>
                            <p class="fs12 cBlue mb10" @click="moreList(v.AddEmphasisList, 3)">{{ v.AddEmphasisSum }}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fix submit-wrap clearfix bgCW"><div class="fl btn cBlue" @click="isShow = false">关闭</div></div>
        </van-popup>
        <!-- <van-popup :show="isShow2" closeable position="right" custom-style="height: 100%;width:100%;padding-bottom: 60px;">
            <div class="filter-wrapper">
                <div class="content">
                    <van-cell-group>
                        <van-cell v-for="(item, index) in shareList2" :key="index" @click="goDetailFn(item)">
                            <view slot="title">
                                <van-image width="50px" height="50px" fit="cover" round class="fl mr8" lazy-load :src="item.AccessPeopleHeadPic" />
                                <div class="fl" style="width: calc(100vw - 150px);">
                                    <div style="width: 100%;">
                                        <div class="c3 fl bold">{{ item.AccessPeopleName }}<span class="c6 ml10" @click.native.stop="clickPhone(item.AccessPeoplePhone)">{{ item.AccessPeoplePhone }}</span></div>
                                        <div class="c3 fr rel">
                                            <van-icon name="eye-o" class="fs16" />
                                            <span> {{ item.AccessSum }}次</span>
                                            <van-icon class="fs26 abs cBlue" style="left: 45px;top: -5px;" name="phone-o" v-if="item.AccessPeoplePhone && item.AccessPeoplePhone != ''" @click.native.stop="clickPhone(item.AccessPeoplePhone)" />
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <p class="c6 lineEllips2">{{ item.CreateTime | formatTime }} 看过：{{ item.AccessContent }}</p>
                                </div>
                            </view>
                            <van-icon slot="right-icon" name="arrow" class="custom-icon" />
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
            <div class="fix submit-wrap clearfix bgCW">
                <div class="fl btn cBlue" @click="isShow2 = false">关闭</div>
            </div>
        </van-popup> -->
    </div>
</template>
<script>
import { PreLogin, TryGetWorkerLoginByPreToken, GetWorkloadAndShare, WhoReadMyShare, QueryAccessLists } from '../../utils/http';
import Toast from '../../static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
import Vue from 'vue';
let nowDate = Vue.filter('formatDay')(new Date());
let typeData = [{ text: '我的', val: 1 }, { text: '部门', val: 2 }, { text: '机构', val: 3 }];
let timeData = [
    { text: '当天', value: 1, BeginDate: nowDate + ' 00:00:00', EndDate: nowDate + ' 23:59:59' },
    { text: '本周', value: 2, BeginDate: Vue.filter('getMonday')('s', 0), EndDate: Vue.filter('getMonday')('e', 0) },
    { text: '本月', value: 3, BeginDate: Vue.filter('getMonth')('s', 0), EndDate: Vue.filter('getMonth')('e', 0) },
    { text: '本年度', value: 4, BeginDate: Vue.filter('getYear')('s', 0), EndDate: Vue.filter('getYear')('e', 0) }
];
let RtypeData = [{ text: '按员工统计', value: 1 }, { text: '按部门统计', value: 2 }];
export default {
    data() {
        return {
            imgUrl: '',
            text: '',
            fadeInUp: false,
            typeData,
            timeData,
            RtypeData,
            isShow: false,
            isShow2: false,
            screenType: 1,
            screenTime: 2,
            screenRtype: 1,
            BeginDate: Vue.filter('getMonday')('s', 0),
            EndDate: Vue.filter('getMonday')('e', 0),
            tableList: [], // 统计表格数据
            tableList2: [], // 统计表格数据 隐藏的
            shareList: [], // 分享数据
            shareList2: [], // 分享数据 隐藏的
            ishow: false,
            ishow2: false
        };
    },
    onShow() {
        if (!!this.globalData.windowData.isreload) {
            this.WeixinFun();
            this.globalData.windowData.isreload = false;
        }
        this.globalData.windowData['isTourist'] = false;
    },
    mounted() {
        this.WeixinFun();
    },
    methods: {
        getWxCode() {
            let that = this;
            wx.request({
                url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx7f2e351fd4d318af&secret=13a034c8bbba1598b80f98bbd53e903c',
                data: {},
                success: function(res) {
                    let access_token = res.data.access_token;
                    // 获取二维码
                    wx.request({
                        url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token,
                        method: 'POST',
                        responseType: 'arraybuffer', // 这个是转化成base64需要加的
                        data: {
                            scene: 'a=1', // 你的参数
                            path: 'pages/cust/index',
                            width: '200'
                        },
                        success: function(res) {
                            // 这个是转化成base64（因为微信官方返回给我们的会被解析成乱码）
                            that.imgUrl = wx.arrayBufferToBase64(res.data);
                        },
                        fail: function(res) {
                            wx.showModal({
                                title: '提示',
                                content: '请稍后重试',
                                showCancel: false,
                                success: function(res) {
                                    if (res.confirm) {
                                    }
                                }
                            });
                        }
                    });
                },
                fail: function(res) {
                    wx.showModal({
                        title: '提示',
                        content: '请稍后重试',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                            }
                        }
                    });
                }
            });
        },
        clickPhone(val) {
            // 打电弧
            wx.makePhoneCall({
                phoneNumber: val
            });
        },
        seeMore() {
            // 查看更多
            this.isShow = true;
            this.tableList2 = this.tableList;
        },
        nomore() {
            Toast.fail('暂无更多');
        },
        seeMore2() {
            this.globalData.windowData['tongji'] = [];
            this.globalData.windowData['wywaid'] = wx.getStorageSync('WorkerId');
            wx.navigateTo({ url: '../wywiad/index' });
        },
        thisPeople(item) {
            // 点击头像查看此人看了我的明细
            let id = item.SourceId;
            let phone = item.AccessPeoplePhone;
            let name = item.AccessPeopleName;
            wx.navigateTo({ url: '../visit/index?id='+id+'&phone='+phone+'&name='+name });
        },
        timeFun(e) {
            this.screenTime = e.detail;
            this.BeginDate = this.timeData[e.detail - 1].BeginDate;
            this.EndDate = this.timeData[e.detail - 1].EndDate;
            // this.WhoReadMyShareFun();
            this.GetWorkloadAndShareFun();
        },
        RtypeFun(e) {
            this.screenRtype = e.detail;
            if (e.detail == 2) {
                this.screenType = 2;
            }
            this.GetWorkloadAndShareFun();
        },
        goDetailFn(item) {
            // 查看分享详情
            if (item.SourceTypeText == '项目') {
                wx.navigateTo({ url: '../attractInvestmentDetail/index?id=' + item.SourceId });
            }
        },
        WeixinFun() {
            let that = this;
            wx.login({
                success(res) {
                    if (res.code) {
                        PreLogin({ code: res.code }).then(res => {
                            if (res.Status == 200 && !!res.Data) {
                                that.globalData.windowData.preToken = res.Data;
                                TryGetWorkerLoginByPreToken({ preToken: res.Data }).then(ret => {
                                    if (!ret.Data || !ret.Data.WorkerData) {
                                        // 没有查询到绑定员工
                                        Dialog.alert({
                                            title: '授权成功！',
                                            message: '当前没有绑定的账号信息。请先绑定员工！'
                                        }).then(() => {
                                            let url = '../bindStaff/index';
                                            wx.redirectTo({ url });
                                        });
                                    } else {
                                        // 有查询到绑定员工
                                        Toast.success({
                                            message: '登陆成功',
                                            position: 'top',
                                            duration: 3000
                                        });
                                        that.globalData.useInfo = ret.Data.WorkerData;
                                        that.globalData.windowData.CmpCode = ret.Data.WorkerData.CmpCode;
                                        that.globalData.windowData.Token = ret.Data.Token;
                                        wx.setStorageSync('Token', ret.Data.Token);
                                        wx.setStorageSync('WorkerId', ret.Data.WorkerData.WorkerId);
                                        that.globalData.windowData.UserId = ret.Data.UserId;
                                        that.WhoReadMyShareFun();
                                        that.GetWorkloadAndShareFun();
                                    }
                                });
                            } else {
                                wx.showToast({
                                    title: res.Message,
                                    icon: 'none',
                                    duration: 2000
                                });
                            }
                        });
                    }
                }
            });
        },
        GetWorkloadAndShareFun() {
            let params = {
                BeginDate: this.BeginDate,
                EndDate: this.EndDate,
                Type: this.screenType,
                Rtype: this.screenRtype
            };
            wx.showLoading({
                mask: true,
                title: '加载中' // 数据请求前loading
            });
            GetWorkloadAndShare(params).then(res => {
                if (res.Status == 200) {
                    this.tableList = res.Data.WorkloadTotalList;
                    this.ishow = true;
                    wx.stopPullDownRefresh();
                } else {
                    Toast.fail(res.Message);
                }
            });
        },
        WhoReadMyShareFun() {
            let params = {
                PageIndex: 1,
                PageSize: 1000,
                WorkerID: wx.getStorageSync('WorkerId'),
                Sort: {
                    Field: 'CreateTime',
                    IsASC: false
                }
            };
            QueryAccessLists(params).then(res => {
                if (res.Status == 200) {
                    this.shareList = res.Data.Data;
                    this.ishow2 = true;
                } else {
                    Toast.fail(res.Message);
                }
                wx.showLoading({
                    mask: true,
                    title: '加载中'
                });
            });
        },
        fastEnterFn(url, type) {
            if (type === 'switch') {
                wx.switchTab({ url });
            } else if (type === 'navigate') {
                wx.navigateTo({ url });
            }
        },
        changeType(val) {
            // 我的 部门 机构筛选
            if (this.screenRtype == 2 && val.val == 1) {
                Toast.fail('部门统计不能点击我的筛选');
                return false;
            }
            this.screenType = val.val;
            this.GetWorkloadAndShareFun();
        },
        changeTime(val) {
            // 时间筛选
            this.screenTime = val.idx;
            this.BeginDate = val.BeginDate;
            this.EndDate = val.EndDate;
            // this.WhoReadMyShareFun();
            this.GetWorkloadAndShareFun();
        },
        moreList(ids, i) {
            let url = '';
            if (!!ids && ids.length == 0) {
                Toast.fail('暂无新增');
                return;
            }
            this.globalData.windowData['tongji'] = ids;
            // if (i == 3) {
            //     Toast.fail('暂未开放');
            //     return;
            // }
            if (i == 6) {
                // 访客列表
                wx.navigateTo({ url: '../wywiad/index' });
                return;
            }
            wx.navigateTo({ url: '../tongjiList/index?type=' + i });
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.WhoReadMyShareFun();
        this.GetWorkloadAndShareFun();
    }
};
</script>
<style scoped lang="scss">
.index-wrapper {
    background-color: #f5f5f5;
    .blockGroll {
        position: absolute;
        top: 20px;
        display: inline-block;
    }
    .noticeGroll {
        height: 20px;
        padding: 5px;
        border: 1px solid #eee;
        border-radius: 20px;
        z-index: 100;
        position: absolute;
        top: 10px;
        background-color: #ffffff;
    }
    .filter-wrapper {
        padding: 0 12px;
        position: relative;
        height: 100%;
        overflow-y: auto;
        .item {
            border-radius: 3px;
            margin-bottom: 3px;
            background: #fff;
            &:last-child {
                margin-bottom: 0;
            }
            .top {
                padding: 5px;
                background-color: #1989fa;
                color: #ffffff;
            }
            ul.content {
                li {
                    position: relative;
                    padding: 5px 0;
                    width: 20%;
                    &:after {
                        content: '';
                        display: block;
                        width: 1px;
                        height: 70%;
                        position: absolute;
                        right: 0;
                        top: 15%;
                        background: #f5f5f5;
                    }
                    &:last-child:after {
                        display: none;
                    }
                }
            }
        }
    }
    .submit-wrap {
        width: 100%;
        bottom: 0;
        left: 0;
        .btn {
            width: 100%;
            height: 44px;
            line-height: 44px;
            text-align: center;
            background-color: #eee;
        }
    }
    ul.fast-enter {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        display: inline-block;
        li {
            width: 25%;
            float: left;
            text-align: center;
            margin: 20rpx 0px;
        }
    }
    .main-content {
        padding: 0px 20rpx 16rpx;
        .screenTitle {
            .typeBtn {
                margin-top: 14px;
                span {
                    color: #333;
                    border-right: 1px solid #eee;
                    padding: 5px;
                    &:last-child {
                        border-right: none;
                    }
                }
                span.active {
                    color: #1989fa;
                }
            }
            .rightBtn {
                width: 55%;
            }
            .timeBtn {
                span {
                    border: 1px solid #eee;
                    color: #333;
                    background-color: white;
                    border-right: none;
                    padding: 5px;
                    &:last-child {
                        border-right: 1px solid #eee;
                    }
                }
                span.active {
                    color: #ffffff;
                    background-color: #1989fa;
                    border: 1px solid #1989fa;
                }
            }
        }
        .item {
            border-radius: 3px;
            margin-bottom: 3px;
            background: #fff;
            &:last-child {
                margin-bottom: 0;
            }
            .top {
                padding: 5px;
                background-color: #1989fa;
                color: #ffffff;
            }
            ul.content {
                li {
                    position: relative;
                    padding: 5px 0;
                    width: 20%;
                    &:after {
                        content: '';
                        display: block;
                        width: 1px;
                        height: 70%;
                        position: absolute;
                        right: 0;
                        top: 15%;
                        background: #f5f5f5;
                    }
                    &:last-child:after {
                        display: none;
                    }
                }
            }
        }
        .shareDiv {
            .title {
                padding: 20rpx 10rpx;
            }
        }
    }
}
</style>
