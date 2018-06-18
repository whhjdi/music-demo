{
    let view = {
        el:'.page-1',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.modeule1()
            this.modeule2()
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        modeule1(){
            var script1 = document.createElement('script')
            script1.src = "./js/index/page1-1.js"
            document.body.appendChild(script1)
        },
        modeule2(){
            var script2 = document.createElement('script')
            script2.src = "./js/index/page1-2.js"
            document.body.appendChild(script2)
        }

    }
    controller.init(view, model)
}