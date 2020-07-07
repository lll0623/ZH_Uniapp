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
           <view class=""> {{ json.text }} </view>
       </van-cell>
       <van-popup class="overflow" :show="isShowPopup"
                  position="bottom"
                  @close="()=>{this.isShowPopup = false}">
            <van-picker
                :columns="columns"
                show-toolbar
                :title="label"
                @cancel="()=>{this.isShowPopup = false}"
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
                json: {
                    text: '点击选择',
                    val: ''
                }
            }
        },
        created() {
            this.GetItemsData = this.globalData.windowData.GetItemsData["Ls.Ag." + this.lsCode];
            if(!!this.GetItemsData && this.GetItemsData.length > 0) {
                this.GetItemsData.forEach(res => {
                    this.columns.push({
                        text: res.ItemName,
                        val: res.ItemValue
                    })
                    if (this.isVal == res.ItemValue) {
                        this.json.text = res.ItemName;
                        this.json.val = res.ItemValue;
                        this.$emit("listenTochildEvent", this.json);
                    }
                })
            }
        },
        mounted() {},
        methods: {
            onConFirmFun (value, index) {
                this.json = value.detail.value;
                this.isShowPopup = false;
                this.$emit("listenTochildEvent", this.json);
            }
        }
    }
</script>

<style>
</style>
