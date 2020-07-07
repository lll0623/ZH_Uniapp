<template>
    <div class="addDynamic-wrapper">
        <van-cell-group>
            <van-field :value="title"
                       required
                       clearable
                       @input="gettitle"
                       input-align="right"
                       label="动态标题"
                       placeholder="请输入动态标题" />
            <van-field :value="contents"
                       required
                       @input="getcontents"
                       clearable
                       type="textarea"
                       label="动态内容"
                       placeholder="勤跟进,多签单"
                       border="true"
                       autosize="true" />
        </van-cell-group>
        <div class="submit">
            <van-button block
                        type="info"
                        @click="Submit" :loading="disabled" :loading-text="loadingSubText"
                        size="normal">提交</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '../../static/vant/toast/toast';
import { AddImProjectNews } from '../../utils/http'
export default {
    data () {
        return {
            disabled: false,
            loadingSubText: '提交中...',
            projectId: '',
            title: '',
            contents: ''
        }
    },
    mounted() {
        if (!!this.$root.$mp.query && this.$root.$mp.query.id) {
            this.projectId = this.$root.$mp.query.id; // 客户id
        }
    },
    methods: {
        gettitle (val) {
            this.title = val.detail;
        },
        getcontents (val) {
            this.contents = val.detail;
        },
        Submit () {
            if (this.title == "") {
                Toast.fail('动态标题不能为空');
                return false;
            }
            if (this.contents == "") {
                Toast.fail('动态内容不能为空');
                return false;
            }
            let params = {
                projectId: this.projectId,
                title: this.title,
                contents: this.contents
            }
            this.disabled = true;
            AddImProjectNews(params).then(res => {
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
}
</script>
<style lang='scss'>
.addDynamic-wrapper {
    .submit {
        margin: 16px;
    }
}
</style>
