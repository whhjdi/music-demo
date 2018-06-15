window.eventHub = {
    events: {},
    //发布
    emit(eventName, data) {
        for (let key in this.events) {
            if (key === eventName) {
                this.events[eventName].map((fn) => {
                    fn.call(undefined, data)
                })
            }
        }
    },
    //订阅
    on(eventName, fn) {
        if (this.events[eventName] === undefined) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    },
}