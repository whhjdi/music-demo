{
    let view = {
        el: '.new-song',
        init() {
            this.$el = $(this.el)
        },
        template: `
        新建音乐
        `,
        render(data) {
            this.$el.html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            // 点击新建,显示上传页面,
            this.view.$el.on('click', () => {
                window.eventHub.emit('uploadPage')
                window.eventHub.emit('editHide')
            })
        },
        bindEventHub() {
            window.eventHub.on('edit', (data) => {
                window.eventHub.emit('editPage')
                window.eventHub.emit('uploadHide')
            })
        },
    }
    controller.init(view, model)
}