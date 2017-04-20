/* 
 This is licenced  under creative commons licence Attribution 4.0 (https://creativecommons.org/licenses/by/4.0/).
 Feel free to use it as you please and remix it, just credit me (Byren Higgin) in any instance where this code is used. Thanks!
*/

var PromiseLib = {
    _PROMISE_STATES: {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2
    },
    getThen: function (value) {
        var t = typeof value;
        if (value && (t === 'object' || t === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {
                return then;
            }
        }
        return null;
    },
    doResolve: function (fn, onFulfilled, onRejected) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return
                done = true
                onFulfilled(value)
            }, function (reason) {
                if (done) return
                done = true
                onRejected(reason)
            })
        } catch (ex) {
            if (done) return
            done = true
            onRejected(ex)
        }
    }

}


function Promise(fn) {
    var state = PromiseLib._PROMISE_STATES.PENDING;

    var value = null;

    var handlers = []

    function fulfill(result) {
        state = PromiseLib._PROMISE_STATES.FULFILLED;
        value = result;
    }

    var resolve = function (result) {
        try {
            var then = PromiseLib.getThen(result);
            if (then) {
                PromiseLib.doResolve(then.bind(result), resolve, reject)
                return
            }
            state = PromiseLib._PROMISE_STATES.FULFILLED;
            value = result;
            handlers.forEach(handle);
            handlers = null;
        } catch (e) {
            reject(e);
        }
    }

    var reject = function (error) {
        state = PromiseLib._PROMISE_STATES.REJECTED;
        value = error;
        handlers.forEach(handle);
        handlers = null;
    }

    function handle(handler) {
        if (state === PromiseLib._PROMISE_STATES.PENDING) {
            handlers.push(handler);
        } else {
            if (state === PromiseLib._PROMISE_STATES.FULFILLED && typeof handler.onFulfilled === 'function') {
                handler.onFulfilled(value);
            }
            if (state === PromiseLib._PROMISE_STATES.REJECTED && typeof handler.onRejected === 'function') {
                handler.onRejected(value);
            }
        }
    }

    this.done = function (onFulfilled, onRejected) {
        setTimeout(function () {
            handle({
                onFulfilled: onFulfilled,
                onRejected: onRejected
            });
        }, 0);
    }

    this.then = function (onFulfilled, onRejected) {
        var self = this;
        return new Promise(function (resolve, reject) {
            return self.done(function (result) {
                if (typeof onFulfilled === 'function') {
                    try {
                        return resolve(onFulfilled(result));
                    } catch (ex) {
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return resolve(result);
                }
            }, function (error) {
                if (typeof onRejected === 'function') {
                    try {
                        return resolve(onRejected(error));
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return reject(error);
                }
            });
        });
    }
    PromiseLib.doResolve(fn, resolve, reject);
}
