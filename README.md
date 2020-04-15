# Hart Optimization
This is a project to manage the jobs and scheduling at Hart Precision Machining.

# Types
## Tool
Tool is a type that represents a tool that can either be in a machine or not.

To instantiate it, an object with the field `id` and any other properties the tool has, such as physical measurements or source or etc.

## Tool Endpoints
GET /api/tools
Gets a list of all tools and their attributes

GET /api/tools/:id
Gets a specific tool, found by its id

POST /api/tools
Creates a new tool. ID field required, any additional fields are optional.

## Tool Manager 
Tool Manager is a singleton that holds all the tools, and takes care of various tasks involving the collection

## Machine
Machine is a type that represents a machine that holds tools and can process jobs.

## Machine Endpoints
GET /api/machines
Gets a list of all machines and their attributes

GET /api/machines/:id
Gets a specific machines, found by its id

POST /api/machines
Creates a new machines. ID field required, any additional fields are optional.

## Machine Manager
Machine Manager is a singleton that holds all the machines, and takes care of various tasks involving the collection.

## Job
Job is a type that represents a job that uses raw material to make product.