const wxRequest = require('./wxRequest')
const wxApi = require('./wxApi')
const API = require('./api')
const Promise = require('./es6-promise');

    function onLogin(){
        let url = API.getToken + 'unionid_' + wx.getStorageSync('unionid') + '_type_2';
        let token = 'bGl6LXJlZHBhY2thZ2Utd3g6c2VjcmV0'
        return wxRequest.fetch(url,{type:'Basic',value:token},'',"POST").then((res)=>{
           saveTokens(res.data.access_token,res.data.refresh_token,res.data.expires_in);
            return res.data.access_token
        }).catch((req)=>{
            return 'error'
        })
    }
    function setWait(){
        wxApi.wxPromisify(wx.setStorageSync('access_token','wait'));
    }
    function saveTokens(access_token,refresh_token,expires_in){
        wx.setStorageSync('access_token',access_token);
        wx.setStorageSync('refresh_token',refresh_token);
        var exp = new Date();
        var expires_ins=exp.getTime() + expires_in*1000-30000;
        wx.setStorageSync('expires_in',expires_ins);
    }
    function onRefreshToken(){
            setWait();
            let token = 'bGl6LXJlZHBhY2thZ2Utd3g6c2VjcmV0'
            var url=API.refreshToken + wx.getStorageSync('refresh_token');
            return wxRequest.fetch(url,{type:'Basic',value:token},'','POST').then((res)=>{
                if(res.data.access_token){
                    saveTokens(res.data.access_token,res.data.refresh_token,res.data.expires_in);
                    return res.data.access_token;
                }else{
                    return onLogin().then(res=>{
                        return res
                    });
                }
            }).catch(req=>{
                if(wx.getStorageSync('refresh_token') != null){
                    return onLogin().then(res=>{
                        return res
                    });
                }
            })
    }
    function getAccessToken(){
        var date = new Date();
    var dt = date.getTime();
    var expires_in = wx.getStorageSync('expires_in');
    console.log(expires_in)
    if (!expires_in) {
        return onRefreshToken();
    } else if (dt >= expires_in && wx.getStorageSync('access_token') != 'wait') {
        return onRefreshToken();
    } else if (wx.getStorageSync('access_token') == 'wait') {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(wx.getStorageSync('access_token'))
            }, 2000)
        })
    } else {
        return new Promise((resolve, reject) => {
            resolve(wx.getStorageSync('access_token'))
        })
    }
    }
module.exports={
    onLogin:onLogin,
    getAccessToken:getAccessToken
}
