{
    let view = {
        el: '.songList-container',
        init(){
            this.$el = $(this.el)
        },
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data) {
            this.$el.html(this.template)
            let {songs} = data
            console.log(songs)
            let liList = songs.map((song)=> $('<li></li>').text(song.name))
            this.$el.find('ul').empty()
            console.log(liList)
            liList.map((domLi)=>{
                console.log(domLi)
                this.$el.find('ul').append(domLi)
            })
            
        },
        clearActive(){
            this.$el.find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs:[ ]
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}