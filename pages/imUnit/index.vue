<template>
    <div class="imUnit-wrapper">
        <div class="top fix">
            <van-search :value="SearchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
            <div class="block pb8 tc bgCW">
                <van-tag class="mr8" v-for="(item, idx) in GetItemsData['Ls.Ag.Vacancy']" :key="idx" :color="item.Property1">{{item.ItemName}}</van-tag>
            </div>
        </div>
        <div class="content">
            <!-- 列表 -->
            <ul class="nav clearfix">
                <li :class="navActive === 0?'active':''"
                    @click="changeNavFn(0)">全部房源</li>
                <li :class="navActive === 3?'active':''"
                    @click="changeNavFn(3)">更多筛选</li>
            </ul>
            <ul class="lists" :class="navActive === 0 ? 'block' : 'none'">
                <li class="tc cRed" v-if="ImUnitList == '' || ImUnitList.length == 0">暂无数据</li>
                <li class="rel" v-if="ImUnitList != '' || ImUnitList.length>0" @click="goImUnit(item.Id, item.FullName)" v-for="(item, idx) in ImUnitList" :key="idx">
                    <div class="fl" style="width: calc(100% - 50px);">
                        <div class="clearfix mb12 tit-wrap">
                            <h4 class="fl fs16 c0">{{ item.FullName }}</h4>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">面积:</label>
                            <p class="fl block fs14 c6 mr10">{{ item.ConstructionArea }}㎡</p>
                            <label class="fl block fs14 c6">房间类型:</label>
                            <p class="fl block fs14 c6">{{ item.ImUnitType | GetItemsFilter('Ls.Ag.ImUnitType', globalData.windowData.GetItemsData) }}</p>
                        </div>
                        <div class="clearfix item">
                            <label class="fl block fs14 c6">日均价:</label>
                            <p class="fl block fs14 c6">{{ item.DailyRent }}元</p>
                        </div>
                    </div>
                    <div class="fl tc cWhite" style="width: '50px'">
                        <van-tag :color="item.UnitStatusColor" size="large">{{ item.UnitStatus | GetItemsFilter('Ls.Ag.Vacancy', globalData.windowData.GetItemsData) }}</van-tag>
                    </div>
                    <div class="clearfix"></div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && ImUnitList.length > 0">已全部加载</div>
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
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="房间类型" lsCode="ImUnitType" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="房间状态" lsCode="Vacancy" /></div>
                    <div class="item">
                        <h4 class="c6 fs14">建筑面积</h4>
                        <div class="block">
                            <input class="fl cont fs14" type="number" :value="paramsJson.AreaMin" @input="getAreaMin" placeholder="请输入" style="width:100rpx;" />
                            <view class="fl tc c3 fs14" style="width:80rpx;">-</view>
                            <input class="fl cont fs14" type="number" :value="paramsJson.AreaMax" @input="getAreaMax" placeholder="请输入" style="width:100rpx;" />
                            <view class="clearfix"></view>
                        </div>
                    </div>
                    <div class="item">
                        <h4 class="c6 fs14">日租金</h4>
                        <div class="block">
                            <input class="fl cont fs14" type="number" :value="paramsJson.DailyRentMin" @input="getDailyRentMin" placeholder="请输入" style="width:100rpx;" />
                            <view class="fl tc c3 fs14" style="width:80rpx;">-</view>
                            <input class="fl cont fs14" type="number" :value="paramsJson.DailyRentMax" @input="getDailyRentMax" placeholder="请输入" style="width:100rpx;" />
                            <view class="clearfix"></view>
                        </div>
                    </div>
                    <div class="item">
                        <h4 class="c6 fs14">省市区</h4>
                        <areas-list
                            @listenTochildEvent="AreaListFun"
                            :isVal="paramsJson.AreaCode"
                            label="省市区" />
                    </div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="餐饮条件" lsCode="CateringType" /></div>
                    <div class="item"><block-sec v-if="hackReset" @listenTochildEvent="listenTochildFun" label="装修" lsCode="DecoRate" /></div>
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
import { QueryImUnitLists } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
import blockSec from '@/components/blockSec';
import areasList from '@/components/areasList';
import Vue from 'vue';
export default {
    components: {
        blockSec,
        areasList
    },
    onShow() {
        // 所选项目
        if (!!this.globalData.windowData.ProjectIds && this.globalData.windowData.ProjectIds.length > 0) {
            this.ProjectIds = this.globalData.windowData.ProjectIds;
        }
        if (this.globalData.windowData.imUnit) {
            this.Refresh();
            this.globalData.windowData.imUnit = false;
        }
    },
    data() {
        return {
            GetItemsData: this.globalData.windowData.GetItemsData,
            windowHeight: 0, // 返回顶部
            floorstatus: false, // 返回顶部
            hackReset: true, // 用于刷新子组件
            ProjectIds: [], // 项目 筛选用
            paramsJson: {
                // SearchKey: null,
                PageIndex: 1,
                PageSize: 15,
                UnitStatus: '', // 商铺状态
                ProjectIds: [], // 项目id
                DecoRate: '', // 装修
                ProvinceCode: '', // 省
                CityCode: '', // 市
                AreaCode: '', // 区
                ImUnitType: '', // 商铺类别
                FoodConditions: '', // 餐饮条件
                DailyRentMin: '', // 日租金最小值
                DailyRentMax: '', // 日租金最大值
                AreaMin: '', // 建筑面积最小值
                AreaMax: '' // 建筑面积最大值
            },
            finished: false,
            ImUnitList: [], // 全部带看列表数据
            navActive: 0,
            isShow: false,
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
        AreaListFun (val) {
            if(!!val && val.length > 2) {
                this.paramsJson.ProvinceCode = val[0].code;
                this.paramsJson.CityCode = val[1].code;
                this.paramsJson.AreaCode = val[2].code;
            }
        },
        onSearch() {
            this.paramsJson.PageIndex = 1;
            this.ImUnitList = [];
            this.finished = false;
            this.QueryImUnitListsFun();
        },
        getAreaMin (val) { // 建筑面积最小值
            this.paramsJson.AreaMin = val.detail.value;
        },
        getAreaMax (val) { // 建筑面积最大值
            this.paramsJson.AreaMax = val.detail.value;
        },
        getDailyRentMin (val) { // 日租金最小值
            this.paramsJson.DailyRentMin = val.detail.value;
        },
        getDailyRentMax (val) { // 日租金最大值
            this.paramsJson.DailyRentMax = val.detail.value;
        },
        listenTochildFun(val, name) {
            // 带看状态筛选
            if (val[0].FormatCode == -1) {
                if (name == 'CateringType') {
                    this.paramsJson['FoodConditions'] = '';
                } else if (name == 'Vacancy') {
                    this.paramsJson['UnitStatus'] = '';
                } else {
                    this.paramsJson[name] = '';
                }
            } else {
                if (name == 'CateringType') {
                    this.paramsJson['FoodConditions'] = val[0].FormatCode;
                } else if (name == 'Vacancy') {
                    this.paramsJson['UnitStatus'] = val[0].FormatCode;
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
            this.ProjectIds = [];
            this.globalData.windowData.ProjectIds = [];
            this.paramsJson = {
                PageIndex: 1,
                PageSize: 15,
                UnitStatus: '', // 商铺状态
                ProjectIds: [], // 项目id
                DecoRate: '', // 装修
                ProvinceCode: '', // 省
                CityCode: '', // 市
                AreaCode: '', // 区
                ImUnitType: '', // 商铺类别
                FoodConditions: '', // 餐饮条件
                DailyRentMin: '', // 日租金最小值
                DailyRentMax: '', // 日租金最大值
                AreaMin: '', // 建筑面积最小值
                AreaMax: '' // 建筑面积最大值
            }; // 参数初始化
            this.Refresh();
        },
        search() {
            // 筛选搜索
            this.Refresh();
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
        // 房间详情
        goImUnit (id, FullName) {
            wx.navigateTo({ url: '../imUnitDetail/index?id=' + id +'&name=' + FullName });
        },
        goSelPro () { // 选择项目
            let ProjectIdsStr = encodeURIComponent(JSON.stringify(this.ProjectIds));
            wx.navigateTo({ url: '../selPro/index?dataList=' + ProjectIdsStr+'&type=1' });
        },
        // 搜索
        searchFn() {},
        QueryImUnitListsFun() {
            let params = this.paramsJson;
            params['ProjectIds'] = []; // 置空
            if (!!this.ProjectIds && this.ProjectIds.length > 0) {
                // 客源方参数赋值
                this.ProjectIds.forEach(res => {
                    params['ProjectIds'].push(res.id);
                });
            }
            if (!this.finished) {
                QueryImUnitLists(params).then(res => {
                    if (res.Status == 200) {
                        let CusList = (res.Data.Data == '') ? [] : res.Data.Data; // 全部带看列表数据
                        if (CusList.length == this.paramsJson.PageSize) {
                            this.paramsJson.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        if (CusList != '' || CusList.length>0) this.ImUnitList = this.ImUnitList.concat(CusList);
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
            this.ImUnitList = [];
            this.QueryImUnitListsFun();
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
            this.QueryImUnitListsFun();
        }
    }
};
</script>
<style lang="scss">
.imUnit-wrapper {
    > .top {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    > .content {
        padding-top: 85px;
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
                > ul.sel-imUnit {
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
        .submit-wrap {
            width: 100%;
            bottom: 0;
            left: 0;
            .btn {
                width: 50%;
                height: 44px;
                line-height: 44px;
                text-align: center;
            }
        }
    }
}
</style>
