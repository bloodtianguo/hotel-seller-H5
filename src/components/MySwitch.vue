<template>
    <div class="content" @click="handle" :class="{stop:!isTrue}">
        <div class="spot" :class="{'stop-spot':!isTrue}"></div>
    </div>
</template>

<script>
export default {
    name:'mySwitch',
    data(){
        return{
            // isTrue:false
        }
    },
    computed:{
        isTrue(){
            return this.$store.state.aiduoStatus
        },
    },
    methods:{
        handle(){
            this.$store.commit('setAiduoStatus',!this.isTrue)
        }
    }
}
</script>

<style lang="less" scoped>
.content{
    position: relative;
    width: 36px;
    height: 18px;
    border: 2px solid #292BFE;
    border-radius: 18px;
    cursor: pointer;
    transition:all .3s ease;
    .spot{
        position: absolute;
        top: 50%;
        right: 2px;
        transform: translateY(-50%);
        
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #292BFE;
        transition:all .3s ease;

    }
}
.stop{
    border: 2px solid gray;
    
}
.stop-spot{
    background-color: gray !important;
    right: 20px !important;
}
</style>