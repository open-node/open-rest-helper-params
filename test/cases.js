const assert = require('assert');
const rest = require('open-rest');
const helper = require('../')(rest);

describe('open-rest-helper-params', () => {
  describe('omit', () => {
    it('keys type error', (done) => {
      const msg = 'Keys is an array and item must be a string.';
      assert.throws(() => {
        helper.omit({});
      }, err => err instanceof Error && err.message === msg);
      done();
    });

    it('keys item error', (done) => {
      assert.throws(() => {
        helper.omit([null, []]);
      }, err => err instanceof Error && err.message === 'Every item in keys must be a string.');
      done();
    });

    it('omit 1', (done) => {
      const omit = helper.omit(['age']);
      const req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College',
        },
      };
      const res = {};
      omit(req, res, (error) => {
        assert.equal(null, error);
        assert.deepEqual({ name: 'Redstone', edu: 'College' }, req.params);
        done();
      });
    });

    it('omit 2', (done) => {
      const omit = helper.omit(['age', 'edu']);
      const req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College',
        },
      };
      const res = {};
      omit(req, res, (error) => {
        assert.equal(null, error);
        assert.deepEqual({ name: 'Redstone' }, req.params);
        done();
      });
    });

    it('omit params undefined', (done) => {
      const omit = helper.omit(['age', 'edu']);
      const req = {};
      const res = {};
      omit(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(undefined, req.params);
        done();
      });
    });
  });

  describe('required', () => {
    it('keys type error', (done) => {
      const msg = 'Keys is an array and item must be a string.';
      assert.throws(() => {
        helper.required({});
      }, err => err instanceof Error && err.message === msg);
      done();
    });

    it('keys item error', (done) => {
      assert.throws(() => {
        helper.required([null, []]);
      }, err => err instanceof Error && err.message === 'Every item in keys must be a string.');
      done();
    });

    it('error type error', (done) => {
      assert.throws(() => {
        helper.required(['username', 'password'], {});
      }, err => (
        err instanceof Error && err.message === 'The error is called next when params missed.'
      ));
      done();
    });

    it('error is null, check pass', (done) => {
      const required = helper.required(['age']);
      const req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College',
        },
      };
      const res = {};
      required(req, res, (error) => {
        assert.equal(null, error);
        done();
      });
    });

    it('error is null, check dont pass', (done) => {
      const required = helper.required(['income']);
      const req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College',
        },
      };
      const res = {};
      required(req, res, (error) => {
        assert.ok(error instanceof Error);
        assert.equal('Missing required params: income', error.message);
        assert.equal(409, error.statusCode);
        done();
      });
    });

    it('error isnt null, check pass', (done) => {
      const required = helper.required(['age'], Error('Hello world'));
      const req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College',
        },
      };
      const res = {};
      required(req, res, (error) => {
        assert.equal(null, error);
        done();
      });
    });

    it('error isnt null, check dont pass', (done) => {
      const required = helper.required(['income'], Error('Hello world'));
      const req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College',
        },
      };
      const res = {};
      required(req, res, (error) => {
        assert.ok(error instanceof Error);
        assert.equal('Hello world', error.message);
        done();
      });
    });
  });

  describe('map', () => {
    it('dict type error', (done) => {
      assert.throws(() => {
        helper.map('hello world');
      }, (err) => {
        const msg = 'Dict is an object, like this key => value, value is string.';
        return err instanceof Error && err.message === msg;
      });
      done();
    });

    it('dict type error, include non-string', (done) => {
      assert.throws(() => {
        helper.map({ key: ['hello world'] });
      }, err => err instanceof Error && err.message === 'Map dict value must be a string.');
      done();
    });

    it('params map', (done) => {
      const map = helper.map({ name: 'username' });
      const req = {
        params: {
          name: 'Redstone',
          age: 36,
          edu: 'College',
        },
      };
      const res = {};
      map(req, res, (error) => {
        assert.equal(null, error);
        assert.deepEqual({
          name: 'Redstone',
          username: 'Redstone',
          age: 36,
          edu: 'College',
        }, req.params);
        done();
      });
    });
  });

  describe('assign', () => {
    it('keyPath type error', (done) => {
      assert.throws(() => {
        helper.assign(['hello world']);
      }, err => err instanceof Error && err.message === 'Gets the value at path of object.');
      done();
    });

    it('obj type error', (done) => {
      assert.throws(() => {
        helper.assign('hooks.user.id', 'hello world');
      }, err => err instanceof Error && err.message === 'Fixed value or path of req object');
      done();
    });

    it('obj validate error', (done) => {
      assert.throws(() => {
        helper.assign('hooks.user.id', { name: 'Stone' });
      }, (err) => {
        const msg = 'Argument obj contains at least fixed, path one of them.';
        return err instanceof Error && err.message === msg;
      });
      done();
    });

    it('assign fixed value', (done) => {
      const assign = helper.assign('user.id', { fixed: 100 });
      const req = {
        params: {},
      };
      const res = {};
      assign(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(100, req.params.user.id);
        done();
      });
    });

    it('assign path value', (done) => {
      const assign = helper.assign('user.id', { path: 'user.id' });
      const req = {
        params: {},
        user: {
          id: 100,
        },
      };
      const res = {};
      assign(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(100, req.params.user.id);
        done();
      });
    });
  });
});
