<template>
    <div>
       <van-cell is-link
                 @click="()=>{this.isShowPopup = true}">
           <view slot="title">
               <div class="rel common-required">
                   <span v-if="isBT == 'true'" class="cRed">*</span>
                   <span class="van-cell-text">{{ label }}</span>
               </div>
           </view>
            <view class="textHere">
                <span v-if="jsonArry.length == 0 && !isVal">点击选择</span>
                <span v-if="isVal && jsonArry.length == 0">{{ isVal }}</span>
                <span v-for="(item, index) in jsonArry" :key="index">{{ item.text }}</span>
            </view>
       </van-cell>
       <van-popup class="overflow" :show="isShowPopup"
                  position="bottom"
                  @close="()=>{this.isShowPopup = false}">
            <van-picker
                :columns="columns"
                show-toolbar
                :title="label"
                @cancel="()=>{this.isShowPopup = false}"
                @change="selectDouble"
                @confirm="onConFirmFun" />
       </van-popup>
    </div>
</template>

<script>
    import watch from '@/utils/index';
    export default {
        props: ['label', 'isBT', 'lsCode', 'isVal'],
        data() {
            return {
                GetItemsData: [],
                isShowPopup: false,
                columns: [],
                list1: [], // 一级数据
                list2: [], // 二级数据
                jsonArry: [] // 输出数据
            }
        },
        created() {
            this.GetItemsData = this.globalData.windowData.GetItemsData["Ls.Ag." + this.lsCode];
            if(!!this.GetItemsData && this.GetItemsData.length > 0) {
                let obj = {};
                this.GetItemsData.map(item => {
                    obj = item;
                    if(!!item['ItemName']) {
                        obj['text'] = item['ItemName'];
                        delete obj['ItemName'];
                        if (!!item.Children && item.Children.length > 0) {
                            let objs = {};
                            item.Children.map(items => {
                                objs = items;
                                objs['text'] = items['ItemName'];
                                delete objs['ItemName'];
                            })
                        }
                    }
                })
                this.columns = [
                    {
                        values: this.GetItemsData, // 设置的第一列的初始值
                        className: "column1"
                    },
                    {
                        values: this.GetItemsData[0].Children, // 设置第二列的初始值
                        className: "column2"
                    }
                ]
            }
        },
        mounted() {},
        methods: {
            onConFirmFun (e) {
                this.isVal = null;
                this.jsonArry = []; // 先清空
                let value = e.detail.value;
                if (!!value[0]) {
                    this.jsonArry.push({
                        text: value[0].text,
                        val: value[0].ItemValue,
                        index: value[0].SortCode - 1
                    })
                } else {
                    this.jsonArry.push({
                        text: '',
                        val: '',
                        index: ''
                    })
                }
                if (!!value[1]) {
                    this.jsonArry.push({
                        text: value[1].text,
                        val: value[1].ItemValue,
                        index: value[1].SortCode - 1
                    })
                } else {
                    this.jsonArry.push({
                        text: '',
                        val: '',
                        index: ''
                    })
                }
                this.isShowPopup = false;
                this.$emit("listenTochildEvent", this.jsonArry);
            },
            selectDouble (event) { // 两列改变事件
                const { picker, value, index } = event.detail;
                if (!!value[0].Children && value[0].Children.length>0) {
                    picker.setColumnValues(1, value[0].Children);
                } else {
                    picker.setColumnValues(1, '');
                }
            }
        }
    }
</script>

<style lang="scss">
    .textHere {
        span + span:before {
            content: "-";
        }
    }
</style>
