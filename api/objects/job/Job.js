
// Maybe a job doesn't even need to be represented in memory?

module.exports = class Job {
    id;
    name;
    tools = [];
    machines = [];
}