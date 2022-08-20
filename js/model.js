'use strict';
const model = () => {
    return {
        dbName: null,
        currentId: null,

        lastContactData() {
            return this.getData().filter(item => item.id === this.currentId - 1)[0];
        },

        setDbName(key) {
            if (!key.trim()) throw new Error('Db name is required in options app.js');
            this.dbName = key;
        },

        getData() {
            return JSON.parse(localStorage.getItem(this.dbName));
        },

        setData(contact) {
            const data = this.getData() ? this.getData() : [];
            data.push(contact);
            localStorage.setItem(this.dbName, JSON.stringify(data));
        },

        updateData(data) {
            data.length ? localStorage.setItem(this.dbName, JSON.stringify(data)) : localStorage.removeItem(this.dbName);
        },

        init(key) {
            this.setDbName(key)
            this.currentId = this.getData() ? Math.max(...(this.getData().map(contactItem => contactItem.id))) + 1 : 1;
        }
    }
}
