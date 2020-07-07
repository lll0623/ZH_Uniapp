<template>
    <div class="addCust-wrapper">
        <van-cell-group>
            <van-cell icon="" use-label-slot="true" required title-width="150rpx">
                <view slot="title">
                    <view class="van-cell-text">报备类型</view>
                </view>
                <view>
                    <van-radio-group
                    	:value="formData.BookType"
                        @change="radioChange"
                    	class="van-radio van-radio--horizontal">
                        <van-radio class="fl" name="2">我要开店</van-radio>
                        <van-radio class="fl" name="3" style="margin-left: 1rem;">我有推荐</van-radio>
                    </van-radio-group>
                </view>
            </van-cell>
            <van-cell is-link
                      url="/pages/selPro/index?type=0"
                      :value="ImProjectName">
                <view slot="title">
                    <div class="rel common-required">
                        <span class="cRed">*</span>
                        <span class="van-cell-text">选择项目</span>
                    </div>
                </view>
            </van-cell>
            <van-cell is-link
                      @click="openRoomList">
                <view slot="title">
                    <div class="rel common-required">
                        <span class="cRed">*</span>
                        <span class="van-cell-text">选择房间</span>
                    </div>
                </view>
                <view class="rel">
                    <input class="tr" placeholder="点击选择房间" type="text"
                        :value="ImUnitName"
                        disabled>
                </view>
            </van-cell>
            <van-field 
                :value="formData.CustName"
                required
                @input="getCustName"
                clearable
                input-align="right"
                label="客户名称"
                placeholder="请输入客户名称" />
            <van-field
                :value="formData.CustPhone"
                @input="getCustPhone"
                input-align="right"
                required
                clearable label="客户电话" type="tel" placeholder="请输入客户电话" />
            <picker-popup
                @listenTochildEvent="ShopNatureFun"
                :isVal="formData.ShopNature"
                label="报备店铺性质"
                isBT="true"
                lsCode="ShopNature" />
            <van-field
                :value="formData.Brand"
                @input="getBrand"
                input-align="right"
                clearable label="店招/品牌/公司"
                required
                placeholder="请输入店招/品牌/公司" />
            <picker-popup2
                @listenTochildEvent="FormatFun"
                :isVal="Format"
                label="业态"
                lsCode="Format" />
            <van-cell>
                <view slot="title">
                    <div class="rel">
                        <span class="cRed abs fs14" style="left: -6px;">*</span>
                        <span class="van-cell-text">需求面积(m²)</span>
                    </div>
                </view>
                <view class="fr">
                    <input class="fl cont tc" type="number" :value="formData.AreaMin" @input="getAreaMin" placeholder="请输入" style="width:80rpx;" />
                    <view class="fl tc c32" style="width:80rpx;">--</view>
                    <input class="fl cont tc" type="number" :value="formData.AreaMax" @input="getAreaMax" placeholder="请输入" style="width:80rpx;" />
                </view>
            </van-cell>
            <van-cell>
                <view slot="title">
                    <div class="rel">
                        <span class="cRed abs fs14" style="left: -6px;">*</span>
                        <span class="van-cell-text">月租总价(万元)</span>
                    </div>
                </view>
                <view class="fr">
                    <input class="fl cont tc" type="number" :value="formData.PriceMin" @input="getPriceMin" placeholder="请输入" style="width:80rpx;" />
                    <view class="fl tc c32" style="width:80rpx;">--</view>
                    <input class="fl cont tc" type="number" :value="formData.PriceMax" @input="getPriceMax" placeholder="请输入" style="width:80rpx;" />
                </view>
            </van-cell>
            <picker-popup
                @listenTochildEvent="BookSourceFun"
                :isVal="formData.BookSource"
                label="报备来源方"
                lsCode="BookSource" />
            <van-cell is-link
                      :value="dateTimeText"
                      @click="()=>{
                          this.isShowPopup = true
                      }">
                <view slot="title">
                    <div class="rel common-required">
                        <span class="cRed">*</span>
                        <span class="van-cell-text">预计看铺时间</span>
                    </div>
                </view>
            </van-cell>
            <van-cell is-link
                      @click="goselAdmit"
                      :value="ImStaffName">
                <view slot="title">
                    <div class="rel common-required">
                        <!-- <span class="cRed">*</span> -->
                        <span class="van-cell-text">招商接待人员</span>
                    </div>
                </view>
            </van-cell>
            <van-field
                :value="formData.Remark"
                @input="getRemark"
                input-align="right"
                clearable label="备注"
                placeholder="请输入备注" />
            <div v-if="formData.BookType == '3'">
                <h4 class="fs14 c0 tit bold">报备信息</h4>
                <van-field
                    :value="formData2.BookName"
                    required
                    @input="getBookName"
                    input-align="right"
                    clearable label="报备人名称"
                    placeholder="请输入报备人名称" />
                <van-field
                    :value="formData2.BookPhone"
                    required
                    @input="getBookPhone"
                    input-align="right"
                    clearable label="报备人手机号"
                    placeholder="请输入报备人手机号" />
                <picker-popup
                    @listenTochildEvent="BookPeopleRelationFun"
                    :isVal="formData2.BookPeopleRelation"
                    label="报备人关系"
                    lsCode="BookPeopleRelation" />
            </div>
        </van-cell-group>
        
        <!-- button -->
        <div class="fix common-btn-wrap bgCW tr">
            <van-button class="cancel" round type="default" @click="Cancel">取消</van-button>
            <van-button class="submit ml12" round type="info" :loading="disabled" :loading-text="loadingSubText" @click="Submit">提交</van-button>
        </div>
        <!-- popup -->
        <van-popup :show="isShowPopup"
                   position="bottom"
                   custom-style="height: 100%;width: 100%;"
                   @close="()=>{this.isShowPopup = false}">
            <!-- 带看时间 -->
            <date-time @listenTochildEvent="getDateTime" />
        </van-popup>
        <van-popup :show="isShow" position="right" custom-style="height: 100%;width:100%;padding-bottom: 60px;">
            <div class="filter-wrapper">
                <div class="title">
                    <view class="fl cBlue back" @click="backLi" v-show="Level>0">
                        返回上级
                    </view>
                    <view class="fl ml8">
                        <van-tag type="primary" size="large" v-if="ImUnitName">{{ ImUnitName }}</van-tag>
                    </view>
                    <view class="clearfix"></view>
                </div>
                <ul class="content">
                    <li v-for="(item, index) in option" :key="index" :class="{'active': activeLi == index ? true : false}" @click="chooseLi(item, index)">
                        {{ item.Name }}
                    </li>
                </ul>
                <div class="fix common-btn-wrap bgCW tr">
                    <van-button class="cancel" round type="default" @click="isShow = false">关闭</van-button>
                    <van-button class="submit ml12" round type="info" @click="sureRoom">确定</van-button>
                </div>
            </div>
        </van-popup>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import Toast from '../../static/vant/toast/toast';
import pickerPopup from '@/components/picker';
import pickerPopup2 from '@/components/picker2';
import { AddFromBook, GetImUnitInfo, NewAddVisitorFrom, AccessGetImUnitInfo } from '../../utils/http'
import dateTime from '@/components/dateTime';
import { checkPhone, checkEmail } from '../../utils/index'
let formName = {
    ImProjectId: '项目名称',
    CustName: '客户名称',
    CustPhone: '客户电话',
    Brand: '店招/品牌/公司',
    ShopNature: '报备店铺性质',
    AreaMin: '最小需求面积',
    AreaMax: '最大需求面积',
    PriceMin: '最小月租总价',
    PriceMax: '最大月租总价',
    BookTime: '预计看铺时间'
};
export default {
    components: {
        pickerPopup,
        pickerPopup2,
        dateTime
    },
    onShow() {
        // 选择项目数据 赋值
        let ProId = this.globalData.windowData.ProId;
        if (!!ProId && ProId.length > 0) {
            this.formData.ImProjectId = ProId[0].val;
            this.ImProjectName = ProId[0].name;
            this.globalData.windowData.ProId = ''; // 置空
        }
        // 招商接待人员 赋值
        let admitId = this.globalData.windowData.admitId;
        if (!!admitId && admitId.length > 0) {
            this.formData.ImStaffId = admitId[0].val;
            this.ImStaffName = admitId[0].name;
            this.globalData.windowData.admitId = ''; // 置空
        }
    },
    data() {
        return {
            formName,
            disabled: false,
            loadingSubText: '提交中...',
            isShowPopup: false,
            isShow: false, // 房间popup
            Format: [], // 两级业态数据
            ImProjectName: '点击选择项目', // 项目名称
            ImStaffName: '点击选择接待人员', // 招商接待人员名称
            ImUnitName: '', // 房间名称
            dateTimeText: '点击选择',
            formData: {
                BookType: "2", // 报备类型 我要开店：2,我有推荐:3
                ImProjectId: '', // 项目id
                ImUnitId: '', // 房间id
                CustName: '', // 客户名称
                CustPhone: '', // 客户电话
                Brand: '', // 店招/品牌/公司
                ShopNature: '', // 报备店铺性质
                Format: '', // 二级业态
                AreaMin: '', // 需求面积最小值
                AreaMax: '', // 需求面积最大值
                PriceMin: '', // 月租总价最小值
                PriceMax: '', // 月租总价最大值
                CreateAccIdType: 1, // 创建人类型
                BookSource: '', // 报备来源方
                BookTime: '', // 预计看铺时间
                BookBeginDate: '', // 预计看铺开始时间
                BookEndDate: '', // 预计看铺结束时间
                ImStaffId: '', // 接待人员id
                Remark: '' // 备注
            },
            formData2: {
                BookName: '', // 报备人名称
                BookPhone: '', // 报备人手机号
                BookPeopleRelation: '', // 报备人关系
            },
            option: [], // 房产数据
            buildData: [], // 楼栋
            floorData: [], // 楼层
            roomData: [], // 房间
            Level: -1, // 房产级数
            activeLi: -1
        };
    },
    created() {
        // let DataList = this.globalData.windowData.editBrandData;
        // if (JSON.stringify(DataList) !== '{}') {
        //     wx.setNavigationBarTitle({
        //         title: "编辑品牌" // 页面切换，更换页面标题
        //     })
        //     // 主体信息
        //     if (!!DataList.Entity) {
        //         let v = DataList.Entity;
        //         this.IsPrivateCust = v.IsPrivateCust ? '2' : '1';
        //         this.formData.Name = v.Name; // 品牌名称
        //         // 业态
        //         this.Format = v.FormatName; // 业态赋值
        //         this.formData.FormatCategory = v.FormatCategory; // 一级业态
        //         this.formData.Format = v.Format; // 二级业态
        //         this.formData.Position = v.Position; // 品牌定位
        //         this.formData.BrandType = v.BrandType; // 经营方式
        //         this.formData.Company = v.Company; // 公司名称
        //         this.formData.BrandSource = v.BrandSource; // 来源
        //         this.ChannelName = v.ChannelName; // 渠道名称
        //         this.formData.ChannelId = v.ChannelId; // 渠道名称id
        //         this.formData.LegalPerson = v.LegalPerson; // 姓名
        //         this.formData.JobTitle = v.JobTitle; // 职务
        //         this.formData.TelPhone = v.TelPhone; // 手机号码
        //         this.formData.FixationPhone = v.FixationPhone; // 固定电话
        //         this.formData.Email = v.Email; // 邮箱
        //         this.formData.Address = v.Address; // 通讯地址
        //         this.formData.Area = v.Area; // 需求面积
        //         this.formData.InvestmentBudget = v.InvestmentBudget; // 投资预算
        //         this.formData.UrgencyDegree = v.UrgencyDegree; // 紧急程度
        //         this.formData.DemandAreas = v.DemandAreas; // 需求区域
        //         this.formData.Floor = v.Floor; // 楼层
        //         this.formData.UnitTypeTags = v.UnitTypeTags; // 商铺类型
        //         this.formData.Quantity = v.Quantity; // 电量
        //         this.formData.LoadBearing = v.LoadBearing; // 楼板承重
        //         this.formData.Describe = v.Describe; // 备注
        //     }
        // }
    },
    mounted() {
        if (!!this.$root.$mp.query && this.$root.$mp.query.id) {
            this.id = this.$root.$mp.query.id; // 客户id
        }
        if (this.globalData.windowData.isTourist) { // 游客登录状态
            this.formData.CreateAccIdType = 1; // 枚举:erp:0,c端:1
            this.formData.ShareWorkerId = wx.getStorageSync("WorkerId") || ''
        }
    },
    methods: {
        radioChange (e) { // 宝贝类型切换
            this.formData.BookType = e.mp.detail;
        },
        openRoomList () { // 选择房间
            let id = this.formData.ImProjectId;
            if (id == "") { Toast.fail('请先选择项目'); return false; }
            if (this.globalData.windowData.isTourist) {
                AccessGetImUnitInfo({Id: id, CmpCode: this.globalData.windowData.CmpCode}).then(res => {
                    if (res.Status == 200) {
                        if (res.Data && res.Data.length>0) {
                            this.option = res.Data.TreeList;
                            this.isShow = true;
                        } else {
                            Toast.fail("暂无房间");
                        }
                    } else {
                        Toast.fail(res.Message);
                    }
                })
            } else {
                GetImUnitInfo({Id: id}).then(res => {
                    if (res.Status == 200) {
                        if (res.Data && res.Data.length>0) {
                            this.option = res.Data.TreeList;
                            this.isShow = true;
                        } else {
                            Toast.fail("暂无房间");
                        }
                    } else {
                        Toast.fail(res.Message);
                    }
                })
            }
        },
        chooseLi (val, index) { // 选中楼栋/楼层/房间
            this.activeLi = index;
            this.formData.ImUnitId = val.Id;
            this.Level = val.Level;
            if (val.Level == 0) this.buildData[0] = val.Name, this.buildData[1] = val.Id, this.buildData[2] = index;
            if (val.Level == 1) this.floorData[0] = '/' + val.Name, this.floorData[1] = val.Id, this.floorData[2] = index, this.floorData[3] = this.option;
            if (val.Level == 2) this.roomData[0] = '/' + val.Name, this.roomData[1] = val.Id, this.roomData[2] = index;
            let buildName = this.buildData[0] ? this.buildData[0] : '';
            let floorName = this.floorData[0] ? this.floorData[0] : '';
            let roomName = this.roomData[0] ? this.roomData[0] : '';
            this.ImUnitName = buildName + floorName + roomName;
            // 下一级
            if (val.Children && val.Children.length>0) {
                this.option = val.Children;
            }
        },
        backLi () { // 上一级
            this.activeLi = -1;
            this.Level = this.Level - 1;
            if (this.Level == 0) {
                this.buildData = [];
                this.floorData = [];
                this.roomData = [];
                GetImUnitInfo({Id: this.formData.ImProjectId}).then(res => {
                    if (res.Status == 200 && res.Data) {
                        this.option = res.Data.TreeList;
                        this.isShow = true;
                    } else {
                        Toast.fail(res.Message);
                    }
                })
            }
            if (this.Level == 1) {
                this.roomData = [];
                this.option = this.floorData[3];
                this.activeLi = this.floorData[2];
            }
            let buildName = this.buildData[0] ? this.buildData[0] : '';
            let floorName = this.floorData[0] ? this.floorData[0] : '';
            let roomName = this.roomData[0] ? this.roomData[0] : '';
            this.ImUnitName = buildName + floorName + roomName;
        },
        sureRoom () {
            if (this.Level < 2) {
                Toast.fail("必须选到房间");
                return;
            }
            this.isShow = false;
        },
        getCustName (val) { // 客户名称赋值
            this.formData.CustName = val.detail;
        },
        getCustPhone (val) { // 客户电话赋值
            this.formData.CustPhone = val.detail;
        },
        ShopNatureFun (val) { // 报备性质
            this.formData.ShopNature = val.val;
        },
        getBrand (val) {
            this.formData.Brand = val.detail;
        },
        FormatFun (val) { // 业态
            this.formData.FormatCategory = val[0].val;
            this.formData.Format = val[1].val;
        },
        getAreaMin (val) { // 需求面积最小值
            this.formData.AreaMin = val.detail.value;
        },
        getAreaMax (val) { // 需求面积最大值
            this.formData.AreaMax = val.detail.value;
        },
        getPriceMin (val) { // 月租总价最小值
            this.formData.PriceMin = val.detail.value;
        },
        getPriceMax (val) { // 月租总价最大值
            this.formData.PriceMax = val.detail.value;
        },
        BookSourceFun (val) { // 报备来源方
            this.formData.BookSource = val.val;
        },
        getDateTime (val) { // 预计看铺时间
            this.dateTimeText = val.ReceptionTime + ' ' + val.BeginDate + '-' + val.EndDate;
            this.formData.BookTime = val.ReceptionTime;
            this.formData.BookBeginDate	 = val.BeginDate;
            this.formData.BookEndDate = val.EndDate;
            this.isShowPopup = false;
        },
        goselAdmit () { // 选择接待人员
            let id = this.formData.ImProjectId;
            if (id == "") { Toast.fail('请先选择项目'); return false; }
            wx.navigateTo({ url: '../selAdmit/index?id='+id+'&type=0' });
        },
        getRemark (val) { // 备注
            this.formData.Remark= val.detail;
        },
        getBookName (val) { // 报备人名称
            this.formData2.BookName= val.detail;
        },
        getBookPhone (val) { // 报备人手机号
            this.formData2.BookPhone= val.detail;
        },
        BookPeopleRelationFun (val) {
            this.formData2.BookPeopleRelation = val.val;
        },
        onIsPrivateCust (e) {
            this.IsPrivateCust = e.mp.detail;
            e.mp.detail === '1' ? (this.formData.IsPrivateCust = false) : (this.formData.IsPrivateCust = true);
        },
        Submit () {
            let isSum = true;
            for (let item in this.formName) {
                if (this.formData[item] == "" || !this.formData[item]) {
                    Toast.fail(this.formName[item] + '不能为空');
                    isSum = false;
                    return;
                }
            };
            let params = {};
            if (this.formData.BookType == "3") {
                if (!checkPhone(this.formData2.BookPhone)) {
                    Toast.fail('手机格式不正确');
                    return false;
                }
                params = Object.assign(this.formData, this.formData2);
            } else {
                params = this.formData;
            }
            if (isSum) {
                this.disabled = true;
                if (this.globalData.windowData.isTourist) { // 游客登陆
                    params["CmpCode"] = this.globalData.windowData.CmpCode;
                    NewAddVisitorFrom(params).then(res => {
                        if (res.Status == 200) {
                            Toast.success(res.Message);
                            setTimeout(()=>{
                                this.disabled = false;
                                wx.navigateBack({
                                    delta: 1
                                });
                            }, 2000);
                        } else {
                            this.disabled = false;
                            Toast.fail(res.Message);
                        }
                    })
                } else {
                    AddFromBook(params).then(res => {
                        if (res.Status == 200) {
                            Toast.success(res.Message);
                            this.globalData.windowData['Report'] = true;
                            setTimeout(()=>{
                                this.disabled = false;
                                wx.navigateBack({
                                    delta: 1
                                });
                            }, 2000);
                        } else {
                            this.disabled = false;
                            Toast.fail(res.Message);
                        }
                        this.disabled = false;
                    })
                }
            }
        },
        Cancel () {
            wx.navigateBack({
                delta: 1
            });
        }
    }
};
</script>
<style lang="scss">
.addCust-wrapper {
    padding-bottom: 70px;
    .tit {
        padding: 12px;
    }
    .common-cell {
        padding: 12px 16px;
        .common-label {
            .cRed {
                left: -7px;
            }
            padding-right: 12px;
        }
        .van-cell {
            padding: 0;
        }
        .common-ipt-d {
            .van-cell {
                width: calc(50% - 6px);
            }
            // .span {
            // }
        }
    }
    .title {
        height: 23px;
        border-bottom: 2px solid #eee;
        padding: 8px;
    }
    ul.content {
        li {
            border-bottom: 1px solid #eee;
            padding: 8px;
        }
        li.active {
            background-color: #1989fa;
            color: white;
        }
    }
}
</style>
