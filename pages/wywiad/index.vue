<template>
    <div class="wywiad-wrapper">
        <div class="top fix">
            <van-search :value="SearchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>
        <div class="content">
            <ul class="clearfix bgCW top statistics">
                <li class="tc fl rel">
                    <p class="fs16 c3">{{ TotalPeople }}</p>
                    <p class="fs10 c9 mt4">总分享人</p>
                </li>
            </ul>
            <!-- 列表 -->
            <ul class="nav clearfix">
                <li :class="navActive === 0?'active':''"
                    @click="changeNavFn(0)">全部访客</li>
                <li :class="navActive === 3?'active':''"
                    @click="changeNavFn(3)">更多筛选</li>
            </ul>
            <ul class="lists" :class="navActive === 0 ? 'block' : 'none'">
                <li class="tc cRed" v-if="dataList.length == 0">暂无数据</li>
                <li class="rel" @click="goDetailFn(item.SourceId, item.SourceType)" v-for="(item, idx) in dataList" :key="idx">
                    <div class="rel">
                        <van-image width="50px" height="50px" fit="cover" round class="fl mr8" lazy-load @click.native.stop="thisPeople(item)" :src="item.AccessPeopleHeadPic" />
                        <div class="fl" style="width: calc(100vw - 150px);">
                            <div style="width: 100%;">
                                <div class="c3 fl"><span class="bold">{{ item.AccessPeopleName }}</span><span class="cBlue ml10" @click.native.stop="clickPhone(item.AccessPeoplePhone)">{{ item.AccessPeoplePhone }}</span></div>
                                <div class="c3 fr">
                                    <van-icon name="eye-o" class="fs16" />
                                    <span> {{ item.AccessSum }}次</span>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <p class="c6 fs12">时间：{{ item.CreateTime | formatTime }}</p>
                            <p class="c6 fs12">{{ item.AccessContent }}</p>
                        </div>
                        <div class="fr">
                            <van-icon class="fs26 cBlue" name="phone-o" v-if="item.AccessPeoplePhone && item.AccessPeoplePhone != ''" @click.native.stop="clickPhone(item.AccessPeoplePhone)" />
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && dataList.length > 0">已全部加载</div>
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
                    <div class="item">
                        <h4 class="c6 fs14">时间筛选</h4>
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
                          <van-cell v-for="(v, i) in SourceId" :key="i" :title="v.name">
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
import { QueryAccessLists } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
import blockSec from '@/components/blockSec';
import Vue from 'vue';
export default {
    components: {
        blockSec
    },
    onShow() {
        if (!!this.globalData.windowData.ProjectIds && this.globalData.windowData.ProjectIds.length > 0) {
            this.SourceId = this.globalData.windowData.ProjectIds;
        }
    },
    data() {
        return {
            windowHeight: 0, // 返回顶部
            floorstatus: false, // 返回顶部
            hackReset: true, // 用于刷新子组件
            TotalPeople: 0, // 总分享人
            SourceId: [], // 客源方 筛选用
            AccessIds: [],
            paramsJson: {
                SearchKey: null,
                PageIndex: 1,
                PageSize: 1000,
                SourceId: [], // 项目id
                SourceType: 0, // 枚举 项目0
                BeginDate: '', // 开始时间
                EndDate: '' // 结束时间
            },
            finished: false,
            dataList: [], // 全部报备列表数据
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
    },
    mounted() {
        this.AccessIds = this.globalData.windowData.tongji;
        this.Refresh();
        console.log(this.AccessIds);
    },
    methods: {
        clickPhone (val) { // 打电话
            wx.makePhoneCall({
                phoneNumber: val
            });
        },
        onChangeSearch(e) {
            // 搜索框值改变事件
            this.paramsJson.SearchKey = e.mp.detail;
        },
        onSearch() {
            this.paramsJson.PageIndex = 1;
            this.dataList = [];
            this.finished = false;
            this.QueryAccessListsFun();
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
            // 报备状态筛选
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
            this.SourceId = [];
            this.globalData.windowData.CreateUserId = [];
            this.globalData.windowData.SourceId = [];
            this.paramsJson = {
                SearchKey: null,
                PageIndex: 1,
                PageSize: 1000,
                SourceId: [], // 项目id
                SourceType: 0, // 枚举 项目0
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
            this.SourceId = this.SourceId.filter(res => {
                return res.id != id;
            });
            this.globalData.windowData.ProjectIds = this.SourceId;
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
            if (type == 0) wx.navigateTo({ url: '../attractInvestmentDetail/index?id=' + id }); // 项目详情
        },
        goSelPro () { // 选择项目
            let ProjectIdsStr = encodeURIComponent(JSON.stringify(this.SourceId));
            wx.navigateTo({ url: '../selPro/index?dataList=' + ProjectIdsStr+'&type=1' });
        },
        // 搜索
        searchFn() {},
        QueryAccessListsFun() {
            let params = this.paramsJson;
            params['SourceId'] = []; // 置空
            if (!!this.SourceId && this.SourceId.length > 0) {
                // 客源方参数赋值
                this.SourceId.forEach(res => {
                    params['SourceId'].push(res.id);
                });
            }
            if (!this.finished) {
                if (this.AccessIds && this.AccessIds.length>0) {
                    params["AccessIds"] = this.AccessIds;
                } else {
                    params["WorkerID"] = this.globalData.windowData.wywaid;
                }
                QueryAccessLists(params).then(res => {
                    if (res.Status == 200) {
                        this.Data = nullToStr(res.Data);
                        let CusList = res.Data.Data; // 全部报备列表数据
                        this.TotalPeople = res.Data.RowCount;
                        if (CusList.length == this.paramsJson.PageSize) {
                            this.paramsJson.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        this.dataList = this.dataList.concat(CusList);
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
        thisPeople(item) {
            // 点击头像查看此人看了我的明细
            let id = item.SourceId;
            let phone = item.AccessPeoplePhone;
            let name = item.AccessPeopleName;
            wx.navigateTo({ url: '../visit/index?id='+id+'&phone='+phone+'&name='+name });
        },
        Refresh() {
            this.finished = false;
            this.paramsJson.PageIndex = 1;
            this.dataList = [];
            this.QueryAccessListsFun();
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
            this.QueryAccessListsFun();
        }
    }
};
</script>
<style lang="scss">
.wywiad-wrapper {
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
                    width: calc(100% - 70px);
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
                > ul.sel-wywiad {
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
