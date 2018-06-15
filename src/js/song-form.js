{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },

        template: `
        <h1>编辑</h1>
        <form action="" class="form">
            <div class="row">
                <label>歌名:</label>
                <input type="text" value='__name__' name="name">
            </div>
            <div class="row">
                <label>歌手:</label>
                <input type="text" name="singer">
            </div>
            <div class="row">
                <label>外链:</label>
                <input type="text" value='__url__' name="url">
            </div>
            <div class="row actions">
                <button type='submit'>保存</button>
            </div>
        </form>`,
        render(data = {}) {
            let placeholders = ['name', 'url', 'singer', 'id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data) {
            let Song = AV.Object.extend('Song')
            let song = new Song()
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            return song.save().then((newSong) => {
                let {id,attributes} = newSong
                Object.assign(this.data,{id,...attributes,}) 
            }, (error) => {
                console.log(error)
            })
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data) => {
                console.log(data)
                this.view.render(data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                    .then(() => {
                        this.view.reset()
                        let string = JSON.stringify(this.model.data)
                        let object = JSON.parse(string)
                        window.eventHub.emit('create', object)
                    })
            })
        }
    }
    controller.init(view, model)
}