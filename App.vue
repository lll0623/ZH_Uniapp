<script>
import { GetItems, PreLogin, TryGetWorkerLoginByPreToken, GetAreaData, BookMenus, ReceptionMenus } from './utils/http';
import globalData from './utils/global'; // 全局参数
export default {
    onLaunch: function() {
        // console.log('App Launch');
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                console.log('onCheckForUpdate====', res)
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    console.log('res.hasUpdate====')
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        }
    },
    onShow: function() {
        // console.log('App Show');
        // 获取词典数据
        let params = {
            keys: [
                'Ls.Ag.ProjectStatus', // 项目状态
                'Ls.Ag.ProjectType', // 项目类型
                'Ls.Ag.Format', // 业态
                'Ls.Ag.Urgency', // 意向等级
                'Ls.Ag.ConstructionArea', // 面积
                'Ls.Ag.CustSource', // 客户来源
                'Ls.Ag.Source', // 客户来源
                'Ls.Ag.DemandArea', // 需求区域
                'Ls.Ag.UnitType', // 商铺类型
                'Ls.Ag.UnitStatus', // 经济商铺状态
                'Ls.Ag.Vacancy', // 招商商铺状态
                'Ls.Ag.ImUnitType', // 商铺类别
                'Ls.Ag.ReceptionSatisfaction', // 满意度
                'Ls.Ag.Position', // 品牌定位
                'Ls.Ag.BrandType', // 经营方式
                'Ls.Ag.AgentType', // 渠道类型
                'Ls.Ag.CateringType', // 餐饮条件
                'Ls.Ag.DecoRate', // 装修
                'Ls.Ag.BookState', // 反馈状态
                'Ls.Ag.ShopNature', // 店铺性质
                'Ls.Ag.BookPeopleRelation', // 报备人关系
                'Ls.Ag.ProjectBelongType' // 项目所属类别
            ]
        }
        GetItems(params).then(res => {
            if (res.Status == 200) {
                globalData.windowData.GetItemsData = res.Data;
                BookMenus({}).then(res => { // 获取渠道的词典数据
                    if (res.Data.length>0) {
                        console.log(res.Data[0])
                        for (let val in res.Data[0]) {
                            if (val == "BkType") globalData.windowData.GetItemsData["Ls.Ag.BookType"] = res.Data[0][val];
                            if (val == "BkSorue") globalData.windowData.GetItemsData["Ls.Ag.BookSource"] = res.Data[0][val];
                            if (val == "BkStatus") globalData.windowData.GetItemsData["Ls.Ag.BookStatus"] = res.Data[0][val];
                        }
                        globalData.windowData.GetItemsData["Ls.Ag.BookType"].push({
                            ItemName: "我要开店",
                            ItemValue: "2"
                        }, {
                            ItemName: "我有推荐",
                            ItemValue: "3"
                        })
                    }
                })
                ReceptionMenus({}).then(res => {
                    globalData.windowData.GetItemsData["Ls.Ag.ReceptionType"] = res.Data.ReceptionType;
                })
                console.log(globalData.windowData.GetItemsData);
            }
        })
    },
    onHide: function() {
        // console.log('App Hide');
    }
};
</script>

<style lang="scss">
    @import url("/static/animate.wxss");
	/*common-css*/
	.ellipsis {
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    word-wrap: normal;
	}
    /* 超出一行就显示... */
    .lineEllips1 {
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .lineEllips2 {
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
	.clearfix:after {
	    visibility: hidden;
	    display: block;
	    height: 0;
	    font-size: 0;
	    content: "";
	    clear: both;
	}
    textarea {
        height: 80px !important;
    }
	.fl {
	    float: left;
	}
	.fr {
	    float: right;
	}
	.tc {
	    text-align: center;
	}
	.tr {
	    text-align: right;
	}
	.tl {
	    text-align: left;
	}
	.rel {
	    position: relative;
	}
	.abs {
	    position: absolute;
	}
	.fix {
	    position: fixed;
	}
	.bold {
	    font-weight: bold;
	}
	.block {
	    display: block;
	}
	.inline {
	    display: inline;
	}
	.inlineBlock {
	    display: inline-block;
	}
	.none {
	    display: none;
	}
	.overflow {
	    overflow: hidden;
	}
    .overflowYA {
        overflow-y: auto;
    }
    .overflowXA {
        flex-direction: row;
        display: flex;
        overflow-y: hidden;
    }
	
	/*font-szie*/
	.fs10 {
	    font-size: 10px;
	}
	.fs12 {
	    font-size: 12px;
	}
	.fs14 {
	    font-size: 14px;
	}
	.fs16 {
	    font-size: 16px;
	}
	.fs18 {
	    font-size: 18px;
	}
	.fs20 {
	    font-size: 20px;
	}
	.fs22 {
	    font-size: 22px;
	}
	.fs24 {
	    font-size: 24px;
	}
	.fs26 {
	    font-size: 26px;
	}
	/*color*/
	.cBlue {
	    color: #1989fa;
	}
	.cRed {
	    color: #ee0a24;
	}
	.cGreen {
	    color: #07c160;
	}
	.cOrange {
	    color: #ff976a;
	}
	.cWhite {
	    color: #fff;
	}
	.c3 {
	    color: #333;
	}
	.c6 {
	    color: #666;
	}
	.c9 {
	    color: #999;
	}
    .c32 {
        color: #323233;
    }
    .c1c{
        color: #1c1c1c;
    }
	
	/*background-color*/
	.bgCW {
	    background-color: #fff;
	}
	
	.bgCBlue {
	    background-color: #1989fa;
	}
	
	.bgCRed {
	    background-color: #ee0a24;
	}
	
	.bgCGreen {
	    background-color: #07c160;
	}
    .bgF5 {
        background-color: #f7f7f7;
    }
	
	.bgCOrange {
	    background-color: #ff976a;
	}
    .bgEEE {
        background-color: #eeeeee;
    }
    .bgEBE {
        background-color: #ebedf0;
    }
	/*padding*/
	.p8 {
	    padding: 8px;
	}
	.pt4 {
	    padding-top: 4px;
	}
	.pt8 {
	    padding-top: 8px;
	}
	.pr4 {
	    padding-right: 4px;
	}
	.pr8 {
	    padding-right: 8px;
	}
	.pb4 {
	    padding-bottom: 4px;
	}
	.pb8 {
	    padding-bottom: 10px;
	}
	.pl4 {
	    padding-left: 4px;
	}
	.pl8 {
	    padding-left: 8px;
	}
    .ml10 {
        margin-left: 10px;
    }
    .p20 {
        padding: 20rpx;
    }
    .p30 {
        padding: 30rpx;
    }
    .p10_15{
        padding: 10px 15px;
    }
	/*margin*/
	.m8 {
	    margin: 8px;
	}
	.mt4 {
	    margin-top: 4px;
	}
	.mt8 {
	    margin-top: 8px;
	}
	.mt12 {
	    margin-top: 12px;
	}
    .mr10 {
        margin-right: 10rpx;
    }
	.mt16 {
	    margin-top: 16px;
	}
	.mr4 {
	    margin-right: 4px;
	}
	.mr8 {
	    margin-right: 8px;
	}
	.mb4 {
	    margin-bottom: 4px;
	}
	.mb8 {
	    margin-bottom: 8px;
	}
	.mb12 {
	    margin-bottom: 12px;
	}
	.mb16 {
	    margin-bottom: 16px;
	}
	.mb12 {
	    margin-bottom: 12px;
	}
	.ml4 {
	    margin-left: 4px;
	}
	.ml8 {
	    margin-left: 8px;
	}
	.ml12 {
	    margin-left: 12px;
	}
    .w100{
        width: 100%;
    }
    .h100{
        height: 100%;
    }
    .borBF58 {
        border-bottom: 8px solid #f5f5f5;
    }
	/*page-css*/
	.common-add-btn, .common-top-btn {
	    bottom: 20px;
	    right: 20px;
	    width: 40px;
	    height: 40px;
	    line-height: 50px;
	    border-radius: 50%;
        z-index: 99;
	    .icon {
	        font-size: 20px;
	    }
	}
    .common-top-btn {
        bottom: 70px;
    }
	.common-btn-wrap {
	    bottom: 0;
	    left: 0;
	    padding: 12px;
	    width: calc(100% - 24px);
	    border-top: 1px solid #ddd;
	    z-index: 99;
        button {
            min-width: 70px;
        }
        > div {
	        border-radius: 40px;
	        height: 34px;
	        line-height: 34px;
	        width: 100px;
	        text-align: center;
	        &:nth-of-type(2) {
	            margin-right: 12px;
	            border: 1px solid #ddd;
	        }
	    }
	}
	.common-required {
	    left: -4px;
	}
	.common-field {
	    background: #fff;
	    padding: 10px 16px;
	    .common-label {
	        width: 90px;
	        .cRed {
	            top: 0px;
	        }
	        .text {
	            padding-left: 8px;
	        }
	    }
	    .common-ipt {
	        width: calc(100% - 90px);
	    }
	}
	//  详情页更多操作
	.common-more-btn-tit {
	    border-bottom: 1px solid #f5f5f5;
	    padding: 16px 0;
	}
    .login {
        padding: 0 10%;
        .icon{
            background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAU8AAAKeCAYAAAAlR5nlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZjUyZTMzZi0zNGQ2LTQwZTItYmMwYi1mZDdhOTNiMjU4NzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDc4NjdBRjQ3RUNBMTFFOThENjRGRTc0RDY0MzA1NjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDc4NjdBRjM3RUNBMTFFOThENjRGRTc0RDY0MzA1NjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NTc5Y2EzZC1iYzgxLTRiZjEtYTUzOS00NDYxNTI0YzUxOTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MGY1MmUzM2YtMzRkNi00MGUyLWJjMGItZmQ3YTkzYjI1ODc0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4gkgngCIJ4B4AogngHgCiCcA4gkgngDiCSCeAOIJgHgCiCeAeAKIJ4B4AiCeAOIJIJ4A4gkgngCIJ4B4AogngHgCiCcA4gkgngDiCSCeAOIJgHgCiCeAeAKIJ4B4AiCeAOIJIJ4A4gkgngCIJ4B4AogngHgCiCcA4gkgngDiCSCeAOIJgHgCiCeAeAKIJ4B4AiCeAOIJIJ4A4gkgngCIJ4B4AogngHgCiCcA4gkgngDiCSCeAOIJgHgCiCeAeAKIJ4B4AiCeAOIJIJ4A4gkgngCIJ4B4AogngHgCiCeAeAIgngDiCSCeAOIJIJ4AiCeAeAKIJ4B4AognAOIJIJ4A4gkgngDiCYB4AogngHgCiCeAeAIgngDiCSCeAOIJIJ4AiCeAeAKIJ4B4AognAOIJIJ4A4gkgngDiCYB4AogngHgCiCeAeAIgngDiCSCeAOIJIJ4AiCeAeAKIJ4B4AognAOIJIJ4A4gkgngDiCYB4AogngHgCiCeAeAIgngDiCSCeAOIJIJ4AiCeAeAKIJ4B4AognAOIJIJ4A4gkgngDiCYB4AogngHgCiCeAeAIgngDiCSCeAOIJIJ4A4gmAeAKIJ4B4AogngHgCIJ4A4gkgngDiCSCeAIgngHgCiCeAeAKIJwDiCSCeAOIJIJ4A4gmAeAKIJ4B4AogngHgCIJ4A4gkgngDiCSCeAIgngHgCiCeAeAKIJwDiCSCeAOIJIJ4A4gmAeAKIJ4B4AogngHgCIJ4A4gkgngDiCSCeAIgngHgCiCeAeAKIJwDiCSCeAOIJIJ4A4gmAeAKIJ4B4AogngHgCIJ4A4gkgngDiCSCeAIgngHgCiCeAeAKIJwDiCSCeAOIJIJ4A4gmAeAKIJ4B4AogngHgCiCcA4gkgngDiCSCeAOIJgHgCiCeAeAKIJ4B4AiCeAOIJIJ4A4gkgngCIJ4B4AogngHgCiCcA4gkgngDiCSCeAOIJgHgCiCeAeAKIJ4B4AiCeAOIJIJ4A4gkgngCIJ4B4AogngHgCiCcA4gkgngDiCSCeAOIJgHgCiCeAeAKIJ4B4AiCeAOIJIJ4A/4T8PwEGAK5oMiH0NTuLAAAAAElFTkSuQmCC');
        }
    }
    .submit-wrap {
        width: 100%;
        bottom: 0;
        left: 0;
        .btn {
            width: 50%;
            height: 44px;
            line-height: 44px;
            text-align: center;
        }
    }
</style>
