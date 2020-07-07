const filter = {
    formatMoney: function (s, n) {
        n = n > -1 && n <= 20 ? n : 2;
        if (s == null || s == undefined || s == "" || s == 0 || s == NaN) {
            return (0).toFixed(n);
        } else {
            var fuhao = "";
            if (s < 0) {
                s = Math.abs(s);
                fuhao = "-";
            }
            // 判断是否有逗号
            if (s.toString().indexOf(",") != -1) {
                var res = new RegExp(",", "g"); // 定义正则表达式
                // 第一个参数是要替换掉的内容，第二个参数"g"表示替换全部（global）。
                s = Number(s.replace(res, "")); // 第一个参数是正则表达式。
            }
            if (n == 0) {
                s = String(Math.round(s));
            } else {
                s = String(Number(s).toFixed(n));
            }
            var re = /(-?\d+)(\d{3})/;
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1] ? s.split(".")[1] : "";
            var t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            if (r == "") {
                return fuhao + t.split("").reverse().join("");
            } else {
                return fuhao + t.split("").reverse().join("") + "." + r;
            }
        }
    },
    GetItemsFilter: function(val, arg1, data) { // 词典匹配枚举
        let ItemName = '-';
        if(Number(val)>-1) {
            if(!!data[arg1] && data[arg1].length > 0) {
                data[arg1].forEach(res => {
                    if(Number(res.ItemValue) == val) {
                        ItemName = res.ItemName;
                    }
                })
            }
        }
        return ItemName;
    },
    formatDay: function(date) {
        date = new Date(date);
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const t1 = [year, month, day].map(formatNumber).join('-')
        return `${t1}`
    },
    formatTime: function (date) {
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
    },
    // 得到本周、上周、下周的起始、结束日期
    // type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
    // dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
    getMonday: function (type, dates) {
        let now = new Date();
        let nowTime = now.getTime();
        let day = now.getDay();
        let longTime = 24 * 60 * 60 * 1000;
        let n = longTime * 7 * (dates || 0);
        let dd = "";
        if (type == "s") {
            dd = nowTime - (day - 1) * longTime + n;
        };
        if (type == "e") {
            dd = nowTime + (7 - day) * longTime + n;
        };
        dd = new Date(dd);
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1;
        let d = dd.getDate();
        m = m < 10 ? "0" + m: m;
        d = d < 10 ? "0" + d: d;
        day = y + "-" + m + "-" + d;
        return day;
    },
    // 得到本月、上月、下月的起始、结束日期
    // type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
    // months为数字类型，不传或0代表本月，-1代表上月，1代表下月
    getMonth: function (type, months) {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (Math.abs(months) > 12) {
            months = months % 12;
        };
        if (months != 0) {
            if (month + months > 12) {
                year++;
                month = (month + months) % 12;
            } else if (month + months < 1) {
                year--;
                month = 12 + month + months;
            } else {
                month = month + months;
            };
        };
        month = month < 10 ? "0" + month: month;
        var date = d.getDate();
        var firstday = year + "-" + month + "-" + "01";
        var lastday = "";
        if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
            lastday = year + "-" + month + "-" + 31;
        } else if (month == "02") {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
                lastday = year + "-" + month + "-" + 29;
            } else {
                lastday = year + "-" + month + "-" + 28;
            };
        } else {
            lastday = year + "-" + month + "-" + 30;
        };
        var day = "";
        if (type == "s") {
            day = firstday;
        } else {
            day = lastday;
        };
        return day;
    },
    // 得到今年、去年、明年的开始、结束日期
    // type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
    // dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
    getYear: function (type, dates) {
        var dd = new Date();
        var n = dates || 0;
        var year = dd.getFullYear() + Number(n);
        if (type == "s") {
            var day = year + "-01-01";
        };
        if (type == "e") {
            var day = year + "-12-31";
        };
        if (!type) {
            var day = year + "-01-01/" + year + "-12-31";
        };
        return day;
    }
}
function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
export default filter;
