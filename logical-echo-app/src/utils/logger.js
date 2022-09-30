const logger = {
    level: 'debug',

    debug(message) {
        this.level === 'debug' && console.log('%cDEBUG %c' + new Date().toISOString() + ' %c' + message, 'color: green;', 'color: grey;', 'color: green;')
    },

    info(message) {
        (this.level === 'debug' || this.level === 'info') && console.log('%cINFO %c' + new Date().toISOString() + ' %c' + message, 'color: turquoise;', 'color: grey;', 'color: turquoise;')
    },

    warn(message) {
        (this.level === 'debug' || this.level === 'info' || this.level === 'warn') && console.log('%cWARN %c' + new Date().toISOString() + ' %c' + message, 'color: orange;', 'color: grey;', 'color: orange;')
    },

    error(message) {
        (this.level === 'debug' || this.level === 'info' || this.level === 'warn' || this.level === 'error') && console.log('%cERROR %c' + new Date().toISOString() + ' %c' + message, 'color: red;', 'color: grey;', 'color: red;')
    }
}

export default logger