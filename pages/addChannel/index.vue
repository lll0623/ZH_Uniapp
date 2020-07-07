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
                label="渠道姓名"
                placeholder="请输入渠道姓名" />
            <picker-popup
                @listenTochildEvent="AgentTypeFun"
                :isVal="formData.AgentType"
                label="渠道类型"
                isBT="true"
                lsCode="AgentType" />
            <van-field
                :value="formData.CompanyName"
                @input="getCompanyName"
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
                @listenTochildEvent="AgentSourceFun"
                :isVal="formData.AgentSource"
                label="来源"
                lsCode="Source" />
            <van-field
                :value="formData.Remark"
                @input="getRemark"
                input-align="right"
                required clearable autosize label="备注" type="number" placeholder="请输入备注" />
        </van-cell-group>
        <h4 class="fs14 c0 tit bold">联系方式</h4>
        <van-cell-group>
            <van-field
                :value="formData.Phone"
                @input="getPhone"
                input-align="right"
                required
                clearable label="手机号码" type="tel" placeholder="请输入手机号码" />
            <van-field
                :value="formData.TelPhone"
                @input="getTelPhone"
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
import { AddInviteAgentCust } from '../../utils/http'
import { checkPhone, checkEmail } from '../../utils/index'
let formName = {
    Name: '渠道名称',
    AgentType: '渠道类型',
    Phone: '联系人手机号码',
    Remark: '备注'
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
            id: '', // 渠道id 编辑用
            formName,
            disabled: false,
            loadingSubText: '提交中...',
            IsPrivateCust: '1',
            formData: {
                IsPrivateCust: false, // 是否私客
                Name: '', // 渠道姓名
                AgentType: '', // 渠道类型
                CompanyName: '', // 公司
                JobTitle: '', // 职务
                AgentSource: '', // 来源
                Remark: '', // 备注
                Phone: '', // 手机号码
                TelPhone: '', // 固定电话
                Email: '', // 邮箱
                Address: '', // 通讯地址
            }
        };
    },
    created() {
        let DataList = this.globalData.windowData.editChannelData;
        if (JSON.stringify(DataList) !== '{}') {
            wx.setNavigationBarTitle({
                title: "编辑渠道" // 页面切换，更换页面标题
            })
            // 主体信息
            if (!!DataList.Entity) {
                let v = DataList.Entity;
                this.IsPrivateCust = v.IsPrivateCust ? '2' : '1';
                this.formData.Name = v.Name; // 渠道名称
                this.formData.AgentType = v.AgentType; // 渠道类型
                this.formData.CompanyName = v.CompanyName; // 公司名称
                this.formData.JobTitle = v.JobTitle; // 职务
                this.formData.AgentSource = v.AgentSource; // 来源
                this.formData.Remark = v.Remark; // 备注
                this.formData.Phone = v.Phone; // 手机号码
                this.formData.TelPhone = v.TelPhone; // 固定电话
                this.formData.Email = v.Email; // 邮箱
                this.formData.Address = v.Address; // 通讯地址
            }
        }
    },
    mounted() {
        if (!!this.$root.$mp.query && this.$root.$mp.query.id) {
            this.id = this.$root.$mp.query.id; // 客户id
        }
    },
    methods: {
        getName (val) { // 渠道姓名赋值
            this.formData.Name = val.detail;
        },
        getCompanyName (val) { // 公司
            this.formData.CompanyName = val.detail;
        },
        getJobTitle (val) { // 职务
            this.formData.JobTitle = val.detail;
        },
        AgentSourceFun (val) { // 来源
            this.formData.AgentSource = val.val;
        },
        AgentTypeFun (val) { // 渠道类型
            this.formData.AgentType = val.val;
        },
        getPhone (val) { // 手机号码
            this.formData.Phone = val.detail;
        },
        getTelPhone (val) { // 固定电话
            this.formData.TelPhone = val.detail;
        },
        getEmail (val) { // 邮箱
            this.formData.Email = val.detail;
        },
        getAddress (val) { // 通讯地址
            this.formData.Address = val.detail;
        },
        getRemark (val) { // 备注
            this.formData.Remark = val.detail;
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
            if (!checkPhone(this.formData.Phone)) {
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
                AddInviteAgentCust(this.formData).then(res => {
                    if (res.Status == 200) {
                        Toast.success(res.Message);
                        this.globalData.windowData['Channel'] = true;
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
        }
    }
}
</style>
