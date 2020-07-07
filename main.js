import Vue from 'vue';
import App from './App';
import global from './utils/global';
import filter from './utils/filter'
Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();
Vue.prototype.globalData = global;
// 全局的过滤器
for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
        const element = filter[key]
        Vue.filter(key, element)
    }
}
