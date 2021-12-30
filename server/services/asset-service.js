class AssetService {
    constructor({ logger }) {
        this.logger = logger;
    }

    async uploadImage() {

    }

    makeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    getExtension(fileName) {
        const re = /(?:\.([^.]+))?$/;
        return re.exec(fileName)[1];
    }

}

module.exports = AssetService;
