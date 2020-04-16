class UuidGenerator {
    startIndex = 100
    
    getSnowflake() {
        this.startIndex += 1;
        return `${Date.now()}${this.startIndex}${process.pid}`;
    }

    getPrefixedSnowflake(prefix) {
        return `${prefix}${this.getSnowflake()}`;
    }
}

module.exports = new UuidGenerator();