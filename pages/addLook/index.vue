<template>
    <div class="addLook-wrapper">
        <van-cell is-link
                  :value="dateTimeText"
                  @click="()=>{
                      this.isShowPopup = true
                  }">
            <view slot="title">
                <div class="rel common-required">
                    <span class="cRed">*</span>
                    <span class="van-cell-text">带看时间</span>
                </div>
            </view>
        </van-cell>
        <van-cell is-link
                  url="/pages/selPro/index?type=0"
                  :value="StructureName">
            <view slot="title">
                <div class="rel common-required">
                    <span class="cRed">*</span>
                    <span class="van-cell-text">带看项目</span>
                </div>
            </view>
        </van-cell>
        <picker-popup
            @listenTochildEvent="SatisfactionFun"
            isBT="true"
            :isVal="formData.Satisfaction"
            label="带看满意度"
            lsCode="ReceptionSatisfaction"
            />
        <van-field
            :value="formData.Remark"
            @input="getRemark"
            input-align="right"
            required clearable autosize label="带看反馈" placeholder="勤跟进,多签单" />
        <!-- button -->
        <div class="submit">
            <van-button block
                @click="AddReceptionFun"
                type="info"
                :loading="disabled" :loading-text="loadingSubText"
                size="normal">提交</van-button>
        </div>
        <!-- popup -->
        <van-popup :show="isShowPopup"
                   position="bottom"
                   custom-style="height: 100%;width: 100%;"
                   @close="()=>{this.isShowPopup = false}">
            <!-- 带看时间 -->
            <date-time @listenTochildEvent="getDateTime" />
        </van-popup>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import Toast from '../../static/vant/toast/toast';
import { AddReception } from '../../utils/http.js'
import dateTime from '@/components/dateTime';
import pickerPopup from '@/components/picker';
let formName = {
    ReceptionTime: '带看时间',
    StructureId: '带看项目',
    Satisfaction: '带看满意度',
    Remark: '带看反馈',
};
export default {
    components: {
        dateTime,
        pickerPopup
    },
    data () {
        return {
            formName,
            id: '', // 来源id
            disabled: false,
            loadingSubText: '提交中...',
            dateTimeText: '点击选择',
            isShowPopup: false,
            StructureName: '点击选择', // 项目名称
            formData: {
                ReceptionTime: '', // 带看日期
                BeginDate: '', // 带看开始时间
                EndDate: '', // 带看结束时间
                StructureId: '', // 项目Id
                Satisfaction: '', // 满意度。
                Remark: '', // 带看反馈
                ReceptionType: 1, // 带看类型 必传 1:客户.2:项目.3:渠道.4:品牌.5:报备
            }
        }
    },
    onShow () {
        // 选择项目数据 赋值
        let ProId = this.globalData.windowData.ProId;
        if (!!ProId && ProId.length > 0) {
            this.formData.StructureId = ProId[0].val;
            this.StructureName = ProId[0].name;
            this.globalData.windowData.ProId = ''; // 置空
        }
    },
    mounted() {
        this.id = this.$root.$mp.query.id; // 来源id
        let type = Number(this.$root.$mp.query.type); // 带看类型
        this.formData.ReceptionType = type;
        type == 1 ? this.formData["CustId"] = this.id : type == 3 ? this.formData["AgentId"] = this.id : type == 4 ? this.formData["BrandId"] = this.id : type == 5 ? this.formData["BookId"] = this.id : '';
    },
    methods: {
        SatisfactionFun (val) { // 满意度
            this.formData.Satisfaction = val.val;
        },
        getRemark (val) { // 备注
            this.formData.Remark = val.detail;
        },
        getDateTime (val) {
            this.dateTimeText = val.ReceptionTime + ' ' + val.BeginDate + '-' + val.EndDate;
            this.formData.ReceptionTime = val.ReceptionTime;
            this.formData.BeginDate = val.BeginDate;
            this.formData.EndDate = val.EndDate;
            this.isShowPopup = false;
        },
        AddReceptionFun () { // 带看提交
            let isSum = true;
            for (let item in this.formName) {
                if (this.formData[item] == "" || !this.formData[item]) {
                    Toast.fail(this.formName[item] + '不能为空');
                    isSum = false;
                    return;
                }
            };
            if (isSum) {
                this.disabled = true;
                AddReception(this.formData).then(res => {
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
    created () { }
}
</script>
<style lang="scss">
.addLook-wrapper {
    .submit {
        margin: 16px;
    }
}
</style>
