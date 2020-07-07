<template>
    <div class="report-wrapper">
        <div class="top fix">
            <van-search :value="SearchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>5
        <div class="content">
            <ul class="clearfix bgCW top statistics">
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ TodayRecetTotal }}</p>
                    <p class="fs10 c9 mt4">今日</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ WeekReceTotal }}</p>
                    <p class="fs10 c9 mt4">本周</p>
                </li>
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ MonthReceTotal }}</p>
                    <p class="fs10 c9 mt4">本月</p>
                </li>
            </ul>
            <!-- 列表 -->
            <ul class="nav clearfix">
                <li :class="navActive === 0?'active':''"
                    @click="changeNavFn(0)">全部带看</li>
                <li :class="navActive === 1?'active':''"
                    @click="changeNavFn(1)">我的带看</li>
                <li :class="navActive === 3?'active':''"
                    @click="changeNavFn(3)">更多筛选</li>
            </ul>
            <ul class="lists" :class="navActive === 0 ? 'block' : 'none'">
                <li class="tc cRed" v-if="ReceptionList == '' || ReceptionList.length == 0">暂无数据</li>
                <li class="rel" v-if="ReceptionList != '' || ReceptionList.length>0" @click="goDetailFn(item.Id, item.ReceptionType)" v-for="(item, idx) in ReceptionList" :key="idx">
                    <div class="content">
                        <div class="clearfix mb12 tit-wrap">
                            <h4 class="fl fs16 c0">{{ item.ReceptionName }}</h4>
                            <div class="fl tag-wrap ml8">
                                <van-tag class="tag" v-if="item.ReceptionType != ''" size="medium" type="success">{{ item.ReceptionType }}</van-tag>
                            </div>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">带看项目:</label>
                            <p class="fl block fs14 c6">{{ item.ProjectName }}</p>
                        </div>
                        <div class="clearfix item">
                            <label class="fl block fs14 c6">带看时间:</label>
                            <p class="fl block fs14 c6">{{ item.ReceptionTime | formatTime }}</p>
                        </div>
                    </div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && ReceptionList.length > 0">已全部加载</div>
            </ul>
            <ul class="lists" :class="navActive === 1 ? 'block' : 'none'">
                <li class="tc cRed" v-if="MyReceptionList == '' || MyReceptionList.length == 0">暂无数据</li>
                <li class="rel" v-if="MyReceptionList != '' || MyReceptionList.length>0" @click="goDetailFn(item.Id, item.ReceptionType)" v-for="(item, idx) in MyReceptionList" :key="idx">
                    <div class="content">
                        <div class="clearfix mb12 tit-wrap">
                            <h4 class="fl fs16 c0">{{ item.ReceptionName }}</h4>
                            <div class="fl tag-wrap ml8">
                                <van-tag class="tag" v-if="item.ReceptionType != ''" size="medium" type="success">{{ item.ReceptionType }}</van-tag>
                            </div>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">带看项目:</label>
                            <p class="fl block fs14 c6">{{ item.ProjectName }}</p>
                        </div>
                        <div class="clearfix item">
                            <label class="fl block fs14 c6">带看时间:</label>
                            <p class="fl block fs14 c6">{{ item.ReceptionTime | formatTime }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 更多筛选 -->
        <van-popup :show="isShow"
                   closeable
                   position="right"
                   custom-style="height: 100%;width:280px;"
                   @close="onCloseFilterFn">
            <div class="filter-wrapper">
                <h4 class="abs">数据筛选</h4>
                <div class="content">
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="带看类型" lsCode="ReceptionType" /></div>
                    <div class="item" style="height: 90px;">
                        <h4 class="c6 fs14">客源方</h4>
                        <ul class="sel-report clearfix fl overflowXA" style="max-width: 75%;padding-top: 3px;height: 85px;">
                            <li v-for="(v, i) in CreateUserId" :key="i">
                                <van-image round width="50px" height="50px" :src="v.img" />
                                <p class="fs14 tc mt4 c6 ellipsis">{{ v.name }}</p>
                                <van-icon name="clear" @click="deleteWorker(v.name, v.id)" class="abs icon" />
                            </li>
                        </ul>
                        <ul class="sel-report fl" style="width: 25%;">
                            <li class="add-btn" @click="goSelPersonFn"><p>+</p></li>
                        </ul>
                    </div>
                    <div class="item">
                        <h4 class="c6 fs14">带看时间</h4>
                        <van-cell is-link :value="BegainTime" @click="()=>{this.BegainPopup = true}">
                            <view slot="title" class="clearfix">
                                <div class="rel"><span class="van-cell-text">开始时间</span></div>
                            </view>
                        </van-cell>
                        <van-cell is-link :value="EndTime" @click="()=>{this.EndPopup = true}">
                            <view slot="title" class="clearfix">
                                <div class="rel"><span class="van-cell-text">结束时间</span></div>
                            </view>
                        </van-cell>
                    </div>
                    <div class="item rel">
                        <h4 class="c6 fs14">选择项目</h4>
                        <van-button class="abs" type="default" style="top:0px;right: 10px;" size="small" @click="goSelPro">添加</van-button>
                        <van-cell-group>
                          <van-cell v-for="(v, i) in ProjectIds" :key="i" :title="v.name">
                              <view>
                                  <van-button type="danger" size="small" @click="deletePro(v.name, v.id)">删除</van-button>
                              </view>
                          </van-cell>
                        </van-cell-group>
                   </div>
                </div>
            </div>
            <div class="fix submit-wrap clearfix bgCW">
                <div class="fl btn cBlue" @click="resert">重置</div>
                <div class="fl btn bgCBlue cWhite" @click="search">确定</div>
            </div>
        </van-popup>
        <van-popup class="overflow" :show="BegainPopup"
                   position="bottom"
                   @close="()=>{this.BegainPopup = false}">
                   <van-datetime-picker
                     type="datetime"
                     :value="currentDate"
                     @cancel="()=>{this.BegainPopup = false}"
                     @confirm="BegainFirm"
                   />
        </van-popup>
        <van-popup class="overflow" :show="EndPopup"
                   position="bottom"
                   @close="()=>{this.EndPopup = false}">
                   <van-datetime-picker
                     type="datetime"
                     :value="currentDate"
                     @cancel="()=>{this.EndPopup = false}"
                     @confirm="EndFirm"
                   />
        </van-popup>
        <div class="common-top-btn fix bgCBlue tc" @click="goTop" v-show="floorstatus"><van-icon name="arrow-up" class="icon cWhite" /></div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '../../static/vant/toast/toast';
import { QueryReceptionLists } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
import blockSec from '@/components/blockSec';
import Vue from 'vue';
let paramsJsonChushi = {
    SearchKey: null,
    PageIndex: 1,
    PageSize: 15,
    ReceptionType: '', // 带看类型
    CreateUserId: [], //  // 客源方 筛选用
    ProjectIds: [], // 带看的项目
    AppointmentTime: '', // 带看时间
    BeginDate: '', // 开始时间
    EndDate: '' // 结束时间
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
        if (!!this.globalData.windowData.ProjectIds && this.globalData.windowData.ProjectIds.length > 0) {
            this.ProjectIds = this.globalData.windowData.ProjectIds;
        }
    },
    data() {
        return {
            windowHeight: 0, // 返回顶部
            floorstatus: false, // 返回顶部
            paramsJsonChushi, // 列表参数初始化
            hackReset: true, // 用于刷新子组件
            TodayRecetTotal: 0, // 今日带看数量
            WeekReceTotal: 0, // 本周带看数量
            MonthReceTotal: 0, // 本月带看数量
            CreateUserId: [], // 客源方 筛选用
            ProjectIds: [], // 客源方 筛选用
            paramsJson: {
                SearchKey: null,
                PageIndex: 1,
                PageSize: 15,
                ReceptionType: '', // 带看类型
                CreateUserId: [], //  // 客源方 筛选用
                ProjectIds: [], // 带看的项目
                AppointmentTime: '', // 带看时间
                BeginDate: '', // 开始时间
                EndDate: '' // 结束时间
            },
            finished: false,
            ReceptionList: [], // 全部带看列表数据
            MyReceptionList: [], // 我的带看列表数据
            navActive: 0,
            isShow: false,
            currentDate: new Date().getTime(),
            BegainTime: '请选择开始时间', // 开始时间
            BegainPopup: false, // 开始时间picker
            EndTime: '请选择结束时间', // 结束时间
            EndPopup: false, // 结束时间picker
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
            this.ReceptionList = [];
            this.MyReceptionList = [];
            this.finished = false;
            this.QueryReceptionListsFun();
        },
        BegainFirm (e) {
            this.BegainTime = Vue.filter('formatTime')(new Date(e.detail));
            this.paramsJson.BeginDate = this.BegainTime;
            this.BegainPopup = false;
        },
        EndFirm (e) {
            if (e.detail < new Date(this.BegainTime).getTime()) {
                wx.showModal({
                    title: '提示',
                    content: '结束时间不能大于开始时间'
                });
                this.EndTime = "请选择结束时间";
                return;
            }
            this.EndTime = Vue.filter('formatTime')(new Date(e.detail));
            this.paramsJson.EndDate = this.EndTime;
            this.EndPopup = false;
        },
        listenTochildFun(val, name) {
            // 带看状态筛选
            if (val[0].FormatCode == -1) {
                this.paramsJson[name] = '';
            } else {
                this.paramsJson[name] = val[0].FormatCode;
            }
        },
        resert() {
            // 筛选重置
            this.hackReset = false;
            this.$nextTick(() => {
                this.hackReset = true;
            });
            this.CreateUserId = [];
            this.ProjectIds = [];
            this.globalData.windowData.CreateUserId = [];
            this.globalData.windowData.ProjectIds = [];
            this.paramsJson = {
                SearchKey: null,
                PageIndex: 1,
                PageSize: 15,
                ReceptionType: '', // 带看类型
                CreateUserId: [], //  // 客源方 筛选用
                ProjectIds: [], // 带看的项目
                AppointmentTime: '', // 带看时间
                BeginDate: '', // 开始时间
                EndDate: '' // 结束时间
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
        deletePro(name, id) {
            // 删除选择的项目
            this.ProjectIds = this.ProjectIds.filter(res => {
                return res.id != id;
            });
            this.globalData.windowData.ProjectIds = this.ProjectIds;
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
        goDetailFn(id, type) {
            wx.navigateTo({ url: '../ReceptionDetail/index?id=' + id +'&type='+type });
        },
        goSelPersonFn() {
            let CreateUserIdStr = encodeURIComponent(JSON.stringify(this.CreateUserId));
            wx.navigateTo({ url: '../selPerson/index?dataList=' + CreateUserIdStr+'&type=1' });
        },
        goSelPro () { // 选择项目
            let ProjectIdsStr = encodeURIComponent(JSON.stringify(this.ProjectIds));
            wx.navigateTo({ url: '../selPro/index?dataList=' + ProjectIdsStr+'&type=1' });
        },
        // 搜索
        searchFn() {},
        QueryReceptionListsFun() {
            let params = this.paramsJson;
            params['CreateUserId'] = []; // 置空
            params['ProjectIds'] = []; // 置空
            if (!!this.CreateUserId && this.CreateUserId.length > 0) {
                // 客源方参数赋值
                this.CreateUserId.forEach(res => {
                    params['CreateUserId'].push(res.id);
                });
            }
            if (!!this.ProjectIds && this.ProjectIds.length > 0) {
                // 客源方参数赋值
                this.ProjectIds.forEach(res => {
                    params['ProjectIds'].push(res.id);
                });
            }
            if (!this.finished) {
                QueryReceptionLists(params).then(res => {
                    if (res.Status == 200) {
                        if (this.paramsJson.PageIndex == 1) {
                            this.TodayRecetTotal= res.Data.TodayRecetTotal;
                            this.MonthReceTotal = res.Data.MonthReceTotal;
                            this.WeekReceTotal= res.Data.WeekReceTotal;
                        }
                        let CusList = (res.Data.ReceptionList == "") ? [] : res.Data.ReceptionList; // 全部带看列表数据
                        let FavoriteList = (res.Data.MyReceptionList == '') ? [] : res.Data.MyReceptionList; // 我的收藏列表数据
                        if (CusList.length == this.paramsJson.PageSize) {
                            this.paramsJson.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        if (CusList != '' || CusList.length>0) this.ReceptionList = this.ReceptionList.concat(CusList);
                        if (FavoriteList != '' || FavoriteList.length>0) this.MyReceptionList = this.MyReceptionList.concat(FavoriteList);
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
            this.ReceptionList = [];
            this.MyReceptionList = [];
            this.QueryReceptionListsFun();
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
            this.QueryReceptionListsFun();
        }
    }
};
</script>
<style lang="scss">
.report-wrapper {
    > .top {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    > .content {
        padding-top: 50px;
        ul.statistics {
            margin: 16px;
            border-top: 1px solid #f5f5f5;
            padding: 12px 0;
            width: calc(100% - 32px);
            li {
                width: 33%;
                &:after {
                    content: "";
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
                .content {
                    width: 100%;
                    .tit-wrap {
                        .tag {
                            top: -2px;
                        }
                    }
                    .item {
                        label {
                            width: 70px;
                            margin-right: 8px;
                        }
                        > p {
                            width: calc(100% - 78px);
                        }
                    }
                }
                .state {
                    width: 80px;
                    top: 50px;
                    right: 0;
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
            padding: 30px 0 45px 0;
            .item {
                margin-bottom: 8px;
                > h4 {
                    padding: 8px 0;
                }
                > ul.sel-report {
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
