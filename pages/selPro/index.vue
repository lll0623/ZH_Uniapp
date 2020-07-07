<template>
    <div class="selPro-wrapper">
        <div class="top fix">
            <van-search :value="searchKey" use-action-slot placeholder="请输入搜索关键词" @search="onSearch" @change="onChangeSearch">
                <view slot="action" @tap="onSearch">搜索</view>
            </van-search>
        </div>
        <div class="content">
            <van-cell-group v-if="type == '0'">
                <van-cell v-for="(items, indexs) in ProList" :key="items.ProjectId" clickable :data-index="items.ProjectId" @click="onClick(items)">
                    <view slot="title">
                        <span class="c3 fl">{{ items.ProjectName }}</span>
                        <van-tag class="fl rel tag ml4" type="success">{{ items.ProjectStatus | GetItemsFilter('Ls.Ag.ProjectStatus', globalData.windowData.GetItemsData) }}</van-tag>
                    </view>
                </van-cell>
            </van-cell-group>
            <van-checkbox-group :value="value" @change="onChange" v-if="type == '1'">
                <van-cell-group>
                    <van-cell v-for="(items, indexs) in ProList" :key="items.ProjectId" clickable :data-index="items.ProjectId" @click="onClick(items)">
                        <view slot="title">
                            <span class="c3 fl">{{ items.ProjectName }}</span>
                            <van-tag class="fl rel tag ml4" type="success">{{ items.ProjectStatus | GetItemsFilter('Ls.Ag.ProjectStatus', globalData.windowData.GetItemsData) }}</van-tag>
                        </view>
                        <van-checkbox class="fr" @tap="noop" :class="'checkboxes-'+items.ProjectId" :name="items.ProjectId" />
                    </van-cell>
                </van-cell-group>
                <div class="tc p20 c9 fs14" v-show="finished && WorkerList.length > 0">已全部加载</div>
            </van-checkbox-group>
            <div class="tc p20 c9 fs14" v-show="finished && ProList.length > 0">已全部加载</div>
        </div>
        <div class="fix common-btn-wrap bgCW tr" v-if="type == '1'">
            <van-button class="cancel" round type="default" @click="cancel">取消</van-button>
            <van-button class="ml12" round type="info" @click="this.isShowPro = true">查看已选（{{ chooseData.length }}）</van-button>
            <van-button class="submit ml12" round type="info" @click="sureClic">确定</van-button>
        </div>
        <!-- 查看已选项目 -->
        <van-popup :show="isShowPro"
                   position="right"
                   custom-style="height: 100%;width:280px;"
                   @close="this.isShowPro = false">
            <div class="filter-wrapper">
                <van-cell-group>
                  <van-cell v-for="(v, i) in chooseData" :key="i" :title="v.name">
                      <view>
                          <van-button type="danger" size="small" @click="deletePro(v.name, v.id)">删除</van-button>
                      </view>
                  </van-cell>
                </van-cell-group>
            </div>
        </van-popup>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '@/static/vant/toast/toast';
import { InviteBusinessProjectList, AccessProjectList } from '@/utils/http';
export default {
    data() {
        return {
            type: '',
            isShowPro: false,
            imageDoin: this.globalData.windowData.ImgUrl,
            searchKey: null,
            ProList: [],
            chooseData: [], // 选中项目
            PageIndex: 1,
            PageSize: 15,
            finished: false,
            value: [],
        };
    },
    onShow() {
        this.type = this.$root.$mp.query.type; // 单选还是多选 0单选 1多选
        if(!!this.$root.$mp.query.dataList && JSON.parse(decodeURIComponent(this.$root.$mp.query.dataList)).length > 0) {
            this.chooseData = JSON.parse(decodeURIComponent(this.$root.$mp.query.dataList));
            this.chooseData.forEach(its => {
                this.value.push(its.id);
            })
        }
        this.Refresh();
    },
    methods: {
        onChangeSearch(e) {
            // 搜索框值改变事件
            this.searchKey = e.mp.detail;
        },
        onChange(event) {
            this.value = event.detail;
        },
        onClick(item) {
            if (this.type == '0') {
                this.chooseData.push({
                    name: item.ProjectName,
                    val: item.ProjectId
                });
                this.globalData.windowData['ProId'] = this.chooseData; // 已选的项目数据存入全局参数以供调用
                wx.navigateBack();
            } else {
                const checkbox = this.selectComponent(`.checkboxes-${item.ProjectId}`);
                checkbox.toggle();
                if(this.value.indexOf(item.ProjectId) !=-1) {
                    this.chooseData.push({
                        name: item.ProjectName,
                        id: item.ProjectId,
                    });
                }else{
                    this.chooseData = this.chooseData.filter(res => {
                        return res.id != item.ProjectId;
                    })
                }
            }
        },
        deletePro (name, id) {
            const checkbox = this.selectComponent(`.checkboxes-${id}`);
            checkbox.toggle();
            this.chooseData = this.chooseData.filter(res => {
                return res.id != id;
            })
        },
        noop () {},
        onSearch() {
            this.Refresh();
        },
        ProListsFun() {
            let params = {
                PageIndex: this.PageIndex,
                PageSize: this.PageSize,
                SearchKey: this.searchKey,
                "Sort": {
                    "Field": "CreateTime",
                    "IsASC": false
                }
            };
            if(!this.finished) {
                if (this.globalData.windowData.isTourist) {
                    params["CmpCode"] = this.globalData.windowData.CmpCode;
                    AccessProjectList(params).then(res => {
                        if (res.Status == 200) {
                            if (res.Data.Data.length == this.PageSize) {
                                this.PageIndex += 1;
                            } else {
                                this.finished = true;
                            }
                            this.ProList = this.ProList.concat(res.Data.Data);
                        } else {
                            Toast.fail({
                                message: res.Message,
                                position: 'top',
                                duration: 3000
                            });
                        }
                        this.isShow = true;
                        wx.stopPullDownRefresh();
                    })
                } else {
                    InviteBusinessProjectList(params).then(res => {
                        if (res.Status == 200) {
                            if (res.Data.Data.length == this.PageSize) {
                                this.PageIndex += 1;
                            } else {
                                this.finished = true;
                            }
                            this.ProList = this.ProList.concat(res.Data.Data);
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
            }
        },
        sureClic () {
            this.globalData.windowData['ProjectIds'] = this.chooseData;
            wx.navigateBack();
        },
        cancel () {
            wx.navigateBack();
        },
        Refresh() {
            this.finished = false;
            this.PageIndex = 1;
            this.ProList = [];
            this.ProListsFun();
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.Refresh();
    },
    onReachBottom() {
        this.ProListsFun();
    },
    filters: {
        GetItemsFilter: function(val, arg1, data) {
            let ItemName = '-';
            if(!!val) {
                if(!!data[arg1] && data[arg1].length > 0) {
                    data[arg1].forEach(res => {
                        if(Number(res.ItemValue) == val) {
                            ItemName = res.ItemName;
                        }
                    })
                }
            }
            return ItemName;
        }
    }
};
</script>
<style lang="scss">
.selPro-wrapper {
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
            flex: 1;
        }
    }
}
</style>
