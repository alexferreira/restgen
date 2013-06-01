var restErrors = require('./resterrors');

module.exports = function(app, controller) {
  // List All Records
  app.get('/' + controller.plural + '.:format?', function(req, res, next) {
    controller.index(req.query, function(err, results) {
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else {
        var options = {};
        options[controller.plural] = results.map(function(instance) {return instance.toObject()});
        req.params.format.toLowerCase() == 'json' ? res.json(results) : res.render(controller.name, options);
      }
    });
  });

  // Create Record
  app.post('/' + controller.plural + '.:format?', function(req, res, next) {
    controller.create(req.body, function(err, instance){
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else {
        req.params.format.toLowerCase() == 'json' ? res.json(201, instance) : res.redirect(controller.plural + '/' + instance._id + '/show');
      }
    });
  });

  // Show Record
  app.get('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    controller.show(req.params.id, function(err, instance) {
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance)
        req.params.format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else {
        var options = {};
        options[controller.name] = instance.toObject();
        req.params.format.toLowerCase() == 'json' ? res.json(instance) : res.render(controller.name + '/show', options );
      }
    });

  });

  // Update Record
  app.put('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    controller.update(req.params.id, req.body, function(err, instance){
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance)
        req.params.format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else 
        req.params.format.toLowerCase() == 'json' ? res.json(instance) : res.redirect(controller.plural + '/' + instance._id + '/show');
    });
  });

  // Delete Record
  app.del('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    controller.destroy(req.params.id, function(err, instance){
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance)
        req.params.format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else
        req.params.format.toLowerCase() == 'json' ? res.json(instance) : res.redirect(controller.plural);
    });
  });
};
