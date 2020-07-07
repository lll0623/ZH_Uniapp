<template>
    <div class="selPerson-wrapper">
        <div class="top fix">
            <van-search :value="searchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>
        <div class="content">
            <van-cell class="clearfix default-cell">
                <van-image width="3rem" height="3rem" fit="cover" round class="fl" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <h4 class="fs14 c3 fl ml12 tit">公司部门</h4>
                <van-icon class="fr fs16 icon rel" name="arrow" />
            </van-cell>
            <van-index-bar v-if="type == '0'">
                    <view v-for="(item, idx) in bigCodeData" :key="idx">
                        <van-index-anchor :index="item.Code" />
                            <van-cell-group>
                                <van-cell v-for="(items, indexs) in item.List" :key="items.Id" clickable :data-index="items.Id" @click="onClick(items, 0)">
                                    <view slot="title">
                                        <!-- <van-image width="50px" height="50px" fit="cover" round class="fl mr8" v-if="!items.HeadPic" src="" />
                                        <van-image width="50px" height="50px" fit="cover" round class="fl mr8" v-else :src="imageDoin + items.HeadPic" /> -->
                                        <van-image width="50px" height="50px" fit="cover" round class="fl mr8" lazy-load :src="imageDoin + items.HeadPic" />
                                        <div class="fl" style="width: calc(100vw - 150px);">
                                            <span class="c3">{{ items.Name }}</span>
                                            <p class="c6 lineEllips1">{{ items.OrganizeName }}/{{ items.DepartmentName }}</p>
                                        </div>
                                    </view>
                                </van-cell>
                            </van-cell-group>
                    </view>
                    <div class="tc p20 c9 fs14" v-show="finished && WorkerList.length > 0">已全部加载</div>
            </van-index-bar>
            <van-index-bar v-if="type == '1'">
                 <van-checkbox-group :value="value" @change="onChange">
                    <view v-for="(item, idx) in bigCodeData" :key="idx">
                        <van-index-anchor :index="item.Code" />
                            <van-cell-group>
                                <van-cell v-for="(items, indexs) in item.List" :key="items.Id" clickable :data-index="items.Id" @click="onClick(items, 1)">
                                    <view slot="title">
                                        <!-- <van-image width="50px" height="50px" fit="cover" round class="fl mr8" v-if="!items.HeadPic" src="" />
                                        <van-image width="50px" height="50px" fit="cover" round class="fl mr8" v-else :src="imageDoin + items.HeadPic" /> -->
                                        <van-image width="50px" height="50px" fit="cover" round class="fl mr8" lazy-load :src="imageDoin + items.HeadPic" />
                                        <div class="fl" style="width: calc(100vw - 150px);">
                                            <span class="c3">{{ items.Name }}</span>
                                            <p class="c6 lineEllips1">{{ items.OrganizeName }}/{{ items.DepartmentName }}</p>
                                        </div>
                                    </view>
                                    <van-checkbox catch:tap="noop" :value="!!items.check ? true : false" :class="'checkboxes-'+items.Id" :name="items.Id" />
                                </van-cell>
                            </van-cell-group>
                    </view>
                    <div class="tc p20 c9 fs14" v-show="finished && WorkerList.length > 0">已全部加载</div>
                </van-checkbox-group>
            </van-index-bar>
        </div>
        <div class="fix common-btn-wrap bgCW tr" v-if="type == '1'">
            <van-button class="cancel" round type="info" @click="this.isShowWorker = true">查看已选（{{ chooseData.length }}）</van-button>
            <van-button class="submit ml12" round type="info" @click="sureClic">确定</van-button>
        </div>
        <!-- 查看已选员工 -->
        <van-popup :show="isShowWorker"
                   position="right"
                   custom-style="height: 100%;width:280px;"
                   @close="this.isShowWorker = false">
            <div class="filter-wrapper">
                <van-cell-group>
                  <van-cell v-for="(v, i) in chooseData" :key="i" :title="v.name">
                      <view>
                          <van-button type="danger" size="small" @click="deleteWorker(v.name, v.id)">删除</van-button>
                      </view>
                  </van-cell>
                </van-cell-group>
            </div>
        </van-popup>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
import Toast from '@/static/vant/toast/toast';
import Dialog from '../../static/vant/dialog/dialog';
import vPinyin from '@/utils/vue-py.js';
import { SearchWorker, SetOrCancelCustPrivate, SetOrCancelChannelPrivate, SetOrCancelBrandPrivate, CheckSourceInfo } from '@/utils/http';
let bigCode = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
export default {
    data() {
        return {
            type: '',
            name: '', // 调用接口的名字
            imageDoin: this.globalData.windowData.ImgUrl,
            bigCode,
            value: [],
            bigCodeData: [],
            searchKey: null,
            WorkerList: [],
            chooseData: [], // 选中员工
            isShowWorker: false,
            PageIndex: 1,
            PageSize: 15,
            finished: false,
            scrollTop: 0
        };
    },
    mounted() {
        this.type = this.$root.$mp.query.type ? this.$root.$mp.query.type : '0'; // 单选还是多选 0单选 1多选 默认单选
        if(!!this.$root.$mp.query.dataList && JSON.parse(decodeURIComponent(this.$root.$mp.query.dataList)).length > 0) {
            this.chooseData = JSON.parse(decodeURIComponent(this.$root.$mp.query.dataList));
            this.chooseData.forEach(its => {
                this.value.push(its.id);
            })
        }
        this.SearchWorkerFun();
    },
    methods: {
        onChangeSearch(e) {
            // 搜索框值改变事件
            this.searchKey = e.mp.detail;
        },
        onChange(event) {
            this.value = event.detail;
        },
        onClick(item, i) {
            let query = this.$root.$mp.query;
            if (i == 0) {
                if (!!JSON.parse(decodeURIComponent(query.params))) {
                    if (!!query.name && query.name== "设置私客") { // 设置私客接口 招商和渠道用
                        let params = JSON.parse(decodeURIComponent(query.params));
                        let typeNames = '';
                        if (params.IsIm) typeNames = '客户';
                        else typeNames = '渠道';
                        params['UserId'] = item.Id;
                        Dialog.confirm({
                            title: '设为私客',
                            message: '是否确定将该'+typeNames+'设置为['+item.Name+']的私客?',
                            asyncClose: true
                        }).then(() => {
                            if (params.IsIm) { // 客户
                                SetOrCancelCustPrivate(params).then(res => {
                                    if (res.Status == 200) {
                                        Toast.success(res.Message);
                                        setTimeout(()=>{
                                            wx.navigateBack();
                                        }, 2000);
                                    } else {
                                        Toast.fail(res.Message);
                                    }
                                })
                            } else {
                                SetOrCancelChannelPrivate(params).then(res => {
                                    if (res.Status == 200) {
                                        Toast.success(res.Message);
                                        setTimeout(()=>{
                                            wx.navigateBack();
                                        }, 2000);
                                    } else {
                                        Toast.fail(res.Message);
                                    }
                                })
                            }
                        }).catch(() => {
                            Dialog.close();
                        });
                    }
                    if (!!query.name && query.name== "设置私客(品牌)") { // 设置私客接口 品牌
                        let params = JSON.parse(decodeURIComponent(query.params));
                        params['UserId'] = item.Id;
                        Dialog.confirm({
                            title: '设为私客',
                            message: '是否确定将该品牌设置为['+item.Name+']的私客?',
                            asyncClose: true
                        }).then(() => {
                            SetOrCancelBrandPrivate(params).then(res => {
                                if (res.Status == 200) {
                                    Toast.success(res.Message);
                                    setTimeout(()=>{
                                        wx.navigateBack();
                                    }, 2000);
                                } else {
                                    Toast.fail(res.Message);
                                }
                            })
                        }).catch(() => {
                            Dialog.close();
                        });
                    }
                    if (!!query.name && (query.name== "客源" || query.name== "私客")) { // 设置变更接口
                        let params = JSON.parse(decodeURIComponent(query.params));
                        params['wId'] = item.Id;
                        let typeName = params.refType == 2 ? '客户' : params.refType == 7 ? '品牌' : params.refType == 3 ? '渠道' : '';
                        Dialog.confirm({
                            title: '变更'+query.name+'方',
                            message: '是否变更该'+ typeName +'的'+query.name+'方为['+item.Name+']?',
                            asyncClose: true
                        }).then(() => {
                            CheckSourceInfo(params).then(res => {
                                if (res.Status == 200) {
                                    Toast.success(res.Message);
                                    setTimeout(()=>{
                                        wx.navigateBack();
                                    }, 2000);
                                } else {
                                    Toast.fail(res.Message);
                                }
                            })
                        }).catch(() => {
                            Dialog.close();
                        });
                    }
                }
            } else {
                const checkbox = this.selectComponent(`.checkboxes-${item.Id}`);
                checkbox.toggle();
                if(this.value.indexOf(item.Id) !=-1) {
                    this.chooseData.push({
                        name: item.Name,
                        id: item.Id,
                        img: this.imageDoin + item.HeadPic
                    });
                }else{
                    this.chooseData = this.chooseData.filter(res => {
                        return res.id != item.Id;
                    })
                }
            }
        },
        deleteWorker (name, id) {
            const checkbox = this.selectComponent(`.checkboxes-${id}`);
            checkbox.toggle();
            this.chooseData = this.chooseData.filter(res => {
                return res.id != id;
            })
        },
        noop () {},
        onSearch() {
            this.PageIndex = 1;
            this.bigCodeData = [];
            this.WorkerList = [];
            this.finished = false;
            this.SearchWorkerFun();
        },
        firstCode(text) {
            return vPinyin.chineseToPinYin(text).substr(0, 1);
        },
        SearchWorkerFun() {
            let params = {
                PageIndex: this.PageIndex,
                PageSize: this.PageSize,
                searchText: this.searchKey
            };
            if(!this.finished) {
                SearchWorker(params).then(res => {
                    if (res.Status == 200) {
                        this.bigCodeData = [];
                        this.bigCode.forEach(res => {
                            this.bigCodeData.push({
                                Code: res
                            })
                        });
                        if (res.Data.WorkerList.length == this.PageSize) {
                            this.PageIndex += 1;
                        } else {
                            this.finished = true;
                        }
                        this.WorkerList = this.WorkerList.concat(res.Data.WorkerList);
                        this.WorkerList.forEach((item, i) => {
                            if(this.value.indexOf(item.Id) !=-1) {
                                item["check"] = true;
                            }
                            item['firstCode'] = this.firstCode(item.Name);
                        });
                        this.bigCodeData.forEach((v, i) => {
                            v['List'] = [];
                            this.WorkerList.forEach((m, j) => {
                                if (v.Code == m.firstCode) {
                                    v['List'].push(m);
                                }
                            });
                        });
                        setTimeout
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
        sureClic () {
            this.globalData.windowData['CreateUserId'] = this.chooseData;
            wx.navigateBack();
        },
        Refresh() {
            this.finished = false;
            this.PageIndex = 1;
            this.WorkerList = [];
            this.SearchWorkerFun();
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.Refresh();
    },
    onReachBottom() {
        this.SearchWorkerFun();
    },
};
</script>
<style lang="scss">
.selPerson-wrapper {
    > .top {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    > .content {
        padding-top: 52px;
        .default-cell {
            .tit {
                line-height: 45px;
            }
            .icon {
                top: 18px;
            }
        }
        padding-bottom: 75px;
        .van-cell__title{
            flex: 12;
        }
        .van-cell__value {
            flex: 2;
        }
    }
    .cancel{
        button {
            width: 135px;
        }
    }
}
</style>
