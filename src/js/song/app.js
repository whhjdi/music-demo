{
    let view = {
        el: '#app',
        init(){
            this.$el = $(this.el)
        },
        play(){
            console.log(this.$el.find('audio')[0])
            this.$el.find('audio')[0].play()
        },
        pause(){
            console.log(this.$el.find('audio'))
            this.$el.find('audio')[0].pause()
        },
        render(data){
            let {song,status} = data
            console.log(song)
            this.$el.css('background-image', `url(${song.cover})`)
            this.$el.find('img.cover').attr('src', song.cover)
            this.$el.find('.song-description>h1').html(song.name)
            if(this.$el.find('audio').attr('src')!== song.url){
                let audio = this.$el.find('audio').attr('src', song.url).get(0)
                audio.onended = ()=>{ window.eventHub.emit('songEnd') }
            }
            
            if(status === 'playing'){
                this.$el.find('.disc-container').addClass('playing')
                this.play()
            }else{
                this.$el.find('.disc-container').removeClass('playing')
                this.pause()
            }
            
        },
    }
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: '',
                cover:''
            },
            status: 'playing'       
        },
        get(id) {
            var query = new AV.Query('Song')
            return query.get(id).then((song) => {
                Object.assign(this.data.song, {
                    id: song.id,
                    ...song.attributes
                })
                console.log(song)
                return song

            })
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(() => {
                this.view.render(this.model.data)
            })
            this.bindEvents()
            
        },
        bindEvents(){
            this.view.$el.on('click','.icon-play',()=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
            })
            this.view.$el.on('click','.icon-pause',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
            window.eventHub.on('songEnd', ()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
            
        },
        getSongId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let array = search.split('&').filter(v => v)
            let id = ''
            for (let i = 0; i < search.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id

        }
    }
    controller.init(view, model)
}