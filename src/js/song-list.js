{
    let view = {
        el: '.songList-container',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data) {
            this.$el.html(this.template)
            let {
                songs
            } = data
            console.log(songs)
            let liList = songs.map((song) => $('<li></li>').text(song.name).attr('data-song-id',song.id))
            
            this.$el.find('ul').empty()
            console.log(liList)
            liList.map((domLi) => {
                console.log(domLi)
                this.$el.find('ul').append(domLi)
            })

        },
        activeItem(li) {
            let $li = $(li)
            $li.addClass('active')
                .siblings('.active').removeClass('active')
        },
        clearActive() {
            this.$el.find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return {
                        id: song.id,
                        ...song.attributes
                    }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            console.log(this.view.$el)
            this.view.$el.on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                let data
                let songs = this.model.data.songs
                for(let i = 0; i < songs.length; i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        console.log(data)
                        break
                    }
                }
                console.log(data)
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub() {
            
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data) => {
                this.view.clearActive()
            })
        }
    }
    controller.init(view, model)
}