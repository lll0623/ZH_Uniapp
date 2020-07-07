<template>
    <div class="addDynamic-wrapper">
        <van-cell-group>
            <van-field :value="value"
                       required
                       clearable
                       label="项目名称"
                       placeholder="请输入项目名称" />
            <van-field :value="value"
                       required
                       clearable
                       label="项目状态"
                       placeholder="" />
            <van-field :value="value"
                       required
                       clearable
                       label="项目类型"
                       placeholder="" />
            <van-field :value="value"
                       required
                       clearable
                       label="建筑面积(m²)"
                       placeholder="" />
            <van-field :value="value"
                       required
                       clearable
                       label="均价(元/m²·天)"
                       placeholder="" />
            <van-field :value="value"
                       required
                       clearable
                       label="省市区"
                       placeholder="" />
            <van-field :value="value"
                       required
                       clearable
                       label="详细地址"
                       placeholder="" />
            <van-field :value="value"
                       required
                       clearable
                       label="推荐业态"
                       placeholder="" />  
            <van-field :value="value"
                       required
                       clearable
                       type="textarea"
                       label="项目介绍"
                       placeholder="请输入项目介绍"
                       autosize="true" />
        </van-cell-group>
        <div class="submit">
            <van-button block
                        type="info"
                        size="normal">提交</van-button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            value: null
        }
    },
    methods: {}
}
</script>
<style lang='scss'>
.addDynamic-wrapper {
    .submit {
        margin: 16px;
    }
}
</style>
