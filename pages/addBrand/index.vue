<template>
    <div class="addCust-wrapper">
        <van-cell-group>
            <van-cell>
                <view slot="title">
                    <div class="rel common-required">
                        <span class="cRed">*</span>
                        <span class="van-cell-text">公私客</span>
                    </div>
                </view>
                <div class="clearfix tr">
                    <van-radio-group class="clearfix" :value="IsPrivateCust" @change="onIsPrivateCust">
                        <van-radio class="fr ml8" name="2">私客</van-radio>
                        <van-radio class="fr" name="1">公客</van-radio>
                    </van-radio-group>
                </div>
            </van-cell>
            <van-field 
                :value="formData.Name"
                required
                @input="getName"
                clearable
                input-align="right"
                label="品牌名称"
                placeholder="请输入品牌名称" />
            <picker-popup2
                @listenTochildEvent="FormatFun"
                :isVal="Format"
                label="业态"
                lsCode="Format" />
            <picker-popup
                @listenTochildEvent="PositionFun"
                :isVal="formData.Position"
                label="品牌定位"
                lsCode="Position" />
            <picker-popup
                @listenTochildEvent="BrandTypeFun"
                :isVal="formData.BrandType"
                label="经营方式"
                lsCode="BrandType" />
            <van-field
                :value="formData.Company"
                @input="getCompany"
                input-align="right"
                clearable label="公司"
                placeholder="请输入公司" />
            <picker-popup
                @listenTochildEvent="BrandSourceFun"
                :isVal="formData.BrandSource"
                label="来源"
                lsCode="CustSource" />
            <van-cell is-link :value="ChannelName" url="/pages/selAgent/index">
                <view slot="title" class="clearfix">
                    <div class="rel"><span class="van-cell-text">中介渠道</span></div>
                </view>
            </van-cell>
        </van-cell-group>
        <h4 class="fs14 c0 tit bold">联系人</h4>
        <van-cell-group>
            <van-field
                :value="formData.LegalPerson"
                required
                @input="getLegalPerson"
                clearable
                input-align="right"
                label="姓名"
                placeholder="请输入姓名" />
            <van-field
                :value="formData.JobTitle"
                @input="getJobTitle"
                input-align="right"
                clearable
                label="职务" placeholder="请输入职务" />
            <van-field
                :value="formData.TelPhone"
                @input="getTelPhone"
                input-align="right"
                required
                clearable label="手机号码" type="tel" placeholder="请输入手机号码" />
            <van-field
                :value="formData.FixationPhone"
                @input="getFixationPhone"
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
            <picker-popup
                @listenTochildEvent="AreaFun"
                :isVal="formData.Area"
                label="需求面积(m²)"
                lsCode="ConstructionArea" />
            <van-field
                :value="formData.InvestmentBudget"
                @input="getInvestmentBudget"
                input-align="right"
                clearable label="投资预算(万/月)" placeholder="请输入投资预算" />
            <picker-popup
                @listenTochildEvent="UrgencyDegreeFun"
                :isVal="formData.UrgencyDegree"
                label="紧急程度"
                lsCode="Urgency" />
            <picker-mul
                @listenTochildEvent="DemandAreaFun"
                isBT="true"
                :isVal="formData.DemandAreas ? formData.DemandAreas : []"
                label="需求区域"
                lsCode="DemandArea" />
            <van-field
                :value="formData.Floor"
                @input="getFloor"
                input-align="right"
                clearable label="楼层（楼）" type="number" placeholder="请输入楼层" />
            <picker-mul
                @listenTochildEvent="UnitTypeTagsFun"
                isBT="true"
                :isVal="formData.UnitTypeTags ? formData.UnitTypeTags : []"
                label="商铺类型"
                lsCode="UnitType" />
            <van-field
                :value="formData.Quantity"
                @input="getQuantity"
                input-align="right"
                clearable label="电量(kW)" type="number" placeholder="请输入电量" />
            <van-field
                :value="formData.LoadBearing"
                @input="getLoadBearing"
                input-align="right"
                title-width="130px"
                clearable label="楼板承重(kg/m²）" type="number" placeholder="请输入楼板承重" />
            <van-field
                :value="formData.Describe"
                @input="getDescribe"
                required
                input-align="right"
                clearable autosize label="备注" type="number" placeholder="请输入备注" />
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
import { AddorEditBrand } from '../../utils/http'
import { checkPhone, checkEmail } from '../../utils/index'
let formName = {
    Name: '品牌名称',
    LegalPerson: '联系人姓名',
    TelPhone: '联系人手机号码',
    Describe: '备注'
};
export default {
    components: {
        pickerPopup,
        pickerPopup2,
        pickerMul
    },
    onShow() {
        // 渠道数据 赋值
        let ChannelId = this.globalData.windowData.AgentId;
        if (!!ChannelId && ChannelId.length > 0) {
            this.ChannelName = ChannelId[0].name;
            this.formData.ChannelId = ChannelId[0].val;
            this.globalData.windowData.AgentId = ''; // 置空
        }
    },
    data() {
        return {
            id: '', // 品牌id 编辑用
            formName,
            disabled: false,
            loadingSubText: '提交中...',
            IsPrivateCust: '1',
            Format: [], // 两级业态数据
            ChannelName: '点击选择', // 渠道名称
            formData: {
                IsPrivateCust: false, // 是否私客
                Name: '', // 品牌名称
                FormatCategory: '', // 一级业态
                Format: '', // 二级业态
                Position: '', // 品牌定位
                BrandType: '', // 经营方式
                Company: '', // 公司
                BrandSource: '', // 来源
                ChannelId: '', // 渠道Id
                // 联系人
                LegalPerson: '', // 姓名
                JobTitle: '', // 职务
                TelPhone: '', // 手机号码
                FixationPhone: '', // 固定电话
                Email: '', // 邮箱
                Address: '', // 通讯地址
                // 需求信息
                Area: '', // 需求面积
                InvestmentBudget: '', // 投资预算
                UrgencyDegree: '', // 紧急程度
                DemandAreas: '', // 需求区域
                Floor: '', // 楼层
                UnitTypeTags: '', // 商铺类型
                Quantity: '', // 电量
                LoadBearing: '', // 楼板承重
                Describe: '' // 备注
            },
            fileList: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }, { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }]
        };
    },
    created() {
        let DataList = this.globalData.windowData.editBrandData;
        if (JSON.stringify(DataList) !== '{}') {
            wx.setNavigationBarTitle({
                title: "编辑品牌" // 页面切换，更换页面标题
            })
            // 主体信息
            if (!!DataList.Entity) {
                let v = DataList.Entity;
                this.IsPrivateCust = v.IsPrivateCust ? '2' : '1';
                this.formData.Name = v.Name; // 品牌名称
                // 业态
                this.Format = v.FormatName; // 业态赋值
                this.formData.FormatCategory = v.FormatCategory; // 一级业态
                this.formData.Format = v.Format; // 二级业态
                this.formData.Position = v.Position; // 品牌定位
                this.formData.BrandType = v.BrandType; // 经营方式
                this.formData.Company = v.Company; // 公司名称
                this.formData.BrandSource = v.BrandSource; // 来源
                this.ChannelName = v.ChannelName; // 渠道名称
                this.formData.ChannelId = v.ChannelId; // 渠道名称id
                this.formData.LegalPerson = v.LegalPerson; // 姓名
                this.formData.JobTitle = v.JobTitle; // 职务
                this.formData.TelPhone = v.TelPhone; // 手机号码
                this.formData.FixationPhone = v.FixationPhone; // 固定电话
                this.formData.Email = v.Email; // 邮箱
                this.formData.Address = v.Address; // 通讯地址
                this.formData.Area = v.Area; // 需求面积
                this.formData.InvestmentBudget = v.InvestmentBudget; // 投资预算
                this.formData.UrgencyDegree = v.UrgencyDegree; // 紧急程度
                this.formData.DemandAreas = v.DemandAreas; // 需求区域
                this.formData.Floor = v.Floor; // 楼层
                this.formData.UnitTypeTags = v.UnitTypeTags; // 商铺类型
                this.formData.Quantity = v.Quantity; // 电量
                this.formData.LoadBearing = v.LoadBearing; // 楼板承重
                this.formData.Describe = v.Describe; // 备注
            }
        }
    },
    mounted() {
        if (!!this.$root.$mp.query && this.$root.$mp.query.id) {
            this.id = this.$root.$mp.query.id; // 客户id
        }
    },
    methods: {
        getName (val) { // 品牌名称赋值
            this.formData.Name = val.detail;
        },
        FormatFun (val) { // 业态
            this.formData.FormatCategory = val[0].val;
            this.formData.Format = val[1].val;
        },
        PositionFun (val) { // 品牌定位
            this.formData.Position = val.val;
        },
        BrandTypeFun (val) { // 经营方式
            this.formData.BrandType = val.val;
        },
        getCompany (val) { // 公司
            this.formData.Company = val.detail;
        },
        BrandSourceFun (val) { // 来源
            this.formData.BrandSource = val.val;
        },
        getLegalPerson (val) { // 姓名
            this.formData.LegalPerson = val.detail;
        },
        getJobTitle (val) { // 职务
            this.formData.JobTitle = val.detail;
        },
        getTelPhone (val) { // 手机号码
            this.formData.TelPhone = val.detail;
        },
        getFixationPhone (val) { // 固定电话
            this.formData.FixationPhone = val.detail;
        },
        getEmail (val) { // 邮箱
            this.formData.Email = val.detail;
        },
        getAddress (val) { // 通讯地址
            this.formData.Address = val.detail;
        },
        AreaFun (val) { // 需求面积
            this.formData.Area = val.val;
        },
        getInvestmentBudget (val) { // 投资预算
            this.formData.InvestmentBudget = val.detail;
        },
        UrgencyDegreeFun (val) { // 紧急程度
            this.formData.UrgencyDegree = val.val;
        },
        DemandAreaFun (val) { // 需求区域
            this.formData.DemandAreas = val;
        },
        getFloor (val) { // 楼层
            this.formData.Floor = val.detail;
        },
        UnitTypeTagsFun (val) { // 商铺类型
            this.formData.UnitTypeTags = val;
        },
        getQuantity (val) { // 电量
            this.formData.Quantity = val.detail;
        },
        getLoadBearing (val) { // 楼板承重
            this.formData.LoadBearing = val.detail;
        },
        getDescribe(val) { // 备注
            this.formData.Describe= val.detail;
        },
        onIsPrivateCust(e) {
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
            if (!checkPhone(this.formData.TelPhone)) {
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
                AddorEditBrand(this.formData).then(res => {
                    if (res.Status == 200) {
                        Toast.success(res.Message);
                        this.globalData.windowData['Brand'] = true;
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
