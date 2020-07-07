<template>
    <div class="reportDetail-wrapper">
        <div class="top bgCW mb16">
            <picker-popup
                @listenTochildEvent="BookStateFun"
                :isVal="Entity.State"
                label="报备状态"
                lsCode="BookState" />
            <van-tabs color="#1989fa" :active="activeTab" animated="true" swipeable="true">
                <van-tab title="详细信息">
                    <div class="thir-wrap mb12 mt12">
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">招商对接人</label>
                            <p class="fs14 c3 cBlue fl ellipsis">
                                <span v-for="(v, i) in Entity.Residents" :key="i">{{v.StaffName}}</span>
                            </p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">报备类型</label>
                            <p class="fs14 cBlue fl ellipsis">{{ Entity.BookType | GetItemsFilter('Ls.Ag.BookType', globalData.windowData.GetItemsData) }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">项目名称</label>
                            <p class="fs14 c3 cBlue fl ellipsis">{{ Entity.ImProjectName  }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">客户姓名</label>
                            <p class="fs14 c3 cBlue fl ellipsis">{{ Entity.CustName  }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">联系电话</label>
                            <p class="fs14 c3 cBlue fl ellipsis">{{ Entity.CustPhone  }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6" style="width: 100px;">店招/品牌/公司</label>
                            <p class="fs14 c3 cBlue fl ellipsis" style="width: calc(100% - 104px);">{{ Entity.Brand   }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">店铺性质</label>
                            <p class="fs14 c3 cBlue fl ellipsis">{{ Entity.ShopNature | GetItemsFilter('Ls.Ag.ShopNature', globalData.windowData.GetItemsData) }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">业态</label>
                            <p class="fs14 c3 cBlue fl ellipsis">{{ Entity.FormateCategory }}-{{ Entity.Formate }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">面积需求</label>
                            <p class="fs14 c3 cBlue fl ellipsis">{{ Entity.AreaMin }}-{{ Entity.AreaMax }}㎡</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">预约时间</label>
                            <p class="fs14 c3 fl ellipsis">{{ Entity.BookTime | formatTime }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">报备人名称</label>
                            <p class="fs14 c3 fl ellipsis">{{ Entity.BookName }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">报备人手机号</label>
                            <p class="fs14 c3 fl ellipsis">{{ Entity.BookPhone }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">报备人关系</label>
                            <p class="fs14 c3 fl ellipsis">{{ Entity.BookPeopleRelation | GetItemsFilter('Ls.Ag.BookPeopleRelation', globalData.windowData.GetItemsData) }}</p>
                        </div>
                        <div class="clearfix item mb12">
                            <label class="fl block fs14 c6">报备备注</label>
                            <p class="fs14 c3 fl ellipsis">{{ Entity.Remark }}</p>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="反馈记录">
                    <van-steps
                        :steps="steps"
                        :active="active"
                        direction="vertical"
                        active-color="#1989fa"
                    />
                </van-tab>
            </van-tabs>
            
        </div>
        <!-- <div class="fix btn-wrap bgCW">
            <div class="fr cWhite bgCBlue tc fs14">未带看</div>
            <div class="fr cBlue tc fs14">已带看</div>
        </div> -->
        <van-toast id="van-toast" />
    </div>
</template>
<script>
    import pickerPopup from '@/components/picker';
    import Toast from '../../static/vant/toast/toast';
    import Dialog from '../../static/vant/dialog/dialog';
    import { GetBookDetail, UpdateFeedbackState, GetFeedbackRecord } from '../../utils/http';
    import { nullToStr } from '../../utils/index.js';
    export default {
        components: {
            pickerPopup
        },
        data () {
            return {
                id: "", // 报备id
                activeTab: 0,
                imageDoin: this.globalData.windowData.ImgUrl,
                Entity: {}, // 主体信息
                steps: [], // 反馈记录数据
                active: 1 // 最后一条选中
            }
        },
        created () {
            this.Entity = this.globalData.windowData.reportData;
        },
        mounted() {
            this.id = this.$root.$mp.query.id; // 报备id
            this.GetFeedbackRecordFun(); // 反馈记录
        },
        methods: {
            BookStateFun(val) { // 报备状态事件
                let isTo = false;
                if (this.steps.length > 0) {
                    isTo = this.steps.some(item=>{
                        if(item.text == val.text) {
                            return true;
                        }
                    })
                }
                if (!isTo) {
                    if (this.id !="") {
                        let params = {
                            id: this.id,
                            state: val.val
                        }
                        UpdateFeedbackState(params).then(res => { // 更新反馈状态
                            if (res.Status == 200) {
                                this.activeTab = 1;
                                this.GetFeedbackRecordFun();
                            } else {
                                Toast.fail({
                                    message: res.Message,
                                    position: 'top',
                                    duration: 3000
                                });
                            }
                        })
                    }
                } else {
                    Toast.fail("该状态已执行");
                }
            },
            GetBookDetailFun () {
                let params = {
                    id: this.id
                }
                GetBookDetail(params).then(res => { // 获取报备详情
                    if (res.Status == 200) {
                        res.Data = nullToStr(res.Data);
                        (res.Data) ? this.Entity = res.Data : this.Entity = {};
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                })
            },
            GetFeedbackRecordFun () { // 获取反馈记录
                let params = {
                    refId: this.id,
                    refType: 13
                }
                GetFeedbackRecord(params).then(res => {
                    if (res.Status == 200) {
                        this.steps = [];
                        if (res.Data && res.Data.length > 0) {
                            res.Data.forEach(res => {
                                this.steps.push({
                                    text: res.Content,
                                    desc: res.OperatorTime,
                                })
                            })
                            this.steps = this.steps.sort(function (a, b) {
                                return Date.parse(a.desc) - Date.parse(b.desc); // 时间正序
                            });
                            this.active = res.Data.length;
                        }
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.reportDetail-wrapper {
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
    }
    van-tabs .thir-wrap {
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
            width: 100px;
            text-align: center;
            &:nth-of-type(2) {
                margin-right: 12px;
                border: 1px solid #ddd;
            }
        }
    }
}
</style>
