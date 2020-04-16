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
Creates a new tool. 'name' field required, any additional fields are optional.

POST /api/tools/freeTools
Removes tools from machines. Takes an array called "tools" in the post body with the IDs of the tools to be removed.

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
Creates a new machines. 'name' field required, any additional fields are optional.

POST /api/machines/:id/addTools
Loads tools into the machines. The post body should have an array called "tools" with the tool IDs that are to be loaded into the machine.
Tools can only be loaded into one machine at once, and loading a tool into a machine that is already loaded into another will result in a transfer, not an error.

## Machine Manager
Machine Manager is a singleton that holds all the machines, and takes care of various tasks involving the collection.

## Job
Job is a type that represents a job that uses raw material to make product.