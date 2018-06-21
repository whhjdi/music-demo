window.eventHub = {
    events: {},
    // 发布(触发事件)
    emit(eventName, data) {
        for (let key in this.events) {
            if (key === eventName) {
                this.events[eventName].map((callback) => {
                    callback.call(undefined, data)
                })
            }
        }
    },
    // 订阅(绑定事件)
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }
        this.events[eventName].push(callback)
    }
}