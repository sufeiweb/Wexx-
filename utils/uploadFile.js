var Promise = require('./es6-promise');

function wxPromisify(fn){
    return function (obj = {}){
        return new Promise((resolve,reject) =>{
            obj.success = function(res){
                //成功
                wx.hideToast()
                console.log('→返回数据：'+ JSON.stringify(res.data))
                console.log('→end')
                resolve(res);
            }
            obj.fail = function(res){
                //失败
                console.log('→请求失败：'+ JSON.stringify(res))
                console.log('→end')
                wx.hideToast()
                reject(res)
            }
            fn(obj)
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


  function wxUpLoadFile (url,formData,token){
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
    var wxtUpLoadFile = wxPromisify(wx.uploadFile);
    return wxtUpLoadFile({
        url:url,
        name:'file',
        filePath:formData,
        header:{
            "Authorization": 'Bearer '+token 
        }
    })
  }

  module.exports = {
    uploadFile:wxUpLoadFile
 }
