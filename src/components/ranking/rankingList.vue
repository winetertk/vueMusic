<template>
    <div class="ranking">
        <ul>
            <li v-for="(item, index) in topList" class="list-item flex" @click="go(item.id)" v-if="item.id !=201">
                <div class="list-img">
                    <img :src="item.picUrl || require('../../assets/images/default.png')" alt="加载中..." width="100">
                    <span class="iconfont icon-play">{{(item.listenCount/10000).toFixed(1)}}万</span>
                </div>
                
                <div class="list-infor">
                    <h2 class="list-title font-size15">{{item.topTitle}}</h2>
                    <p v-for="(song,i) in item.songList" class="text-hide">
                        <span class="color-808080 font-size16">{{i+1}}</span>
                        <span class="font-size14">{{song.songname}}</span>
                        <span class="font-size12 color-808080"> -{{song.singername}}</span>
                    </p>
                </div>
                <i class="more"></i>
            </li>
        </ul>
        <footerBar ref="footer"></footerBar>
    </div>
</template>

<style scoped>
    h2{
        color: #555;
    }
    .ranking{
        height: 100vh;
    }
    ul{
        padding: 1rem 0;
        background-color: #f5f5f5;
        padding-bottom: 7rem;
    }
    .list-item{
        position: relative;
        justify-content: flex-start;
        flex-wrap: nowrap;
        margin-bottom: 1rem;
        padding: 0 1rem;
        box-shadow: 0 1rem 1rem #e5e5e5;
        border-top: 1px solid #e5e5e5;
    }
    .list-img{
        position: relative;
        width: 100px;
        height: 100px;
        overflow: hidden;
        margin-right: 1rem;
        flex: 0 0 auto;
    }
    .list-img span{
        position: absolute;
        bottom: 5%;
        left: 8%;
        font-size: 1rem;
        color: #b2b2b2;
        z-index: 3;
    }
    .list-img .iconfont:before{
        margin-right: 0.3rem;
    }
    .list-img::after{
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.3);
        z-index: 2;
    }
    .list-infor p{
        line-height: 2rem;
    }
    .list-infor{
        white-space: nowrap;
        margin-right: 2rem;
        overflow: hidden;
        flex: 0 1 auto;
        padding: 0.3rem 0;
    }
    .more{
        position: absolute;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border-right: 1px solid #808080;
        border-bottom: 1px solid #808080;
        transform: rotate(-45deg);
        top: 40%;
        right: 1.2rem;
    }
</style>

<script>
import footer from '../footer/footer'
import store from '../store/store.js'
export default {
    data(){
        return{
            topList:[],
        }
    },
    created(){
        this.$axios.get('/qqmusic/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1899276512&uin=1105632073&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1533712909308')
        .then(res => {
            this.topList = res.data.data.topList;
        })
    },
    mounted() {
        var _this = this;
    },
    components:{
        footerBar: footer
    },
    methods: {
        go(id){
            this.$router.push({name: 'rankingDatail', params: {'id': id}})
        }
    }
}
</script>
