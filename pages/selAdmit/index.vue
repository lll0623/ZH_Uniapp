<template>
    <div class="selAdmit-wrapper">
        <div class="content">
            <van-cell-group>
                <van-cell v-for="(item, indexs) in AdmitList" :key="item.Id" clickable @click="onClick(item)">
                    <view slot="title">
                        <div class="fl" style="width: calc(100vw - 150px);">
                            <span class="c3">{{ item.StaffName }}</span>
                        </div>
                    </view>
                </van-cell>
            </van-cell-group>
            <div class="tc cRed p20" v-if="AdmitList.length == 0">暂无数据</div>
        </div>
        <div class="fix common-btn-wrap bgCW tr">
            <van-button class="cancel" round type="default" @click="cancel">取消</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from '@/static/vant/toast/toast';
import { GetResidents } from '@/utils/http';
export default {
    data() {
        return {
            id: '',
            type: '',
            imageDoin: this.globalData.windowData.ImgUrl,
            AdmitList: [],
            chooseData: [], // 选中的数据
        };
    },
    onShow() {
        this.id = this.$root.$mp.query.id; // 模块id
        this.type = this.$root.$mp.query.type; // 模块类型
        this.Refresh();
    },
    methods: {
        onClick(item) {
            this.chooseData.push({
                name: item.StaffName,
                val: item.StaffId
            });
            this.globalData.windowData['admitId'] = this.chooseData; // 已选的招商接待人员数据存入全局参数以供调用
            wx.navigateBack();
        },
        noop () {},
        onSearch() {
            this.AdmitList = [];
            this.GetResidentsFun();
        },
        GetResidentsFun() {
            let params = {
                refId: this.id,
                RefType: this.type
            };
            if(!this.finished) {
                GetResidents(params).then(res => {
                    if (res.Status == 200) {
                        this.AdmitList = res.Data;
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
            wx.navigateTo({ url: '../addReport/index' });
        },
        cancel () {
            wx.navigateBack();
        },
        Refresh() {
            this.AdmitList = [];
            this.GetResidentsFun();
        }
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.Refresh();
    },
    onReachBottom() {
        this.GetResidentsFun();
    },
};
</script>
<style lang="scss">
.selAdmit-wrapper {
    > .content {
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
    .cancel{
        button {
            width: 80px;
        }
    }
}
</style>
