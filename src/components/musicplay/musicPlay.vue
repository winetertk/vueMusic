<template>
    <div class="play-page" id="playPage">
        <div class="modal" v-if="haveSong" :style="'background-image:url(' + 'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+ currentSong.albummid +'.jpg?max_age=2592000' + ');'"></div>
        <div class="modal" v-else></div>
        <header class="font-size14 text-hide">
            <p class="song-name text-hide">{{currentSong.songname}}
                <!-- <span class="font-size12">{{currentSong.albumname}}</span> -->
            </p>
            <span v-for="(item, index) in currentSong.singer" class="singer font-size12" :key="index">
                <span v-if="index == (currentSong.singer.length-1)">{{item.name}}</span>
                <span v-else>{{item.name}}、</span>
            </span>
        </header>
        <div class="player-cont">
            <div class="song" @click="lyric">
                <img src="../../assets/images/ic_needle.png" alt="" class="img-mark" :class="{'pause': !playing}">
                <div class="song-img-wrap">
                    <div class="song-img" :class="{'playing': playing}">
                        <img :src="currentSong.albummid ? 'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+ currentSong.albummid +'.jpg?max_age=2592000' : require('../../assets/images/default.png')" alt="" width="100">
                    </div>
                </div>
                <div class="cont-tools flex dsn">
                    <span class="iconfont icon-download"></span>
                    <span class="iconfont icon-concern"></span>
                    <span class="iconfont icon-detail"></span>
                </div>
                <div class="cur-lyric font-size14">{{lyricCont}}</div>
            </div>

            <div class="lyric" @click="lyric">
                <p v-for="(item,index) in lyricArr" v-if="item" :data-time="lyricIndex[index]" :key="index">{{item}}</p>
            </div>
        </div>

        <div class="play-tools flex-r">
            <div class="time-line flex">
                <span class="curTime">00:00</span>
                <div class="line-wrap">
                    <hr class="line">
                </div>
                <span>{{formatMinute(currentSong.interval)}}</span>
            </div>
            <div class="play-btn">
                <span class="iconfont icon-prev" @click="nextPlay('prev')"></span>
                <span class="iconfont icon-playb" :class="{'icon-pause': playing}" @click="changePlay"></span>
                <span class="iconfont icon-next" @click="nextPlay('next')"></span>
            </div>
        </div>
        <footerBar ref="footer" class="dsn"></footerBar>
    </div>
</template>

<script>
    import footer from '../footer/footer'
    import store from '../store/store.js'
    import Velocity from 'velocity-animate'
    export default {
        data() {
            return {
                haveSong: false, // 缓存是否有歌曲
                playing: false,  // 是否处于播放状态
                timer: '',  // 进度定时器
                index: '',
                lyricArr: [],    // 歌词数组
                lyricIndex: [],  // 歌词时间数组
                index_lyric: 0,   // 下一句歌词序号
                lyricCont: ''
            }
        },
        components:{
            footerBar: footer
        },
        created(){
            var _this = this;
            if (localStorage.songInfor) _this.haveSong = true;
        },
        mounted(){
            var _this = this;
            var player = document.getElementsByClassName('play-tools')[0];
            Velocity(player, {
                'bottom': 0,
                'opacity': 1
            }, {
                easing: 'swing',
                duration: 400
            })
            var line = document.getElementsByClassName('line')[0];
            var curTime = document.getElementsByClassName('curTime')[0];
            // 初始化播放状态
            var audio = document.getElementById("audioB");
            if (audio && !audio.paused) {
                _this.playing = true;
            }
            if (audio) {
                line.style.width = audio.currentTime / _this.currentSong.interval * 100 + "%";
            }
            if (_this.playing) {
                _this.timer = setInterval(function(){
                    var curt = audio.currentTime;
                    line.style.width = curt / _this.currentSong.interval * 100 + "%";
                    curTime.innerHTML = _this.formatMinute(curt)
                }, 1000)
            }
        },
        // 实时监听当前播放歌曲
        computed:{
            currentSong(){
                return  store.state.songInfor//返回store实例的currentSong状态
            },
            currentLyric(){
                return store.state.currentTime
            }
        },
        watch: {
           currentSong(val, _val) {
               var _this = this;
               // 获取歌词
               _this.getLyric();
               // 初始化歌词
               var lyric = document.getElementsByClassName('lyric')[0];
               var p = lyric.getElementsByTagName('p');
               if (p[0]) {
                    _this.index_lyric = 0;
                    for (let index = 0; index < p.length; index++) {
                        p[index].classList.remove('currentIndex');
                    }
                    p[0].classList.add('currentIndex');
                    _this.lyricCont = _this.lyricArr[0];
               }
               
           },
           // 歌词高亮
           currentLyric(val, _val) {
                var _this = this;
                var lyric = document.getElementsByClassName('lyric')[0];
                var p = lyric.getElementsByTagName('p');
                // 歌词最后一句
                if (_this.index_lyric == p.length) {
                    return
                }
                // 添加高亮效果
                for (let index = 0; index < p.length; index++) {
                    if (val == p[_this.index_lyric].getAttribute('data-time')) {
                        p[index].classList.remove('currentIndex');
                    }
                    var pTime = p[index].getAttribute('data-time')
                    if (pTime == val) {
                        p[index].classList.add('currentIndex');
                        _this.lyricCont = _this.lyricArr[index];
                        _this.index_lyric = index+1;
                    }
                }
            }
        },
        methods:{
            // 播放/暂停
            changePlay(){
                var _this = this;
                var audio = document.getElementById("audioB");
                if (audio) {
                    if (audio.paused) {
                        _this.playing = true;
                        audio.play();
                        return
                    } else {
                        _this.playing = false;
                        audio.pause();
                    }
                }else {
                    if (localStorage.songInfor) {
                        _this.$refs.footer.play(_this.currentSong, 'list');
                        _this.initPlay();
                        return
                    }

                    this.$toast({
                        message: '播放列表里面没有歌曲',
                        position: 'middle',
                        duration: 1500
                    })
                    
                }
                

                
            },
            // 歌词显示/隐藏
            lyric(){
                var e = event || window.event;
                var lyric = document.getElementsByClassName('lyric')[0];
                if (e.currentTarget.className == 'song') {
                    e.currentTarget.classList.add('rotate');
                    var curIndex = document.getElementsByClassName('currentIndex')[0];
                    if (curIndex) {
                        var curScroll = curIndex.offsetTop;   
                        lyric.scrollTop = curScroll - lyric.offsetHeight/2;
                    }
                    Velocity(lyric, {
                        'right': 0,
                        'opacity': 1,
                        'background-color': 'rgba(0,0,0,0.5)'
                    }, {
                        easing: 'swing',
                        duration: 250,
                    })
                } else {
                    Velocity(lyric, {
                        'right': '-50%',
                        'opacity': 0,
                        'background-color': 'rgba(0,0,0,0)'
                    }, {
                        easing: 'swing',
                        duration: 250,
                    })
                    document.getElementsByClassName('rotate')[0].classList.remove('rotate');
                }
            },
            // 格式化时间
            formatMinute(time){
                var min;
                var sec;
                if (time) {
                    min = Math.floor(time/60)==0 ? '00': '0'+Math.floor(time/60);
                    sec = Math.floor(time%60)<10 ? '0' + Math.floor(time%60) : Math.floor(time%60);
                } else {
                    min = '00';
                    sec = '00'
                }
                return min + ':' + sec
            },
            // 下一首
            nextPlay(type){
                var _this = this;
                if(localStorage.songInfor) {
                    this.$refs.footer.nextPlay(type);
                    var listSong = JSON.parse(localStorage.getItem('listSong'));
                    _this.getsongIndex();
                    if (_this.index != listSong.length-1) {
                        this.initPlay();
                    }
                    return
                }

                this.$toast({
                    message: '播放列表里面没有歌曲',
                    position: 'middle',
                    duration: 1500
                })
                
            },
            // 初始化播放
            initPlay(){
                var _this = this;
                _this.playing = true;
                clearInterval(_this.timer);
                var line = document.getElementsByClassName('line')[0];
                var curTime = document.getElementsByClassName('curTime')[0];
                var flag = true;
                _this.timer = setInterval(function(){   
                    var audio = document.getElementById("audioB");
                    var curt = audio.currentTime;
                    line.style.width = curt / _this.currentSong.interval * 100 + "%";
                    curTime.innerHTML = _this.formatMinute(curt);
                }, 1000)
            },
            // 获取当前播放歌曲序号
            getsongIndex(){
                var _this = this;
                var listSong = JSON.parse(localStorage.getItem('listSong'));
                var song = _this.$store.state.songInfor;
                for (let index = 0; index < listSong.length; index++) {
                    if (listSong[index].songmid == song.songmid) {
                        _this.index = index
                        break;
                    }
                }
            },
            // 获取当前歌曲歌词
            getLyric() {
                var _this = this;
                _this.$store.state.showLoading = false;
                _this.$axios.get('/qqmusic/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1494070301711&songmid='+ _this.currentSong.songmid +'&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0')
                .then(res => {
                    // 处理返回的歌词数据
                    var data = JSON.parse(res.data.replace(/MusicJsonCallback_lrc\((.*)\)/, '$1'));
                    var lyric = decodeURIComponent(escape(window.atob(data.lyric)));
                    var lyricArr = lyric.split('\n');
                    lyricArr.splice(0, 5)
                    var lyricIndex = [];
                    var regex2 = /\[(.+?)\]/g;
                    for (let index = 0; index < lyricArr.length; index++) {
                        if (lyricArr[index].match(/[0-9]+:[0-9][0-9].[0-9][0-9]/))
                           lyricIndex[index] = lyricArr[index].match(/[0-9]+:[0-9][0-9].[0-9][0-9]/)[0].slice(0, -3); 
                        lyricArr[index] = lyricArr[index].replace(/\[.*\]/,'');
                    }
                    _this.lyricArr = lyricArr;
                    _this.lyricIndex = lyricIndex;
                })
            }
        },
        
        beforeRouteLeave (to, from, next) {
            var _this = this;
            clearInterval(_this.timer);
            next()
        }
    }
</script>

<style scoped>
    .play-page{
        position: relative;
        height: 100vh;
        overflow: hidden;
        padding: 0;
        color: #f5f5f5;
    }
    .modal{
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        -webkit-filter: blur(30px);
        height: 100vh;
        width: 100vw;
        z-index: -1;
        background-color: #666;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    header, .play-cont, .play-tools{
        margin: 0 auto;
    }
    header{
        width: 95vw;
        padding: 1rem;
        border-bottom: 1px solid #999;
        text-align: center;
        font-size: 1.6rem;
    }
    header p{
        max-width: 100vw;
    }
    header span{
        color: #d0d0d0;
    }
    .player-cont{
        height: 70vh;
        text-align: center;
        overflow: hidden;
        position: relative;
        perspective: 800px;
    }
    .song{
        transition: all .25s;
        height: 100%;
    }
    .rotate{
        transform: rotateY(-90deg);
    }
    .img-mark{
        position: absolute;
        top: -2.1vh;
        left: 45%;
        z-index: 2;
        height: 28vh;
        transform-origin: 20% 10%;
        transition: all .5s;
    }
    .pause{
        transform: rotate(-25deg);
    }
    .song-img-wrap{
        position: absolute;
        top: 21%;
        z-index: 1;
        width: 70vw;
        height: 70vw;
        border-radius: 70vw;
        overflow: hidden;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
    }
    .song-img{
        width: 70vw;
        height: 70vw;
        border-radius: 70vw;
        background-color: #222;
        line-height: 70vw;
    }
    .song-img img{
        width: 43vw;
        height: 43vw;
        border-radius: 43vw;
        box-shadow: 0 0 1.5rem #000;
    }
    .song-img::before, .song-img::after{
        display: block;
        content: '';
        width: 10vw;
        height: 4vw;
        position: absolute;
        transform: rotate(33deg);
        background: #fff;
        -webkit-filter: blur(17px);
    }
    .song-img::before{
        top: 17vw;
        left: 5vw;
    }
    .song-img::after{
        bottom: 17vw;
        right: 5vw;
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
    .playing {
        animation: rotatego 10s infinite linear;
    }
    .play-tools{
        width: 100vw;
        position: absolute;
        bottom: 0;
        padding: 2rem 1rem;
        height: 20vh;
        line-height: 7vh;
        bottom: -50%;
        opacity: 0;
    }
    .cont-tools{
        position: absolute;
        bottom: 2rem;
        justify-content: space-around;
        width: 100%;
    }
    .cur-lyric{
        position: absolute;
        bottom: 1.5rem;
        line-height: 4rem;
        text-align: center;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 1rem;
        color: #d0d0d0;
        transition: all .25s;
        background-color: rgba(0,0,0,0.3)
    }
    .time-line{
        justify-content: space-between;
        align-items: center;
    }
    .line-wrap{
        position: relative;
        width: 100%;
        margin: 0 0.5rem;
        background-color: #222;
        height: 1px;
        border-radius: 2px;
        box-shadow: 0 1px 1px #666;
    }
    .line{
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        vertical-align: middle;
        background-color: #fff;
        width: 0;
    }
    .line:after{
        content: '';
        display: block;
        position: absolute;
        top: -5px;
        right: -5px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background-color: #fff;
    }
    .play-btn{
        text-align: center;
        letter-spacing: 5vw;
    }
    .play-btn span{
        font-size: 4rem;
    }
    .lyric{
        position: absolute;
        top: 0;
        right: -50%;
        width: 100%;
        height: 100%;
        overflow: hidden;
        overflow-y: scroll;
        z-index: -1;
        background-color: rgba(0,0,0,0.5);
        padding: .5rem;
        opacity: 0;
    }
    .lyric p{
        text-align: center;
        height: auto;
        line-height: 3rem;
        font-size: 1.4rem;
        color: #bbb;
        letter-spacing: .1rem;
        transition: all .25s;
    }
    p.currentIndex{
        color: #29b672;
        font-size: 1.6rem;
        padding: 0 1rem;
    }
</style>
