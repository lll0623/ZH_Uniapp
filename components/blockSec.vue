<template>
    <div class="blockSec">
       <h4 class="c6 fs14">{{ label }}</h4>
       <ul class="sel-normal clearfix">
           <li :class="{fl:true, active: chooseIndex == v.val}"
               v-for="(v, i) in chooseAfterData" :key="i" @click="choose(v.val, v.text)">{{ v.text }}</li>
       </ul>
    </div>
</template>

<script>
    let dataItemList = {
        CustStatus: [
            {text: '全部', val: -1},
            {text: '有效', val: 1},
            {text: '无效', val: 0},
        ],
        IsImPrivateCust: [
            {text: '全部', val: -1},
            {text: '公客', val: false},
            {text: '私客', val: true},
        ]
    }
    
    export default {
        name: 'blockSec',
        props: ['label', 'lsCode', 'dataList'],
        data() {
            return {
                dataItemList, // 写死的词典 json
                chooseIndex: -1,
                GetItemsData: [],
                isShowPopup: false,
                chooseAfterData: [{text: '全部', val: -1}],
                chooseAfterValue: [] // 选中的数据
            }
        },
        created() {
            this.chooseIndex = -1;
            if(this.dataList == "true") {
                this.chooseAfterData = this.dataItemList[this.lsCode]; // 赋值词典数据
            } else {
                this.GetItemsData = this.globalData.windowData.GetItemsData["Ls.Ag." + this.lsCode];
                if(!!this.GetItemsData && this.GetItemsData.length > 0) {
                    this.GetItemsData.forEach(res => {
                        this.chooseAfterData.push({
                            text: res.ItemName,
                            val: res.ItemValue
                        })
                    })
                }
            }
        },
        mounted() {},
        methods: {
            choose (value, text) {
                this.chooseIndex = value;
                this.chooseAfterValue = [];
                if(this.dataList == "true") {
                    this.chooseAfterValue.push({
                        FormatName: text,
                        FormatCode: value
                    })
                } else {
                    this.chooseAfterValue.push({
                        FormatName: text,
                        FormatCode: value
                    })
                }
                this.$emit("listenTochildEvent", this.chooseAfterValue, this.lsCode);
            },
        }
    }
</script>

<style lang="scss">
    .blockSec{
        > h4 {
            padding: 8px 0;
        }
        > ul.sel-normal {
            > li {
                margin-right: 8px;
                border: 1px solid #ddd;
                color: #999;
                font-size: 14px;
                padding: 5px 10px;
                text-align: center;
                border-radius: 3px;
                margin-bottom: 5px;
                &.active {
                    border-color: #1989fa;
                    color: #1989fa;
                }
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
</style>
