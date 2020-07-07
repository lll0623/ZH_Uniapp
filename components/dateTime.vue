<template>
    <div class="dateTime">
        <van-calendar
            :poppable="false"
            :show-confirm="false"
            @confirm="confirm"
            row-height="50"
            class="calendar" />
        <van-cell title="选择时间" is-link icon="underway-o" 
            @click="()=>{
                this.isShowPopup = true
            }">
            <view>
                {{ startTime }} - {{ endTime }}
            </view>
        </van-cell>
        <div class="submit">
            <van-button block
                        type="info"
                        @click="submitDate"
                        size="normal">确定</van-button>
        </div>
       <van-popup class="overflow" :show="isShowPopup"
                  position="bottom"
                  @close="()=>{this.isShowPopup = false}">
            <van-picker
                :columns="columns"
                show-toolbar
                :title="label"
                @cancel="()=>{this.isShowPopup = false}"
                @confirm="onConFirmFun" />
                <view class="fenge abs" style="">-</view>
       </van-popup>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                hour: [],
                second: [],
                date: '',
                startTime: '10:00',
                endTime: '11:00',
                isShowPopup: false,
                jsonArry: [],
                columns: []
            }
        },
        mounted() {
            this.date = this.getDateFun(new Date());
            let Hour = new Date().getHours();
            let Minute = new Date().getMinutes();
            if (Minute < 10) Minute = "0"+Minute;
            this.startTime = Hour + ':' + Minute;
            if (Hour == 23) {
                this.endTime = "00" + ':' + Minute;
            } else {
                this.endTime = (Number(Hour) + 1) + ':' + Minute;
            }
            for (var i=0; i<24; i++) {
                if(i<10) {
                    this.hour.push('0' + i)
                } else {
                    this.hour.push(String(i))
                }
            }
            for (var i=0; i<60; i++) {
                if(i<10) {
                    this.second.push('0' + i)
                } else {
                    this.second.push(String(i))
                }
            }
            this.columns[0] = {
                values: this.hour,
                defaultIndex: (Hour == 0) ? 0 : Hour
            };
            this.columns[1] = {
                values: this.second,
                defaultIndex: Minute
            };
            this.columns[2] = {
                values: this.hour,
                defaultIndex: (Hour == 0) ? 0 : (Hour+1)
            };
            this.columns[3] = {
                values: this.second,
                defaultIndex: Minute
            };
        },
        methods: {
            confirm (e) {
                this.date = this.getDateFun(e.detail);
            },
            onConFirmFun (e) {
                console.log(e.detail)
                const {index, value} = e.detail;
                if (index[2] + index[3] <= index[0] + index[1]) {
                    wx.showToast({
                        title: '结束时间不能小于开始时间',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                } else {
                    this.startTime = value[0] + ":" + value[1];
                    this.endTime = value[2] + ":" + value[3];
                    this.isShowPopup = false;
                }
            },
            submitDate () {
                let json = {
                    ReceptionTime: this.date,
                    BeginDate: this.startTime,
                    EndDate: this.endTime
                }
                this.$emit("listenTochildEvent", json);
            },
            getDateFun (val) {
                const year = val.getFullYear();
                const month = val.getMonth() + 1;
                const day = val.getDate();
                return year + '-' + month + '-' + day;
            }
        }
    }
</script>

<style lang="scss">
    .dateTime{
        .calendar {
            --calendar-height: 380px;
        }
        .fenge {
            top: calc(50% + 10px);
            left: 50%;
        }
    }
</style>
