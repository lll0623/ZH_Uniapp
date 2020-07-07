<template>
    <view class="login">
        <view class="rel tit tc mt30 mb40">
            <view class="fs12 c6 rel bgCW inlineBlock">推荐登录方式</view>
            <view class="abs"></view>
        </view>
        <button class="cWhite fs30 mt30 bold tc bgCBlue comBtn comWidth" open-type="getPhoneNumber" lang="zh_CN" @getphonenumber="getPhoneNumber">
            <view class="icon i-weChat mr10 rel inlineBlock"></view>
            账号登录
        </button>
    </view>
</template>

<script>
    import { LoginForWorker, PreLogin} from '../../utils/http';
    export default {
        data() {
            return {
                phone: '', // 手机号
                code: '', // 验证码
                disabled: false,
                wxLoginInfo: '',
            }
        },
        onShow() {
            wx.showLoading({
                title: '加载中...',
                mask: true
            });
            wx.checkSession({
                success: ()=> {
                    if(!this.globalData.windowData.token) {
                        this.WxLogin()
                    }
                },
                fail: ()=> {
                    this.WxLogin()
                }
            })
        },
        methods: {
            WxLogin () {
                let that = this;
                wx.login({
                    success(res) {
                        if (res.code) {
                            PreLogin({ code: res.code }).then(res => {
                                if (res.Status == 200 && !!res.Data) {
                                    that.wxLoginInfo = res.Data;
                                } else {
                                    wx.showToast({
                                        title: res.Message,
                                        icon: 'none',
                                        duration: 2000
                                    })
                                }
                            });
                        }
                    }
                })
            },
            getPhoneNumber(e) {
                let encryptedDataStr = e.detail.encryptedData, iv = e.detail.iv;
                wx.showLoading({
                    title: '登录中...',
                    mask: true
                });
                // 发起授权登录请求获取电话号码
                let params = {
                    preToken: this.wxLoginInfo,
                    encryptedDataStr: encryptedDataStr,
                    iv: iv,
                }
                LoginForWorker(params).then(res => {
                    if (res.Status == 200) {
                        wx.setStorageSync('TouristToken', res.Data.Token); // 游客token
                        // wx.setStorageSync('TouristName', res.Data.Name);
                        // wx.setStorageSync('TouristHeadPic', res.Data.HeadPic);
                        wx.setStorageSync('TouristPhone', res.Data.Phone);
                        this.globalData.windowData.TouristToken = res.Data.Token; // 游客
                        this.globalData.windowData.Token = res.Data.Token; // 游客
                        // this.globalData.windowData.TouristName = res.Data.Name;
                        // this.globalData.windowData.TouristHeadPic = res.Data.HeadPic;
                        this.globalData.windowData.TouristPhone = res.Data.Phone;
                        wx.showToast({
                            title: "授权成功",
                            duration: 2000,
                            icon: 'success',
                            mask: true
                        })
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 2000)
                    } else {
                        wx.showToast({
                            title: res.Message,
                            duration: 2000,
                            icon: 'none',
                            mask: true
                        })
                    }
                })
            }
        }
    }
</script>

<style>
    .i-weChat{
        width:50rpx;
        height:50rpx;
        background-size:330rpx auto;
        background-position:4rpx -163rpx;
        top:16rpx;
    }
    .i-close{
        width:50rpx;
        height:50rpx;
        background-size:330rpx auto;
        background-position:-52rpx -163rpx;
        top:16rpx;
    }
    .tit{
        width:240rpx;
        margin:0 auto;
        height:40rpx;
        line-height:40rpx;
        overflow: hidden;
    }
    .tit>.rel{
        width:150rpx;
        z-index:2;
    }
    .tit>.abs{
        width:100%;
        z-index:1;
        height:1rpx;
        background:#666;
        top:50%;
        left:0;
    }
    
    .telLogin{
        width:91%;
    }
    .loginIptItem button{
        height:90rpx;
        line-height:90rpx;
    }
    .loginIptItem button,.loginIptItem button:after,.loginIptItem button[disabled]{
        background: none;
        border:none;
    }
    .loginIptItem input{
        height:90rpx;
        line-height: 90rpx;
    }
    .mt30 {
        margin-top: 30rpx;
    }
</style>
