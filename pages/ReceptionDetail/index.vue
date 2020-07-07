<template>
    <div class="ReceptionDetail-wrapper">
        <div class="top bgCW">
            <div class="clearfix mb12 fir-wrap">
                <h4 class="fs16 bold c0 fl" v-if="Entity.SourceName">{{ Entity.SourceName }}</h4>
                <div class="clearix tags-wrap fl rel">
                    <van-tag type="success" class="tag">{{ type }}</van-tag>
                </div>
                <div class="btn fr c9 fs12 rel" v-if="Entity.SourceId" @click="linkAgent(Entity.SourceId)">查看<van-icon name="arrow" class="rel" /></div>
            </div>
            <div class="clearfix sec-wrap mb12 ">
                <!-- <p class="fl ellipsis c9 fs12">带看编号:KH000895</p> -->
                <p class="fl ellipsis c9 fs12 ml8">招商人员:{{ Entity.StaffName }}</p>
            </div>
            <div class="thir-wrap mb12">
                <div class="clearfix item mb12">
                    <label class="fl block fs14 c6">带看项目</label>
                    <p class="fs14 c3 cBlue fl ellipsis">{{ Entity.StructureName }}</p>
                </div>
                <div class="clearfix item mb12">
                    <label class="fl block fs14 c6">预约时间</label>
                    <p class="fs14 cBlue fl ellipsis">{{ Entity.ReceptionTime | formatDay }} {{Entity.BeginDate}}-{{ Entity.EndDate }}</p>
                </div>
            </div>
            <div class="clearfix mb12 fir-wrap">
                <h4 class="fs16 bold c0 fl">带看反馈</h4>
            </div>
            <ul class="detail-wrap">
                <li class="clearfix">
                    <label class="fl c6">满意度:</label>
                    <p class="fl cBlue" v-if="Entity.Satisfaction == '1'">{{ Entity.Satisfaction | GetItemsFilter('Ls.Ag.ReceptionSatisfaction', globalData.windowData.GetItemsData) }}</p>
                    <p class="fl cOrange" v-if="Entity.Satisfaction == '2'">{{ Entity.Satisfaction | GetItemsFilter('Ls.Ag.ReceptionSatisfaction', globalData.windowData.GetItemsData) }}</p>
                    <p class="fl cGreen" v-if="Entity.Satisfaction == '3'">{{ Entity.Satisfaction | GetItemsFilter('Ls.Ag.ReceptionSatisfaction', globalData.windowData.GetItemsData) }}</p>
                </li>
                <li class="clearfix">
                    <label class="fl c6">情况说明:</label>
                    <p class="fl c3">{{ Entity.Remark }}</p>
                </li>
            </ul>
        </div>
        <div class="followUp">
            <div class="title c6 fs14">跟进记录</div>
            <ul class="content bgCW">
                <div v-if="FollowUp.length == 0" class="cRed tc p20">暂无数据</div>
                <li v-for="(v, i) in FollowUp" :key="i">
                    <div class="clearfix mb12">
                        <h4 class="fl fs14 c3">{{ v.StaffName }}</h4>
                        <p class="fr fs14 c6">{{ v.CreateTime | formatTime }}</p>
                    </div>
                    <p class="fs14 c3">{{ v.Content }}</p>
                </li>
            </ul>
        </div>
        <div class="fix btn-wrap bgCW">
            <div class="fr tc bgCBlue cWhite fs14" @click="addFollowUp">写跟进</div>
            <div class="fr cWhite bgCBlue tc fs14" @click="showCust=true">回访</div>
            <div class="fr cBlue tc fs14" @click="delReception" style="margin-right: 12px;border: 1px solid #bbb;">删除</div>
        </div>
        <!-- 联系客户 -->
        <van-action-sheet
            :show="showCust"
            :actions="actionsCust"
            close-on-click-overlay
            safe-area-inset-bottom
            close-on-click-action
            @select="selectCust"
            @close="() => { this.showCust = false;}"
            :description="Entity.SourceName"
            @cancel="() => { this.showCust = false; }"
            cancel-text="取消" />
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
import Toast from '../../static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
import { GetReceptionDetail, DeleteReception } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
export default {
    data() {
        return {
            id: '', // 带看id
            type: '', // 带看类型
            imageDoin: this.globalData.windowData.ImgUrl,
            Entity: {}, // 主体信息
            FollowUp: [], // 跟进记录
            actionsCust: [],
            // 推荐房源
            activeNameHouseSources: '3',
            // 更多操作
            isShowPopup: false,
            showCust: false // 联系渠道
        };
    },
    onShow() {
        this.id = this.$root.$mp.query.id; // 项目id
        this.type = this.$root.$mp.query.type; // 带看类型
        this.isShowPopup = false; // 关闭更多按钮弹框
        this.GetReceptionDetailFun(); // 渠道详情
    },
    methods: {
        GetReceptionDetailFun () {
            let params = {
                id: this.id
            }
            GetReceptionDetail(params).then(res => {
                if (res.Status == 200) {
                    res.Data = nullToStr(res.Data);
                    let EntityData = res.Data.Entity;
                    // 主体信息
                    (!!EntityData) ? this.Entity = EntityData : this.Entity = {};
                    // 跟进记录 FollowUp
                    if (!!res.Data.FollowUp && res.Data.FollowUp.length > 0) this.FollowUp = res.Data.FollowUp;
                    // 联系渠道赋值
                    if (!!EntityData) {
                        this.actionsCust = [];
                        this.actionsCust.push(
                            {name: '手机号码:' + EntityData.SourcePhone, val: EntityData.SourcePhone, color: '#1989fa', type: 1},
                            {name: '固定电话:' + EntityData.SourceFixePhone, val: EntityData.SourceFixePhone, color: '#1989fa', type: 1},
                            {name: '邮箱:' + EntityData.SourceEmail, val: EntityData.SourceEmail, color: '#1989fa', type: 2},
                            {name: '地址:' + EntityData.SourceAddress, val: EntityData.SourceAddress, color: '#1989fa', type: 2}
                        )
                    }
                } else {
                    Toast.fail({
                        message: res.Message,
                        position: 'top',
                        duration: 3000
                    });
                }
            })
        },
        delReception () {
            Dialog.confirm({
                title: '删除带看',
                message: '是否确认删除该带看？'
            }).then(() => {
                let params = {
                    id: this.id
                }
                DeleteReception(params).then(res => {
                    if (res.Status == 200) {
                        Toast.success(res.Message);
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1
                            });
                        }, 2000);
                    } else {
                        Toast.fail(res.Message);
                    }
                })
            }).catch(() => {
                // on cancel
            });
        },
        linkAgent (id) { // 查看
            if (this.Entity.ReceptionType == 1) wx.navigateTo({ url: '../custDetail/index?id=' + id });
            if (this.Entity.ReceptionType == 3) wx.navigateTo({ url: '../channelDetail/index?id=' + id });
            if (this.Entity.ReceptionType == 4) wx.navigateTo({ url: '../brandDetail/index?id=' + id });
        },
        addFollowUp () {
            let url = '../addFollowUp/index?id='+ this.id +'&type='+ 4;
            wx.navigateTo({ url: url });
        },
        // 联系客户选项列
        selectCust (e) {
            const { val, type } = e.detail;
            if (type == 1) {
                if (!!val && val != '') {
                    wx.makePhoneCall({
                        phoneNumber: val
                    });
                }
            }
            if (type == 2) {
                if (!!val && val != '') {
                    wx.setClipboardData({
                        data: val,
                        success: function (res) {
                            wx.getClipboardData({
                                success: function (res) {
                                    wx.showToast({
                                        title: '复制成功'
                                    })
                                }
                            })
                        }
                    })
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.ReceptionDetail-wrapper {
    padding-bottom: 60px;
    > .top {
        padding: 16px;
        .fir-wrap {
            .tags-wrap {
                top: -1px;
                .tag {
                    margin-left: 8px;
                }
            }
            > .btn {
                top: 2px;
                .rel {
                    top: 2px;
                }
            }
        }
        > .sec-wrap {
            p {
                width: calc(50% - 8px);
                &:nth-of-type(1) {
                    width: 50%;
                }
            }
        }
        > .thir-wrap {
            > .item {
                label {
                    width: 70px;
                    margin-right: 4px;
                }
                p {
                    width: calc(100% - 74px);
                    &.btn-p {
                        width: calc(100% - 120px);
                    }
                }
                .btn {
                    top: 2px;
                    .rel {
                        top: 2px;
                    }
                }
            }
        }
        > ul.detail-wrap {
            li {
                font-size: 14px;
                margin-bottom: 12px;
                > label {
                    display: block;
                    width: 70px;
                    margin-right: 8px;
                }
                > p {
                    width: calc(100% - 78px);
                }
                > div {
                    &.rate-wrap {
                        p {
                            width: 30px;
                        }
                        .rate {
                            top: -1px;
                            margin-left: 4px;
                        }
                    }
                }
                > .tags-wrap {
                    .tag {
                        margin-left: 4px;
                        &:nth-of-type(1) {
                            margin-left: 0;
                        }
                    }
                }
            }
        }
    }
    .followUp {
        border-top: 8px solid #eee;
        .title {
            padding: 12rpx 16px;
            border-bottom: 1px solid #eee;
        }
        .content {
            padding: 16px;
            li {
                border-bottom: 1px solid #f5f5f5;
                padding: 12px 0;
                &:first-child {
                    padding-top: 0;
                }
                &:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
            }
        }
    }
    > .btn-wrap {
        bottom: 0;
        left: 0;
        padding: 12px;
        width: calc(100% - 24px);
        border-top: 1px solid #ddd;
        > div {
            border-radius: 40px;
            height: 34px;
            line-height: 34px;
            padding: 0 20px;
            text-align: center;
            &:nth-of-type(2) {
                margin-right: 12px;
                border: 1px solid #ddd;
            }
        }
    }
}
</style>
