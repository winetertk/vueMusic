<template>
    <div id="welcome" class="welcome">
        <img src="../../assets/images/default.png" alt="" width="80">
        <span>Welcome to Music world</span>
        <p @click="go">立即体验</p>
    </div>
</template>

<style scoped="scoped">
    .welcome{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #222;
        color: #fff;
        position: relative;
    }
    img{
        border-radius: 80px; 
    }
    span{
        margin: 1.5rem;
        font-size: 2rem;
    }
    p{
        position: absolute;
        width: 90%;
        border-radius: 4px;
        text-align: center;
        font-size: 1.6rem;
        bottom: 2rem;
        line-height: 4rem;
        background-color: #2196f3;
        color: #fff;
        justify-content: flex-end;
    }
</style>

<script>
export default {
    mounted(){
        document.getElementById('welcome').style.height = document.documentElement.clientHeight + 'px';
    },
    methods:{
        go(){
            this.$router.replace('/Recommend')
        }
    }
};
</script>
