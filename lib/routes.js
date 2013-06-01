var restErrors = require('./resterrors');

function checkUrlFormat(format, req, res, next){
  if (format && format.toLowerCase() != 'json') 
    next(restErrors.RestError.BadRequest.insert('The \'' + req.params.format + '\' format is not supported at this time.'), req, res);
}

module.exports = function(app, controller) {
  // List All Records
  app.get('/' + controller.plural + '.:format?', function(req, res, next) {
    format = req.params.format;
    checkUrlFormat(format, req, res, next);

    controller.index(req.query, function(err, results) {
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else {
        var options = {};
        options[controller.plural] = results.map(function(instance) {return instance.toObject()});
        format && format.toLowerCase() == 'json' ? res.json(results) : res.render(controller.plural, options);
      }
    });
  });

  // Render new view to create a new record with FormData
  app.get('/' + controller.plural + '/new', function(req, res, next) {
    var options = {};
    options[controller.name] = new controller.model();
    res.render(controller.plural + '/new', options );
  });

  // Create Record
  app.post('/' + controller.plural + '.:format?', function(req, res, next) {
    format = req.params.format;
    checkUrlFormat(format, req, res, next);

    if (format){
      if (format.toLowerCase() == 'json') entity = req.body;
    }else
      entity = req.body[controller.name];

    controller.create(entity, function(err, instance){
      if (err)
        format && format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else {
        format && format.toLowerCase() == 'json' ? res.json(201, instance) : res.redirect(controller.plural + '/' + instance._id + '/show');
      }
    });
  });

  // Show Record
  app.get('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    format = req.params.format;
    checkUrlFormat(format, req, res, next);

    controller.show(req.params.id, function(err, instance) {
      if (err)
        format && format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance)
        format && format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else {
        var options = {};
        options[controller.name] = instance.toObject();
        format && format.toLowerCase() == 'json' ? res.json(instance) : res.render(controller.plural + '/show', options );
      }
    });

  });

  // Update Record
  app.put('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    format = req.params.format;
    checkUrlFormat(format, req, res, next);

    if (format){
      if (format.toLowerCase() == 'json') entity = req.body;
    }else
      entity = req.body[controller.name];

    controller.update(req.params.id, entity, function(err, instance){
      if (err)
        format && format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance)
        format && format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else 
        format && format.toLowerCase() == 'json' ? res.json(instance) : res.redirect(controller.plural + '/' + instance._id + '/show');
    });
  });

  // Delete Record
  app.del('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    format = req.params.format;
    checkUrlFormat(format, req, res, next);

    controller.destroy(req.params.id, function(err, instance){
      if (err)
        format && format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance)
        format && format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else
        format && format.toLowerCase() == 'json' ? res.json(instance) : res.redirect(controller.plural);
    });
  });

  // Req url with action for template jade
  app.get('/' + controller.plural + '/:id/:action', function(req, res, next) {
    format = req.params.format;
    checkUrlFormat(format, req, res, next);

    controller.show(req.params.id, function(err, instance) {
      if (err)
        next(new Error('Internal Server Error: see logs for details: ' +  err), req, res);
      else if (!instance)
        next(restErrors.RestError.NotFound.create(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      else {
        var options = {};
        options[controller.name] = instance.toObject();
        res.render(controller.plural + '/' + req.params.action, options );
      }
    });
  });
};
