<template>
    <div class="addCust-wrapper">
        <van-cell-group>
            <van-cell>
                <view slot="title">
                    <div class="rel common-required">
                        <span class="cRed">*</span>
                        <span class="van-cell-text">客户类型</span>
                    </div>
                </view>
                <div class="clearfix tr">
                    <van-radio-group class="clearfix" :value="MerchantsType" @change="onMerchantsType">
                        <van-radio class="fr ml8" name="1">办公</van-radio>
                        <van-radio class="fr" name="2">商业</van-radio>
                    </van-radio-group>
                </div>
            </van-cell>
            <van-cell v-if="id == ''">
                <view slot="title">
                    <div class="rel common-required">
                        <span class="cRed">*</span>
                        <span class="van-cell-text">公私客</span>
                    </div>
                </view>
                <div class="clearfix tr">
                    <van-radio-group class="clearfix" :value="IsImPrivateCust" @change="onIsImPrivateCust">
                        <van-radio class="fr ml8" name="2">私客</van-radio>
                        <van-radio class="fr" name="1">公客</van-radio>
                    </van-radio-group>
                </div>
            </van-cell>
            <van-field 
                :value="formData.CustName"
                required
                @input="getCustName"
                clearable
                input-align="right"
                label="客户姓名"
                placeholder="请输入客户姓名" />
            <van-cell is-link :value="formData.Brand == '' ? '点击选择' : formData.Brand" url="/pages/selBrand/index">
                <view slot="title" class="clearfix">
                    <div class="rel"><span class="van-cell-text">品牌</span></div>
                </view>
            </van-cell>
            <picker-popup2
                @listenTochildEvent="FormatFun"
                :isVal="Format"
                label="业态"
                lsCode="Format" />
            <van-field
                :value="formData.CustCompany"
                @input="getCustCompany"
                input-align="right"
                clearable label="公司"
                placeholder="请输入公司" />
            <van-field
                :value="formData.JobTitle"
                @input="getJobTitle"
                input-align="right"
                clearable
                label="职务" placeholder="请输入职务" />
            <picker-popup
                @listenTochildEvent="CustSourceFun"
                :isVal="formData.CustSource"
                label="来源"
                lsCode="CustSource" />
            <van-cell is-link :value="AgentName" url="/pages/selAgent/index">
                <view slot="title" class="clearfix">
                    <div class="rel"><span class="van-cell-text">中介渠道</span></div>
                </view>
            </van-cell>
        </van-cell-group>
        <h4 class="fs14 c0 tit bold">联系方式</h4>
        <van-cell-group>
            <van-field
                :value="formData.PhoneNum1"
                @input="getPhoneNum1"
                input-align="right"
                required
                clearable label="手机号码" type="tel" placeholder="请输入手机号码" />
            <van-field
                :value="formData.PhoneNum3"
                @input="getPhoneNum3"
                input-align="right"
                clearable label="固定号码" type="tel" placeholder="请输入固定号码" />
            <van-field
                :value="formData.Email"
                @input="getEmail"
                input-align="right"
                clearable label="邮箱" placeholder="请输入邮箱" />
            <van-field
                :value="formData.Address"
                @input="getAddress"
                input-align="right"
                clearable label="通讯地址" placeholder="请输入通讯地址" />
        </van-cell-group>
        <h4 class="fs14 c0 tit bold">需求信息</h4>
        <van-cell-group>
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
            <van-field
                :value="formData.InvestmentBudget"
                @input="getInvestmentBudget"
                input-align="right"
                title-width="130px"
                clearable label="投资预算(万/月)" placeholder="请输入投资预算" />
            <picker-popup
                @listenTochildEvent="UrgencyFun"
                :isVal="formData.Urgency"
                label="紧急程度"
                lsCode="Urgency" />
            <picker-mul
                @listenTochildEvent="DemandAreaFun"
                isBT="true"
                :isVal="formData.DemandAreas ? formData.DemandAreas : []"
                label="需求区域"
                lsCode="DemandArea" />
            <picker-mul
                @listenTochildEvent="UnitTypeFun"
                isBT="true"
                :isVal="formData.UnitTypes ? formData.UnitTypes : []"
                label="商铺类型"
                lsCode="UnitType" />
            <van-field
                :value="formData.Electricity"
                @input="getElectricity"
                input-align="right"
                clearable label="电量(kW)" type="number" placeholder="请输入电量" />
            <van-field
                :value="formData.FloorBearing"
                @input="getLoadBearing"
                input-align="right"
                title-width="130px"
                clearable label="楼板承重(kg/m²）" type="number" placeholder="请输入楼板承重" />
            <van-field
                :value="formData.Remark"
                @input="getRemark"
                input-align="right"
                required clearable autosize label="备注" placeholder="请输入备注" />
        </van-cell-group>
        <!-- button -->
        <div class="fix common-btn-wrap bgCW tr">
            <van-button class="cancel" round type="default" @click="Cancel">取消</van-button>
            <van-button class="submit ml12" round type="info" :loading="disabled" :loading-text="loadingSubText" @click="Submit">提交</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import Toast from '../../static/vant/toast/toast';
import pickerPopup from '@/components/picker';
import pickerPopup2 from '@/components/picker2';
import pickerMul from '@/components/pickerMul';
import { AddInviteBusinessCust } from '../../utils/http.js'
import { checkPhone, checkEmail } from '../../utils/index'
let formName = {
    CustName: '客户姓名',
    PhoneNum1: '手机号码',
    AreaMin: '需求面积最小值',
    AreaMax: '需求面积最大值',
    DemandAreas: '需求区域',
    UnitTypes: '商铺类型',
    Remark: '备注'
};
export default {
    components: {
        pickerPopup,
        pickerPopup2,
        pickerMul
    },
    onShow() {
        // 选择品牌数据 赋值
        let brandId = this.globalData.windowData.brandId;
        if (!!brandId && brandId.length > 0) {
            this.formData.Brand = brandId[0].name;
            this.globalData.windowData.brandId = ''; // 置空
        }
        // 渠道数据 赋值
        let AgentId = this.globalData.windowData.AgentId;
        if (!!AgentId && AgentId.length > 0) {
            this.AgentName = AgentId[0].name;
            this.formData.AgentId = AgentId[0].val;
            this.globalData.windowData.AgentId = ''; // 置空
        }
    },
    data() {
        return {
            id: '', // 招商客户id 编辑用
            formName,
            disabled: false,
            loadingSubText: '提交中...',
            IsImPrivateCust: '1',
            MerchantsType: '2',
            Format: [], // 两级业态数据
            AgentName: '点击选择', // 渠道名称
            formData: {
                IsImPrivateCust: false, // 是否私客
                CustName: '', // 客户姓名
                Brand: '', // 品牌
                FormatCategory: '', // 一级业态
                Format: '', // 二级业态
                CustCompany: '', // 公司
                JobTitle: '', // 职务
                CustSource: '', // 来源
                AgentId: '', // 渠道Id
                PhoneNum1: '', // 手机号码
                PhoneNum3: '', // 固定电话
                Email: '', // 邮箱
                Address: '', // 通讯地址
                AreaMin: '', // 需求面积最小值
                AreaMax: '', // 需求面积最大值
                InvestmentBudget: '', // 投资预算
                Urgency: '', // 紧急程度
                DemandAreas: '', // 需求区域
                UnitTypes: '', // 商铺类型
                Electricity: '', // 电量
                FloorBearing: '', // 楼板承重
                MerchantsType: 2,
                Remark: '' // 备注
            },
            fileList: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }, { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }]
        };
    },
    created() {
        let DataList = this.globalData.windowData.editCustData;
        if (JSON.stringify(DataList) !== '{}') {
            wx.setNavigationBarTitle({
                title: "编辑客户" // 页面切换，更换页面标题
            })
            // 主体信息
            if (!!DataList.Entity) {
                let v = DataList.Entity;
                this.IsImPrivateCust = v.IsImPrivateCust ? '1' : '2';
                this.formData.CustName = v.CustName; // 客户名称
                this.formData.Brand = v.Brand; // 品牌
                // 业态
                this.Format = v.FormatName; // 业态赋值
                this.formData.FormatCategory = v.FormatCategory; // 一级业态
                this.formData.Format = v.Format; // 二级业态
                this.formData.CustCompany = v.CustCompany; // 公司名称
                this.formData.JobTitle = v.JobTitle; // 职务
                this.formData.CustSource = v.CustSource; // 来源
                this.AgentName = v.AgentName; // 渠道名称
                this.formData.AgentId = v.AgentId; // 渠道名称id
                this.formData.PhoneNum1 = v.PhoneNum1; // 手机号码
                this.formData.PhoneNum3 = v.PhoneNum3; // 固定电话
                this.formData.Email = v.Email; // 邮箱
                this.formData.Address = v.Address; // 通讯地址
                this.formData.AreaMin = v.AreaMin; // 需求面积最小值
                this.formData.AreaMax = v.AreaMax; // 需求面积最大值
                this.formData.InvestmentBudget = v.InvestmentBudget; // 投资预算
                this.formData.Urgency = v.Urgency; // 紧急程度
                this.formData.DemandAreas = v.DemandAreas; // 需求区域
                this.formData.UnitTypes = v.UnitTypes; // 商铺类型
                this.formData.Electricity = v.Electricity; // 电量
                this.formData.FloorBearing = v.FloorBearing; // 楼板承重
                this.formData.MerchantsType = v.MerchantsType; // 客户类型
                this.MerchantsType = String(v.MerchantsType);
                this.formData.Remark = v.Remark; // 备注
            }
        }
    },
    mounted() {
        if (!!this.$root.$mp.query && this.$root.$mp.query.id) {
            this.id = this.$root.$mp.query.id; // 客户id
        }
    },
    methods: {
        getCustName (val) { // 客户姓名赋值
            this.formData.CustName = val.detail;
        },
        getCustCompany (val) { // 公司
            this.formData.CustCompany = val.detail;
        },
        getJobTitle (val) { // 职务
            this.formData.JobTitle = val.detail;
        },
        CustSourceFun (val) { // 来源
            this.formData.CustSource = val.val;
        },
        FormatFun (val) { // 业态
            this.formData.FormatCategory = val[0].val;
            this.formData.Format = val[1].val;
        },
        UrgencyFun (val) { // 紧急程度
            this.formData.Urgency = val.val;
        },
        getPhoneNum1 (val) { // 手机号码
            this.formData.PhoneNum1 = val.detail;
        },
        getPhoneNum3 (val) { // 固定电话
            this.formData.PhoneNum3 = val.detail;
        },
        getEmail (val) { // 邮箱
            this.formData.Email = val.detail;
        },
        getAddress (val) { // 通讯地址
            this.formData.Address = val.detail;
        },
        getAreaMin (val) { // 需求面积最小值
            this.formData.AreaMin = val.detail.value;
        },
        getAreaMax (val) { // 需求面积最大值
            this.formData.AreaMax = val.detail.value;
        },
        getInvestmentBudget (val) { // 投资预算
            this.formData.InvestmentBudget = val.detail;
        },
        DemandAreaFun (val) { // 需求区域
            this.formData.DemandAreas = val;
        },
        UnitTypeFun (val) { // 商铺类型
            this.formData.UnitTypes = val;
        },
        getElectricity (val) { // 电量
            this.formData.Electricity = val.detail;
        },
        getLoadBearing (val) { // 楼板承重
            this.formData.FloorBearing = val.detail;
        },
        getRemark (val) { // 备注
            this.formData.Remark = val.detail;
        },
        onIsImPrivateCust(e) {
            this.IsImPrivateCust = e.mp.detail;
            e.mp.detail === '1' ? (this.formData.IsImPrivateCust = false) : (this.formData.IsImPrivateCust = true);
        },
        onMerchantsType(e) {
            this.MerchantsType = e.mp.detail;
            e.mp.detail === '1' ? this.formData.MerchantsType = 1 : this.formData.MerchantsType = 2;
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
            if (!checkPhone(this.formData.PhoneNum1)) {
                Toast.fail('手机格式不正确');
                return false;
            }
            if (this.formData.Email != '' && !checkEmail(this.formData.Email)) {
                Toast.fail('邮箱格式不正确');
                return false;
            }
            if (isSum) {
                this.disabled = true;
                if (this.id != '') this.formData['id'] = this.id;
                AddInviteBusinessCust(this.formData).then(res => {
                    if (res.Status == 200) {
                        Toast.success(res.Message);
                        this.globalData.windowData['Cust'] = true;
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
}
</style>
