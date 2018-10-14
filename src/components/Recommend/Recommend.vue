<template>
    <div class="recommend">
        <!-- <audio src="http://ws.stream.qqmusic.qq.com/C100002eYD4Z1IHCG5.m4a?fromtag=0&guid=1105632073" controls id="audio"></audio> -->
        <div class="slider">
            <mt-swipe :auto="3000">
                <mt-swipe-item v-for="(item,index) in slider" :key="index">
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl" alt="" class="slider-img">
                    </a>
                </mt-swipe-item>
            </mt-swipe>
        </div>

        <div class="music-cont">
            <h2>电台</h2>
            <div class="radio flex">
                <div class="radio-item-wrapper" v-for="(item,index) in radioList" :id="item.radioid" @click="selectList(item.radioid, 'radio')">
                    <div class="radio-item">
                        <img :src="item.picUrl || require('../../assets/images/default.png')" alt="">
                        <span class="icon iconfont icon-play"></span>
                    </div>
                    <span class="nav-title">{{item.Ftitle}}</span>
                </div>
            </div>
        </div>
        
        <div class="music-cont">
            <h2>歌单</h2>
            <div class="radio flex song-sheet">
                <div class="radio-item-wrapper" v-for="(item,index) in songSheet" @click="selectList(item.id)">
                    <div class="radio-item">
                        <img :src="item.picUrl" alt="">
                        <span class="icon iconfont icon-play"></span>
                    </div>
                    <span class="nav-title">{{item.songListDesc}}</span>
                </div>
            </div>
        </div>
        <footerBar ref="footer"></footerBar>
    </div>
</template>

<style scoped>
    .recommend{
        padding-top: 4rem;
        background-color: #f2f2f7;
        padding-bottom: 7rem;
        height: 100vh;
        overflow-y: scroll;
    }
    .mint-swipe{
        height: 100%;
    }
    .is-active{
        background-color: #ffffff;
    }
    .slider{
        max-width: 1080px;
        max-height: 432px;
        width: 100%;
        overflow: hidden;
        margin: 0 auto;
    }
    img{
        width: 100%;
    }
    .music-cont{
        padding: 1rem;
    }
    .radio{
        padding: 1rem 0;
    }
    .radio-item-wrapper{
        margin: 0 2%;
        width: 46%;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 1rem 1rem #e5e5e5;
    }
    .radio-item{
        position: relative;
    }
    .nav-title{
        display: inline-block;
        padding: 0.5rem;
    }
    .iconfont{
        color: #fff;
        position: absolute;
        right: 1rem;
        bottom: 0.5rem;
    }
    .song-sheet{
        flex-wrap: wrap;
    }
</style>

<script>
import footer from '../footer/footer'
import jsonp from 'jsonp'
export default {
    data(){
        return {
            radioList: '',
            slider: '',
            songSheet: '',
            flagH: false // 是否更新轮播高度
        }
    },
    components:{
        footerBar: footer
    },
    created(){
        /**api 集合 */
        // target: '/qqmusic/qzone/fcg-bin', // 热门歌单歌曲获取
        // target: '/qqmusic/musichall/fcgi-bin/', // 推荐页 整体内容（图片 id）
        // 电台热歌 labelid=199  经典老歌 labelid=307
        this.getAllinfor();
    },
    mounted() {
        var _this = this;
        _this.$axios.get('/qqmusic/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1494070301711&songmid=001VySE80MYPrC&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0')
        .then(res => {
            console.log(res)
        })
    },
    methods: {
        getAllinfor(){
            var _this = this;
            _this.$axios.get('/qqmusic/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1533892940278')
            .then(res=>{
                _this.radioList = res.data.data.radioList;
                _this.slider = res.data.data.slider;
                _this.songSheet = res.data.data.songList;
                _this.flagH = true;
            })
        },
        // 电台播放
        selectList(id,type) {
            var _this = this;
            var url = '';
            if (type == 'radio') {
                url = '/qqmusic/v8/fcg-bin/fcg_v8_radiosonglist.fcg?labelid='+ id +'&g_tk=5381&uin=0&format=json&inCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1533880559758'
                this.$axios.get(url)
                .then(res => {
                    var a = res.data.data;
                    _this.initList(a);                   

                })
                .catch( erro => {
                    _this.$toast({
                        message: '获取播放列表失败',
                        position: 'middle',
                        duration: 2000
                    })
                })
                return
            }   
            
            url = '/qqmusic/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&new_format=1&pic=500&disstid='+ id +'&type=1&json=1&utf8=1&onlysong=0&picmid=1&nosign=1&song_begin=0&song_num=99999&_=1534300892238'
            this.$axios.get(url).then(res => {
                var a = res.data.cdlist[0].songlist;
                if (a) {
                    _this.initList(a)
                }
            }).catch((err) => {
                _this.$toast({
                    message: '获取播放列表失败',
                    position: 'middle',
                    duration: 2000
                })
            })

        },

        // 歌曲列表刷新
        initList(a){
            var _this = this;
            var songList = [];
            for (let index = 0; index < a.length; index++) {
                var b = {
                    songmid: a[index].mid,   // 歌曲id
                    songname: a[index].name,  // 歌名
                    albummid: a[index].album.mid,  // 图片id
                    albumname: a[index].album.name, // 歌曲类
                    interval: a[index].interval,    // 歌曲时长
                    singer: a[index].singer,
                    size128: a[index].file.size_128,
                    size320: a[index].file.size_320
                }
                songList.push(b);
            }
            // 清空原始列表
            _this.$refs.footer.deletPlaylisy('all');
            // 添加新列表
            _this.$refs.footer.setRecommendList(songList);
        }
    },
    watch: {
        flagH(val, _val) {
            var _this = this;
            _this.$nextTick(function(){
                var slider = document.getElementsByClassName('slider')[0];
                // 按照图片宽高比来设置容器高度 （达到自适应）
                slider.style.height = slider.offsetWidth/2.5 + 'px';
            })
        }
    }
}
</script>
