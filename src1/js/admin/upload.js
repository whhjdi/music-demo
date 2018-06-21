{
    let view = {
        el: '.upload-page',
        init(){
            this.$el = $(this.el)
        },
        template:` 
        <div id="uploadButton" class="uploadButton">点击上传</div>
        <span class="upload-text2">每个文件大小不能超过40M</span>
        <span class="upload-text1">请点击或者拖拽到此区域上传</span>`,
        render(data){
            this.$el.html(this.template)
        }
    }
    let model = {
        data: {
            status: 'open'
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.initQiniu()
            this.bindEventHub()
        },
        bindEventHub(){
            
        },
        initQiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5', //上传模式,依次退化
                browse_button: 'uploadButton', //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8888/uptoken',
                domain: 'paahiebgs.bkt.clouddn.com', //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '40mb', //最大文件体积限制
                dragdrop: true, //开启可拖曳上传
                drop_element: 'uploadContainer', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': (up, files) => {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': (up, file) => {
                        window.eventHub.emit('beforeUpload')
                        if (this.model.data.status === 'closed') {
                            return false
                        } else {
                            this.model.data.status = 'closed'
                            return true
                        }
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    // 文件上传成功之后调用 FileUploaded
                    'FileUploaded': (up, file, info) => {
                        window.eventHub.emit('afterUpload')
                        this.model.data.status = 'open'
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = 'http://' + domain + '/' + encodeURIComponent(response.key);
                        window.eventHub.emit('new', {
                            url: sourceLink,
                            name: response.key
                        })
                        window.eventHub.emit('edit')
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });
        }
    }
    controller.init(view, model)
}