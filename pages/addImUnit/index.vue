<template>
    <div class="addImUnit-wrapper">
        <van-cell-group>
            <van-cell is-link
                      @click="()=>{this.isShow = true}">
                <view slot="title">楼栋/楼层</view>
                <view class=""> {{ label }} </view>
            </van-cell>
            <van-field 
                :value="formData.Name"
                required
                @input="getName"
                clearable
                input-align="right"
                label="名称"
                placeholder="请输入名称" />
            <van-field
                v-if="Level>0"
                :value="formData.ConstructionArea"
                required
                @input="getConstructionArea"
                clearable
                input-align="right"
                label="建筑面积(㎡)"
                type="digit"
                placeholder="请输入建筑面积" />
            <van-field
                v-if="Level>0"
                :value="formData.MonthRent"
                required
                @input="getMonthRent"
                clearable
                input-align="right"
                label="月租金(元/月)"
                type="digit"
                placeholder="请输入月租金" />
            <van-field
                v-if="Level>0"
                :value="formData.DailyRent"
                required
                @input="getDailyRent"
                clearable
                input-align="right"
                label="日单价(元/m²·天)"
                title-width="130px"
                type="digit"
                placeholder="请输入日单价" />
            <picker-popup
                @listenTochildEvent="UnitStatusFun"
                :isVal="formData.UnitStatus"
                isBT="true"
                label="商铺状态"
                lsCode="Vacancy" />
            <picker-popup
                @listenTochildEvent="ImUnitTypeFun"
                :isVal="formData.ImUnitType"
                isBT="true"
                label="商铺类别"
                lsCode="ImUnitType" />
            <picker-popup
                @listenTochildEvent="FormatFun"
                :isVal="formData.Format"
                isBT="true"
                label="业态"
                lsCode="Format" />
            <picker-popup
                @listenTochildEvent="DecoRateFun"
                :isVal="formData.DecoRate"
                label="装修"
                isBT="true"
                lsCode="DecoRate" />
            <picker-popup
                @listenTochildEvent="FoodConditionsFun"
                :isVal="formData.FoodConditions"
                label="餐饮条件"
                isBT="true"
                lsCode="CateringType" />
            <van-field
                :value="formData.Sort"
                @input="getSort"
                clearable
                input-align="right"
                label="排序"
                type="digit"
                placeholder="请输入排序" />
            <div class="clearfix bgCW">
                <van-field
                    required
                    label="招商商铺图片"
                    readonly="true" />
                <div class="image-wrap">
                    <van-uploader 
                        :file-list="fileList"
                        multiple
                        @delete="deleteFile"
                        @afterread="afterRead" />
                </div>
            </div>
        </van-cell-group>
        <!-- button -->
        <div class="fix common-btn-wrap bgCW tr">
            <van-button class="cancel" round type="default" @click="Cancel">取消</van-button>
            <van-button class="submit ml12" round type="info" v-if="!isEdit" :loading="disabled" :loading-text="loadingSubText" @click="Submit(1)">提交并新增</van-button>
            <van-button class="submit ml12" round type="info" :loading="disabled" :loading-text="loadingSubText" @click="Submit(2)">提交</van-button>
        </div>
        <van-toast id="van-toast" />
        <van-popup :show="isShow" position="right" custom-style="height: 100%;width:100%;padding-bottom: 60px;">
            <div class="filter-wrapper">
                <div class="title">
                    <view class="fl cBlue back" @click="backLi" v-show="Level>0">
                        返回上级
                    </view>
                    <view class="fl ml8">
                        <van-tag type="primary" size="large" v-if="pstruceName">{{ pstruceName }}</van-tag>
                    </view>
                    <view class="clearfix"></view>
                </div>
                <ul class="content">
                    <li v-for="(item, index) in option" :key="index" >
                        <view :class="{'active': activeLi == index ? true : false,'fl':true}" style="width: calc(100% - 106px);" @click="chooseLi(item, index)">{{ item.Name }}</view>
                        <view class="cBlue fr" style="width: 70px;" @click.native.stop="nextPar(item)">
                            下一级
                        </view>
                        <view class="clearfix"></view>
                    </li>
                </ul>
                <div class="fix common-btn-wrap bgCW tr">
                    <van-button class="cancel" round type="default" @click="isShow = false">关闭</van-button>
                    <van-button class="submit ml12" round type="info" @click="isShow = false">确定</van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import Toast from '../../static/vant/toast/toast';
import pickerPopup from '@/components/picker';
import pickerPopup2 from '@/components/picker2';
import pickerMul from '@/components/pickerMul';
import { AddImunit, GetImUnitInfo } from '../../utils/http.js'
import { checkPhone, checkEmail } from '../../utils/index'
import Vue from 'vue';
let formName = {
    Name: '名称',
    // ConstructionArea: '建筑面积',
    // DailyRent: '日单价',
    UnitStatus: '商铺状态',
    ImUnitType: '商铺类别',
    FoodConditions: '餐饮条件',
    Format: '业态',
    DecoRate: '装修'
};
export default {
    components: {
        pickerPopup,
        pickerPopup2,
        pickerMul
    },
    onShow() {},
    data() {
        return {
            isEdit: false,
            Id: '', // 房源id 编辑用
            disabled: false,
            loadingSubText: '提交中...',
            formName,
            ProjectId: '', // 招商项目id
            formData: {
                ParentId: '', // 房源id
                Name: '', // 房源名称
                ConstructionArea: '', // 建筑面积
                MonthRent: '', // 月租金
                DailyRent: '', // 日单价
                UnitStatus: '', // 商铺状态
                ImUnitType: '', // 商铺类别
                Format: '', // 业态
                DecoRate: '', // 装修
                FoodConditions: '', // 餐饮条件
                Sort: '', // 排序
            },
            Pics: [], // 招商房源图片
            fileList: [], // 招商房源图片
            isShow: false, // 房源信息弹框
            TreeList: [], // 房源信息数据
            option: [],
            label: '点击选择房源',
            budynekName: '', // 楼栋名称
            pstruceName: '',
            Level: 0,
            activeLi: -1
        };
    },
    created() {
        let DataList = this.globalData.windowData.editImUnit;
        debugger
        if (DataList && JSON.stringify(DataList) !== '{}') {
            wx.setNavigationBarTitle({
                title: "编辑房源" // 页面切换，更换页面标题
            })
            this.isEdit = true;
            // 主体信息
            if (!!DataList) {
                let res = DataList;
                this.formData["Id"] = res.Id;
                this.formData.ParentId = res.ParentId;
                let index = res.FullName.lastIndexOf("\/");
                this.label = res.FullName.substring(0, index+1);
                this.formData.Name = res.Name;
                this.formData.ConstructionArea = res.ConstructionArea;
                this.formData.MonthRent = res.MonthRent;
                this.formData.DailyRent = res.DailyRent;
                this.formData.UnitStatus = res.UnitStatus;
                this.formData.ImUnitType = res.ImUnitType;
                this.formData.Format = res.Format;
                this.formData.DecoRate = res.DecoRate;
                this.formData.FoodConditions = res.FoodConditions;
                this.formData.Sort = res.Sort;
                this.Level = 1;
                // 轮播图
                if (res.Pics &&res.Pics.length > 0) {
                    res.Pics.forEach((v, i) => {
                        this.fileList.push({url: this.globalData.windowData.ImgUrl + v.PicAddr});
                        this.Pics.push({PicAddr: v.PicAddr, RefType: 8});
                    })
                }
                this.ProjectId = res.ProjectId; // 客户id
                this.TreeList = this.globalData.windowData.HomeTreeList;
                this.option = this.globalData.windowData.HomeTreeList;
            }
        }
    },
    mounted() {
        if (!!this.$root.$mp.query && this.$root.$mp.query.id) {
            this.ProjectId = this.$root.$mp.query.id; // 项目id
            this.TreeList = this.globalData.windowData.HomeTreeList;
            this.option = this.globalData.windowData.HomeTreeList;
        }
    },
    methods: {
        chooseLi (val, index) { // 选中楼栋/楼层
            this.activeLi = index;
            if (this.formData.ParentId == val.Id) {
                return
            }
            if (val.Level == 0) this.pstruceName = val.Name, this.budynekName = val.Name;
            if (val.Level == 1) this.pstruceName = this.budynekName + '/' + val.Name;
            this.formData.ParentId = val.Id;
            this.label = this.pstruceName;
        },
        nextPar (val) { // 下一级
            if (val.Children && val.Children.length>0 && val.Level<1) {
                if (val.Level == 0) this.pstruceName = val.Name, this.budynekName = val.Name;
                this.formData.ParentId = val.Id;
                this.option = val.Children;
                this.activeLi = -1;
                this.Level = val.Level+1;
            }
        },
        backLi () { // 上一级
            this.activeLi = -1;
            this.option = this.TreeList;
            this.Level = 0;
            this.pstruceName = "";
            this.label = "";
            this.formData.ParentId = "";
        },
        getName (val) { // 名称
            this.formData.Name = val.detail;
        },
        getConstructionArea (val) { // 建筑面积
            this.formData.ConstructionArea = Number(val.detail);
        },
        getMonthRent (val) { // 月租金
            this.formData.MonthRent = Number(val.detail);
        },
        getDailyRent (val) { // 日单价
            this.formData.DailyRent = Number(val.detail);
        },
        FormatFun (val) { // 业态
            this.formData.Format = val.val;
        },
        UnitStatusFun (val) { // 商铺状态
            this.formData.UnitStatus = Number(val.val);
        },
        ImUnitTypeFun (val) { // 商铺类别
            this.formData.ImUnitType = val.val;
        },
        DecoRateFun (val) { // 装修
            this.formData.DecoRate = val.val;
        },
        getSort (val) { // 排序
            this.formData.Sort = Number(val.detail);
        },
        FoodConditionsFun (val) { // 餐饮条件
            this.formData.FoodConditions = Number(val.val);
        },
        deleteFile (e) {
            this.fileList.splice(e.mp.detail.index, 1);
            this.Pics.splice(e.mp.detail.index, 1);
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
                            that.Pics.push({PicAddr: JSON.parse(res.data).Data, RefType: 8});
                        }
                    });
                });
            }
        },
        Submit (i) {
            let isSum = true;
            if (this.Level>0) {
                this.formName["ConstructionArea"] = '建筑面积';
                this.formName["DailyRent"] = '日单价';
            } else {
                Vue.delete(this.formName, 'ConstructionArea');
                Vue.delete(this.formName, 'DailyRent');
            }
            for (let item in this.formName) {
                if (this.formData[item] == "" || !this.formData[item]) {
                    Toast.fail(this.formName[item] + '不能为空');
                    isSum = false;
                    return;
                }
            };
            if (this.Pics.length == 0) {
                Toast.fail('请上传招商商铺图片');
                return;
            }
            if (isSum) {
                this.disabled = true;
                this.formData['ProjectId'] = this.ProjectId;
                this.formData['Pics'] = this.Pics;
                AddImunit(this.formData).then(res => {
                    if (res.Status == 200) {
                        Toast.success(res.Message);
                        setTimeout(()=>{
                            this.disabled = false;
                            if (i == 2) {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
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
.addImUnit-wrapper {
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
    .common-btn-wrap {
        button {
            min-width: initial;
        }
    }
    .filter-wrapper {
        .title {
            height: 23px;
            border-bottom: 2px solid #eee;
            padding: 8px;
        }
        .content {
            li {
                border-bottom: 1px solid #eee;

                .fl {
                    padding: 8px;
                }
                .fl.active {
                    background-color: #1989fa;
                    color: white;
                }
                .fr {
                    padding: 8px;
                }
            }
        }
    }
}
</style>
