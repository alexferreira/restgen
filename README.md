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
  * Commander
  * Fleck

## Setup

A tool is provided to auto-generate a project structure for you.  You can use it by executing the following:

    restgen new hello

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

    restgen generate -m user name:String email:String

the file will be created in the model directory

Here's an example of how you'd define one:

    module.exports.user = function (mongoose) {
      var Schema = mongoose.Schema;

      /* schema for user */
      userSchema = new Schema ({ 
        name: String,
        email: String
      }, { versionKey: false });

      /* methods for userSchema */

      // userSchema.method({
      //   example: function () {
      //     return true;
      //   }
      // });

      return mongoose.model('user', userSchema);
    };


### Creating a Controller

You don't have to do anything to create a basic controller, one that provides show, index, create, update, and destroy is reflectively created for you at runtime.

You can create or extend the controller by typing the following from the root of the project:

    restgen generate -c user

the file will be created in the controller directory

Here's an example of how you'd define one:

    module.exports.userController = function(baseController, restgen){
        return baseController;
    }

From this basic framework a controller is dynamically built for each model object that implements:


  * index()
  * new
  * create(json)
  * show(id)
  * update(id, json)
  * remove(id)

You can extend the base functionality by defining your controller something like this:

    module.exports.userController = function(baseController, restgen){
        //Example of how to extend the base controller if you need to...
        var userController = baseController.extend({
            toString: function(){
                // calls parent "toString" method without arguments
                return this._super(extendedController, "toString") + this.name;
            }
        });

        return userController;
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

You can extend the patterns by defining routes for your entity by typing the following from the root of the project:

    module.exports.casaRoutes = function(casaController, app, restMvc){
      
      app.get('/casa.:format?', function(request, response, next) {

        console.log('Overriden list route');

        casaController.index(function(err, results) {
          if (err)
            next(new Error('Internal Server Error: see logs for details: ' +  err), request, response);
          else {
            if (request.params.format){
              if (request.params.format.toLowerCase() == 'json') {
                  response.send(results.map(function(instance) {
                      return instance.toObject();
                  }));
              }else
                next(restMvc.RestError.BadRequest.create('The \'' + request.params.format + '\' format is not supported at this time.'), request, response);
            }
            else {
              response.render(controller.name, { collection: results.map(function(instance) {
                return instance.toObject();
              })});
            }
          }
        });
      })
    };

## Customize RestErrors

So far only two errors are handled, 400 and 404.  If you want to extend this, it is very easy to do.  Just do something like this in your app.js file.

    // Add a custom rest error for Forbidden
    restMVC.RestError.Forbidden = restMVC.RestError.BaseRestError.extend({
        name: 'Forbidden',
        title: 'Forbidden',
        description: 'Access denied.',
        httpStatus: 403
    })

You can just let the default error template generate the html response, or you can define a customer one like so:

    // Add a custom handler for Forbidden
    restMVC.ErrorMapper['Forbidden'] = function(error, request, response){
        response.render('resterror.jade', {
            status: error.httpStatus,
            error: error
        });
    }


## License and Copyright

[MIT Style License](http://opensource.org/licenses/MIT)

Copyright &copy; 2013 [Alex Ferreira](http://www.alexferreira.eti.br)