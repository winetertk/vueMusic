<template>
    <div class="hello">
        <div class="search" @click="initPagenum">
            <input type="text" class="font-size14" placeholder="关键字" v-model:value="searchVal" id="searchVal">
            <span class="iconfont icon-search" @click="search"></span>
        </div>

        <div class="wrapper dsn" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
            <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                <ul class="song-list list-none">
                    <li :id="item.size128" v-for="(item, index) in songList" class="flex flex-r font-size14 line-height4" :class="{disabled: item.size128 == 0 && item.size320 == 0}">
                        <div class="song-name text-hide">{{item.songname}}
                            <i class="color-808080 font-size12">{{item.albumname}}</i>
                        </div>
                        <!-- 歌手 -->
                        <div class="singer text-hide">
                            <span class="singer-all" v-for="(singer,i) in item.singer">
                                <span v-if="i == item.singer.length-1">{{singer.name}}</span>
                                <span v-else>{{singer.name}}、</span>
                            </span>
                        </div>
                        <!-- 列表按钮 -->
                        <div class="song-opera">
                            <span class="song-btn iconfont icon-play" @click="play(item)"></span>
                            <span class="song-btn iconfont icon-concern" @click.stop="comming"></span>
                        </div>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
        <footerBar ref="footer"></footerBar>

    </div>
</template>

<script>
import footer from '../footer/footer'
import store from '../store/store.js'
export default {
    data() {
        return {
            wrapperHeight: 0,
            searchVal: "", // 搜索关键字
            sizes: 20, // 返回数量
            songList: [],
            searchPageNum: 1, // 搜索页码
            totalnum: 0,
            allLoaded: false,
            bottomStatus: "",
            flag: true
        };
    },
    components:{
      footerBar: footer
   },
    mounted() {
        this.wrapperHeight = document.documentElement.clientHeight * 90 / 100 - this.$refs.wrapper.getBoundingClientRect().top;
    },
    methods: {
        search() {
            var _this = this;
            if (_this.searchVal) {
                _this.$axios.get(
                    "/qqmusic/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8¬ice=0&platform=h5&needNewCode=1&w=" +
                        _this.searchVal +
                        "&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=" +
                        _this.sizes +
                        "&p=" +
                        _this.searchPageNum +
                        "&remoteplace=txt.mqq.all&_=1520833663464"
                )
                .then(res => {
                    // 显示列表 去掉dsn类名
                    document
                        .querySelector(".wrapper")
                        .classList.remove("dsn");
                    document
                        .querySelector(".song-list")
                        .classList.remove("list-none");
                    _this.totalnum = res.data.data.song.totalnum;
                    for (
                        let index = 0;
                        index < res.data.data.song.list.length;
                        index++
                    ) {
                        _this.songList.push(res.data.data.song.list[index]);
                    }
                    _this.searchPageNum += 1;
                });
                return;
            }
            _this.$toast({
                message: "请输入搜索关键字",
                position: "middle",
                duration: 1000
            });
        },
        // 播放
        play(item) {
            if (_this.flag) {
                this.$refs.footer.play(item, 'list');
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
        // 上拉加载更多
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        loadBottom() {
            var _this = this;
            if (_this.songList.length >= _this.totalnum) {
                _this.allLoaded = true;
                _this.searchPageNum = 1;
                return;
            }
            _this.search();
            _this.$refs.loadmore.onBottomLoaded();
        },
        // 初始化页码
        initPagenum() {
            document.querySelector(".song-list").classList.add("list-none");
            this.songList = [];
            this.searchPageNum = 1;
            this.allLoaded = false;
        },
        comming(){
            this.$toast({
                message: '功能即将上线...',
                position: 'middle',
                duration: 1500
            })
        }
    }
};
</script>
<style scoped>
.wrapper {
    overflow: scroll;
    padding-bottom: 12rem;
}
.hello {
    width: 100%;
    text-align: center;
    height: 100vh;
}
.disabled {
    color: #808080;
    background-color: rgba(0, 0, 0, 0.1);
}
input {
    outline: 0;
    border: 0;
    line-height: 2.6rem;
    background-color: transparent;
}
#searchVal {
    border-bottom: 1px solid #d8d8d8;
}
.search {
    box-sizing: border-box;
    padding: 2rem;
    position: relative;
}
.search input {
    width: 94%;
    text-align: center;
    padding: 0 3rem;
}
.search span {
    color: #666666;
    position: absolute;
    right: 3rem;
}
.list-none {
    opacity: 0 !important;
    height: 0 !important;
    padding: 0 !important;
}
.song-list {
    box-sizing: border-box;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    height: auto;
    transition: all 0.5s;
    background-color: #f2f7f7;
    box-shadow: 0 5px 1rem #d8d8d8;
    border-radius: 5px;
    overflow: hidden;
}
.song-list li {
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
    transition: all 0.25s;
    white-space: nowrap;
}
.song-btn {
    font-size: 2.3rem;
}
.song-name {
    flex-grow: 1;
    align-self: flex-start;
    text-align: left;
    max-width: 40%;
}
.singer {
    flex-grow: 1;
    align-self: center;
    max-width: 18%;
    margin: 0 2%;
}
.song-opera {
    flex-grow: 1;
    align-self: flex-end;
    text-align: right;
    letter-spacing: 2px;
    max-width: 18%;
}
</style>
