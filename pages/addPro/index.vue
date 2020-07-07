<template>
    <div class="addPro-wrapper">
        <van-field
            :value="formData.ProjectName"
            required
            @input="getProjectName"
            clearable
            input-align="right"
            label="项目名称"
            placeholder="请输入项目名称" />
        <picker-popup
            @listenTochildEvent="ProjectStatusFun"
            isBT="true"
            :isVal="formData.ProjectStatus"
            label="项目状态"
            lsCode="ProjectStatus"
            />
        <picker-popup
            @listenTochildEvent="ProjectTypeFun"
            :isVal="formData.ProjectType"
            isBT="true"
            label="项目类型"
            lsCode="ProjectType"
            />
        <picker-popup
            @listenTochildEvent="ProjectBelongTypeFun"
            :isVal="formData.ProjectBelongType"
            isBT="true"
            label="项目所属类别"
            lsCode="ProjectBelongType" />
        <van-field 
            :value="formData.ConstrucArea"
            required
            @input="getConstrucAreaName"
            clearable
            type="number"
            input-align="right"
            title-width="120px"
            label="建筑面积（m²）" 
            placeholder="请输入建筑面积" />
        <van-field 
            :value="formData.AvgPrice"
            required
            @input="getAvgPriceName"
            clearable
            type="number"
            title-width="120px"
            input-align="right"
            label="均价（元/m²·天）"
            placeholder="请输入均价" />
        <areas-list
            @listenTochildEvent="AreaListFun"
            isBT="true"
            :isProvince="formData.Province"
            :isCity="formData.City"
            :isArea="formData.Area"
            :isVal="formData.AreaCode"
            label="省市区" />
        <van-field 
            :value="formData.ProjectAddress"
            required
            @input="getProjectAddressName"
            clearable
            input-align="right"
            label="详细地址"
            placeholder="请输入详细地址" />
        <picker-mul 
            @listenTochildEvent="FormatFun"
            isBT="true"
            :isVal="formData.Formats ? formData.Formats : []"
            label="推荐业态"
            lsCode="Format" />
        <van-field 
            :value="formData.ProjectDesc"
            autosize
            @input="getProjectDescName"
            required
            input-align="right"
            clearable
            label="项目介绍"
            placeholder="请输入项目介绍" />
        <div class="clearfix bgCW">
            <van-field
                required
                label="上传轮播图"
                readonly="true" />
            <div class="image-wrap">
                <van-uploader 
                    :file-list="fileList"
                    multiple
                    @delete="deleteFile"
                    @afterread="afterRead" />
            </div>
        </div>
        <div class="clearfix bgCW">
            <van-field
                required
                label="上传项目描述"
                readonly="true" />
            <div class="image-wrap">
                <van-uploader 
                    :file-list="fileList2"
                    multiple
                    @delete="deleteFile2"
                    @afterread="afterRead2" />
            </div>
        </div>
        <div class="c3 p10_15 bold bgEBE">商务条款</div>
        <van-cell>
            <view slot="title">
                <div class="rel">
                    <span class="van-cell-text">付款方式</span>
                </div>
            </view>
            <view class="fr">
                <view class="fl tc c32" style="width:80rpx;">押</view>
                <input class="fl cont tc"  maxlength="2" type="number" :value="Deposit" @input="getDeposit" placeholder="请输入" style="width:85rpx;" />
                <view class="fl tc c32" style="width:80rpx;">付</view>
                <input class="fl cont tc"  maxlength="2" type="number" :value="Pay" @input="getPay" placeholder="请输入" style="width:85rpx;" />
            </view>
        </van-cell>
        <van-cell>
            <view slot="title">
                <div class="rel">
                    <span class="van-cell-text">递增方式</span>
                </div>
            </view>
            <view class="fr">
                <input class="fl cont tc" type="number" :value="YearIncrement" @input="getYearIncrement" placeholder="请输入" style="width:80rpx;" />
                <view class="fl tc c32" style="width:80rpx;">年</view>
                <input class="fl cont tc" type="number" :value="YearIncrementPercent" @input="getYearIncrementPercent" placeholder="请输入" style="width:80rpx;" />
                <view class="fl tc c32" style="width:80rpx;">%</view>
            </view>
        </van-cell>
        <van-field
            :value="PropertyCosts"
            clearable
            @input="getPropertyCosts"
            type="number"
            title-width="130px"
            input-align="right"
            label="物业费（元/m²·月）"
            placeholder="请输入物业费" />
        <van-cell>
            <view slot="title">
                <div class="rel">
                    <span class="van-cell-text">合同年限（年）</span>
                </div>
            </view>
            <view class="fr">
                <input class="fl cont tc" type="number" :value="ContractTermBegin" @input="getContractTermBegin" placeholder="请输入" style="width:80rpx;" />
                <view class="fl tc c32" style="width:80rpx;">--</view>
                <input class="fl cont tc" type="number" :value="ContractTermEnd" @input="getContractTermEnd" placeholder="请输入" style="width:80rpx;" />
            </view>
        </van-cell>
        <van-cell>
            <view slot="title">
                <div class="rel">
                    <span class="van-cell-text">免租期（天）</span>
                </div>
            </view>
            <view class="fr">
                <input class="fl cont tc" type="number" :value="RentFreePeriodBegin" @input="getRentFreePeriodBegin" placeholder="请输入" style="width:80rpx;" />
                <view class="fl tc c32" style="width:80rpx;">--</view>
                <input class="fl cont tc" type="number" :value="RentFreePeriodEnd" @input="getRentFreePeriodEnd" placeholder="请输入" style="width:80rpx;" />
            </view>
        </van-cell>
        <div class="c3 p10_15 bold bgEBE">建筑信息</div>
        <van-field
            :value="RoomRate"
            @input="getRoomRate"
            clearable
            type="number"
            input-align="right"
            label="得房率（%）"
            placeholder="请输入得房率" />
        <van-field
            :value="CommercialArea"
            clearable
            @input="getCommercialArea"
            id="CommercialArea"
            type="number"
            input-align="right"
            label="商业面积（m²）"
            title-width="120px"
            placeholder="请输入商业面积" />
        <van-field
            :value="WorkArea"
            @input="getWorkArea"
            clearable
            type="number"
            input-align="right"
            label="办公面积（m²）"
            title-width="120px"
            placeholder="请输入办公面积" />
        <van-field
            :value="GroundFloor"
            @input="getGroundFloor"
            clearable
            type="number"
            input-align="right"
            label="地上层数"
            placeholder="请输入地上层数" />
        <van-field
            :value="BaseNum"
            @input="getBaseNum"
            clearable
            type="number"
            input-align="right"
            label="地下层数"
            placeholder="请输入地下层数" />
        <van-field
            :value="CarsNumber"
            @input="getCarsNumber"
            clearable
            type="number"
            input-align="right"
            label="车位数"
            placeholder="请输入车位数" />
        <van-field
            :value="Elevator"
            @input="getElevator"
            clearable
            type="number"
            input-align="right"
            label="电梯数"
            placeholder="请输入电梯数" />
        <!-- button -->
        <div class="fix common-btn-wrap bgCW tr">
            <van-button class="cancel" round type="default" @click="Cancel">取消</van-button>
            <van-button class="submit ml12" round type="info" :loading="disabled" :loading-text="loadingSubText" @click="Submit">提交</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import watch from '@/utils/index';
import { AddImProject, GetAreaData, InviteBusinessProjectDetail, EditImProject } from '../../utils/http';
import Toast from '../../static/vant/toast/toast';
import pickerPopup from '@/components/picker';
import pickerMul from '@/components/pickerMul';
import areasList from '@/components/areasList';
let formName = {
    ProjectName: '项目名称',
    ProjectStatus: '项目状态',
    ProjectType: '项目类型',
    ProjectBelongType: '项目所属类别',
    ConstrucArea: '建筑面积',
    AvgPrice: '均价',
    Province: '所在省份',
    City: '所在市',
    Area: '所在区',
    ProjectAddress: '详细地址',
    Formats: '推荐业态',
    ProjectDesc: '项目介绍'
};
export default {
    components: {
        pickerPopup,
        pickerMul,
        areasList
    },
    data () {
        return {
            ProjectId: '', // 招商项目id 编辑页面用的
            disabled: false,
            loadingSubText: '提交中...',
            formName,
            formData: {
                ProjectName: '', // 项目名称
                ProjectStatus: '', // 项目状态
                ProjectType: '', // 项目类型
                ProjectBelongType: '', // 项目所属类别
                ConstrucArea: '', // 建筑面积
                AvgPrice: '', // 均价
                Province: '', // 省
                ProvinceCode: '', // 省编码
                City: '', // 市
                CityCode: '', // 市编码
                Area: '', // 区
                AreaCode: '', // 区编码
                ProjectAddress: '', // 详细地址
                Formats: [], // 推荐业态 FormatName[推荐业态名称]  FormatCode[推荐业态编号]
                ProjectDesc: '', // 项目介绍
                IsIM: true // 招商为true
            },
            // 商务条款
            Deposit: '', // int 押一付三
            Pay: '', // int 押一付三
            YearIncrement: '', // 递增年	 例：2年10%
            YearIncrementPercent: '', // 递增百分比	 例：2年10%
            PropertyCosts: '', // 物业费
            ContractTermBegin: '', // 合同年限（开始年）
            ContractTermEnd: '', // 合同年限结束
            RentFreePeriodBegin: '', // 免租期（开始）30-70
            RentFreePeriodEnd: '', // 免租期（结束）
            RoomRate: '', // 得房率（%）
            // 建筑信息
            CommercialArea: '', // 商业面积
            WorkArea: '', // 办公面积
            GroundFloor: '', // 地上层数
            BaseNum: '', // 地下层数
            CarsNumber: '', // 车位数
            Elevator: '', // 电梯数
            ShufflingPics: [], // 轮播图 PicAddr[图片地址], Sort[排序号]
            ConventionalPics: [], // 项目描述 PicAddr[图片地址], Sort[排序号]
            fileList: [],
            fileList2: []
        }
    },
    created () {
        let DataList = this.globalData.windowData.editProData;
        if (JSON.stringify(DataList) !== '{}') {
            wx.setNavigationBarTitle({
                title: "编辑项目" // 页面切换，更换页面标题
            })
            // 主体信息
            if (!!DataList.Entity) {
                this.formData.ProjectName = DataList.Entity.ProjectName; // 项目名称
                this.formData.ProjectStatus = DataList.Entity.ProjectStatus; // 项目状态
                this.formData.ProjectType = DataList.Entity.ProjectType; // 项目类型
                this.formData.ProjectBelongType = DataList.Entity.ProjectBelongType; // 项目所属类别
                this.formData.ConstrucArea = DataList.Entity.ConstrucArea; // 建筑面积
                this.formData.AvgPrice = DataList.Entity.AvgPrice; // 均价
                this.formData.Province = DataList.Entity.Province; // 省
                this.formData.ProvinceCode = DataList.Entity.ProvinceCode; // 省编码
                this.formData.City = DataList.Entity.City; // 市
                this.formData.CityCode = DataList.Entity.CityCode; // 市编码
                this.formData.Area = DataList.Entity.Area; // 区
                this.formData.AreaCode = DataList.Entity.AreaCode; // 区编码
                this.formData.ProjectAddress = DataList.Entity.ProjectAddress; // 详细地址
                this.formData.Formats = DataList.Entity.Types; // 推荐业态 FormatName[推荐业态名称]  FormatCode[推荐业态编号]
                this.formData.ProjectDesc = DataList.Entity.ProjectDesc; // 项目介绍
                this.Deposit = DataList.Entity.Deposit; // int 押一付三
                this.Pay = DataList.Entity.Pay; // int 押一付三
                this.YearIncrement = DataList.Entity.YearIncrement; // 递增年	 例：2年10%
                this.YearIncrementPercent = DataList.Entity.YearIncrementPercent; // 递增百分比	 例：2年10%
                this.PropertyCosts = DataList.Entity.PropertyCosts; // 物业费
                this.ContractTermBegin = DataList.Entity.ContractTermBegin; // 合同年限（开始年）
                this.ContractTermEnd = DataList.Entity.ContractTermEnd; // 合同年限结束
                this.RentFreePeriodBegin = DataList.Entity.RentFreePeriodBegin; // 免租期（开始）30-70
                this.RentFreePeriodEnd = DataList.Entity.RentFreePeriodEnd; // 免租期（结束）
                this.RoomRate = DataList.Entity.RoomRate; // 得房率（%）
                this.CommercialArea = DataList.Entity.CommercialArea; // 商业面积
                this.WorkArea = DataList.Entity.WorkArea; // 办公面积
                this.GroundFloor = DataList.Entity.GroundFloor; // 地上层数
                this.BaseNum = DataList.Entity.BaseNum; // 地下层数
                this.CarsNumber = DataList.Entity.CarsNumber; // 车位数
                this.Elevator = DataList.Entity.Elevator; // 电梯数
            }
            // 轮播图
            if (!!DataList.Entity.Shuffling && DataList.Entity.Shuffling.length > 0) {
                DataList.Entity.Shuffling.forEach((v, i) => {
                    this.fileList.push({url: this.globalData.windowData.ImgUrl + v.ImageUrl});
                    this.ShufflingPics.push({PicAddr: v.ImageUrl, Sort: ''});
                })
            }
            // 项目描述 projectDesc
            if (!!DataList.Entity.Carousels && DataList.Entity.Carousels.length > 0) {
                DataList.Entity.Carousels.forEach((v, i) => {
                    this.fileList2.push({url: this.globalData.windowData.ImgUrl+ v.ImageUrl});
                    this.ConventionalPics.push({PicAddr: v.ImageUrl, Sort: ''});
                })
            }
        }
    },
    mounted() {
        if (!!this.$root.$mp.query && this.$root.$mp.query.id) {
            this.ProjectId = this.$root.$mp.query.id; // 项目id
        }
    },
    methods: {
        getProjectName (val) { // 项目名称赋值
            this.formData.ProjectName = val.detail;
        },
        getConstrucAreaName (val) { // 建筑面积赋值
            this.formData.ConstrucArea = val.detail;
        },
        getAvgPriceName (val) { // 均价赋值
            this.formData.AvgPrice = val.detail;
        },
        getProjectAddressName (val) { // 详细地址
            this.formData.ProjectAddress = val.detail;
        },
        getProjectDescName (val) { // 项目介绍
            this.formData.ProjectDesc = val.detail;
        },
        ProjectStatusFun (val) { // 项目状态
            this.formData.ProjectStatus = val.val;
        },
        ProjectTypeFun (val) { // 项目类型
            this.formData.ProjectType = val.val;
        },
        ProjectBelongTypeFun (val) { // 项目所属类别
            this.formData.ProjectBelongType = val.val;
        },
        AreaListFun (val) { // 省市区
            if(!!val && val.length > 2) {
                this.formData.Province = val[0].name;
                this.formData.ProvinceCode = val[0].code;
                this.formData.City = val[1].name;
                this.formData.CityCode = val[1].code;
                this.formData.Area = val[2].name;
                this.formData.AreaCode = val[2].code;
            }
        },
        FormatFun (val) { // 推荐业态
            let Data = [];
            if (val.length>0) {
                val.forEach(res => {
                    Data.push({
                        FormatName: res.ItemName,
                        FormatCode: res.ItemCode
                    })
                })
            }
            this.formData.Formats = Data;
        },
        getDeposit (val) { // 押
            this.Deposit = val.detail.value;
        },
        getPay (val) { // 付
            this.Pay = val.detail.value;
        },
        getYearIncrement (val) { // 递增方式 年
            this.YearIncrement = val.detail.value;
        },
        getYearIncrementPercent (val) { // 递增百分比
            this.YearIncrementPercent = val.detail.value;
        },
        getPropertyCosts (val) { // 物业费
            this.PropertyCosts = val.detail;
        },
        getContractTermBegin (val) { // 合同年限（开始年）
            this.ContractTermBegin = val.detail.value;
        },
        getContractTermEnd (val) { // 合同年限结束
            this.ContractTermEnd = val.detail.value;
        },
        getRentFreePeriodBegin (val) { // 免租期（开始）
            this.RentFreePeriodBegin = val.detail.value;
        },
        getRentFreePeriodEnd (val) { // 免租期（结束）
            this.RentFreePeriodEnd = val.detail.value;
        },
        getRoomRate (val) { // 得房率（%）
            this.RoomRate = val.detail;
        },
        getCommercialArea (val) { // 商业面积
            this.CommercialArea = val.detail;
        },
        getWorkArea (val) { // 办公面积
            this.WorkArea = val.detail;
        },
        getGroundFloor (val) { // 地上层数
            this.GroundFloor = val.detail;
        },
        getBaseNum (val) { // 地下层数
            this.BaseNum = val.detail;
        },
        getCarsNumber (val) { // 车位数
            this.CarsNumber = val.detail;
        },
        getElevator (val) { // 电梯数
            this.Elevator = val.detail;
        },
        deleteFile (e) {
            this.fileList.splice(e.mp.detail.index, 1);
            this.ShufflingPics.splice(e.mp.detail.index, 1);
        },
        afterRead (e) {
            let that = this;
            let file = e.detail.file;
            if(file && file.length > 0) {
                file.forEach(item => {
                    wx.uploadFile({
                        url: that.globalData.windowData.Host + '/File/Save',
                        filePath: item.path,
                        name: 'image',
                        formData: {},
                        header: {
                            "Content-Type": "multipart/form-data",
                            'CmpCode': this.globalData.windowData.CmpCode,
                            'LsAppCode': this.globalData.windowData.LsAppCode,
                        },
                        success(res) {
                            // 上传完成需要更新 fileList
                            that.fileList.push({url: that.globalData.windowData.ImgUrl + JSON.parse(res.data).Data});
                            that.ShufflingPics.push({PicAddr: JSON.parse(res.data).Data, Sort: ''});
                        }
                    });
                });
            }
        },
        deleteFile2 (e) {
            this.fileList2.splice(e.mp.detail.index, 1);
            this.ConventionalPics.splice(e.mp.detail.index, 1);
        },
        afterRead2 (e) {
            let that = this;
            let file = e.detail.file;
            if(file && file.length > 0) {
                file.forEach(item => {
                    wx.uploadFile({
                        url: that.globalData.windowData.Host + '/File/Save',
                        filePath: item.path,
                        name: 'image',
                        formData: {
                            'user': 'test'
                        },
                        header: {
                            "Content-Type": "multipart/form-data",
                            'CmpCode': this.globalData.windowData.CmpCode,
                            'LsAppCode': this.globalData.windowData.LsAppCode,
                        },
                        success(res) {
                            // 上传完成需要更新 fileList
                            that.fileList2.push({url: that.globalData.windowData.ImgUrl + JSON.parse(res.data).Data});
                            that.ConventionalPics.push({PicAddr: JSON.parse(res.data).Data, Sort: ''});
                        }
                    });
                });
            }
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
            if (isSum) {
                let params = {
                    Deposit: this.Deposit, // int 押一付三
                    Pay: this.Pay, // int 押一付三
                    YearIncrement: this.YearIncrement, // 递增年	 例：2年10%
                    YearIncrementPercent: this.YearIncrementPercent, // 递增百分比	 例：2年10%
                    PropertyCosts: this.PropertyCosts, // 物业费
                    ContractTermBegin: this.ContractTermBegin, // 合同年限（开始年）
                    ContractTermEnd: this.ContractTermEnd, // 合同年限结束
                    RentFreePeriodBegin: this.RentFreePeriodBegin, // 免租期（开始）30-70
                    RentFreePeriodEnd: this.RentFreePeriodEnd, // 免租期（结束）
                    RoomRate: this.RoomRate, // 得房率（%）
                    // 建筑信息
                    CommercialArea: this.CommercialArea, // 商业面积
                    WorkArea: this.WorkArea, // 办公面积
                    GroundFloor: this.GroundFloor, // 地上层数
                    BaseNum: this.BaseNum, // 地下层数
                    CarsNumber: this.CarsNumber, // 车位数
                    Elevator: this.Elevator, // 电梯数
                    ShufflingPics: this.ShufflingPics,
                    ConventionalPics: this.ConventionalPics
                }
                // 轮播图加序号
                if (!!this.ShufflingPics && this.ShufflingPics.length > 0) {
                    this.ShufflingPics.forEach((v, i) => {
                        v["Sort"] = (i + 1);
                    })
                }
                // 项目描述加序号
                if (!!this.ConventionalPics && this.ConventionalPics.length > 0) {
                    this.ConventionalPics.forEach((v, i) => {
                        v["Sort"] = (i + 1);
                    })
                }
                params = Object.assign(params, this.formData);
                this.disabled = true;
                if (this.ProjectId == "") {
                    AddImProject(params).then(res => {
                        if (res.Status == 200) {
                            Toast.success(res.Message);
                            this.globalData.windowData['Pro'] = true; // 为true 回退列表页会刷新
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
                    params['ProjectId'] = this.ProjectId;
                    EditImProject(params).then(res => {
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
                }
            }
        },
        Cancel () {
            wx.navigateBack({
                delta: 1
            });
        }
    },
}
</script>
<style lang="scss">
.addPro-wrapper {
    padding-bottom: 75px;
    .image-wrap {
        padding: 16px 16px 0;
    }
}
</style>
