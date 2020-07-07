// let windowData = { // 默认
//     GetItemsData: [], // 词典数据
//     AreaList: {}, // 省市区地址
//     Token: wx.getStorageSync("Token") || '',
//     TouristToken: wx.getStorageSync("TouristToken") || '',
//     Phone: wx.getStorageSync("Phone") || '',
//     TouristPhone: wx.getStorageSync("TouristPhone") || '',
//     Name: wx.getStorageSync("Name") || '',
//     TouristName: wx.getStorageSync("TouristName") || '',
//     HeadPic: wx.getStorageSync("HeadPic") || '',
//     TouristHeadPic: wx.getStorageSync("TouristHeadPic") || '',
//     WorkerId: wx.getStorageSync("WorkerId") || '',
//     isTourist: false,
//     preToken: '',
//     LsCustMode: '2',
//     CmpCode: 'V9Base',
//     LsAppCode: 'Ls.WxApp.TangRecords', // Ls.WxApp.WeiXiu
//     ImgUrl: 'http://devimg.mfzhaopu.com',
//     Host: 'https://websvrapi2.mfzhaopu.com' // 接口域名地址
// };
let windowData = { // 棱度
    GetItemsData: [], // 词典数据
    AreaList: {}, // 省市区地址
    Token: wx.getStorageSync("Token") || '',
    TouristToken: wx.getStorageSync("TouristToken") || '',
    Phone: wx.getStorageSync("Phone") || '',
    TouristPhone: wx.getStorageSync("TouristPhone") || '',
    Name: wx.getStorageSync("Name") || '',
    TouristName: wx.getStorageSync("TouristName") || '',
    HeadPic: wx.getStorageSync("HeadPic") || '',
    TouristHeadPic: wx.getStorageSync("TouristHeadPic") || '',
    WorkerId: wx.getStorageSync("WorkerId") || '',
    isTourist: false,
    preToken: '',
    LsCustMode: '2',
    CmpCode: 'shtr',
    LsAppCode: 'Ls.WxApp.LengDu', // Ls.WxApp.WeiXiu
    ImgUrl: 'http://image.guanhaigroup.com',
    Host: 'https://websvrapi.guanhaigroup.com' // 接口域名地址
};
export default {
    windowData
};
