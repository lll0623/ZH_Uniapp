<template>
    <div class="mine">
        <div class="mineTital">
            <div class="leftImg fl"><van-image round class="img" :src="mineData.HeaderPic" /></div>
            <div class="fl pt20 rightText">
                <p class="ft600 fs34">{{ mineData.WorkerName }}</p>
                <p class="fs28">{{ mineData.OrgName }}</p>
                <p class="fs28">{{ mineData.DepName }}</p>
            </div>
            <div style="clear:both;"></div>
        </div>
        <div class="mineList">
            <van-cell title="我的消息" icon="chat-o" use-label-slot="true" is-link link-type="navigateTo" url="/pages/message/index">
                <view><van-tag type="danger" round v-if="noticeNum>0">{{ noticeNum }}</van-tag></view>
            </van-cell>
            <van-cell title="系统通知" icon="volume-o" is-link></van-cell>
        </div>
        <div class="bottomBtn"><van-button type="danger" @click="UnBind" block>解绑</van-button></div>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>

<script>
import { UnbindAccRela, QueryReminderList, ReminderTotal } from '../../utils/http';
import Toast from '../../static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
export default {
    data () {
        return {
            mineData: this.globalData.useInfo,
            noticeNum: 0 // 未读消息数量
        }
    },
    onShow() {
        this.ReminderTotalFun();
    },
    created () {
    },
    methods: {
        ReminderTotalFun () {
            ReminderTotal({}).then(res => {
                if (res.Status == 200 && res.Data) {
                    this.noticeNum = res.Data;
                }
            })
        },
        UnBind() {
            let params = {
                refId: this.globalData.useInfo.WorkerId,
                refType: '3'
            };
            Dialog.confirm({
                title: '确定解绑当前员工？',
                message: '解绑后需要回到绑定员工页面重新绑定。'
            })
                .then(() => {
                    UnbindAccRela(params).then(res => {
                        if (res.Status == 200) {
                            wx.showToast({
                                title: '解绑成功',
                                duration: 2000
                            });
                            this.globalData.useInfo = null;
                            setTimeout(function() {
                                let url = '../bindStaff/index';
                                wx.redirectTo({ url });
                            }, 2000);
                        } else {
                            Toast.fail({
                                message: res.Message,
                                position: 'top',
                                duration: 3000
                            });
                        }
                    });
                })
                .catch(() => {});
        },
    }
}
</script>
<style lang="scss">
.mine {
    background-color: #eeeeee;
    overflow-y: auto;
    .mineTital {
        background-color: #1989fa;
        color: white;
        padding: 3%;
        display: inline-block;
        width: 94%;
        min-height: 100rpx;
        margin-bottom: 20rpx;
        .leftImg {
            width: 200rpx;
            height: 150rpx;
            .van-image {
                width: 150rpx;
                height: 150rpx;
            }
        }
        .rightText {
            width: calc(100% - 200rpx);
        }
    }
    .bottomBtn {
        position: fixed;
        bottom: 20px;
        padding: 20px;
        width: calc(100% - 40px);
    }
}
</style>
