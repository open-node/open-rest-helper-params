var delegate  = require('func-delegate')
  , restify   = require('restify')
  , _         = require('lodash');

// 去掉参数中的某些key
var omit = function(keys) {
  return function(req, res, next) {
    if (req.params == undefined) return next();
    req.params = _.omit(req.params, keys);
    next()
  };
};

// 检测必要参数
var required = function(keys, error) {
  return function(req, res, next) {
    var missings = _.filter(keys, function(key) {
      return !req.params.hasOwnProperty(key);
    });
    if (missings.length === 0) return next();
    if (error) return next(error);
    next(new restify.MissingParameterError('Missing required params: ' + missings));
  };
};

// 将 params 的可以做一个简单的映射
var map = function(dict) {
  return function(req, res, next) {
    _.each(dict, function(v, k) {
      req.params[v] = req.params[k]
    });
    next();
  };
};

// 给params赋值
var assign = function(keyPath, obj) {
  return function(req, res, next) {
    var value = obj.fixed ? obj.fixed : _.get(req, obj.path);
    _.set(req.params, keyPath, value);
    next()
  };
};

var omitSchemas = [{
  name: 'keys',
  type: Array,
  allowNull: false,
  validate: {
    check: function(keys) {
      _.each(keys, function(v) {
        if (!_.isString(v)) {
          throw Error('Every item in keys must be a string.');
        }
      });
      return true;
    }
  },
  message: 'Keys is an String|Array.'
}];

var mapSchemas = [{
  name: 'dict',
  type: Object,
  allowNull: false,
  validate: {
    check: function(dict) {
      _.each(dict, function(v, k) {
        if (!_.isString(v)) {
          throw Error('Map dict value must be a string.');
        }
      });
      return true;
    }
  },
  message: 'Dict is an object, like this key => value, value is string.'
}];

var requiredSchemas = [{
  name: 'keys',
  type: Array,
  allowNull: false,
  validate: {
    check: function(keys) {
      _.each(keys, function(v) {
        if (!_.isString(v)) {
          throw Error('Every item in keys must be a string.');
        }
      });
      return true;
    }
  },
  message: 'Keys is an String|Array.'
}, {
  name: 'error',
  type: Error,
  allowNull: true,
  message: 'The error is called next when params missed.'
}];

var assignSchemas = [{
  name: 'keyPath',
  type: String,
  allowNull: false,
  defaultValue: 'params.id',
  message: 'Gets the value at path of object.'
}, {
  name: 'obj',
  type: Object,
  allowNull: false,
  validate: {
    check: function(v) {
      if (!v.hasOwnProperty('fixed') && !v.hasOwnProperty('path')) {
        throw Error('Argument obj contains at least fixed, path one of them.')
      }
      return true;
    }
  },
  message: 'Fixed value or path of req object'
}];

module.exports = function(rest) {
  return rest.helper.params = {
    omit: delegate(omit, omitSchemas),
    map: delegate(map, mapSchemas),
    required: delegate(required, requiredSchemas),
    assign: delegate(assign, assignSchemas)
  };
};
