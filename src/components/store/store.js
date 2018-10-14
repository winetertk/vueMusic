import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    songInfor: JSON.parse(localStorage.getItem('songInfor')),
    oneLoop: false,
    showLoading: false,
    currentTime: '00:00' // 当前歌词时间
}

const mutations = {
    update(state) {
        if (localStorage.songInfor) {
            state.songInfor = JSON.parse(window.localStorage.songInfor)
        } else {
            // 设置默认值
            state.songInfor = {
                albummid: '',
                songname: '您还没有选择歌曲',
                albumname: '',
                singer: ''
            }
        }
        
    },
    // 是否单曲循环
    oneLoop(state) {
        state.oneLoop = !state.oneLoop;
    },
    // loading状态控制
    loadingStatus(state, payload) {
        state.showLoading = payload.isLoading;
    },
    // 更新当前歌词时间
    updateLyric(state, payload){
        state.currentTime = payload;
    }
}
const getters = {  
    showLoading(state){  
        return state.showLoading  
    }  
}  
const actions = {
    changeLoading:({ commit }) => {  
        commit( 'changeLoading' )  
    },
}
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})