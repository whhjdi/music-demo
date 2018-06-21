{
    let view = {
        el: '.edit-page',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <form action="" class="form">
        <div class="page-left">
            <div class="song-name">
                <label for="">歌曲</label>
                <input type="text" value='__name__' name='name'>
            </div>
            <div class="song-singer">
                <label for="">歌手</label>
                <input type="text" value='__singer__' name="singer">
            </div>
            <div class="song-url">
                <label for="">链接</label>
                <input type="text" value='__url__'  name="url">
            </div>
            <div class="song-cover">
                <label for="">封面</label>
                <input type="text" value='__cover__' name="cover">
            </div>
            <div class="row">
                <button class="delete" type="text">删除</button>
                <button class="save" type='submit'>保存</button>
            </div>
        </div>
        <div class="page-right">
            <div class="song-lyrics">
                <label for="">歌词</label>
                <textarea name="lyrics" id="" cols="40" rows="30"></textarea>
            </div>
        </div>
    </form>
        `,
        render(data) {
            let placeholders = ['name', 'url', 'singer', 'id', 'cover', 'lyrics']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
          }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: '',
            cover: '',
            lyrics: ''
        },
        delete(){
             // 执行 CQL 语句实现删除一个 Todo 对象
            return AV.Query.doCloudQuery(`delete from Song where objectId="${this.data.id}"`)
            .then(function () {
                
            }, function (error) {
                // 异常处理
            });
        },
        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('lyrics', data.lyrics)
            song.set('url', data.url)
            song.set('cover', data.cover)
            return song.save().then((response) => {
                Object.assign(this.data, data)
                return response
            })
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('lyrics', data.lyrics)
            song.set('url', data.url);
            song.set('cover', data.cover);
            return song.save().then((newSong) => {
                let {
                    id,
                    attributes
                } = newSong
                Object.assign(this.data, {
                    id,
                    ...attributes
                })
            }, (error) => {
                console.error(error);
            });
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            this.bindEvents()
            window.eventHub.on('new', (data) => {
                if (this.model.data.id) {
                    this.model.data = {
                        name: '',
                        url: '',
                        id: '',
                        singer: '',
                        lyrics: ''
                    }
                } else {
                    console.log(1)
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        create() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {
                    this.view.reset()
                    //this.model.data === 'ADDR 108'
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)
                })
        },
        update() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(() => {
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        delete(){
            this.model.delete()
                .then(()=>{
                    console.log(JSON.parse(JSON.stringify(this.model.data)))
                    window.eventHub.emit('delete',JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
            this.view.$el.on('click', '.delete', () => {
                this.delete()
            })
        }
    }
    controller.init(view, model)
}