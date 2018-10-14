<template>
    <div id="header" class="header">
        <div class="bar flex">
            <span v-for="(item,index) in menu" @click="tab(item, index)" :class="'bar-item iconfont ' + item.icon" >{{item.text}}</span>
        </div>
    </div>
</template>

<style scoped>
    .header{
        background-color: #000;
        color: #b2b2b7;
        position: fixed;
        width: 100vw;
        z-index: 99;
    }
    .bar{
        padding: 1rem 0;
        justify-content: space-around;
        align-items: center;
    }
    .bar span{
        font-size: 1.6rem!important;
        position: relative;
        width: 33.3333vw;
        text-align: center; 
    }
    /* border 随光标移动方向延伸特效 */
    /* .bar-item::after{
        position: absolute;
        bottom: -1rem;
        left: 100%;
        content: '';
        display: block;
        width: 0;
        height: 100%;
        border-bottom: 2px solid #29b672;
        transition: all .25s linear;
    }
    .bar-item:hover::after{
        width: 100%;
        left: 0;
    }
    .bar-item:hover ~ .bar-item::after {
        left: 0;
    }
    .bar-item:active{
        color: #29b672;
    } */
    /* border 中心向两边延伸 */
    /* .bar-item::after, .bar-item::before{
        position: absolute;
        bottom: -1rem;
        content: '';
        width: 0;
        height: 100%;
        border-bottom: 2px solid #29b672;
        transition: all .25s;
    }
    .bar-item::before{
        right: 45%;
    }
    .bar-item::after{
        left: 45%;
    }
    .bar-item:hover::before, .bar-item:hover::after{
        width: 50%;
    }*/
    .bar .iconfont:before{
        display: inline-block;
        font-size: 1.4rem;
        vertical-align: middle;
        margin-right: 0.5rem;
    }
    .active-bar{
        color: #29b672;
    }
</style>
<script>
export default {
    data(){
        return{
            menu: [
                {
                    pushUrl: '/Recommend',
                    text: '推荐',
                    icon: 'icon-locla-music'
                },
                {
                    pushUrl: '/rankingList',
                    text: '排行榜',
                    icon: 'icon-ranking-list'
                },
                {
                    pushUrl: '/search',
                    text: '搜索',
                    icon: 'icon-search'
                },
            ]
        }
    },
    mounted(){
        this.$nextTick(function(){
            var routeIndex = localStorage.getItem('routeIndex');
            switch (routeIndex) {
                case 'search':
                    this.changeActivebar(2);
                    break;
                case 'rankingList':
                    this.changeActivebar(1);
                    break;
                case 'Recommend':
                    this.changeActivebar(0);
                    break;
                default:
                    break;
            }
            
        })
    },
    methods: {
        tab(item, i){
            var e = event;
            this.$router.push(item.pushUrl);
        },
        changeActivebar(index){
            var barItem = document.getElementsByClassName('bar-item');
            for (let i = 0; i < barItem.length; i++) {
                if (barItem[i].classList.contains('active-bar')) barItem[i].classList.remove('active-bar'); 
            }
            barItem[index].classList.add('active-bar');
        }
    },
    watch: {
        $route(to, from) {
            switch(to.path){
                case '/search':
                    localStorage.setItem('routeIndex', 'search');
                    this.changeActivebar(2);
                    break;
                case '/rankingList':
                    localStorage.setItem('routeIndex', 'rankingList');
                    this.changeActivebar(1);
                    break;
                case '/Recommend':
                    localStorage.setItem('routeIndex', 'Recommend');
                    this.changeActivebar(0);
                    break;
                default:
                    break;
            }
        }
    }

}
</script>
