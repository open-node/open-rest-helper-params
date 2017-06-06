const delegate = require('func-delegate');
const _ = require('lodash');

module.exports = (rest) => {
  // 去掉参数中的某些key
  const omit = (keys) => (
    (req, res, next) => {
      if (req.params == null) return next();
      req.params = _.omit(req.params, keys);
      return next();
    }
  );

  // 检测必要参数
  const required = (keys, error) => (
    (req, res, next) => {
      const missings = _.filter(keys, (key) => !_.has(req.params, key));
      if (missings.length === 0) return next();
      if (error) return next(error);
      return next(rest.errors.missingParameter(`Missing required params: ${missings}`));
    }
  );

  // 将 params 的可以做一个简单的映射
  const map = (dict) => (
    (req, res, next) => {
      _.each(dict, (v, k) => {
        req.params[v] = req.params[k];
      });
      next();
    }
  );

  // 给params赋值
  const assign = (keyPath, obj) => (
    (req, res, next) => {
      const value = obj.fixed ? obj.fixed : _.get(req, obj.path);
      _.set(req.params, keyPath, value);
      next();
    }
  );

  const omitSchemas = [{
    name: 'keys',
    type: Array,
    allowNull: false,
    validate: {
      check(keys) {
        _.each(keys, (v) => {
          if (!_.isString(v)) {
            throw Error('Every item in keys must be a string.');
          }
        });
        return true;
      },
    },
    message: 'Keys is an String|Array.',
  }];

  const mapSchemas = [{
    name: 'dict',
    type: Object,
    allowNull: false,
    validate: {
      check(dict) {
        _.each(dict, (v) => {
          if (!_.isString(v)) {
            throw Error('Map dict value must be a string.');
          }
        });
        return true;
      },
    },
    message: 'Dict is an object, like this key => value, value is string.',
  }];

  const requiredSchemas = [{
    name: 'keys',
    type: Array,
    allowNull: false,
    validate: {
      check(keys) {
        _.each(keys, (v) => {
          if (!_.isString(v)) {
            throw Error('Every item in keys must be a string.');
          }
        });
        return true;
      },
    },
    message: 'Keys is an String|Array.',
  }, {
    name: 'error',
    type: Error,
    allowNull: true,
    message: 'The error is called next when params missed.',
  }];

  const assignSchemas = [{
    name: 'keyPath',
    type: String,
    allowNull: false,
    defaultValue: 'params.id',
    message: 'Gets the value at path of object.',
  }, {
    name: 'obj',
    type: Object,
    allowNull: false,
    validate: {
      check(v) {
        if (!_.has(v, 'fixed') && !_.has(v, 'path')) {
          throw Error('Argument obj contains at least fixed, path one of them.');
        }
        return true;
      },
    },
    message: 'Fixed value or path of req object',
  }];

  rest.helper.params = {
    omit: delegate(omit, omitSchemas),
    map: delegate(map, mapSchemas),
    required: delegate(required, requiredSchemas),
    assign: delegate(assign, assignSchemas),
  };

  return rest.helper.params;
};
