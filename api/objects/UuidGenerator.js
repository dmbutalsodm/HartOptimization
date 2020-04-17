//Generates unique identifiers
class UuidGenerator {
    startIndex = 100
    
    getSnowflake() {
        this.startIndex += 1;
        return `${this.startIndex}${process.pid}${Date.now()}`;
    }

    getPrefixedSnowflake(prefix) {
        return `${prefix}${this.getSnowflake()}`;
    }
}

module.exports = new UuidGenerator();