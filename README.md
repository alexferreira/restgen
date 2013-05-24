restGen
=======

The goal of restgen is to  provide a micro framework that helps you to write a RESTful webservice using NodeJs, Express, Mongoose (MongoDB).

## Features

This is the first release, but so far given a mongoose model object it will:

 * Handle 'BadRequest', 'NotFound' and '500' errors in a nice clean way.
 * Tool to build project skelleton for you
 * Tool to build empty models for you
 * Auto-generate controllers
 * Auto-generate routes
 * Inflection Library
 * Accept header based response rendering
 
## Installation

    npm install restgen -g

### Dependancies

So far this is dependant on:

  * Nodejs >= 0.8.0
  * Mongoose 3.x
  * Express 3.x
  * Node-Jake 0.5.15
  * NodeUnit
  * Jade
  * EJS

## Setup

A tool is provided to auto-generate a project structure for you.  You can use it by executing the following:

    restgen app hello

It will generate a project structure for you like this:

    /controllers
    /controllers/{modelName}.js
    /models
    /models/{modelName}.js
    /routes
    /routes/{modelName}.js
    app.js

### Creating a Model

Models are just standard Mongoose models, you can create a new model by creating a javascript file inside of the 'models' folder.  You need to name the file, and the export the same.  Your object will get a Mongoose object passed to it, you use that to create your model.

You can create an empty model by typing the following from the root of the project:

    restgen model {modelName}

Here's an example of how you'd define one:

    module.exports.user = function (mongoose) {
  	    var schema = mongoose.Schema;
    
  	    mongoose.model('user', new schema({
        name: String,
        emai: String
	    }, {versionKey: false}));
    
        return mongoose.model('user');
    };


### Creating a Controller

You don't have to do anything to create a basic controller, one that provides show, index, create, update, and destroy is reflectively created for you at runtime.  However if you wanted to extend or change the base controller, you'd create a file inside of the 'controllers' folder and name it the same as your model file.  The file should export an object named {modelName}Controller, for example userController.

Here's an example of how you'd define one:

    module.exports.personController = function(baseController, restgen){
        return baseController;
    }

From this basic framework a controller is dynamically built for each model object that implements:


  * index(),
  * new
  * create(json)
  * show(id)
  * update(id, json)
  * remove(id)

You can extend the base functionality by defining your controller something like this:

    module.exports.userController = function(baseController, restgen){
        //Example of how to extend the base controller if you need to...
        var personController = baseController.extend({
            toString: function(){
                // calls parent "toString" method without arguments
                return this._super(extendedController, "toString") + this.name;
            }
        });

        return personController;
    };

### Routes

The default routes that get added to your express app are:

| options | object name | file |
| --------|-------------|------|
|	GET	   |    /{modelPluralName}/             		 |	- Renders Index view of all entities in the colleciton
|	GET    | 	/{modelPluralName}/new                   | 	- Renders New view to create a new entity
|	GET    | 	/{modelPluralName}.json                  |	- Sends a json list of all entities in the colleciton
|	GET    | 	/{modelPluralName}/{id}                  |	- Renders Show view of a specified entity
|	GET    | 	/{modelPluralName}/{id}.json             |	- Sends json representation of a specified entity
|	POST   | 	/{modelPluralName}/ {FormData}           |	- Create a new record using {FormData} passed in
|	POST   | 	/{modelPluralName}.json              	 |	- Create a new record using the {JSON} passed in
|	PUT    | 	/{modelPluralName}/{id} {FormData}       |	- Updates a record using the {FormData} passed in
|	PUT    | 	/{modelPluralName}/{id}.json             |	- Updates a record using the {JSON} passed in
|	DELETE | 	/{modelPluralName}/{id}                  |	- Deletes the specified record


## License and Copyright

[MIT Style License](http://opensource.org/licenses/MIT)

Copyright &copy; 2013 [Alex Ferreira](http://www.alexferreira.eti.br)