<template>
    <div class="attractInvestmentDetail-wrapper">
        <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000" indicator-active-color="#1989fa">
            <block v-for="(item, index) in imageLists" :index="index" :key="key">
                <swiper-item><image :src="imageDoin + item.ImageUrl" class="slide-image" mode="scaleToFill" /></swiper-item>
            </block>
        </swiper>
        <swiper class='swiper-box' autoplay='true' interval='2000' vertical='true' circular='true'>
          <swiper-item class='item' v-for='(item, index) in shareList' :key="index">
              <div class="noticeGroll fs14">
                  <van-image width="20px" height="20px" fit="cover" round class="fl mr8" lazy-load :src="item.AccessPeopleHeadPic" />
                  <div class="fl"><span class="cBlue bold">{{ item.AccessPeopleName }}</span>查看了此房源</div>
              </div>
          </swiper-item>
        </swiper>
       <!-- <div :class="{'animated':true,'abs':true,'slow':true,'fadeInUp': fadeInUp}" style="top: 30px;" v-if="shareList.length>0 && AccessPeopleName != ''">
            <div class="noticeGroll fs14">
                <van-image width="20px" height="20px" fit="cover" round class="fl mr8" lazy-load :src="AccessPeopleHeadPic" />
                <div class="fl"><span class="cBlue bold">{{ AccessPeopleName }}</span>查看了此房源</div>
            </div>
        </div> -->
        <div class="content bgCW borBF58">
            <div class="clearfix">
                <p class="bold c3 fs14 fl">{{ Entity.ProjectName ? Entity.ProjectName : '' }}</p>
                <van-tag class="fl rel tag ml8" type="success">{{ Entity.ProjectStatus | GetItemsFilter('Ls.Ag.ProjectStatus', globalData.windowData.GetItemsData) }}</van-tag>
            </div>
            <p class="fs12 c9 mt8">项目编号：{{ Entity.ProCode ? Entity.ProCode : '' }}</p>
            <ul class="lists">
                <li class="clearfix">
                    <label>项目类型:</label>
                    <p>{{ Entity.ProjectType | GetItemsFilter('Ls.Ag.ProjectType', globalData.windowData.GetItemsData) }}</p>
                </li>
                <li class="clearfix">
                    <label>建筑面积:</label>
                    <p v-if="Entity.ConstrucArea">{{ Entity.ConstrucArea ? Entity.ConstrucArea : '' }}m²</p>
                </li>
                <li class="clearfix">
                    <label>项目均价:</label>
                    <p>{{ Entity.AvgPrice ? Entity.AvgPrice : '' }}{{ Entity.PerUnit ? Entity.PerUnit : '' }}</p>
                </li>
                <li class="clearfix">
                    <label>项目地址:</label>
                    <p>{{ Entity.Province ? Entity.Province : '' }}{{ Entity.City ? Entity.City : '' }}{{ Entity.Area ? Entity.Area : '' }}{{ Entity.ProjectAddress ? Entity.ProjectAddress : '' }}</p>
                </li>
                <li class="clearfix">
                    <label>推荐业态:</label>
                    <p v-if="!!Entity.Types">
                        <van-tag v-for="(item, index) in Entity.Types" :key="index" class="fl rel tag ml8" type="primary">{{ item.Name }}</van-tag>
                    </p>
                </li>
                <li class="clearfix">
                    <label>驻场人员:</label>
                    <p v-if="!!Entity.Residents && Entity.Residents.length>0">
                        <div class="fs14 cBlue" style="margin-left: 78px;" v-for="(v, i) in Entity.Residents" :key="i"  @click="clickPhone(v.PhoneNum)">
                            {{ v.StaffName }} - {{ v.PhoneNum }}
                            <van-icon
                                class="fs14 cBlue"
                                name="phone-o"
                                v-if="v.PhoneNum && v.PhoneNum != ''"
                            />
                        </div>
                    </p>
                </li>
                <li class="clearfix">
                    <label>项目介绍:</label>
                    <p>{{ Entity.ProjectDesc ? Entity.ProjectDesc : '' }}</p>
                </li>
            </ul>
            <map-wx
                v-if="hackReset"
                class="mt12 block"
                :address="`${Entity.City}${Entity.Area}${Entity.ProjectAddress}`"
                :name="Entity.ProjectName"
                :scale="16"
                :enable-zoom="false"
                :enable-scroll="false"
                width="100%"
                height="400rpx"
                />
        </div>
        <div class="content-tab">
            <van-tabs color="#1989fa" animated="true" swipeable="true">
                <van-tab title="详细信息">
                    <dl class="bgCW tab-content-detail">
                        <dt>商务条款</dt>
                        <dd class="clearfix">
                            <label>付款方式:</label>
                            <p>押{{ Entity.Deposit ? Entity.Deposit : '' }}付{{ Entity.Pay ? Entity.Pay : '' }}</p>
                        </dd>
                        <dd class="clearfix">
                            <label>递增方式:</label>
                            <p>{{ Entity.YearIncrement ? Entity.YearIncrement : '' }}年{{ Entity.YearIncrementPercent ? Entity.YearIncrementPercent : '' }}%</p>
                        </dd>
                        <dd class="clearfix">
                            <label>物业费:</label>
                            <p v-if="Entity.PropertyCosts">{{ Entity.PropertyCosts ? Entity.PropertyCosts : '' }}元/m²·月</p>
                        </dd>
                        <dd class="clearfix">
                            <label>合同年限:</label>
                            <p>{{ Entity.ContractTermBegin ? Entity.ContractTermBegin : '' }}-{{ Entity.ContractTermEnd ? Entity.ContractTermEnd : '' }}年</p>
                        </dd>
                        <dd class="clearfix">
                            <label>免租期:</label>
                            <p>{{ Entity.RentFreePeriodBegin ? Entity.RentFreePeriodBegin : '' }}-{{ Entity.RentFreePeriodEnd ? Entity.RentFreePeriodEnd : '' }}天</p>
                        </dd>
                        <dt class="mt16">建筑信息</dt>
                        <dd class="clearfix">
                            <label>得房率:</label>
                            <p v-if="Entity.RoomRate">{{ Entity.RoomRate ? Entity.RoomRate : '' }}%</p>
                        </dd>
                        <dd class="clearfix">
                            <label>商业面积:</label>
                            <p v-if="Entity.CommercialArea">{{ Entity.CommercialArea ? Entity.CommercialArea : '' }}m²</p>
                        </dd>
                        <dd class="clearfix">
                            <label>办公面积:</label>
                            <p v-if="Entity.WorkArea">{{ Entity.WorkArea ? Entity.WorkArea : '' }}m²</p>
                        </dd>
                        <dd class="clearfix">
                            <label>地上层数:</label>
                            <p>{{ Entity.GroundFloor ? Entity.GroundFloor : '' }}</p>
                        </dd>
                        <dd class="clearfix">
                            <label>地下层数:</label>
                            <p>{{ Entity.BaseNum ? Entity.BaseNum : '' }}</p>
                        </dd>
                        <dd class="clearfix">
                            <label>车位数:</label>
                            <p>{{ Entity.CarsNumber ? Entity.CarsNumber : '' }}</p>
                        </dd>
                        <dd class="clearfix">
                            <label>电梯:</label>
                            <p>{{ Entity.Elevator ? Entity.Elevator : '' }}</p>
                        </dd>
                    </dl>
                </van-tab>
                <van-tab title="项目描述">
                    <div class="tab-pro-detail">
                        <van-uploader show-upload="false" :file-list="projectDesc" :disabled="true" :deletable="false" />
                    </div>
                </van-tab>
                <van-tab title="房态图">
                    <div class="block p8 tc">
                        <van-tag class="mr8" v-for="(item, idx) in GetItemsData['Ls.Ag.Vacancy']" :key="idx" :color="item.Property1">{{item.ItemName}}</van-tag>
                    </div>
                    <van-collapse class="tab-ftt-detail" :value="activeNameFTT" @change="onChangeFTT" accordion>
                        <van-collapse-item :name="idx+1" v-for="(item, idx) in HomeTreeList" :key="idx">
                            <view slot="title">
                                <span class="bold fs16 fl">{{ item.Name }}</span>
                                <span class="fr">日均价:{{ item.DayAverage ? item.DayAverage : 0 }}元</span>
                                <span class="fr mr8">总面积:{{ item.BuildingAreaTotal }}㎡</span>
                                <span class="fr mr8">总房源:{{ item.UnitTotal ? item.UnitTotal : 0 }}</span>
                                <span class="clearfix"></span>
                            </view>
                            <div class="item" v-if="item.Children && item.Children.length>0" v-for="(item2, idx2) in item.Children" :key="idx2">
                                <view style="padding: 0 8px 8px;">
                                    <span class="c3 fs14 fl">第{{ item2.Name }}</span>
                                    <span class="fr">日均价:{{ item2.DayAverage }}元</span>
                                    <span class="fr mr8">总面积:{{ item2.BuildingAreaTotal }}㎡</span>
                                    <span class="fr mr8">房源:{{ item2.UnitTotal ? item.UnitTotal : 0 }}</span>
                                    <span class="clearfix"></span>
                                </view>
                                <ul class="clearfix">
                                    <li class="fl bgCBlue" :style="{'background-color':item3.UnitStatusColor}" v-if="item2.Children && item2.Children.length>0" v-for="(item3, idx3) in item2.Children" :key="idx3" @click="goImUnit(item3.Id, item3.FullName)">
                                        <p class="ellipsis">{{ item3.Name }}</p>
                                        <p class="ellipsis">{{ item3.ConstructionArea }}㎡</p>
                                    </li>
                                </ul>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </van-tab>
                <van-tab title="相关客户" v-if="!isTourist">
                    <van-collapse class="tab-cust-detail" :value="activeNameCust" @change="onChangeCust" accordion>
                        <van-collapse-item name="1">
                            <view slot="title" class="clearfix">
                                客户
                                <span class="fr block rel num bgCBlue fs12 cWhite">{{ CustCount }}</span>
                            </view>
                            <div class="item" v-for="(item, index) in RelevantCust" @click="goCustDetailFn(item.CustId)" :key="index">
                                <div class="top clearfix">
                                    <h4 class="c3 bold fs16 fl">{{ item.CustName }}</h4>
                                    <div class="clearfix tag-wrap fl">
                                        <van-tag v-if="item.CustStatus == '无效'" class="tag" size="medium" type="danger">无效</van-tag>
                                        <van-tag v-if="item.CustStatus == '有效'" class="tag" size="medium" type="success">有效</van-tag>
                                        <van-tag v-if="item.IsImPrivateCust == false" class="tag" size="medium" type="danger">公客</van-tag>
                                        <van-tag v-if="item.IsImPrivateCust == true" class="tag" size="medium" type="success">私客</van-tag>
                                        <van-tag class="tag" size="medium" type="primary">{{ item.MerchantsType }}</van-tag>
                                        <van-tag class="tag" size="medium" type="warning">{{ item.IsLook }}</van-tag>
                                    </div>
                                </div>
                                <div class="clearfix mt8 fs14 c9">
                                    <p class="fl">{{ item.FormatName ? item.FormatName : '-' }}</p>
                                    <p class="fl" v-if="item.Brand !=''">/{{ item.Brand ? item.Brand : '-' }}</p>
                                    <p class="fl" v-if="item.AreaMin !='' || item.AreaMax != ''">/{{ item.AreaMin ? item.AreaMin : '-' }}-{{ item.AreaMax ? item.AreaMax : '-' }}㎡</p>
                                </div>
                                <div class="clearfix mt8 fs14 c9" v-if="item.JobTitle !='' || item.CustCompany != ''">{{ item.JobTitle }}/{{ item.CustCompany }}</div>
                            </div>
                            <div class="cBlue tc fs12 mt8" v-if="CustCount>5" @click="seeMoreList(1)">查看更多>></div>
                        </van-collapse-item>
                        <van-collapse-item name="2">
                            <view slot="title" class="clearfix">
                                渠道
                                <span class="fr block rel num bgCBlue fs12 cWhite">{{ AgentCount }}</span>
                            </view>
                            <div class="item" v-for="(item, index) in RelevantAgent" @click="goAgentDetailFn(item.Id)" :key="index">
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
                            <div class="cBlue tc fs12 mt8" v-if="AgentCount>5" @click="seeMoreList(4)">查看更多>></div>
                        </van-collapse-item>
                    </van-collapse>
                </van-tab>
            </van-tabs>
        </div>
        <van-tabbar @change="onChangeTabbar" v-if="!isTourist">
            <van-tabbar-item icon="comment-o">写动态</van-tabbar-item>
            <van-tabbar-item icon="edit">编辑项目</van-tabbar-item>
            <van-tabbar-item>
                <button plain="true" open-type="share" class="share-btn"  :data-proDetail="Entity">
                    <van-icon class="fs18 w100" name="upgrade" style="margin-bottom: 8px;" />
                    <span class="w100 inlineBlock" style="padding-bottom: 5px;">分享</span>
                </button>
            </van-tabbar-item>
            <van-tabbar-item icon="bars">更多操作</van-tabbar-item>
        </van-tabbar>
        <!-- 游客登录按钮 -->
        <van-tabbar @change="onChangeTabbar2" v-if="isTourist">
            <van-tabbar-item icon="add-o">新增报备</van-tabbar-item>
            <van-tabbar-item>
                <button plain="true" open-type="share" class="share-btn"  :data-proDetail="Entity">
                    <van-icon class="fs18 w100" name="upgrade" style="margin-bottom: 8px;" />
                    <span class="w100 inlineBlock" style="padding-bottom: 5px;">分享</span>
                </button>
            </van-tabbar-item>
        </van-tabbar>
        <!-- 更多操作 -->
        <van-popup
            class="overflow"
            position="bottom"
            custom-style="height: 275rpx"
            :show="isShowPopup"
            closeable
            @close="
                () => {
                    this.isShowPopup = false;
                }
            ">
            <h4 class="c3 fs14 bold tc common-more-btn-tit">更多操作</h4>
            <van-grid>
                <van-grid-item use-slot @click="moreToobar(1)">
                    <van-icon name="friends-o" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">招商人员</p>
                </van-grid-item>
                <van-grid-item use-slot @click="moreToobar(2)">
                    <van-icon name="delete" color="#ee0a24" size="50rpx" />
                    <p class="tc mt8 fs12 cRed">删除项目</p>
                </van-grid-item>
                <van-grid-item use-slot>
                    <van-icon name="hotel-o" @click="moreToobar(3)" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">编辑房态表</p>
                </van-grid-item>
                <van-grid-item use-slot @click="moreToobar(4)">
                    <van-icon name="add-o" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">新增房源</p>
                </van-grid-item>
            </van-grid>
        </van-popup>
        <div v-if="isTourist" class="common-add-btn fix bgCBlue tc" @click="goIndexProFn"><van-icon name="wap-home" class="icon cWhite" /></div>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
        <div class="dialogDel">
            <van-dialog
                use-slot
                title="删除项目"
                :show="delDialog"
                show-cancel-button
                show-confirm-button
                @cancel="
                    () => {
                        this.delDialog = false;
                    }
                "
                @confirm="DeleteImCustFun">
                <div class="common-field clearfix rel">
                    <label class="rel fl common-label">
                        <span class="cRed abs fs12">*</span>
                        <span class="fs14 c3 text">删除理由</span>
                    </label>
                    <div class="fl common-ipt rel"
                         style="top:-3px;">
                        <van-field 
                            :value="reason"
                            @input="getReason"
                            type="textarea"
                            placeholder="请输入删除理由"
                            border="true"
                            autosize
                            input-class="textarea" />
                    </div>
                </div>
            </van-dialog>
        </div>
        <div class="dialogGetUserInfo">
            <van-dialog
                use-slot
                title="请先授权登录"
                :show="dialogGetUserInfo"
                show-cancel-button
                show-confirm-button
                confirm-button-open-type="getUserInfo"
                @close="onClose"
                @getuserinfo="getuserinfo">
                <view class="c6 tc p20">为了获取更好的用户体验，请先确认授权获取您的个人用户信息。</view>
            </van-dialog>
        </div>
    </div>
</template>

<script>
import Toast from '../../static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
import Vue from 'vue';
import { nullToStr } from '../../utils/index.js';
import mapWx from '@/components/mapWx';
import { InviteBusinessProjectDetail, DelImProject, GetImUnitInfo, AccessProjectDetail, AddShare, AddAccess, GetAccessesById, UpdateAccessNumber, AccessGetAccessesById, AccessGetImUnitInfo, AccessUpdateAccessNumber } from '../../utils/http';
export default {
    components: {
        mapWx
    },
    data() {
        return {
            GetItemsData: this.globalData.windowData.GetItemsData,
            hackReset: true, // 用于刷新子组件
            fadeInUp: false,
            shareList: [],
            AccessPeopleHeadPic: '',
            AccessPeopleName: '',
            isTourist: this.globalData.windowData.isTourist, // 是否游客
            workerid: '', // 分享人id
            imageDoin: this.globalData.windowData.ImgUrl,
            ProjectId: '',
            imageLists: [], // 轮播图
            Entity: {}, // 主体信息
            initData: {}, // 全部数据
            projectDesc: [], // 项目描述
            // 房态图
            activeNameFTT: 1,
            HomeTreeList: [], // 房态图数据
            // 相关客户
            activeNameCust: '1',
            CustCount: 0,
            RelevantCust: [], // 相关客户数据
            // 相关渠道
            AgentCount: 0,
            RelevantAgent: [], // 关渠道数据
            // tabbar
            tabbarActive: null,
            // 更多操作
            isShowPopup: false,
            reason: '', // 删除理由
            delDialog: false, // 删除的dialog
            dialogGetUserInfo: false // 授权对话框
        };
    },
    onShow() {
        this.ProjectId = this.$root.$mp.query.id; // 项目id
        let queryJson = this.$root.$mp.query;
        if (!!queryJson && queryJson.isShare == "1" && queryJson.workerid && queryJson.cmpcode) {
        // if (!!queryJson && queryJson.isShare == "1" && queryJson.workerid && this.globalData.windowData.WorkerId == '') {
            this.isTourist = true;
            this.globalData.windowData["isTourist"] = true;
            this.workerid = queryJson.workerid;
            wx.setStorageSync('WorkerId', this.workerid);
            this.globalData.windowData["CmpCode"] = queryJson.cmpcode;
            wx.hideHomeButton(); // 隐藏返回首页按钮图标
        }
        wx.hideShareMenu();
        this.InviteBusinessProjectDetailFun(); // 获取详情数据
        this.GetAccessesByIdFun(); // // 根据业务id获取访问记录
        this.GetImUnitInfoFun(); // 获取房源信息-房态图数据
    },
    mounted() {
        if (!!this.isTourist) AccessUpdateAccessNumber({id: this.ProjectId, CmpCode: this.globalData.windowData.CmpCode}).then(res => { })
        else UpdateAccessNumber({id: this.ProjectId}).then(res => { })
    },
    methods: {
        getuserinfo (e) {
            wx.setStorageSync('TouristName', e.detail.userInfo.nickName);
            wx.setStorageSync('TouristHeadPic', e.detail.userInfo.avatarUrl);
            this.globalData.windowData.TouristName = e.detail.userInfo.nickName;
            this.globalData.windowData.TouristHeadPic = e.detail.userInfo.avatarUrl;
            this.dialogGetUserInfo = false;
            wx.navigateTo({ url: '../login/index' });
        },
        onClose () {
            this.dialogGetUserInfo = false;
            this.InviteBusinessProjectDetailFun(); // 获取详情数据
        },
        goIndexProFn () { // 返回列表页面
            wx.navigateTo({ url: '../attractInvestment/index' });
        },
        GetImUnitInfoFun () { // 房态图数据
            if (!!this.isTourist) { // 游客模式
                AccessGetImUnitInfo({Id: this.ProjectId, CmpCode: this.globalData.windowData.CmpCode}).then(res => {
                    if (res.Status == 200) {
                        if (res.Data) {
                            this.HomeTreeList = nullToStr(res.Data.TreeList);
                            this.globalData.windowData["HomeTreeList"] = res.Data.TreeList;
                        }
                    } else {
                        Toast.fail(res.Message);
                    }
                })
            } else {
                GetImUnitInfo({Id: this.ProjectId}).then(res => {
                    if (res.Status == 200) {
                        if (res.Data) {
                            this.HomeTreeList = nullToStr(res.Data.TreeList);
                            this.globalData.windowData["HomeTreeList"] = res.Data.TreeList;
                        }
                    } else {
                        Toast.fail(res.Message);
                    }
                })
            }
        },
        GetAccessesByIdFun () {
            let params = {
                id: this.ProjectId,
                sourceType: 0
            }
            if (!!this.isTourist) { // 游客模式
                params["CmpCode"] = this.globalData.windowData.CmpCode;
                AccessGetAccessesById(params).then(res => {
                    if (res.Status == 200) {
                        if (res.Data && res.Data.length>0) {
                            this.shareList = res.Data;
                        }
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                })
            } else {
                GetAccessesById(params).then(res => {
                    if (res.Status == 200) {
                        if (res.Data && res.Data.length>0) {
                            this.shareList = res.Data;
                        }
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                })
            }
        },
        seeMoreList (type) { // 客户渠道 查看更多
            if (type == 1) this.globalData.windowData["tongji"] = this.initData.CustIds;
            if (type == 4) this.globalData.windowData["tongji"] = this.initData.AgentIds;
            wx.navigateTo({ url: '../tongjiList/index?type='+type });
        },
        clickPhone(val) { // 打电话
            wx.makePhoneCall({
                phoneNumber: val
            });
        },
        AddAccessFun () { // 新增分享
            let queryJson = this.$root.$mp.query;
            let params = {
                SourceId: this.ProjectId, // 来源id 比如此时是项目id
                SourceType: 0, // 项目是0
                ShareUserId: this.workerid, // 分享人id
                ShareUserName: queryJson.name || '', // 享人名称
                ShareTime: queryJson.time || '', // 享人时间
                AccessPeopleName: wx.getStorageSync("TouristName") || '', // 访问人名称
                AccessPeopleHeadPic: wx.getStorageSync("TouristHeadPic") || '',
                AccessPeoplePhone: wx.getStorageSync("TouristPhone") || '',
                AccessContent: '招商项目：'+this.Entity.ProjectName,
                CmpCode: this.globalData.windowData.CmpCode
            }
            wx.hideLoading();
            AddAccess(params).then(res => {})
        },
        InviteBusinessProjectDetailFun() {
            let params = {
                ProjectId: this.ProjectId
            }
            if (!!this.isTourist) {
                params["CmpCode"] = this.globalData.windowData.CmpCode;
                AccessProjectDetail(params).then(res => { // 游客详情信息
                    if (res.Status == 200) {
                        this.initData = res.Data;
                        // 招商项目编辑数据赋值
                        this.globalData.windowData["editProData"] = res.Data;
                        // 轮播图
                        (!!res.Data.Entity.Shuffling) ? this.imageLists = res.Data.Entity.Shuffling : this.imageLists = [];
                        // 主体信息
                        (!!res.Data.Entity) ? this.Entity = res.Data.Entity : this.Entity = {};
                        // 项目描述 projectDesc
                        if (!!res.Data.Entity.Carousels && res.Data.Entity.Carousels.length > 0) {
                            this.projectDesc = [];
                            res.Data.Entity.Carousels.forEach(item => {
                                this.projectDesc.push({
                                    url: this.globalData.windowData.ImgUrl + item.ImageUrl
                                })
                            });
                        }
                        // 相关客户数据
                        this.CustCount = res.Data.CustCount;
                        if (!!res.Data.RelevantCust && res.Data.RelevantCust.length > 0) {
                            this.RelevantCust = res.Data.RelevantCust;
                        }
                        // 渠道数据
                        this.AgentCount = res.Data.AgentCount;
                        if (!!res.Data.RelevantChannel && res.Data.RelevantChannel.length > 0) {
                            this.RelevantAgent = res.Data.RelevantChannel;
                        }
                        let queryJson = this.$root.$mp.query;
                        // 分享后查看
                        if (!!queryJson && queryJson.isShare == "1") {
                            if(this.globalData.windowData.TouristToken == "" || !wx.getStorageSync("TouristHeadPic") || !wx.getStorageSync("TouristPhone") || !wx.getStorageSync("TouristName")) {
                                this.dialogGetUserInfo = true;
                                // wx.navigateTo({ url: '../login/index' });
                            } else {
                                this.AddAccessFun(); // 执行分享新增
                            }
                        }
                        this.hackReset = false;
                        this.$nextTick(() => {
                            this.hackReset = true;
                        });
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                })
            } else {
                InviteBusinessProjectDetail(params).then(res => {
                    if (res.Status == 200) {
                        this.initData = res.Data;
                        // 招商项目编辑数据赋值
                        this.globalData.windowData["editProData"] = res.Data;
                        // 轮播图
                        (!!res.Data.Entity.Shuffling) ? this.imageLists = res.Data.Entity.Shuffling : this.imageLists = [];
                        // 主体信息
                        (!!res.Data.Entity) ? this.Entity = res.Data.Entity : this.Entity = {};
                        // 项目描述 projectDesc
                        if (!!res.Data.Entity.Carousels && res.Data.Entity.Carousels.length > 0) {
                            this.projectDesc = [];
                            res.Data.Entity.Carousels.forEach(item => {
                                this.projectDesc.push({
                                    url: this.globalData.windowData.ImgUrl + item.ImageUrl
                                })
                            });
                        }
                        // 相关客户数据
                        this.CustCount = res.Data.CustCount;
                        if (!!res.Data.RelevantCust && res.Data.RelevantCust.length > 0) {
                            this.RelevantCust = res.Data.RelevantCust;
                        }
                        // 渠道数据
                        this.AgentCount = res.Data.AgentCount;
                        if (!!res.Data.RelevantChannel && res.Data.RelevantChannel.length > 0) {
                            this.RelevantAgent = res.Data.RelevantChannel;
                        }
                        this.hackReset = false;
                        this.$nextTick(() => {
                            this.hackReset = true;
                        });
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                })
            }
        },
        // 房态图
        onChangeFTT(event) {
            this.activeNameFTT = Number(event.mp.detail);
        },
        // 相关客户
        onChangeCust(event) {
            this.activeNameCust = event.mp.detail;
        },
        // 操作栏 tabbar
        onChangeTabbar(event) {
            var url = '../addDynamic/index';
            if (event.mp.detail === 0) {
                // 写动态
                url = '../addDynamic/index?id=' + this.ProjectId;
            } else if (event.mp.detail === 1) {
                // 编辑项目
                url = '../addPro/index?id=' + this.ProjectId;
            } else if (event.mp.detail === 2) {
                // 分享
                return false;
            } else if (event.mp.detail === 3) {
                // 更多操作
                this.isShowPopup = true;
                return false;
            }
            wx.navigateTo({ url: url });
        },
        // 游客操作栏
        onChangeTabbar2(event) {
            var url = '../addReport/index';
            if (event.mp.detail === 0) {
                // 写报备
                url = '../addReport/index';
            } else if (event.mp.detail === 1) {
                // 分享
                return false;
            }
            wx.navigateTo({ url: url });
        },
        // 更多操作按钮
        moreToobar (i) {
            switch (i) {
            case 2: // 删除项目
                this.delDialog = true;
                break;
            case 4: // 新增房源
                wx.navigateTo({ url: '../addImUnit/index?id=' + this.ProjectId });
                break;
            default:
                Toast.fail('暂未开放');
                break;
            }
        },
        // 房间详情
        goImUnit (id, FullName) {
            let name = this.Entity.ProjectName + FullName;
            wx.navigateTo({ url: '../imUnitDetail/index?id=' + id +'&name=' + name });
        },
        // 客户详情
        goCustDetailFn(id) {
            wx.navigateTo({ url: '../custDetail/index?id=' + id });
        },
        // 渠道详情
        goAgentDetailFn(id) {
            wx.navigateTo({ url: '../channelDetail/index?id=' + id });
        },
        getReason (val) {
            this.reason = val.detail;
        },
        DeleteImCustFun () {
            if (this.reason == "") {
                Toast.fail('删除理由不能为空');
                this.delDialog = false;
                return;
            }
            let params = {
                projectId: this.ProjectId,
                deleteReason: this.reason
            }
            DelImProject(params).then(res => {
                if (res.Status == 200) {
                    Toast.success(res.Message);
                    this.globalData.windowData.isRoladAttractInvestment = true; // 目的让招商列表重新加载
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
        // 页面分享
        onShareAppMessage(res) {
            let name = this.globalData.useInfo.WorkerName;
            let cmpcode = this.globalData.windowData.CmpCode;
            let time = Vue.filter('formatTime')(new Date());
            if (res.from === 'button') {
                // 来自页面内转发按钮
                return {
                    title: res.target.dataset.prodetail.ProjectName,
                    path: '/pages/attractInvestmentDetail/index?id='+res.target.dataset.prodetail.Id+'&isShare=1&cmpcode='+cmpcode+'&workerid='+wx.getStorageSync("WorkerId")+'&name='+name+'&time='+time,
                    success: function (res) {
                        alert(JSON.stringify(res));
                    }
                }
            }else{
                return {
                    title: this.Entity.ProjectName,
                    path: '/pages/attractInvestmentDetail/index?id='+this.ProjectId+'&isShare=1&cmpcode='+cmpcode+'&workerid='+wx.getStorageSync("WorkerId")+'&name='+name+'&time='+time
                }
            }
        },
    }
};
</script>
<style lang="scss">
.attractInvestmentDetail-wrapper {
    .swiper-box{
        height: 80rpx;
        line-height: 40rpx;
        padding: 0 20rpx;
        background-color: inherit;
        overflow: hidden;
        top: 30px;
        width: calc(100% - 40rpx);
        position: absolute;
    }
    .swiper-box .item{
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    padding-bottom: 60px;
    .noticeGroll {
        height: 20px;
        padding: 5px;
        border: 1px solid #eee;
        border-radius: 20px;
        z-index: 100;
        background-color: #ffffff;
        display: inline-block;
    }
    swiper {
        image {
            width: 100%;
            height: 100%;
        }
    }
    > .content {
        padding: 16px;
        border-bottom: 1px solid #f5f5f5;
        .tag {
            top: -3px;
        }
        ul.lists {
            li {
                margin-top: 8px;
                label {
                    display: block;
                    float: left;
                    color: #666;
                    font-size: 14px;
                    width: 70px;
                }
                p {
                    float: left;
                    color: #333;
                    font-size: 14px;
                    margin-left: 8px;
                    width: calc(100% - 78px);
                }
            }
        }
    }
    .content-tab {
        // 详细信息
        dl.tab-content-detail {
            padding: 16px;
            dt {
                color: #000;
                font-weight: bold;
                font-size: 14px;
            }
            dd {
                margin-top: 8px;
                font-size: 14px;
                label {
                    float: left;
                    color: #666;
                    width: 70px;
                }
                p {
                    float: left;
                    color: #333;
                    width: calc(100% - 78px);
                }
            }
        }
        // 项目描述
        .tab-pro-detail {
            padding: 16px;
            .van-uploader {
                width: 100%;
                .van-uploader__preview, .van-uploader__preview-image {
                    width: 100% !important;
                    height: 180px !important;
                }
                .van-uploader__upload--disabled {
                    display: none;
                }
            }
        }
        // 房态图
        .tab-ftt-detail {
            .item {
                > h4 {
                    padding: 0 12px 12px;
                    border-bottom: 1px solid #f5f5f5;
                    margin-bottom: 12px;
                    color: #333;
                    margin-top: 4px;
                    :nth-of-type(1) {
                        margin-top: 0;
                    }
                }
                ul {
                    li {
                        text-align: center;
                        width: calc((100% - 32px) / 4);
                        margin: 0 8px 8px 0;
                        padding: 8px 0;
                        color: #fff;
                        &:nth-of-type(4) {
                            margin-right: 0;
                        }
                        p {
                            &:nth-of-type(1) {
                                margin-bottom: 8px;
                            }
                        }
                    }
                }
            }
        }
        // 相关客户
        .tab-cust-detail {
            .item {
                border-bottom: 1px solid #f5f5f5;
                padding: 12px 0;
                &:nth-of-type(1) {
                    padding-top: 0;
                }
                .tag-wrap {
                    position: relative;
                    top: 1px;
                    .tag {
                        margin-left: 8px;
                    }
                }
            }
            .num {
                padding: 4px;
                height: 12px;
                line-height: 12px;
                border-radius: 4px;
                position: relative;
                top: 3px;
            }
        }
    }
    .dialogDel {
        .van-cell  {
            line-height: 33px;
        }
        .textarea {
            min-height: 75px;
            padding: 3px 0;
        }
        .common-ipt {
            border: 1px solid #ddd;
            width: calc(100% - 92px);
            border-radius: 2px;
        }
    }
    .share-btn {
        font-size: 12px;
        color: #646566;
        line-height: inherit;
        border: none;
    }
}
</style>
