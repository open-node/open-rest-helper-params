# open-rest-helper-params

open-rest 的 helper 插件，用来对某些值做断言

[![Build status](https://api.travis-ci.org/open-node/open-rest-helper-params.svg?branch=master)](https://travis-ci.org/open-node/open-rest-helper-params)
[![codecov](https://codecov.io/gh/open-node/open-rest-helper-params/branch/master/graph/badge.svg)](https://codecov.io/gh/open-node/open-rest-helper-params)

# Usage

```bash
npm instsall open-rest-helper-params --save
```

## params.omit
从 req.params 上去掉一些参数
```js
var params = require('open-rest-helper-params');

// keys Array 要从req.params 去掉的参数的名称
params.omit(keys);

// return
// function(req, res, next) { ... };

//or 链式调用
params
  .omit
  .keys(['name', 'password'])
  .exec();
```

## params.required
判断某些必须的参数是否存在

```js
var params = require('open-rest-helper-params');

// keys Array 要判断的参数名称
// error 如果不想等报的错误，Error类型, 可选

params.required(keys, error);

// return
// function(req, res, next) { ... };

//or 链式调用
params
  .required
  .keys(['username', 'password'])
  .error(new restify.MissingParameterError('用户名和密码是必填项')
  .exec();
```

## params.map
根据字典将 req.params 的参数名称做个映射

```js
var params = require('open-rest-helper-params');

// dict Object {key(String) => value(String)}

params.map({email: 'username', pwd: 'password'});

// return
// function(req, res, next) { ... };

//or 链式调用
params
  .map({email: 'user', pwd: 'password'})
  .exec();
```

## params.assign
给指定的 req.params 某个key赋值，可以是静态的值，也可以是动态的值

```js
var params = require('open-rest-helper-params');

// keyPath 从 req.params 上的路径，例如: 'id', 'user.name', 分别代表 req.params.id, req.params.user.name
// obj 要赋的值
//    1. {path: 'params.id'} 代表值从 req.params.id 获取
//    2. {fixed: 20} 代表固定的值

// 静态值
params.assign('user.name', {fixed: 'Redstone Zhao'});

// 动态值
params.assign('user.name', {path: 'hooks.user.name'});

// return
// function(req, res, next) { ... };

//or 链式调用
params
  .assign
  .keyPath('user.name')
  .obj({path: 'user.role'})
  .exec();
```
