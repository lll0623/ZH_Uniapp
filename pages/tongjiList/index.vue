<template>
    <div class="tongji-wrapper">
        <div class="content">
            <ul class="lists" v-if="type == 1">
                <li @click="goCustDetailFn(item.CustId)" v-for="(item, idx) in dataList" :key="idx" v-if="item.CustId">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.CustName }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.CustStatus != ''" size="medium" type="primary">{{ item.CustStatus }}</van-tag>
                            <van-tag class="tag" v-if="item.IsImPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                            <van-tag class="tag" v-if="item.MerchantsType != ''" size="medium" type="warning">{{ item.MerchantsType }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl">{{ item.FormatName }}</p>
                        <p class="fl" v-if="item.Brand !=''">/{{ item.Brand }}</p>
                        <p class="fl" v-if="item.AreaMin !='' || item.AreaMax != ''">/{{ item.AreaMin }}-{{ item.AreaMax }}㎡</p>
                    </div>
                    <div class="clearfix mt8 fs14 c9" v-if="item.JobTitle !='' || item.CustCompany != ''">{{ item.JobTitle }}/{{ item.CustCompany }}</div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && CustList.length > 0">已全部加载</div>
            </ul>
            <ul class="lists" v-if="type == 2">
                <li @click="goCustDetailFn(item.CustId)" v-for="(item, idx) in dataList" :key="idx" v-if="item.CustId">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.CustName }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.CustStatus != ''" size="medium" type="primary">{{ item.CustStatus }}</van-tag>
                            <van-tag class="tag" v-if="item.IsImPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                            <van-tag class="tag" v-if="item.MerchantsType != ''" size="medium" type="warning">{{ item.MerchantsType }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl">{{ item.FormatName }}</p>
                        <p class="fl">/{{ item.Brand }}</p>
                        <p class="fl">/{{ item.AreaMin }}-{{ item.AreaMax }}㎡</p>
                    </div>
                    <div class="clearfix mt8 fs14 c9">{{ item.JobTitle }}/{{ item.CustCompany }}</div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && CustList.length > 0">已全部加载</div>
            </ul>
            <ul class="lists" v-if="type == 3">
                <li @click="goCustDetailFn(item.Id)" v-for="(item, idx) in dataList" :key="idx" v-if="item.Id">
                    <div class="clearfix mb12 tit-wrap">
                        <h4 class="fl fs16 c0">{{ item.CustName }}</h4>
                        <van-tag type="primary" v-if="item.BookSource" class="fl tag ml8 rel">{{ item.BookSource }}</van-tag>
                        <van-tag type="success" v-if="item.BookStatus" class="fl tag ml8 rel">{{ item.BookStatus }}</van-tag>
                    </div>
                    <div class="clearfix item mb12">
                        <label class="fl block fs14 c6">预约项目:</label>
                        <p class="fl block fs14 c6">{{ item.ProjectName }}</p>
                    </div>
                    <div class="clearfix item">
                        <label class="fl block fs14 c6">预约时间:</label>
                        <p class="fl block fs14 c6">{{ item.AppointmentTime | formatTime }}</p>
                    </div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && CustList.length > 0">已全部加载</div>
            </ul>
            <ul class="lists" v-if="type == 4">
                <li @click="goCustDetailFn(item.Id)" v-for="(item, idx) in dataList" :key="idx" v-if="item.Id">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.Name }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.AgentStatus != ''" size="medium" type="primary">{{ item.AgentStatus }}</van-tag>
                            <van-tag class="tag" v-if="item.IsPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.IsLook != ''" size="medium" type="success">{{ item.IsLook }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl" v-if="item.JobTitle !=''">{{ item.JobTitle }}</p>
                        <p class="fl" v-if="item.CompanyName !=''">/{{ item.CompanyName }}</p>
                    </div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && CustList.length > 0">已全部加载</div>
            </ul>
            <ul class="lists" v-if="type == 5">
                <li @click="goCustDetailFn(item.Id)" v-for="(item, idx) in dataList" :key="idx" v-if="item.Id">
                    <div class="clearfix top">
                        <h4 class="fl fs14 c0">{{ item.BrandName }}</h4>
                        <div class="fl tag-wrap">
                            <van-tag class="tag" v-if="item.BrandStatus != ''" size="medium" type="primary">{{ item.BrandStatus }}</van-tag>
                            <van-tag class="tag" v-if="item.IsPrivateCust" size="medium" type="danger">私客</van-tag>
                            <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                            <van-tag class="tag" v-if="item.Islook != ''" size="medium" type="success">{{ item.Islook }}</van-tag>
                        </div>
                    </div>
                    <div class="clearfix mt8 fs14 c9">
                        <p class="fl">{{ item.Format }}</p>
                        <p class="fl" v-if="item.Area > -1">/{{ item.Area | GetItemsFilter('Ls.Ag.ConstructionArea', globalData.windowData.GetItemsData) }}</p>
                    </div>
                    <div class="clearfix mt8 fs14 c9" v-if="item.Company !=''">{{ item.Company }}</div>
                </li>
                <div class="tc p20 c9 fs14" v-show="finished && CustList.length > 0">已全部加载</div>
            </ul>
            <div class="fix common-btn-wrap bgCW tr">
                <van-button class="submit ml12" round type="info" @click="Cancel">返回</van-button>
            </div>
            <van-toast id="van-toast" />
            <van-dialog id="van-dialog" />
        </div>
    </div>
</template>
<script>
import Toast from '@/static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
import { nullToStr } from '../../utils/index';
import { InviteBusinessCustList, QueryReceptionLists, AgentCustLists, BrandLists, BookLists } from '@/utils/http';
export default {
    data() {
        return {
            id: '',
            type: 1, // 1:新增客户 2：带看 3：报备 4:渠道 5：品牌 6：分享
            PageIndex: 1,
            PageSize: 15,
            dataList: [],
            finished: false
        };
    },
    mounted() {
        this.type = Number(this.$root.$mp.query.type);
        let name = this.type == 1 ? '客户' : this.type == 2 ? '带看' : this.type == 3 ? '报备' : this.type == 4 ? '渠道' : this.type == 5 ? '品牌' : '';
        wx.setNavigationBarTitle({
            title: "统计列表查询("+name+")" // 页面切换，更换页面标题
        })
        this.id = this.globalData.windowData.tongji;
        this.getList();
    },
    methods: {
        getList () {
            let params = {
                "PageIndex": this.PageIndex,
                "PageSize": this.PageSize,
                Sort: {
                    Field: 'CreateTime',
                    IsASC: false
                }
            }
            if (this.type == 1) { // 客户列表
                params['CustIds'] = this.id;
                params['Type'] = 1;
                if (!this.finished) {
                    InviteBusinessCustList(params).then(res => {
                        if (res.Status == 200) {
                            this.Data = nullToStr(res.Data);
                            let CusList = res.Data.CustList; // 全部客户列表数据
                            if (CusList.length == this.PageSize) {
                                this.PageIndex += 1;
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
                    })
                }
            }
            if (this.type == 2) { // 带看列表
                params['ReceIds'] = this.id;
                if (!this.finished) {
                    QueryReceptionLists(params).then(res => {
                        if (res.Status == 200) {
                            this.Data = nullToStr(res.Data);
                            let CusList = res.Data.CustList; // 全部客户列表数据
                            if (CusList.length == this.PageSize) {
                                this.PageIndex += 1;
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
                    })
                }
            }
            if (this.type == 3) { // 报备列表
                params['BookIds'] = this.id;
                params['Sort'].Field = "BookCreateTime";
                if (!this.finished) {
                    BookLists(params).then(res => {
                        if (res.Status == 200) {
                            let CusList = res.Data.BookList; // 全部客户列表数据
                            if (CusList.length == this.PageSize) {
                                this.PageIndex += 1;
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
                    })
                }
            }
            if (this.type == 4) { // 渠道列表
                params['AgentIds'] = this.id;
                if (!this.finished) {
                    AgentCustLists(params).then(res => {
                        if (res.Status == 200) {
                            this.Data = nullToStr(res.Data);
                            let CusList = res.Data.AgentList; // 全部客户列表数据
                            if (CusList.length == this.PageSize) {
                                this.PageIndex += 1;
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
                    })
                }
            }
            if (this.type == 5) { // 品牌列表
                params['BrandIds'] = this.id;
                if (!this.finished) {
                    BrandLists(params).then(res => {
                        if (res.Status == 200) {
                            this.Data = nullToStr(res.Data);
                            let CusList = res.Data.MyBrandList; // 全部客户列表数据
                            if (CusList.length == this.PageSize) {
                                this.PageIndex += 1;
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
                    })
                }
            }
        },
        Refresh () {
            this.finished = false;
            this.PageIndex = 1;
            this.dataList = [];
            this.getList();
        },
        goCustDetailFn(id) {
            if (this.type == 1) wx.navigateTo({ url: '../custDetail/index?id=' + id });
            if (this.type == 4) wx.navigateTo({ url: '../channelDetail/index?id=' + id });
            if (this.type == 5) wx.navigateTo({ url: '../brandDetail/index?id=' + id });
        },
        Cancel () {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.Refresh();
    },
    onReachBottom() {
        this.getList();
    },
};
</script>
<style lang="scss">
.tongji-wrapper {
    > .top {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    // 列表
    ul.lists {
        li {
            background: #fff;
            border-bottom: 1px solid #f5f5f5;
            padding: 16px;
            .top {
                .tag-wrap {
                    position: relative;
                    top: -1px;
                    .tag {
                        margin-left: 8px;
                    }
                }
            }
        }
    }
    .cancel{
        button {
            width: 135px;
        }
    }
}
</style>
