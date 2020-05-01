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
Creates a new tool. `name` field required, any additional fields are optional.

POST /api/tools/freeTools  
Removes tools from machines. Takes an array called `tools` in the post body with the IDs of the tools to be removed.

## Tool Manager 
Tool Manager is a singleton that holds all the tools, and takes care of various tasks involving the collection

## Machine
Machine is a type that represents a machine that holds tools and can process ops.

## Machine Endpoints
GET /api/machines  
Gets a list of all machines and their attributes

GET /api/machines/:id  
Gets a specific machines, found by its id

POST /api/machines  
Creates a new machines. `name` field is required, any additional fields are optional.

POST /api/machines/:id/addTools  
Loads tools into the machines. The post body should have an array called `tools` with the tool IDs that are to be loaded into the machine.   
Tools can only be loaded into one machine at once, so loading a tool into a machine that is already loaded into another will result in a transfer, not an error.

## Machine Manager
Machine Manager is a singleton that holds all the machines, and takes care of various tasks involving the collection.

## Op Manager
OpManager is a type that interfaces with the database to coordinate op information.

## Op Endpoints
POST /api/ops  
Creates an op that can be performed on a machine.
Takes up to 6 parameters in its post body.  
* `name`: The name of the op. 
* `opCode`: The code for the operation in the manufacturing process. Usually 2 digits.
* `part`: The part that this op belongs to.
* intervals: the amount of 15-minute intervals the op takes.
* `tools`: [optional] An array of the Tool IDs that this op needs to complete.
* `machines`: [optional] An array of the Machine IDs that are capable of completing this op.


POST /api/ops/updatemachines  
Updates the machines that can complete a specific op.  
Takes 3 parameters:  
* `opId`: The op ID to update.
* `toAdd`: An array containing the machine IDs that will be added to the op.
* `toDelete`: An array containing the machine IDs that will be removed from the op.

POST /api/ops/updatetools  
Updates the tools that can complete a specific op.  
Takes 3 parameters:  
* `opId`: The op ID to update.
* `toAdd`: An array containing the tool IDs that will be added to the op.
* `toDelete`: An array containing the tool IDs that will be removed from the op.

## Part 
Parts are groupings of ops required to produce a physical product.

## Part endpoints
GET /api/parts  
Returns a collection of all the parts that are in the system. Includes the part details, as well as each op required to make the part,
and the machines and tools that the particular op needs.

GET /api/parts/:id  
Returns the details for a specific part, including the part details, as well as each op required to make the part,
and the machines and tools that the particular op needs.  
  
POST /api/parts  
Creates a new part in the system. Name is the only required field.

## Job
Jobs are runs of a part number in a certain quantity, with a certain due date.

## Job endpoints
GET /api/jobs  
Returns a list of all the jobs in the system. Includes id, partId, count, name, dueDate, and priority.  
  
POST /api/jobs  
Creates a new job. Requires 4 parameters in the post body.
* `name`: The name of this job.
* `partId`: The ID of the part that is running in this job.
* `partCount`: The amount of parts that are to be made in this job.
* `dueDate`: The day this job is due, in YYYY/MM/DD format.