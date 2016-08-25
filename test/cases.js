var assert      = require('assert')
  , helper      = require('../');

describe("open-rest-helper-params", function() {

  describe("omit", function() {

    it("keys type error", function(done) {
      assert.throws(function() {
        helper.omit({});
      }, function(err) {
        return err instanceof Error && err.message === 'Keys is an String|Array.'
      });
      done();
    });

    it("keys item error", function(done) {
      assert.throws(function() {
        helper.omit([null, []]);
      }, function(err) {
        return err instanceof Error && err.message === 'Every item in keys must be a string.';
      });
      done();
    });

    it("omit 1", function(done) {
      var omit = helper.omit(['age']);
      var req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College'
        }
      };
      var res = {};
      omit(req, res, function(error) {
        assert.equal(null, error);
        assert.deepEqual({name: 'Redstone', edu: 'College'}, req.params);
        done();
      });
    });

    it("omit 2", function(done) {
      var omit = helper.omit(['age', 'edu']);
      var req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College'
        }
      };
      var res = {};
      omit(req, res, function(error) {
        assert.equal(null, error);
        assert.deepEqual({name: 'Redstone'}, req.params);
        done();
      });
    });

    it("omit params undefined", function(done) {
      var omit = helper.omit(['age', 'edu']);
      var req = {};
      var res = {};
      omit(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(undefined, req.params);
        done();
      });
    });

  });

  describe("required", function() {

    it("keys type error", function(done) {
      assert.throws(function() {
        helper.required({});
      }, function(err) {
        return err instanceof Error && err.message === 'Keys is an String|Array.'
      });
      done();
    });

    it("keys item error", function(done) {
      assert.throws(function() {
        helper.required([null, []]);
      }, function(err) {
        return err instanceof Error && err.message === 'Every item in keys must be a string.';
      });
      done();
    });

    it("error type error", function(done) {
      assert.throws(function() {
        helper.required(['username', 'password'], {});
      }, function(err) {
        return err instanceof Error && err.message === 'The error is called next when params missed.'
      });
      done();
    });

    it("error is null, check pass", function(done) {
      var required = helper.required(['age']);
      var req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College'
        }
      };
      var res = {};
      required(req, res, function(error) {
        assert.equal(null, error);
        done();
      });
    });

    it("error is null, check dont pass", function(done) {
      var required = helper.required(['income']);
      var req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College'
        }
      };
      var res = {};
      required(req, res, function(error) {
        assert.ok(error instanceof Error);
        assert.equal('Missing required params: income', error.message);
        assert.equal(409, error.statusCode);
        done();
      });
    });

    it("error isnt null, check pass", function(done) {
      var required = helper.required(['age'], Error('Hello world'));
      var req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College'
        }
      };
      var res = {};
      required(req, res, function(error) {
        assert.equal(null, error);
        done();
      });
    });

    it("error isnt null, check dont pass", function(done) {
      var required = helper.required(['income'], Error('Hello world'));
      var req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College'
        }
      };
      var res = {};
      required(req, res, function(error) {
        assert.ok(error instanceof Error);
        assert.equal('Hello world', error.message);
        done();
      });
    });

  });

  describe("map", function() {

    it("dict type error", function(done) {
      assert.throws(function() {
        helper.map('hello world');
      }, function(err) {
        return err instanceof Error && err.message === 'Dict is an object, like this key => value, value is string.'
      });
      done();
    });

    it("dict type error, include non-string", function(done) {
      assert.throws(function() {
        helper.map({key: ['hello world']});
      }, function(err) {
        return err instanceof Error && err.message === 'Map dict value must be a string.';
      });
      done();
    });

    it("params map", function(done) {
      var map = helper.map({name: 'username'});
      var req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College'
        }
      };
      var res = {};
      map(req, res, function(error) {
        assert.equal(null, error);
        assert.deepEqual({
          name: 'Redstone',
          username: 'Redstone',
          age: 36,
          edu: 'College'
        }, req.params);
        done();
      });
    });

  });

  describe("assign", function() {

    it("keyPath type error", function(done) {
      assert.throws(function() {
        helper.assign(['hello world']);
      }, function(err) {
        return err instanceof Error && err.message === 'Gets the value at path of object.'
      });
      done();
    });

    it("obj type error", function(done) {
      assert.throws(function() {
        helper.assign('hooks.user.id', 'hello world');
      }, function(err) {
        return err instanceof Error && err.message === 'Fixed value or path of req object'
      });
      done();
    });

    it("obj validate error", function(done) {
      assert.throws(function() {
        helper.assign('hooks.user.id', {name: 'Stone'});
      }, function(err) {
        return err instanceof Error && err.message === 'Argument obj contains at least fixed, path one of them.'
      });
      done();
    });

    it("assign fixed value", function(done) {
      var assign = helper.assign('user.id', {fixed: 100});
      var req = {
        params: {}
      };
      var res = {};
      assign(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(100, req.params.user.id);
        done();
      });
    });

    it("assign path value", function(done) {
      var assign = helper.assign('user.id', {path: 'user.id'});
      var req = {
        params: {},
        user: {
          id: 100
        }
      };
      var res = {};
      assign(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(100, req.params.user.id);
        done();
      });
    });

  });

});
