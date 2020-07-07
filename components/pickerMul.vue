<template>
    <div class="pickerMul">
        <van-cell is-link
                @click="()=>{this.isShowPopup = true}">
            <view slot="title">
                <div class="rel common-required">
                    <span v-if="isBT == 'true'" class="cRed">*</span>
                    <span class="van-cell-text">{{ label }}</span>
                </div>
            </view>
            <view class="textHere">
                <span v-if="chooseAfterData.length == 0">点击选择</span>
                <span v-for="(item, index) in chooseAfterData" :key="index">{{ item.ItemName }}</span>
            </view>
        </van-cell>
        <van-popup class="overflow" :show="isShowPopup"
                    position="bottom"
                    @close="()=>{this.isShowPopup = false}">
            <div class="mulAreaData bgCW w100">
                <div class="title w100">
                    <div class="fl cBlue" style="padding: 0px 16px;" @click="()=>{this.isShowPopup = false}">取消</div>
                    <div class="fl tc c3">{{ label }}</div>
                    <div class="fl cBlue" style="padding: 0px 16px;" @click="submit">确认</div>
                </div>
                <div class="content w100 overflowYA">
                    <div class="fl bgEEE" :class="{'active': chooseAfterValue.indexOf( item.val ) != -1}" @click="choose(item.val, item.text)" v-for="(item, index) in columns" :key="index">{{ item.text }}</div>
                </div>
            </div>
       </van-popup>
    </div>
</template>
<script>
    export default {
        props: ['label', 'isBT', 'lsCode', 'isVal'],
        data() {
            return {
                isShowPopup: false,
                columns: [],
                chooseAfterData: [],
                chooseAfterValue: [] // 选中的数据
            }
        },
        created() {
            let GetItemsData = this.globalData.windowData.GetItemsData["Ls.Ag." + this.lsCode];
            if(!!GetItemsData && GetItemsData.length > 0) {
                GetItemsData.forEach(res => {
                    this.columns.push({
                        text: res.ItemName,
                        val: res.ItemValue
                    })
                })
            }
        },
        mounted() {
            if (this.isVal.length > 0) {
                this.isVal.forEach(res => {
                    if (!!res.Value || !!res.Name) {
                        this.choose(res.Value, res.Name);
                    }
                    if (!!res.ItemCode || !!res.ItemName) {
                        this.choose(res.ItemCode, res.ItemName);
                    }
                })
            }
        },
        methods: {
            choose (value, text) {
                if(this.chooseAfterValue.indexOf(value)!=-1) {
                    this.chooseAfterValue.splice(this.chooseAfterValue.indexOf(value), 1);
                    this.chooseAfterData = this.chooseAfterData.filter(res => {
                        return res.ItemCode != value;
                    })
                }else{
                    this.chooseAfterData.push({
                        ItemName: text,
                        ItemCode: value
                    });
                    this.chooseAfterValue.push(value);
                }
                this.$emit("listenTochildEvent", this.chooseAfterData);
            },
            submit () {
                this.isShowPopup = false;
                this.$emit("listenTochildEvent", this.chooseAfterData);
            }
        }
    }
</script>

<style lang="scss">
    .pickerMul {
        .textHere {
            span + span:before {
                content: ", ";
            }
        }
        .mulAreaData {
            height: 260px;
            .title {
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                -webkit-box-pack: justify;
                -webkit-justify-content: space-between;
                justify-content: space-between;
                height: 44px;
                line-height: 44px;
            }
            .content {
                height: calc(100% - 44px);
                div {
                    padding: 8px;
                    font-size: 14px;
                    border-radius: 5px;
                    margin: 5px 10px;
                    color: #333333;
                }
                div.active {
                    background-color: #1989fa;
                    color: #FFFFFF;
                }
            }
        }
    }
</style>
