<template>
    <div class="custDetail-wrapper">
        <div class="top bgCW mb16">
            <div class="clearfix mb12 fir-wrap">
                <h4 class="fs16 bold c0 fl">{{ Entity.Name }}</h4>
                <div class="clearix tags-wrap fl rel">
                    <van-tag class="tag" v-if="Entity.BrandStatus != ''" size="medium" type="primary">{{ Entity.BrandStatus == 1 ? '有效' : '无效' }}</van-tag>
                    <van-tag class="tag" v-if="Entity.IsPrivateCust" size="medium" type="danger">私客</van-tag>
                    <van-tag class="tag" v-else size="medium" type="danger">公客</van-tag>
                    <van-tag class="tag" size="medium" type="success">{{ Entity.LookCount > 0 ? '已带看' : '未带看' }}</van-tag>
                    <van-tag class="tag" size="medium" type="success">{{ !!Entity.IsFavorite ? '已收藏' : '未收藏' }}</van-tag>
                </div>
                <div class="fr cBlue fs14 btn rel" hidden>
                    办公
                    <van-icon name="arrow" class="cBlue rel" />
                </div>
            </div>
            <div class="clearfix sec-wrap mb12 ">
                <p class="fl ellipsis c9 fs12">客户编号:{{ Entity.Code }}</p>
                <p v-for="(v, i) in Entity.Rights" :key="i" v-if="v.RightType == 200" class="fl ellipsis c9 fs12 ml8">
                    客源方: {{ v.StaffName }}
                </p>
                <p v-for="(v, i) in Entity.Rights" :key="i" v-if="v.RightType == 201" class="fl ellipsis c9 fs12 ml8">
                    私客方: {{ v.StaffName }}
                </p>
            </div>
            <div class="thir-wrap">
                <div class="clearfix item mb12">
                    <label class="fl block fs14 c6">业态</label>
                    <p class="fs14 cBlue fl ellipsis">{{ Entity.FormatName }}</p>
                </div>
                <div class="clearfix item mb12">
                    <label class="fl block fs14 c6">品牌定位</label>
                    <p class="fs14 c3 fl ellipsis">{{ Entity.Position | GetItemsFilter('Ls.Ag.Position', globalData.windowData.GetItemsData) }}</p>
                </div>
                <div class="clearfix item mb12">
                    <label class="fl block fs14 c6">经营方式</label>
                    <p class="fs14 c3 fl ellipsis">{{ Entity.BrandType | GetItemsFilter('Ls.Ag.BrandType', globalData.windowData.GetItemsData) }}</p>
                </div>
                <div class="clearfix item mb12">
                    <label class="fl block fs14 c6">公司</label>
                    <p class="fs14 c3 fl ellipsis">{{ Entity.Company }}</p>
                </div>
                <div class="clearfix item mb12">
                    <label class="fl block fs14 c6">联系人</label>
                    <p class="fs14 c3 fl ellipsis btn-p">
                        <span>{{ Entity.LegalPerson }}</span>
                        <span v-if="Entity.JobTitle != ''">-{{ Entity.JobTitle }}</span>
                    </p>
                    <div class="btn fr c9 fs12 rel" @click="showCust=true">
                        查看联系方式
                        <van-icon name="arrow" class="rel" />
                    </div>
                </div>
                <div class="clearfix item">
                    <label class="fl block fs14 c6">来源</label>
                    <p class="fs14 c3 fl ellipsis btn-p">
                        {{ Entity.BrandSource | GetItemsFilter('Ls.Ag.CustSource', globalData.windowData.GetItemsData) }}
                        <span class="cBlue">-{{ Entity.ChannelName }}</span>
                    </p>
                    <div class="btn fr c9 fs12 rel" @click="linkAgent(Entity.ChannelId)">
                        查看渠道
                        <van-icon name="arrow" class="rel" />
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <van-tabs animated="true" color="#1989fa" swipeable="true">
                <van-tab title="详细信息">
                    <div class="detail-wrap bgCW">
                        <h4 class="c0 fs14 mb12">需求信息</h4>
                        <ul>
                            <li class="clearfix">
                                <label class="fl c6">需求面积:</label>
                                <p class="fl c3">{{ Entity.Area | GetItemsFilter('Ls.Ag.ConstructionArea', globalData.windowData.GetItemsData) }}</p>
                            </li>
                            <li class="clearfix">
                                <label class="fl c6">投资预算:</label>
                                <p class="fl c3">{{ Entity.InvestmentBudget }}万每月</p>
                            </li>
                            <li class="clearfix">
                                <label class="fl c6">紧急程度:</label>
                                <div class="fl c3 rate-wrap">
                                    <p class="fl">{{ Entity.UrgencyDegree | GetItemsFilter('Ls.Ag.Urgency', globalData.windowData.GetItemsData) }}</p>
                                </div>
                            </li>
                            <li class="clearfix">
                                <label class="fl c6">需求区域:</label>
                                <div class="fl tags-wrap rel">
                                    <van-tag v-if="!!Entity.DemandAreas && Entity.DemandAreas.length > 0" type="primary" class="tag" v-for="(v, i) in Entity.DemandAreas" :key="i">{{ v.ItemName }}</van-tag>
                                </div>
                            </li>
                            <li class="clearfix" v-if="Entity.Floor != ''">
                                <label class="fl c6">楼层:</label>
                                <p class="fl c3" >{{ Entity.Floor }}楼</p>
                            </li>
                            <li class="clearfix">
                                <label class="fl c6">商铺类型:</label>
                               <div class="fl tags-wrap rel">
                                   <van-tag v-if="!!Entity.UnitTypeTags && Entity.UnitTypeTags.length > 0" type="primary" class="tag" v-for="(v, i) in Entity.UnitTypeTags" :key="i">{{ v.ItemName }}</van-tag>
                               </div>
                            </li>
                            <li class="clearfix">
                                <label class="fl c6">电量:</label>
                                <p class="fl c3" v-if="Entity.Quantity !=''">{{ Entity.Quantity }}KW</p>
                            </li>
                            <li class="clearfix">
                                <label class="fl c6">楼盘承重:</label>
                                <p class="fl c3" v-if="Entity.LoadBearing !=''">{{ Entity.LoadBearing }}kg/m²</p>
                            </li>
                            <li class="clearfix">
                                <label class="fl c6">备注:</label>
                                <p class="fl c3">{{ Entity.Describe }}</p>
                            </li>
                        </ul>
                    </div>
                </van-tab>
                <!-- <van-tab title="相关客户">
                    <ul class="takeNotes-wrap bgCW">
                        <div v-if="Reception.length == 0" class="cRed tc p20">暂无数据</div>
                        <li v-for="(v, i) in Reception" :key="i">
                            <div class="clearfix top">
                                <p class="fl fs14 c3">{{ v.ReceptionTime | formatDay }} {{ v.BeginDate }} - {{ v.EndDate }}</p>
                                <p class="fl fs14 c3">{{ v.ProjectName }}</p>
                                <p class="fl fs14 c3">{{ v.StaffName }}</p>
                            </div>
                            <div class="clearfix content mb12">
                                <label class="block fs14 c6 fl">满意度:</label>
                                <div class="fl c3 rate-wrap clearfix">
                                    <p class="fl fs14 c3 ml8">{{ v.Satisfaction | GetItemsFilter('Ls.Ag.ReceptionSatisfaction', globalData.windowData.GetItemsData) }}</p>
                                </div>
                            </div>
                            <div class="clearfix content">
                                <label class="block fs14 c6 fl">带看反馈:</label>
                                <p class="fl c3">{{ v.Remark }}</p>
                            </div>
                        </li>
                    </ul>
                </van-tab> -->
                <!-- <van-tab title="推荐房源">
                    <div class="bgCW houseSources-wrap">
                        <van-collapse accordion :value="activeNameHouseSources" @change="onChangeHouseSources">
                            <van-collapse-item name="1">
                                <view slot="title" class="clearfix">
                                    <h4 class="fl fs14 c3">苏州中心</h4>
                                    <van-tag class="fl ml8 rel tit-tag" type="primary">标签</van-tag>
                                    <span class="fr block rel num bgCBlue fs12 cWhite rel">12</span>
                                </view>
                                <ul class="item">
                                    <li class="clearfix">
                                        <p class="fl">A栋/第1层/101室</p>
                                        <p class="fl">待租</p>
                                        <p class="fl">255m²</p>
                                    </li>
                                    <li class="clearfix">
                                        <p class="fl">A栋/第1层/101室</p>
                                        <p class="fl">待租</p>
                                        <p class="fl">255m²</p>
                                    </li>
                                    <li class="clearfix">
                                        <p class="fl">A栋/第1层/101室</p>
                                        <p class="fl">待租</p>
                                        <p class="fl">255m²</p>
                                    </li>
                                </ul>
                            </van-collapse-item>
                            <van-collapse-item name="2">
                                <view slot="title" class="clearfix">
                                    <h4 class="fl fs14 c3">苏州中心</h4>
                                    <van-tag class="fl ml8 rel tit-tag" type="primary">标签</van-tag>
                                    <span class="fr block rel num bgCBlue fs12 cWhite rel">12</span>
                                </view>
                                <ul class="item">
                                    <li class="clearfix">
                                        <p class="fl">A栋/第1层/101室</p>
                                        <p class="fl">待租</p>
                                        <p class="fl">255m²</p>
                                    </li>
                                    <li class="clearfix">
                                        <p class="fl">A栋/第1层/101室</p>
                                        <p class="fl">待租</p>
                                        <p class="fl">255m²</p>
                                    </li>
                                    <li class="clearfix">
                                        <p class="fl">A栋/第1层/101室</p>
                                        <p class="fl">待租</p>
                                        <p class="fl">255m²</p>
                                    </li>
                                </ul>
                            </van-collapse-item>
                        </van-collapse>
                    </div>
                </van-tab> -->
                <van-tab title="带看记录" :info="ReceptionNum">
                    <ul class="takeNotes-wrap bgCW">
                        <div v-if="Reception.length == 0" class="cRed tc p20">暂无数据</div>
                        <li v-for="(v, i) in Reception" :key="i">
                            <div class="clearfix top">
                                <p class="fl fs14 c3 tc">{{ v.ReceptionTime | formatDay }}  {{ v.BeginDate }} - {{ v.EndDate }}</p>
                                <p class="fl fs14 c3 tc">{{ v.ProjectName }}</p>
                                <p class="fl fs14 c3 tc">{{ v.StaffName }}</p>
                            </div>
                            <div class="clearfix content mb12">
                                <label class="block fs14 c6 fl">满意度:</label>
                                <div class="fl c3 rate-wrap clearfix">
                                    <p class="fl fs14 c3">{{ v.Satisfaction | GetItemsFilter('Ls.Ag.ReceptionSatisfaction', globalData.windowData.GetItemsData) }}</p>
                                </div>
                            </div>
                            <div class="clearfix content">
                                <label class="block fs14 c6 fl">带看反馈:</label>
                                <p class="fl c3 fs14">{{ v.Remark }}</p>
                            </div>
                        </li>
                    </ul>
                </van-tab>
                <van-tab title="跟进记录" :info="FollowUpNum">
                    <ul class="followUp-wrap bgCW">
                        <div v-if="FollowUp.length == 0" class="cRed tc p20">暂无数据</div>
                        <li v-for="(v, i) in FollowUp" :key="i">
                            <div class="clearfix mb12">
                                <h4 class="fl fs14 c3">{{ v.StaffName }}</h4>
                                <p class="fr fs14 c6">{{ v.CreateTime | formatTime }}</p>
                            </div>
                            <p class="fs14 c3">{{ v.Content }}</p>
                        </li>
                    </ul>
                </van-tab>
            </van-tabs>
        </div>
        <van-tabbar @change="onChangeTabbar">
            <van-tabbar-item icon="comment">写跟进</van-tabbar-item>
            <van-tabbar-item icon="edit">录带看</van-tabbar-item>
            <!-- <van-tabbar-item icon="manager">编辑联系人</van-tabbar-item> -->
            <van-tabbar-item icon="records">编辑品牌</van-tabbar-item>
            <van-tabbar-item icon="bars">更多操作</van-tabbar-item>
        </van-tabbar>
        <!-- 更多操作 -->
        <van-popup
            class="overflow"
            position="bottom"
            custom-style="height: 444rpx"
            :show="isShowPopup"
            closeable
            @close="
                () => {
                    this.isShowPopup = false;
                }
            "
        >
            <h4 class="c3 fs14 bold tc common-more-btn-tit">更多操作</h4>
            <van-grid>
                <!-- <van-grid-item use-slot @click="moreToobar(1)">
                    <van-icon name="records" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">编辑品牌</p>
                </van-grid-item> -->
                <van-grid-item v-if="!!Entity.IsPrivateCust" use-slot @click="moreToobar(2)">
                    <van-icon name="friends-o" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">取消私客</p>
                </van-grid-item>
                <van-grid-item v-else use-slot @click="moreToobar(2)">
                    <van-icon name="friends-o" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">设为私客</p>
                </van-grid-item>
                <van-grid-item use-slot @click="moreToobar(3)">
                    <van-icon name="exchange" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">变更客源方</p>
                </van-grid-item>
                <van-grid-item use-slot @click="moreToobar(6)">
                    <van-icon name="replay" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">变更私客方</p>
                </van-grid-item>
                <van-grid-item use-slot @click="moreToobar(4)">
                    <van-icon name="delete" color="#ee0a24" size="50rpx" />
                    <p class="tc mt8 fs12 cRed">删除品牌</p>
                </van-grid-item>
                <van-grid-item use-slot v-if="!!Entity.IsFavorite" @click="moreToobar(5)">
                    <van-icon name="like" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">取消收藏</p>
                </van-grid-item>
                <van-grid-item use-slot v-else @click="moreToobar(5)">
                    <van-icon name="like-o" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">收藏</p>
                </van-grid-item>
                <van-grid-item use-slot @click="moreToobar()">
                    <van-icon name="add-square" color="#1989fa" size="50rpx" />
                    <p class="tc mt8 fs12 cBlue">推荐房源</p>
                </van-grid-item>
            </van-grid>
        </van-popup>
        <!-- 联系客户 -->
        <van-action-sheet
            :show="showCust"
            :actions="actionsCust"
            close-on-click-overlay
            safe-area-inset-bottom
            close-on-click-action
            @select="selectCust"
            @close="() => { this.showCust = false;}"
            :description="Entity.LegalPerson"
            @cancel="() => { this.showCust = false; }"
            cancel-text="取消" />
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
import Toast from '../../static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
import { BrandDetail, DeleteBrand, SetOrCancelBrandPrivate, FavoriteOrCancel } from '../../utils/http';
import { nullToStr } from '../../utils/index.js';
export default {
    data() {
        return {
            id: '', // 客户id
            imageDoin: this.globalData.windowData.ImgUrl,
            Entity: {}, // 主体信息
            Reception: [], // 带看记录
            ReceptionNum: 0, // 带看记录数
            FollowUp: [], // 跟进记录
            FollowUpNum: 0, // 跟进记录数
            // 推荐房源
            activeNameHouseSources: '3',
            // 更多操作
            isShowPopup: false,
            actionsCust: [], // 联系客户
            CreateUserId: [], // 选人数据
            showCust: false // 联系客户
        };
    },
    onShow() {
        this.id = this.$root.$mp.query.id; // 项目id
        this.isShowPopup = false; // 关闭更多按钮弹框
        this.BrandDetailFun(); // 客户详情
    },
    methods: {
        getReason (val) {
            this.reason = val.detail;
        },
        BrandDetailFun () {
            let params = {
                id: this.id
            }
            BrandDetail(params).then(res => {
                if (res.Status == 200) {
                    res.Data = nullToStr(res.Data);
                    let EntityData = res.Data.Entity;
                    // 招商客户编辑数据赋值
                    this.globalData.windowData["editBrandData"] = res.Data;
                    // 主体信息
                    (!!EntityData) ? this.Entity = EntityData : this.Entity = {};
                    // 带看记录
                    if (!!res.Data.Reception && res.Data.Reception.length > 0) this.Reception = res.Data.Reception;
                    this.ReceptionNum = this.Reception.length;
                    // 跟进记录 FollowUp
                    if (!!res.Data.FollowUp && res.Data.FollowUp.length > 0) this.FollowUp = res.Data.FollowUp;
                    this.FollowUpNum = this.FollowUp.length;
                    // 联系客户赋值
                    if (!!EntityData) {
                        this.actionsCust = [];
                        this.actionsCust.push(
                            {name: '手机号码:' + EntityData.TelPhone, val: EntityData.TelPhone, color: '#1989fa', type: 1},
                            {name: '固定电话:' + EntityData.FixationPhone, val: EntityData.FixationPhone, color: '#1989fa', type: 1},
                            {name: '邮箱:' + EntityData.Email, val: EntityData.Email, color: '#1989fa', type: 2},
                            {name: '地址:' + EntityData.Address, val: EntityData.Address, color: '#1989fa', type: 2}
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
        onChangeHouseSources(event) {
            this.activeNameHouseSources = event.mp.detail;
        },
        // tabbar
        onChangeTabbar(event) {
            var url = '../addFollowUp/index';
            if (event.mp.detail === 0) {
                // 写跟进
                url = '../addFollowUp/index?id='+ this.id +'&type='+ 7;
            } else if (event.mp.detail === 1) {
                // 录带看
                url = '../addLook/index?id=' + this.id +'&type='+ 4;
            } else if (event.mp.detail === 2) { // 编辑品牌
                url = '../addBrand/index?id=' + this.id;
            } else if (event.mp.detail === 3) {
                // 更多操作
                this.isShowPopup = true;
                return false;
            }
            wx.navigateTo({ url: url });
        },
        // 删除客户
        DeleteBrandFun() {
            let params = {
                id: this.id
            }
            DeleteBrand(params).then(res => {
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
        },
        // 查看品牌详情
        linkBrand (id) {
            if (!!id) wx.navigateTo({ url: '../brandDetail/index?id=' + id});
        },
        // 查看渠道详情
        linkAgent (id) {
            if (!!id) wx.navigateTo({ url: '../channelDetail/index?id=' + id});
        },
        moreToobar (i) {
            switch (i) {
            case 1: // 编辑品牌
                wx.navigateTo({ url: '../addBrand/index?id=' + this.id});
                break;
            case 2:
                let params = {
                    RefId: this.id,
                    IsBrand: true
                }
                if (!!this.Entity.IsPrivateCust) {
                    params['Type'] = 2; // 1-设置，2-取消
                    Dialog.confirm({
                        title: '取消私客',
                        message: '是否确定取消私客？',
                        asyncClose: true
                    }).then(() => {
                        SetOrCancelBrandPrivate(params).then(res => {
                            if (res.Status == 200) {
                                Toast.success(res.Message);
                                setTimeout(()=>{
                                    Dialog.close();
                                    this.isShowPopup = false;
                                    this.BrandDetailFun();
                                }, 2000);
                            } else {
                                Dialog.close();
                                Toast.fail(res.Message);
                            }
                        })
                    }).catch(() => {
                        Dialog.close();
                    });
                } else {
                    params['Type'] = 1; // 1-设置，2-取消
                    params = encodeURIComponent(JSON.stringify(params));
                    wx.navigateTo({ url: '../selPerson/index?params=' +params+ '&type=0&name=设置私客(品牌)' });
                }
                break;
            case 3: // 变更客源方
                let paramss = {
                    refId: this.id,
                    refType: 7, // 品牌是7
                    rightType: 200 // 客源是200  私客是201
                }
                paramss = encodeURIComponent(JSON.stringify(paramss));
                wx.navigateTo({ url: '../selPerson/index?params=' +paramss+ '&type=0&name=客源' });
                break;
            case 6: // 变更私客方
                let paramssi = {
                    refId: this.id,
                    refType: 7, // 品牌是7
                    rightType: 201 // 客源是200  私客是201
                }
                paramssi = encodeURIComponent(JSON.stringify(paramssi));
                wx.navigateTo({ url: '../selPerson/index?params=' +paramssi+ '&type=0&name=私客' });
                break;
            case 4: // 删除品牌
                Dialog.confirm({
                    title: '删除品牌',
                    message: '是否确认删除该品牌？'
                }).then(() => {
                    this.DeleteBrandFun();
                }).catch(() => {
                    // on cancel
                });
                break;
            case 5: // 收藏品牌
                let shoucang = {
                    id: this.id,
                    isFavorite: !this.Entity.IsFavorite,
                    refType: 7
                }
                FavoriteOrCancel(shoucang).then(res => {
                    if (res.Status == 200) {
                        Toast.success(res.Message);
                        setTimeout(()=>{
                            this.isShowPopup = false;
                            this.BrandDetailFun();
                        }, 2000);
                    } else {
                        Dialog.close();
                        Toast.fail(res.Message);
                    }
                })
                break;
            default:
                Toast.fail('暂未开放');
                break;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.custDetail-wrapper {
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
                width: calc(30% - 8px);
                &:nth-of-type(1) {
                    width: 40%;
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
                        width: calc(100% - 200px);
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
    }
    > .content {
        .detail-wrap {
            padding: 16px;
            ul {
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
        .houseSources-wrap {
            .tit-tag {
                top: -1px;
            }
            .num {
                padding: 4px;
                height: 12px;
                line-height: 12px;
                border-radius: 4px;
                top: 3px;
            }
            ul.item {
                > li {
                    color: #666;
                    border-bottom: 1px solid #f5f5f5;
                    padding: 12px;
                    &:last-child {
                        border-bottom: none;
                    }
                    p {
                        width: calc(30% - 8px);
                        &:first-child {
                            width: 40%;
                        }
                    }
                }
            }
        }
        ul.takeNotes-wrap {
            padding: 16px;
            li {
                border-bottom: 1px solid #f5f5f5;
                margin-bottom: 12px;
                padding-bottom: 12px;
                &:last-child {
                    padding-bottom: 0;
                    border-bottom: none;
                    margin-bottom: 0;
                }
                .top {
                    padding: 0 0 12px;
                    > p {
                        width: (100%/3);
                    }
                }
                .content {
                    label {
                        width: 70px;
                        margin-right: 8px;
                        color: #666;
                    }
                    > div {
                        width: calc(100% - 78px);
                        &.rate-wrap {
                            .rate {
                                top: -1px;
                            }
                        }
                    }
                    > p {
                        float: left;
                        color: #333;
                        width: calc(100% - 78px);
                    }
                }
            }
        }
        ul.followUp-wrap {
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
}
.textarea {
    min-height: 75px;
    padding: 3px 0;
}
</style>
