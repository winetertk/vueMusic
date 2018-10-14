<template>
    <!-- 底部播放器 -->
    <div class="player-wrap">
        <div class="play-layer" @click="go">
            <div class="process"></div>
            
            <div class="player-modal" :style="count.albummid? 'background-image:url(' + 'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+ count.albummid +'.jpg?max_age=2592000' + ');' : ''"></div>
            <div class="mini-player flex">
                <div class="mini-player-l flex">
                    <span class="btn player-btn iconfont icon-playb" :class="{'icon-pause': playing}" @click.stop="checkPlay"></span>
                    <div class="player-img" :class="{'playing': playing}">
                        <img :src="count.albummid ? 'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+ count.albummid +'.jpg?max_age=2592000' : require('../../assets/images/default.png')" alt="" width="60">
                    </div>
                    <div class="song-Infor text-l line-height2">
                        <p class="font-size16 text-hide">{{count.songname}}
                            <i class="color-808080 font-size12">{{count.albumname}}</i>
                        </p>
                        <p class="font-size12 color-666666 text-hide">
                            <span v-for="(item, index) in count.singer" :key="index">
                                <span v-if="index == (count.singer.length-1)">{{item.name}}</span>
                                <span v-else>{{item.name}}、</span>
                            </span>
                        </p>
                        <!-- <p>{{curTime || '--'}} | {{this.formatMinute(count.interval)}}</p> -->
                    </div>
                </div>

                <div class="player-btn">
                    <span class="btn player-list-btn iconfont icon-next" @click.stop="nextPlay('next')"></span>
                    <span class="btn player-list-btn iconfont icon-one-loop" @click.stop="setLoopway" v-if="this.$store.state.oneLoop"></span>
                    <span class="btn player-list-btn iconfont icon-list-loop" @click.stop="setLoopway" v-else></span>
                    <span class="btn player-list-btn iconfont icon-play-list" @click.stop.stop="listShow = !listShow"></span>
                </div>
            </div>
        </div>
        
        <!-- 播放列表 -->
        <div class="play-list font-size13" v-show="listShow">
            <div class="list-nav font-size14 flex">
                <span>播放列表（{{listSong.length}}首）</span>
                <img src="../../assets/images/delete.png" alt="图片加载失败" width="20" @click="deletPlaylisy('all')">
            </div>
            <ul v-show="!noSong">
                <li v-for="(item,index) in listSong" class="flex" :class="{'cur-song': item.songmid == count.songmid}" @click.stop="play(item, 'list')" :key="index">
                    <span class="text-hide">{{item.songname}}
                        <span class="singer-all font-size12" v-for="(singer,i) in item.singer" :key="i">
                            <span v-if="i == item.singer.length-1">{{singer.name}}</span>
                            <span v-else>{{singer.name}}、</span>
                        </span>
                    </span>
                    <span class="btn" @click.stop="deletPlaylisy('oneDelete', index)">+</span>
                </li>
            </ul>
            <ul v-show="noSong" class="no-song font-size16">
                <li>播放列表暂无歌曲</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    li.cur-song, li.cur-song span, li.cur-song i{
        transition: all .25s;
        color: #29b672;
    }
    .player-wrap {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 8rem;
        color: #fff;
        z-index: 99;
    }
    .play-list{
        position: absolute;
        top: -24rem;
        right: 0.1rem;
        height: 25rem;
        width: 20rem;
        overflow: auto;
        background: rgba(0,0,0,0.6);
        transition: all .25s;
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
    }
    .play-list ul{
        margin-top: 4rem;
    }
    .list-nav{
        position: fixed;
        width: 20rem;
        background: rgba(0,0,0,0.8);
        box-shadow: 0 0 0.8rem #d8d8d8;
        z-index: 99;
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
    }
    .mini-player, .list-nav, .play-list li {
        padding: 1rem;
        justify-content: space-between;
        align-items: center;
        overflow-x: hidden;
    }
    .play-list li{
        padding: 0 1rem;
    }
    .play-list li span.btn{
        font-size: 3rem;
        transform: rotate(-45deg);
        font-weight: normal;
    }
    .play-list li span:nth-child(1){
        flex: 0 1 auto;
        width: 100%;
        text-align: left;
    }
    .singer-all{
        color: #999;
    }
    .no-song li{
        text-align: center;
        margin-top: 60%;
        letter-spacing: 0.1rem;
    }
    .mini-player-l {
        align-items: center;
        position: relative;
    }
    .mini-player-l .btn {
        position: absolute;
        left: 9%;
        z-index: 9;
    }
    .player-img {
        width: 60px;
        height: 60px;
        border-radius: 60px;
        overflow: hidden;
        box-shadow: 0 0 0.5rem #d8d8d8;
        margin-right: 1rem;
    }
    .player-img img{
        opacity: 0.7;
    }
    .song-Infor p {
        max-width: 13rem;
        min-width: 10rem;
    }
    .player-btn{
        white-space: nowrap;
    }
    .player-btn span {
        display: inline-block;
        width: 3.5rem;
        text-align: center;
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
        animation: rotatego 6s infinite linear;
    }
    .play-layer {
        width: 100%;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.8);
        bottom: 0;
        overflow: hidden;
    }
    .process {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        border-top: 0.2rem solid green;
        transition: all 0.25s;
    }
    .player-modal {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: -1;
        zoom: 1;
        background-repeat: no-repeat;
        background-position: left top;
        background-size: 100% 100%;
    }
    .icon-play-list{
        font-size: 1.8rem!important;
        display: inline-block;
        vertical-align: top;
    }
</style>

<script>
    import store from '../store/store.js'
    export default {
        data() {
            return{
                listShow: false, // 是否显示播放列表
                noSong: false,   // 播放列表是否有歌曲
                oneLoop: true,   // 是否单曲循环
                random: false,   // 随机播放
                listSong: [],    // 播放列表歌曲信息
                index: '',       // 当前歌曲播放序号
                // curTime: '--:--' // 歌曲实时播放时间
                playing: false
            }
        },
        created() {
            var _this = this;
            // 初始化播放列表
            if (JSON.parse(localStorage.getItem('listSong'))) _this.listSong = JSON.parse(localStorage.getItem('listSong'));
            _this.getsongIndex();
        },
        mounted() {
            var _this = this;
            // 初始化播放状态
            var audio = document.getElementById("audioB");
            if (audio && !audio.paused) {
                _this.playing = true;
                this.$store.commit('update');
            }
            document.getElementsByTagName('body')[0].addEventListener('click', function(){
                _this.listShow = false;
            }, false)
        },
        // 实时监听当前播放歌曲
        computed:{
            count(){
                this.$store.commit('update');
                return  store.state.songInfor//返回store实例的count状态
            }
        },
        watch: {
            listSong(val, _val) {
                var _this = this;
                localStorage.setItem('listSong', JSON.stringify(_this.listSong))
                if (val.length == 0) {
                    _this.noSong = true;
                    localStorage.removeItem('listSong');
                    return
                }
            },
        },
        methods: {
            // 播放
            play(item, type){
                var _this = this;
                // 播放时添加至播放列表
                _this.setPlaylist(item);
                // 是否有版权
                if (item.size128 == 0 && item.size320 == 0) {
                    _this.$toast({
                        message: "应版权方要求，歌曲无法播放。",
                        position: "middle",
                        duration: 2000
                    });
                    return;
                }
                // 是否通过列表触发播放
                 var line = _this.getByClass("process");
                if(type == 'list') {
                    var b = document.getElementById("audioB");
                    line.style.width = 0;
                    if (b) document.querySelector("body").removeChild(b);
                }
                localStorage.setItem('songInfor', JSON.stringify(item))
                _this.$store.commit('update');
                var e = event || window.event;
                var routeImg = _this.getByClass("player-img");
                var playBtn = _this.getByClass("icon-playb");
                // 创建audio
                var audio = document.createElement("audio");
                audio.id = "audioB";
                audio.src = "http://ws.stream.qqmusic.qq.com/C100" + item.songmid + ".m4a?fromtag=0&guid=1105632073";
                document.querySelector("body").appendChild(audio);
                // 播放进度
                audio.ontimeupdate = function(){
                    var curt = audio.currentTime;
                    var line = _this.getByClass("process");
                    if (curt >= item.interval) {
                        routeImg.classList.remove("playing");
                        playBtn.classList.remove("icon-pause");
                        line.style.width = "100%";
                        return;
                    }
                    line.style.width = curt / item.interval * 100 + "%";
                    var curTime = _this.formatMinute(curt);
                    // 更新播放时间
                    _this.$store.commit('updateLyric', curTime)
                }
                audio.onended = function(){
                    if (_this.$store.state.oneLoop) {
                        var song = _this.$store.state.songInfor;
                        audio.src = "http://ws.stream.qqmusic.qq.com/C100" + song.songmid + ".m4a?fromtag=0&guid=1105632073";
                        _this.audioPlay(audio);
                        return
                    }
                    // 循环播放下一曲
                    _this.getsongIndex();
                    if (_this.listSong[_this.index + 1]) {
                        _this.index += 1;
                    } else {
                        _this.index = 0;
                    }
                    localStorage.setItem('songInfor', JSON.stringify(_this.listSong[_this.index]));
                    _this.$store.commit('update');
                    audio.src = "http://ws.stream.qqmusic.qq.com/C100" + _this.listSong[_this.index].songmid + ".m4a?fromtag=0&guid=1105632073";
                    _this.getByClass("player-modal").style.backgroundImage = "url(" + 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + _this.listSong[_this.index].albummid +'.jpg?max_age=2592000' + ")";
                    _this.audioPlay(audio)
                    
                }
                // 监听播放地址是否有效
                audio.onerror = function(){
                     _this.$toast({
                        message: '歌曲加载失败',
                        position: 'middle',
                        duration: 2000
                    })
                    _this.nextPlay('next');
                }
                // 播放歌曲
                setTimeout(function() {
                    _this.getByClass("player-modal").style.backgroundImage = "url(" + 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + item.albummid +'.jpg?max_age=2592000' + ")";
                    _this.audioPlay(audio);
                }, 100);
                // console.log(item.interval)  // 歌曲时长（秒）
            },
            // mini-player 播放/暂停
            checkPlay() {
                var e = event || window.event;
                var _this = this;
                var audio = document.getElementById("audioB");
                var routeImg = _this.getByClass("player-img");
                var line = _this.getByClass("process");
                if (!audio) {
                    if (localStorage.getItem('songInfor')) {
                        e.currentTarget.classList.add("icon-pause");
                        _this.play(JSON.parse(localStorage.getItem('songInfor')), 'list')
                    }
                    else 
                        _this.$toast({
                            message: '系统暂未检测到歌曲',
                            position: 'middle',
                            duration: 2000
                        })
                    return
                }
                // 播放完成之后点击播放
                if (audio.ended) {
                    line.style.width = 0;
                    _this.play(JSON.parse(localStorage.getItem('songInfor')), 'list')
                    return;
                }
                // 暂停/播放状态点击
                if (audio.paused) {
                    _this.audioPlay(audio);
                } else {
                    audio.pause();
                    routeImg.classList.remove("playing");
                    e.currentTarget.classList.remove("icon-pause");
                }
            },
            // 设置循环播放方式
            setLoopway() {
               this.$store.commit('oneLoop');
            },
            // 添加到播放列表
            setPlaylist(item){
                var _this = this;
                var c = localStorage.getItem('listSong');
                var flag = true;
                if (c) {
                    // 判断列表里面是否有该歌曲
                    for (let index = 0; index < JSON.parse(c).length; index++) {
                        if (JSON.parse(c)[index].songmid == item.songmid ) {
                            flag = false;
                            break
                        } 
                    }
                    if (flag) {
                        var listSong = JSON.parse(c);
                        var list = listSong.unshift(item);
                        localStorage.setItem('listSong', JSON.stringify(listSong));
                    } 
                    
                } else {
                    var list = [item];
                    localStorage.setItem('listSong', JSON.stringify(list));
                }
                
                _this.listSong = JSON.parse(localStorage.getItem('listSong'));
            },
            // 删除播放列表操作
            deletPlaylisy(type, index) {
                var _this = this;
                if(type == 'all') {
                    _this.listSong = [];
                    return 
                }
                _this.listSong.splice(index, 1);
            },
            // 推荐页面添加到列表
            setRecommendList(arr){
                this.listSong = arr;
                localStorage.removeItem('listSong');
                localStorage.setItem('listSong', JSON.stringify(arr));
                this.play(this.listSong[0], 'list');
            },
            // 上/下一首
            nextPlay(type){
                var _this = this;
                var step;
                if (type == 'next') step = 1;
                else step = -1;
                if (localStorage.listSong) {
                    _this.getsongIndex();
                    var indexNum = _this.index + step;
                    if (indexNum == -1) {
                         _this.$toast({
                            message: '已经是第一首歌曲了',
                            position: 'middle',
                            duration: 1500
                        })
                        return   
                    }
                    if (indexNum > -1 && indexNum < _this.listSong.length) {
                        _this.play(_this.listSong[_this.index+step], 'list');
                        return
                    }
                    if (indexNum == _this.listSong.length) {
                        _this.$toast({
                            message: '没有更多歌曲了',
                            position: 'middle',
                            duration: 1500
                        })
                    }
                    return
                }
                _this.$toast({
                    message: '播放列表里面没有歌曲',
                    position: 'middle',
                    duration: '2000'
                })
                
            },
            // 获取当前播放歌曲序号
            getsongIndex(){
                var _this = this;
                var song = _this.$store.state.songInfor;
                for (let index = 0; index < _this.listSong.length; index++) {
                    if (_this.listSong[index].songmid == song.songmid) {
                        _this.index = index
                        break;
                    }
                }
            },
            audioPlay(audio){
                var _this = this;
                _this.getByClass("player-img").classList.add("playing");
                _this.getByClass("icon-playb").classList.add("icon-pause");
                audio.play();
            },
            formatMinute(time){
                var min;
                var sec;
                if (time) {
                    min = Math.floor(time/60)==0 ? '00': '0'+Math.floor(time/60);
                    sec = Math.floor(time%60)<10 ? '0' + Math.floor(time%60) : Math.floor(time%60);
                } else {
                    min = '--';
                    sec = '--'
                }
                return min + ':' + sec
            },
            go(){
                this.$router.push('/musicPlay')
            },
            getByClass(string) {
                return document.getElementsByClassName(string)[0]
            }
        }
    }
</script>
