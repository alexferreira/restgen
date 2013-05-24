var restErrors = require('./resterrors');

module.exports = function(app, controller) {
  // List All Record
  app.get('/' + controller.plural + '.:format?', function(req, res, next) {
    controller.index(function(err, results) {
      if (err)
        next(new Error('Internal Server Error: see logs for details: ' +  err), req, res);
      else {
        if (req.params.format){
          if (req.params.format.toLowerCase() == 'json') {
            res.send(results.map(function(instance) {
              return instance.toObject();
            }));
          }else
            next(restErrors.RestError.BadRequest.insert('The \'' + req.params.format + '\' format is not supported at this time.'), req, res);
        }else {
          var options = {};
          options[controller.plural] = results.map(function(instance) {
            return instance.toObject();
          });
          res.render(controller.name, options);
        }
      }
    });
  });

  // New Record
  app.get('/' + controller.plural + '/new', function(req, res, next) {
    var options = {};
    options[controller.name] = new controller.model();
    res.render(controller.name + '/new', options );
  });

  // Create Record
  app.post('/' + controller.plural + '.:format?', function(req, res, next) {
    var entity;
    if (req.params.format){
      if (req.params.format.toLowerCase() == 'json')
        entity = req.body;
      else
        next(restErrors.RestError.BadRequest.insert('The \'' + req.params.format + '\' format is not supported at this time.'), req, res);
    }else
      entity = req.body[controller.name];

    controller.create(entity, function(err, instance){
      if (err)
        next(new Error('Internal Server Error: see logs for details: ' +  err), req, res);
      else {
        if (req.params.format)
          if (req.params.format.toLowerCase() == 'json') res.send(instance.toObject(), 201);
        else
          res.redirect(controller.plural + '/' + instance._id + '/show');
      }
    });
  });


  // Show Record
  app.get('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    controller.show(req.params.id, function(err, instance) {
      if (err)
        next(new Error('Internal Server Error: see logs for details: ' +  err), req, res);
      else if (!instance)
        next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else {
        if (req.params.format){
          if (req.params.format.toLowerCase() == 'json')
            res.send(instance.toObject());
          else
            next(restErrors.RestError.BadRequest.insert('The \'' + req.params.format + '\' format is not supported at this time.'), req, res);
        }else{
          var options = {};
          options[controller.name] = instance.toObject();
          res.render(controller.name + '/show', options );
        }
      }
    });
  });

  // Update Record
  app.put('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    var entity;
    if (req.params.format){
      if (req.params.format.toLowerCase() == 'json')
        entity = req.body;
      else
        next(restErrors.RestError.BadRequest.insert('The \'' + req.params.format + '\' format is not supported at this time.'), req, res);
    }else
      entity = req.body[controller.name];

    controller.update(req.params.id, entity, function(err, instance){
      if (err)
        next(new Error('Internal Server Error: see logs for details: ' +  err), req, res);
      else if (!instance)
        next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else {
        if (req.params.format)
          if (req.params.format.toLowerCase() == 'json') res.send(instance.toObject());
        else
          res.redirect(controller.plural + '/' + instance._id + '/show');
      }
    });
  });

  // Delete Record
  app.del('/' + controller.plural + '/:id', function(req, res, next) {
    controller.destroy(req.params.id, function(err, instance){
      if (err)
        next(new Error('Internal Server Error: see logs for details: ' +  err), req, res);
      else if (!instance)
        next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else{
        res.redirect(controller.plural);
      }
    });
  });
};
