<template>
    <div class="addFollowUp-wrapper">
        <van-cell-group>
            <div class="common-field clearfix rel">
                <label class="rel fl common-label">
                    <span class="cRed abs fs12">*</span>
                    <span class="fs14 c3 text">跟进内容</span>
                </label>
                <div class="fl common-ipt rel"
                     style="top:-3px;">
                    <van-field 
                        :value="content"
                        @input="getContent"
                        type="textarea"
                        placeholder="勤跟进,多签单"
                        border="true"
                        autosize
                        input-class="textarea" />
                </div>
            </div>
        </van-cell-group>
        <!-- button -->
        <div class="submit">
            <van-button block
                        type="info"
                        @click="Submit"
                        :loading="disabled" :loading-text="loadingSubText"
                        size="normal">提交</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import Toast from '../../static/vant/toast/toast';
import { RegisterFollowUp, UpdateFollowUpContent } from '../../utils/http.js'
export default {
    data () {
        return {
            RefType: '', // 注册类型
            RefId: '', // 注册关联id
            disabled: false,
            loadingSubText: '提交中...',
            content: ''
        }
    },
    mounted() {
        this.RefType = this.$root.$mp.query.type;
        this.RefId = this.$root.$mp.query.id;
    },
    methods: {
        getContent (val) {
            this.content = val.detail;
        },
        Submit () {
            if (this.content == '') {
                Toast.fail('跟进内容不能为空');
                return;
            }
            RegisterFollowUp({relas: [{RefType: Number(this.RefType), RefId: this.RefId}]}).then(res => {
                if (res.Status == 200) {
                    if(!!res.Data) {
                        let params = {
                            id: res.Data,
                            content: this.content
                        }
                        this.disabled = true;
                        UpdateFollowUpContent(params).then(res => {
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
                } else {
                    Toast.fail(res.Message);
                }
            })
        }
    },
    created () { }
}
</script>
<style lang="scss">
.addFollowUp-wrapper {
    .submit {
        margin: 16px;
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
</style>
