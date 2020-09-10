// 注意:每次调用请求时候,会先调用这个函数,我们可以给ajax提供配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})