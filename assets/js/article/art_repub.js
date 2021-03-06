$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }
                // 调用模板引擎,渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render()
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    var art_state = '已发布'
    // 为存为草稿绑定事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定submit事件
    $('#form-repub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单创建一个FormData对象
        var fd = new FormData($(this)[0])
        // 获取数据渲染页面
        fd.append('state', art_state)
        fd.append('Id', id)
        fd.append('content', tinymce.activeEditor.getContent())
        // fd.forEach(function (value, k) {
        //     console.log(k, value);
        // })
        // 将封面裁剪后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象,存储到fd中
                fd.append('cover_img', blob)
                // 发起ajax数据请求
                xiugai(fd)
            })
    })
    // 定义一个修改文章的方法
    function xiugai(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意向服务器提交的是FormData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！ ')
                }
                layer.msg('修改文章成功！ ')
                // 发布成功后,跳转到文章列表页面
                //location.href = '/article/art_list.html'
                window.parent.$('#btn-lie').click()
            }
        })
    }

    // 渲染页面
    //var value = JSON.parse(localStorage.getItem('data'))
    var id = localStorage.getItem('data')
    //localStorage.removeItem('data')
    // console.log(id);
    $.ajax({
        method: 'GET',
        url: '/my/article/' + id,
        success: function (res1) {
            cover_img = 'http://ajax.frontend.itheima.net' + res1.data.cover_img
            // 为裁剪区域重新设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', cover_img) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
            form.val('form-repub', res1.data)
            localStorage.removeItem('data')
        }
    })
})