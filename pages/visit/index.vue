<template>
    <div class="wywiad-wrapper">
        <div class="content">
            <van-cell class="clearfix default-cell">
                <van-image width="3rem" height="3rem" fit="cover" round class="fl" :src="dataList[0].AccessPeopleHeadPic" />
                <div class="fl">
                    <h4 class="fs14 c3 ml12 tl">
                        <span class="bold">{{ AccessPeopleName }}</span>
                        <span class="cBlue ml10" @click="clickPhone(paramsJson.AccessPeoplePhone)">{{ paramsJson.AccessPeoplePhone }}</span>
                        <div class="fr">
                            <van-icon class="fs26 cBlue" name="phone-o" v-if="paramsJson.AccessPeoplePhone && paramsJson.AccessPeoplePhone != ''" @click="clickPhone(paramsJson.AccessPeoplePhone)" />
                        </div>
                    </h4>
                    <p class="c6 ml12 tl">浏览了<span class="cBlue">{{ TotalPeople }}</span>次</p>
                </div>
            </van-cell>
            <ul class="lists" >
                <li class="tc cRed" v-if="dataList.length == 0">暂无数据</li>
                <li class="rel" @click="goDetailFn(item.SourceId, item.SourceType)" v-for="(item, idx) in dataList" :key="idx">
                    <div class="rel">
                        <div style="width: 100vw">
                            <p class="c6 fs14">访问时间：{{ item.CreateTime | formatTime }}</p>
                            <p class="c6 fs14">访问内容：{{ item.AccessContent }}</p>
                        </div>
                    </div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && dataList.length > 0">已全部加载</div>
            </ul>
        </div>
        <div class="common-top-btn fix bgCBlue tc" @click="goTop" v-show="floorstatus"><van-icon name="arrow-up" class="icon cWhite" /></div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '../../static/vant/toast/toast';
import { QueryAccessLog } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
import Vue from 'vue';
export default {
    data() {
        return {
            windowHeight: 0, // 返回顶部
            floorstatus: false, // 返回顶部
            TotalPeople: 0, // 总分享人
            AccessPeopleName: '', // 访问人
            paramsJson: {
                ProId: '',
                PageIndex: 1,
                PageSize: 100000,
                AccessPeoplePhone: '' // 项目id
            },
            finished: false,
            dataList: [], // 全部报备列表数据
        };
    },
    created() {
        this.windowHeight = wx.getSystemInfoSync().windowHeight;
    },
    mounted() {
        this.paramsJson.ProId = this.$root.$mp.query.id; // 来源id
        this.paramsJson.AccessPeoplePhone = this.$root.$mp.query.phone; // 访问人电话
        this.AccessPeopleName = this.$root.$mp.query.name; // 访问人
        this.Refresh();
    },
    methods: {
        clickPhone (val) { // 打电话
            wx.makePhoneCall({
                phoneNumber: val
            });
        },
        search() {
            // 筛选搜索
            this.Refresh();
        },
        QueryAccessLogFun() {
            let params = this.paramsJson;
            if (!this.finished) {
                QueryAccessLog(params).then(res => {
                    console.log(res);
                    if (res.Status == 200) {
                        this.Data = nullToStr(res.Data);
                        let CusList = res.Data.Data; // 全部报列表数据
                        this.TotalPeople = res.Data.RowCount;
                        if (CusList.length == this.paramsJson.PageSize) {
                            this.paramsJson.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        this.dataList = this.dataList.concat(CusList);
                    } else {
                        Toast.fail({
                            message: res.Message,
                            position: 'top',
                            duration: 3000
                        });
                    }
                    wx.stopPullDownRefresh();
                });
            }
        },
        Refresh() {
            this.finished = false;
            this.paramsJson.PageIndex = 1;
            this.dataList = [];
            this.QueryAccessLogFun();
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
        if (this.navActive == 0) {
            this.QueryAccessLogFun();
        }
    }
};
</script>
<style lang="scss">
.wywiad-wrapper {
    > .content {
        ul.statistics {
            margin: 16px;
            border-bottom: 1px solid #f5f5f5;
            padding: 12px 0;
            width: calc(100% - 32px);
            li {
                width: 33%;
                &:after {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 1px;
                    height: 70%;
                    right: 0;
                    top: 15%;
                    background: #f5f5f5;
                }
                &:last-child:after {
                    display: none;
                }
            }
        }
        // nav
        ul.nav {
            border-bottom: 1px solid #f5f5f5;
            background: #fff;
            li {
                float: left;
                padding: 12px 0;
                color: #666;
                font-size: 14px;
                border-bottom: 2px solid #fff;
                width: calc(100% / 4);
                text-align: center;
                &.active {
                    color: #1989fa;
                    border-color: #1989fa;
                }
            }
        }
        // 列表
        ul.lists {
            li {
                background: #fff;
                border-bottom: 1px solid #f5f5f5;
                padding: 16px;
                .content {
                    width: calc(100% - 70px);
                    .tit-wrap {
                        .tag {
                            top: -2px;
                        }
                    }
                    .item {
                        label {
                            width: 70px;
                            margin-right: 8px;
                        }
                        > p {
                            width: calc(100% - 78px);
                        }
                    }
                }
                .state {
                    width: 80px;
                    top: 50px;
                    right: 0;
                }
            }
        }
    }
    .filter-wrapper {
        padding: 0 12px;
        position: relative;
        height: 100%;
        overflow-y: auto;
        > h4 {
            padding: 0px 0;
        }
        .content {
            padding: 30px 0 45px 0;
            .item {
                margin-bottom: 8px;
                > h4 {
                    padding: 8px 0;
                }
                > ul.sel-wywiad {
                    > li {
                        position: relative;
                        float: left;
                        margin-right: 8px;
                        .ellipsis {
                            width: 50px;
                        }
                        > .icon {
                            top: -2px;
                            right: -2px;
                            color: #ee0a24;
                        }
                        &.add-btn {
                            margin-right: 0;
                            height: 50px;
                            width: 50px;
                            p {
                                font-size: 30px;
                                border-radius: 100%;
                                text-align: center;
                                border: 1px solid #1989fa;
                                color: #1989fa;
                                height: 100%;
                                line-height: 45px;
                            }
                        }
                        image {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}
</style>
