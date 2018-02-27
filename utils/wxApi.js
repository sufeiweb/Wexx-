var Promise = require('./es6-promise');

function wxPromisify(fn){
    return function (obj = {}) {
        return new Promise((resolve,reject) =>{
            obj.success = function (res){
                //成功
                resolve(res);
            }
            obj.fail = function(res) {
                //失败
                reject(res);
            }
            fn(obj);
        })
    }
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
    );
  };

/**
 * 微信用户登，获取code
 */
function wxLogin(){
    return wxPromisify(wx.login)
}

/**
 * 获取微信用户信息
 * 注意：必须在登录之后调用
 */
function wxGetUserInfo(){
    return wxPromisify(wx.getUserInfo)
}

/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
    return wxPromisify(wx.getSystemInfo)
}

module.exports = {
    wxPromisify:wxPromisify,
    wxLogin:wxLogin,
    wxGetSystemInfo:wxGetSystemInfo,
    wxGetUserInfo:wxGetUserInfo
}