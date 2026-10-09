

class Config {

    static check() {
        
    }

    static get(key, defaultValue) {
        return process.env[key] || defaultValue;
    }

}


export { Config };
export default Config;