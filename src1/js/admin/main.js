{
    let view = {
        el: 'main',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view 
            this.view.init()
            this.model = model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('uploadPage',()=>{
                this.view.$el.find('.upload-page').show()
            })
            window.eventHub.on('uploadHide',()=>{
                this.view.$el.find('.upload-page').hide()
            })
            window.eventHub.on('editPage',()=>{
                this.view.$el.find('.edit-page').show()
            })
            window.eventHub.on('editHide',()=>{
                this.view.$el.find('.edit-page').hide()
            })
        }
    }
    controller.init(view, model)
}