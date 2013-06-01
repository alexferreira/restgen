var baseObject = require('./baseobject');

// Count keys of object
function count(obj) { 
  return Object.keys(obj).length; 
}
// get properties
function getPropObjMatches(obj, key) {
  var object = {};
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object')
      objects = objects.concat(getValues(obj[i], key));
    else if (i.match(key)) 
      object[i] = obj[i]
  }
  return object;
}

module.exports = baseObject.extend({
  model : null,
  name : '',
  plural : '',

  _construct: function(model, name) {
    this.model = model;
    this.name = name;
    this.plural = name.pluralize();
  },

  show : function(id, fn) {
    this.model.findById(id, function(err, instance) {
      fn(err, instance);
    });
  },

  index : function(params, fn) {
    var model = this.model.find({})
    

    if(count(params)){
      sort_values = getPropObjMatches(params, 'sort')

      if(params.limit)
        model = model.limit(params.limit)

    }

    model = model.exec(function (err, list) {
      fn(err, list);
    });
  },

  update : function(id, json, fn){
    var options = { safe: true, upsert: false, multi: false};
    var self = this;

    try{
      this.model.update({_id: id}, json, function(err) {
        if (err){
          // TODO: Swallowing this error is bad, but this seems to be thrown when mongo can't find the document we are looking for.
          if (err == 'Error: Element extends past end of object')
            fn(null, null);
          else
            fn(err, null);
        }
        else {
          self.model.findById(id, function(err, instance) {
            fn(err, instance);
          });
        }
      });
    }catch(err){
      fn(err, null);
    }
  },

  create : function(json, fn){
    var instance = new this.model(json);
    instance.save( function(err){
      fn(err, instance);
    });
  },

  destroy : function(id, fn){
    this.model.findById(id, function(err, instance) {
      if (instance) {
        instance.remove(function(err){
          fn(err, instance)
        });
      }
      else {
        fn(err, instance);
      }
    });
  }
});
