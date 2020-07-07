<template>
    <div class="message-wrapper">
        <div class="bgEEE" style="padding: 5px 10px;">
            <span v-if="noticeNum == 0" class="c6 fs12">没有未读消息</span>
            <span class="c6 fs12" v-else>{{ noticeNum }} 条未读消息</span>
            <van-icon class="ml12 mr4 c6" name="brush-o" /> 
            <span class="c6 fs12" @click="clearNotice">清除未读</span>
        </div>
        <ul class="lists bgCW">
            <li class="tc cRed" v-if="BrandList.length == 0">暂无数据</li>
            <li class="clearfix rel" v-for="(item, idx) in option" :key="idx" @click="isRead(item, idx)">
                <span class="abs ado" v-show="!item.IsRead"></span>
                <div class="content ml12 fl rel">
                    <div class="clearfix">
                        <h4 class="fs14 c3 fl rel">{{ item.Title }}</h4>
                        <p class="fr fs12 c6">2019-02-02</p>
                    </div>
                </div>
            </li>
            <div class="tc p20 c9 fs14" v-show="finished && option.length > 0">已全部加载</div>
        </ul>
        <div class="common-top-btn fix bgCBlue tc" @click="goTop" v-show="floorstatus"><van-icon name="arrow-up" class="icon cWhite" /></div>
        <van-toast id="van-toast" />
        <van-dialog
            use-slot
            :title="Title"
            :show="show"
            show-cancel-button
            @confirm="this.show = false"
            @cancel="this.show = false"
        >
            <div class="c6 p30">{{ Content }}</div>
        </van-dialog>
    </div>
</template>
<script>
    import Toast from '../../static/vant/toast/toast';
    import { QueryReminderList, ReminderTotal, SetReminderToRead, SetAllReminderToRead } from '../../utils/http';
    export default {
        data () {
            return {
                windowHeight: 0, // 返回顶部
                floorstatus: false, // 返回顶部
                PageIndex: 1,
                PageSize: 25,
                finished: false,
                option: [], // 消息列表数据
                Title: '',
                CreateTime: '',
                Content: '',
                show: false,
                noticeNum: 0 // 未读消息数量
            }
        },
        onShow() {
            this.ReminderTotalFun();
        },
        created() {
            this.windowHeight = wx.getSystemInfoSync().windowHeight;
            this.Refresh();
        },
        methods: {
            ReminderTotalFun () {
                ReminderTotal({}).then(res => {
                    if (res.Status == 200 && res.Data) {
                        this.noticeNum = res.Data;
                    }
                })
            },
            clearNotice () { // 清除未读
                if (this.noticeNum == 0) {
                    Toast("没有可已读的消息");
                    return;
                }
                SetAllReminderToRead({}).then(res => {
                    if (res.Status == 200) {
                        Toast.success(res.Message);
                        this.Refresh();
                    } else {
                        Toast.fail(res.Message);
                    }
                })
            },
            isRead (item, i) { // 设置已读
                this.show = true;
                this.Title = item.Title;
                this.CreateTime = item.CreateTime;
                this.Content = item.Content;
                if (!item.IsRead) {
                    this.option[i].IsRead = !item.IsRead;
                    let params = {
                        reIds: [item.Id]
                    }
                    SetReminderToRead(params).then(res => {
                        if (res.Status == 200) {
                            Toast.success(res.Message);
                            this.noticeNum = this.noticeNum - 1;
                        } else {
                            Toast.fail(res.Message);
                            this.option[i].IsRead = item.IsRead;
                        }
                    })
                }
            },
            QueryReminderListFun () {
                let params = {
                    "args": {
                        "PageIndex": this.PageIndex,
                        "PageSize": this.PageSize
                    }
                }
                if (!this.finished) {
                    QueryReminderList(params).then(res => {
                        if (res.Status == 200) {
                            this.option = res.Data.Data;
                            let Option = res.Data.Data; // 全部列表数据
                            if (Option.length == this.PageSize) {
                                this.PageIndex += 1;
                            } else {
                                this.finished = true;
                            }
                        } else {
                            Toast.fail({
                                message: res.Message,
                                position: 'top',
                                duration: 3000
                            });
                        }
                        wx.stopPullDownRefresh();
                    })
                }
            },
            Refresh() {
                this.finished = false;
                this.PageIndex = 1;
                this.option = [];
                this.QueryReminderListFun();
                this.ReminderTotalFun();
            },
            goTop() {
                if (wx.pageScrollTo) {
                    wx.pageScrollTo({
                        scrollTop: 0
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    });
                }
            }
        },
        // 获取滚动条当前位置
        onPageScroll(e) {
            if (e.scrollTop > this.windowHeight) {
                this.floorstatus = true;
            } else {
                this.floorstatus = false;
            }
        },
        onPullDownRefresh() {
            // 下拉刷新
            this.Refresh();
        },
        onReachBottom() {
            this.QueryReminderListFun();
        }
    }
</script>
<style lang="scss">
.message-wrapper {
    ul.lists {
        li {
            border-bottom: 1px solid #f5f5f5;
            padding: 16px;
            .content {
                width: calc(100% - 1.3rem - 12px);
                
            }
            .ado {
                width: 8px;
                height: 8px;
                background-color: #ee0a24;
                border-radius: 50%;
                right: 15px;
                top: 10px;
            }
        }
    }
}
</style>
