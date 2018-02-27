const API = require('/api.js')
const AuthProvider = require('./AuthProvider')
var login = function(app, encryptedData, iv) {
    wx.login({
        success: function(res) {
            console.log(res)
            if (res.code) {
                wx.request({
                    url: API.authLogin,
                    data: { appid: API.APP_ID, code: res.code, encryptedData: encryptedData, iv: iv },
                    method: 'post',
                    header: {},
                    success: function(res) {
                        let openid = res.data.resultContent ? res.data.resultContent.openId : '';
                        let unionid = res.data.resultContent ? res.data.resultContent.unionId : '';
                        console.log("get unionID" + unionid)
                        if (openid && unionid) {
                            wx.setStorageSync('openid', openid); //存储openid  
                            wx.setStorageSync('unionid', unionid); //unionid  
                            AuthProvider.onLogin()
                        }
                    },
                    fail: function() {
                        // fail
                        console.log('!res.fail')

                    }
                })
            }
        },
        fail: function(res) {
            console.log("login failed")
        },
        complete: function(res) {
            // complete
        }
    })
}
//调用应用实例的方法获取全局数据
var globalDatas = function(app, that) {
    let userinfos = wx.getStorageSync('userinfo')
    if (userinfos.hasOwnProperty('nickName')) {
        console.log(userinfos)
        that.setData({
            userInfo: userinfos,
            hasUserInfo: true
        })
    } else {
      console.log('globalData userInfo')
        if (app.globalData.userInfo) {
            that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (that.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                that.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else if (!that.data.canIUse) {
            console.log("low version")
            wx.showModal({ // 向用户提示升级至最新版微信。
                title: '提示',
                confirmColor: '#F45C43',
                content: '微信版本过低，请升级至最新版。',
                mask: true
            })
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    that.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    console.log(success)
                }
            })
        }
    }
}

module.exports = {
    login: login,
    globalDatas: globalDatas,
}