function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
export function formatDay(date) {
    date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const t1 = [year, month, day].map(formatNumber).join('-')
    return `${t1}`
}
export function formatTime(date) {
    date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('-')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    return `${t1} ${t2}`
}

export default {
    formatNumber,
    formatTime,
    formatDay
}

export function nullToStr(data) {
    for (let x in data) {
        if (data[x] === null) { // 如果是null 把直接内容转为 ''
            data[x] = '';
        } else {
            if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
                data[x] = data[x].map(function (z) {
                    return nullToStr(z);
                });
            }
            if (typeof (data[x]) === 'object') { // 是json 递归继续处理
                data[x] = nullToStr(data[x])
            }
        }
    }
    return data;
}
// 校验手机号
export function checkPhone(val) {
    let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
    if (!reg.test(val)) {
    	return false;
    } else {
        return true;
    }
}
// 校验邮箱
export function checkEmail(val) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(val)) {
        return true;
    } else {
        return false;
    }
}
