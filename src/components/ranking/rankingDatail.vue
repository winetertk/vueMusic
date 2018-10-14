<template>
    <div id="rankingDetail" class="ranking-detail">
        <div class="list-bar flex">
            <div class="modal" :style="{backgroundImage: 'url('+listDetail.topinfo.pic_album+')'}"></div>
            <div class="top-list-img">
                <img :src="listDetail.topinfo.pic_album || require('../../assets/images/default.png')" alt="" width="125">
            </div>
            <div class="top-list-infor line-hright3" v-cloak>
                <p class="text-hide font-size16">{{listDetail.topinfo.ListName}}</p>
                <p class="text-hide font-size14" v-if="!listDetail.day_of_year">第{{listDetail.date.split('_')[1]}}周</p>
                <p class="text-hide font-size14" v-else>第{{listDetail.day_of_year}}天</p>
                <p class="text-hide font-size14">{{listDetail.update_time}} 更新</p>
            </div>

            <div class="play-all" @click="selectAll(songList)">
                播放全部
            </div>
        </div>
        <!-- 列表 -->
        <div class="top-song-list">
            <span class="line-height4 font-size15">排行榜 &nbsp;&nbsp;共 {{listDetail.total_song_num}} 首</span>
            <ul>
                <li class="list-item flex line-height4" :class="{'cur-song': item.data.songmid == songmid}"  v-for="(item,index) in songList" @click="play(item)">
                    <span class="top-num font-size16" :class="{'color-red': index < 3}">{{index+1}}</span>
                    <div class="song-infor text-hide font-size16">
                        <span>{{item.data.songname}}</span>
                        <i class="color-808080 font-size13">{{item.data.albumname}}</i><br>
                        <span class="singer-all font-size12" v-for="(singer,i) in item.data.singer">
                            <span v-if="i == item.data.singer.length-1">{{singer.name}}</span>
                            <span v-else>{{singer.name}}、</span>
                        </span>
                    </div>
                    <!-- 列表按钮 -->
                    <div class="song-opera">
                        <span class="song-btn iconfont icon-play"></span>
                        <span class="song-btn iconfont icon-concern" @click.stop="comming"></span>
                    </div>
                </li>
            </ul>
        </div>
        <footerBar ref="footer"></footerBar>
    </div>
</template>

<style scoped>
    .color-red{
        color: red;
        font-style: italic;
    }
    .color-bg{
        background-color: #b2b2b7;
    }
    .topThree{
        color: red;
    }
    .ranking-detail{
        margin-top: -4rem;
        height: 100vh;
        width: 100vw;
    }
    li.cur-song, li.cur-song span, li.cur-song i{
        transition: all .25s;
        color: #29b672;
    }
    .list-bar{
        position: relative;
        height: 275px;
        overflow: hidden;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background-color: rgba(0,0,0, 0.5);
        color: #fff;
    }
    .top-list-img{
        flex: 0 0 auto;
        margin-right: 1rem;
    }
    .top-list-infor{
        flex: 0 1 auto;
        white-space: nowrap;
        max-width: 11rem;
    }
    .play-all{
        position: absolute;
        bottom: 5%;
        line-height: 3rem;
        width: 40%;
        text-align: center;
        background: #29b672;
        border-radius: 4px;
        font-size: 1.5rem;
    }
    .modal{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: #666;
        background-position: 20px;
        /* 高斯模糊 */
        object-fit: cover;
        -webkit-filter: blur(36px);
        z-index: -1;
    }
    .top-song-list{
        padding: 1rem;
        background-color: #f2f2f7;
        padding-bottom: 8rem;
    }
    .list-item{
        justify-content: space-between;
        align-items: center;
        color: #555;
        padding: 0.5rem 0;
        margin-bottom: 0.5rem;
        box-shadow: 0 1rem 1rem #e5e5e5;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
    }
    .song-infor{
        line-height: 1.8rem;
        flex: 0 1 auto;
        width: 100%;
    }
    .top-num{
        margin-right: 0.2rem;
        text-align: center;
        width: 5rem;
        white-space: nowrap;
        overflow: hidden;
    }
    .singer-all{
        color: #2c3e50;
    }
    .song-opera{
        flex: 0 0 auto;
        padding: 0 1rem; 
    }
    
</style>

<script>
import footer from '../footer/footer'
import store from '../store/store.js'
export default {
    // pic_album 列表头部图片
    data(){
        return {
            listDetail:{
                'date': '',
                'topinfo':{
                    'ListName': ''
                }
            },    // 排行榜全数据
            songList: [{
                data: {
                    songname: '',
                    albumname: '',
                    pic_album: '',
                    songmid: ''
                }
            }],       // 歌曲
            count: 0,
            flag: true
        }
    },
    computed:{
        songmid(){
            return this.$store.state.songInfor.songmid
        }
    },
    mounted() {
        // :class="{'cur-song': item.data.songmid == songmid"
        console.log(this.$store.state.songInfor.songmid)
        var _this = this;
        if (_this.$route.params.id) {
            _this.initList();
            return
        }
        _this.$toast({
            message: '获取排行榜异常',
            position: 'middle',
            duration: 1000
        })
        setTimeout(function(){ _this.$router.go(-1) }, 1500);
    },
    components:{
        footerBar: footer
    },
    methods: {
        play(item){
            var _this = this;
            if (_this.flag) {
                this.$refs.footer.play(item.data, 'list');
                _this.flag = false;
                setTimeout(function(){ _this.flag = true; }, 300)
            } else {
                _this.$toast({
                    message: '操作过于频繁',
                    position: 'middle',
                    duration: 1000
                })
            }
        },
        initList(){
            var _this = this;
            var promise = new Promise(function(resolve, reject){
                var id = _this.$route.params.id;
                _this.$axios.get('/qqmusic/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1899276512&uin=1105632073&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid='+ id +'&_=1533729500270' )
                .then(res => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
            })
            promise.then(val => {
                _this.listDetail = val.data;
                _this.songList = val.data.songlist;
                // 标注榜三
                var topThree = document.getElementsByClassName('color-red');
                for (let index = 0; index < topThree.length; index++) {
                    topThree[index].parentNode.style.backgroundColor = '#fff';
                }
                document.documentElement.scrollTop = 0;
            }, err => {
                alert(err)
            })
        },
        // 播放全部
        selectAll(a){
            var _this = this;
            var songList = [];
            for (let index = 0; index < a.length; index++) {
                var b = a[index].data;
                songList.push(b);
            }
            // 清空原始列表
            _this.$refs.footer.deletPlaylisy('all');
            // 添加新列表
            _this.$refs.footer.setRecommendList(songList);
        },
        comming(){
            this.$toast({
                message: '功能即将上线...',
                position: 'middle',
                duration: 1500
            })
        }
    }
}
</script>