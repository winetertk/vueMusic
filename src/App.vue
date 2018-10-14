<template>
  <div id="app">
    <headerBar v-show="this.$route.meta.show"></headerBar>
    <div class="loading flex" v-show="showLoading" key="1">
      <img src="./assets/images/loading.png" alt="">
      <p class="iconfont icon-locla-music">玩命加载中...</p>
    </div>
    <transition :name="transitionName">
      <router-view class="viewport" v-show="!showLoading" key="2"></router-view>
    </transition>
  </div>
</template>

<script>
import header from './components/header/header'
import { mapState } from 'vuex'
export default {
  name: 'App',
  data(){
    return{
      transitionName: 'slide-right'
    }
  },
  components:{
      headerBar: header
  },
  mounted(){
    console.log(document.getElementsByClassName('button'))
  },
  computed:{
    ...mapState({
      showLoading: state => state.showLoading
    })
  },
  watch: {
    $route(to, from) {
      document.title = to.meta.title;
      switch (to.path) {
        case '/musicPlay':
          this.transitionName = 'slide-down';
          break;
        case '/rankingDatail':
          if (from.path != '/musicPlay') {
            this.transitionName = 'slide-right';
            return
          }
          this.transitionName = 'slide-up';
          break;
        case '/musicPlay':
          this.transitionName = 'slide-down';
          break;
      
        default:
          if (from.path == '/musicPlay') {
             this.transitionName = 'slide-up';
             return
          }
          this.transitionName = 'slide-left';
          break;
      }
    }
  },
  methods: {
    test(){
      alert('VUE`s methods')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
.viewport{
  padding-top: 4rem;
}
.app-logo{
  vertical-align: middle;
  margin: 20px 10px;
}
.testStore{
  width: 100%;
  height: 150px;
  background: #e5e5e5;
  border: 1px solid #d8d8d8;
  position: absolute;
  top: 5rem;
  left: 0;
}
.testStore .player-wrap{
  position: static!important;
}
/* 过度动画 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  will-change: transform;
  transition: all .1s;
  position: absolute;
}
.loading{
        height: 100vh;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all .25s;
    }
    .loading img{
        width: 3rem;
        height: 3rem;
        border-radius: 3rem;
        animation: rotatego 3s infinite linear;
    }
    .loading p{
        font-size: 1.6rem;
        line-height: 4rem;
    }
    /* 旋转动画 */
    @-webkit-keyframes rotatego {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
