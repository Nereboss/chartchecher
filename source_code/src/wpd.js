var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (a) {
    return a.raw = a
};
$jscomp.createTemplateTagFirstArgWithRaw = function (a, b) {
    a.raw = b;
    return a
};
$jscomp.arrayIteratorImpl = function (a) {
    var b = 0;
    return function () {
        return b < a.length ? {done: !1, value: a[b++]} : {done: !0}
    }
};
$jscomp.arrayIterator = function (a) {
    return {next: $jscomp.arrayIteratorImpl(a)}
};
$jscomp.makeIterator = function (a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.arrayFromIterator = function (a) {
    for (var b, c = []; !(b = a.next()).done;) c.push(b.value);
    return c
};
$jscomp.arrayFromIterable = function (a) {
    return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a))
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function (a) {
    var b = function () {
    };
    b.prototype = a;
    return new b
};
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
    if (a == Array.prototype || a == Object.prototype) return a;
    a[b] = c.value;
    return a
};
$jscomp.getGlobal = function (a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c
    }
    throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
    var c = $jscomp.propertyToPolyfillSymbol[b];
    if (null == c) return a[b];
    c = a[c];
    return void 0 !== c ? c : a[b]
};
$jscomp.polyfill = function (a, b, c, d) {
    b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, c, d) : $jscomp.polyfillUnisolated(a, b, c, d))
};
$jscomp.polyfillUnisolated = function (a, b, c, d) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
        var e = a[d];
        if (!(e in c)) return;
        c = c[e]
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && $jscomp.defineProperty(c, a, {configurable: !0, writable: !0, value: b})
};
$jscomp.polyfillIsolated = function (a, b, c, d) {
    var e = a.split(".");
    a = 1 === e.length;
    d = e[0];
    d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var f = 0; f < e.length - 1; f++) {
        var g = e[f];
        if (!(g in d)) return;
        d = d[g]
    }
    e = e[e.length - 1];
    c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
    b = b(c);
    null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, e, {
        configurable: !0,
        writable: !0,
        value: b
    }) : b !== c && ($jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + e, e =
        $jscomp.propertyToPolyfillSymbol[e], $jscomp.defineProperty(d, e, {configurable: !0, writable: !0, value: b})))
};
$jscomp.getConstructImplementation = function () {
    function a() {
        function c() {
        }

        new c;
        Reflect.construct(c, [], function () {
        });
        return new c instanceof c
    }

    if ($jscomp.TRUST_ES6_POLYFILLS && "undefined" != typeof Reflect && Reflect.construct) {
        if (a()) return Reflect.construct;
        var b = Reflect.construct;
        return function (c, d, e) {
            c = b(c, d);
            e && Reflect.setPrototypeOf(c, e.prototype);
            return c
        }
    }
    return function (c, d, e) {
        void 0 === e && (e = c);
        e = $jscomp.objectCreate(e.prototype || Object.prototype);
        return Function.prototype.apply.call(c, e, d) ||
            e
    }
};
$jscomp.construct = {valueOf: $jscomp.getConstructImplementation}.valueOf();
$jscomp.underscoreProtoCanBeSet = function () {
    var a = {a: !0}, b = {};
    try {
        return b.__proto__ = a, b.a
    } catch (c) {
    }
    return !1
};
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function (a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
    return a
} : null;
$jscomp.inherits = function (a, b) {
    a.prototype = $jscomp.objectCreate(b.prototype);
    a.prototype.constructor = a;
    if ($jscomp.setPrototypeOf) {
        var c = $jscomp.setPrototypeOf;
        c(a, b)
    } else for (c in b) if ("prototype" != c) if (Object.defineProperties) {
        var d = Object.getOwnPropertyDescriptor(b, c);
        d && Object.defineProperty(a, c, d)
    } else a[c] = b[c];
    a.superClass_ = b.prototype
};
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
    if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function () {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function () {
    if (this.isRunning_) throw new TypeError("Generator is already running");
    this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function () {
    this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function (a) {
    this.yieldResult = a
};
$jscomp.generator.Context.prototype.throw_ = function (a) {
    this.abruptCompletion_ = {exception: a, isException: !0};
    this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype.return = function (a) {
    this.abruptCompletion_ = {return: a};
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
    this.abruptCompletion_ = {jumpTo: a};
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function (a, b) {
    this.nextAddress = b;
    return {value: a}
};
$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
    a = $jscomp.makeIterator(a);
    var c = a.next();
    $jscomp.generator.ensureIteratorResultIsObject_(c);
    if (c.done) this.yieldResult = c.value, this.nextAddress = b; else return this.yieldAllIterator_ = a, this.yield(c.value, b)
};
$jscomp.generator.Context.prototype.jumpTo = function (a) {
    this.nextAddress = a
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
    this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
    this.catchAddress_ = a;
    void 0 != b && (this.finallyAddress_ = b)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = a || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
    this.nextAddress = a;
    this.catchAddress_ = b || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
    this.catchAddress_ = a || 0;
    a = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return a
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, c) {
    c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
    this.catchAddress_ = a || 0;
    this.finallyAddress_ = b || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
    b = this.finallyContexts_.splice(b || 0)[0];
    if (b = this.abruptCompletion_ = this.abruptCompletion_ || b) {
        if (b.isException) return this.jumpToErrorHandler_();
        void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? (this.nextAddress = b.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
    } else this.nextAddress = a
};
$jscomp.generator.Context.prototype.forIn = function (a) {
    return new $jscomp.generator.Context.PropertyIterator(a)
};
$jscomp.generator.Context.PropertyIterator = function (a) {
    this.object_ = a;
    this.properties_ = [];
    for (var b in a) this.properties_.push(b);
    this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
    for (; 0 < this.properties_.length;) {
        var a = this.properties_.pop();
        if (a in this.object_) return a
    }
    return null
};
$jscomp.generator.Engine_ = function (a) {
    this.context_ = new $jscomp.generator.Context;
    this.program_ = a
};
$jscomp.generator.Engine_.prototype.next_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
    this.context_.next_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function (a) {
    this.context_.start_();
    var b = this.context_.yieldAllIterator_;
    if (b) return this.yieldAllStep_("return" in b ? b["return"] : function (c) {
        return {value: c, done: !0}
    }, a, this.context_.return);
    this.context_.return(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
    this.context_.throw_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, c) {
    try {
        var d = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(d);
        if (!d.done) return this.context_.stop_(), d;
        var e = d.value
    } catch (f) {
        return this.context_.yieldAllIterator_ = null, this.context_.throw_(f), this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    c.call(this.context_, e);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
    for (; this.context_.nextAddress;) try {
        var a = this.program_(this.context_);
        if (a) return this.context_.stop_(), {value: a.value, done: !1}
    } catch (b) {
        this.context_.yieldResult = void 0, this.context_.throw_(b)
    }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        a = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (a.isException) throw a.exception;
        return {value: a.return, done: !0}
    }
    return {value: void 0, done: !0}
};
$jscomp.generator.Generator_ = function (a) {
    this.next = function (b) {
        return a.next_(b)
    };
    this.throw = function (b) {
        return a.throw_(b)
    };
    this.return = function (b) {
        return a.return_(b)
    };
    this[Symbol.iterator] = function () {
        return this
    }
};
$jscomp.generator.createGenerator = function (a, b) {
    b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
    $jscomp.setPrototypeOf && a.prototype && $jscomp.setPrototypeOf(b, a.prototype);
    return b
};
$jscomp.asyncExecutePromiseGenerator = function (a) {
    function b(d) {
        return a.next(d)
    }

    function c(d) {
        return a.throw(d)
    }

    return new Promise(function (d, e) {
        function f(g) {
            g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e)
        }

        f(a.next())
    })
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(a())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};
$jscomp.polyfill("Reflect", function (a) {
    return a ? a : {}
}, "es6", "es3");
$jscomp.polyfill("Reflect.construct", function (a) {
    return $jscomp.construct
}, "es6", "es3");
$jscomp.polyfill("Reflect.setPrototypeOf", function (a) {
    if (a) return a;
    if ($jscomp.setPrototypeOf) {
        var b = $jscomp.setPrototypeOf;
        return function (c, d) {
            try {
                return b(c, d), !0
            } catch (e) {
                return !1
            }
        }
    }
    return null
}, "es6", "es5");
$jscomp.initSymbol = function () {
};
$jscomp.polyfill("Symbol", function (a) {
    if (a) return a;
    var b = function (e, f) {
        this.$jscomp$symbol$id_ = e;
        $jscomp.defineProperty(this, "description", {configurable: !0, writable: !0, value: f})
    };
    b.prototype.toString = function () {
        return this.$jscomp$symbol$id_
    };
    var c = 0, d = function (e) {
        if (this instanceof d) throw new TypeError("Symbol is not a constructor");
        return new b("jscomp_symbol_" + (e || "") + "_" + c++, e)
    };
    return d
}, "es6", "es3");
$jscomp.initSymbolIterator = function () {
};
$jscomp.polyfill("Symbol.iterator", function (a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
            var d = $jscomp.global[b[c]];
            "function" === typeof d && "function" != typeof d.prototype[a] && $jscomp.defineProperty(d.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function () {
                    return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
                }
            })
        }
        return a
    }, "es6",
    "es3");
$jscomp.initSymbolAsyncIterator = function () {
};
$jscomp.iteratorPrototype = function (a) {
    a = {next: a};
    a[Symbol.iterator] = function () {
        return this
    };
    return a
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function (a) {
    function b() {
        this.batch_ = null
    }

    function c(g) {
        return g instanceof e ? g : new e(function (h, k) {
            h(g)
        })
    }

    if (a && !$jscomp.FORCE_POLYFILL_PROMISE) return a;
    b.prototype.asyncExecute = function (g) {
        if (null == this.batch_) {
            this.batch_ = [];
            var h = this;
            this.asyncExecuteFunction(function () {
                h.executeBatch_()
            })
        }
        this.batch_.push(g)
    };
    var d = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function (g) {
        d(g, 0)
    };
    b.prototype.executeBatch_ = function () {
        for (; this.batch_ && this.batch_.length;) {
            var g =
                this.batch_;
            this.batch_ = [];
            for (var h = 0; h < g.length; ++h) {
                var k = g[h];
                g[h] = null;
                try {
                    k()
                } catch (l) {
                    this.asyncThrow_(l)
                }
            }
        }
        this.batch_ = null
    };
    b.prototype.asyncThrow_ = function (g) {
        this.asyncExecuteFunction(function () {
            throw g;
        })
    };
    var e = function (g) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var h = this.createResolveAndReject_();
        try {
            g(h.resolve, h.reject)
        } catch (k) {
            h.reject(k)
        }
    };
    e.prototype.createResolveAndReject_ = function () {
        function g(l) {
            return function (p) {
                k || (k = !0, l.call(h, p))
            }
        }

        var h = this, k = !1;
        return {resolve: g(this.resolveTo_), reject: g(this.reject_)}
    };
    e.prototype.resolveTo_ = function (g) {
        if (g === this) this.reject_(new TypeError("A Promise cannot resolve to itself")); else if (g instanceof e) this.settleSameAsPromise_(g); else {
            a:switch (typeof g) {
                case "object":
                    var h = null != g;
                    break a;
                case "function":
                    h = !0;
                    break a;
                default:
                    h = !1
            }
            h ? this.resolveToNonPromiseObj_(g) : this.fulfill_(g)
        }
    };
    e.prototype.resolveToNonPromiseObj_ = function (g) {
        var h = void 0;
        try {
            h = g.then
        } catch (k) {
            this.reject_(k);
            return
        }
        "function" == typeof h ?
            this.settleSameAsThenable_(h, g) : this.fulfill_(g)
    };
    e.prototype.reject_ = function (g) {
        this.settle_(2, g)
    };
    e.prototype.fulfill_ = function (g) {
        this.settle_(1, g)
    };
    e.prototype.settle_ = function (g, h) {
        if (0 != this.state_) throw Error("Cannot settle(" + g + ", " + h + "): Promise already settled in state" + this.state_);
        this.state_ = g;
        this.result_ = h;
        this.executeOnSettledCallbacks_()
    };
    e.prototype.executeOnSettledCallbacks_ = function () {
        if (null != this.onSettledCallbacks_) {
            for (var g = 0; g < this.onSettledCallbacks_.length; ++g) f.asyncExecute(this.onSettledCallbacks_[g]);
            this.onSettledCallbacks_ = null
        }
    };
    var f = new b;
    e.prototype.settleSameAsPromise_ = function (g) {
        var h = this.createResolveAndReject_();
        g.callWhenSettled_(h.resolve, h.reject)
    };
    e.prototype.settleSameAsThenable_ = function (g, h) {
        var k = this.createResolveAndReject_();
        try {
            g.call(h, k.resolve, k.reject)
        } catch (l) {
            k.reject(l)
        }
    };
    e.prototype.then = function (g, h) {
        function k(n, q) {
            return "function" == typeof n ? function (r) {
                try {
                    l(n(r))
                } catch (t) {
                    p(t)
                }
            } : q
        }

        var l, p, m = new e(function (n, q) {
            l = n;
            p = q
        });
        this.callWhenSettled_(k(g, l), k(h, p));
        return m
    };
    e.prototype.catch = function (g) {
        return this.then(void 0, g)
    };
    e.prototype.callWhenSettled_ = function (g, h) {
        function k() {
            switch (l.state_) {
                case 1:
                    g(l.result_);
                    break;
                case 2:
                    h(l.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + l.state_);
            }
        }

        var l = this;
        null == this.onSettledCallbacks_ ? f.asyncExecute(k) : this.onSettledCallbacks_.push(k)
    };
    e.resolve = c;
    e.reject = function (g) {
        return new e(function (h, k) {
            k(g)
        })
    };
    e.race = function (g) {
        return new e(function (h, k) {
            for (var l = $jscomp.makeIterator(g), p = l.next(); !p.done; p = l.next()) c(p.value).callWhenSettled_(h,
                k)
        })
    };
    e.all = function (g) {
        var h = $jscomp.makeIterator(g), k = h.next();
        return k.done ? c([]) : new e(function (l, p) {
            function m(r) {
                return function (t) {
                    n[r] = t;
                    q--;
                    0 == q && l(n)
                }
            }

            var n = [], q = 0;
            do n.push(void 0), q++, c(k.value).callWhenSettled_(m(n.length - 1), p), k = h.next(); while (!k.done)
        })
    };
    return e
}, "es6", "es3");
$jscomp.checkEs6ConformanceViaProxy = function () {
    try {
        var a = {}, b = Object.create(new $jscomp.global.Proxy(a, {
            get: function (c, d, e) {
                return c == a && "q" == d && e == b
            }
        }));
        return !0 === b.q
    } catch (c) {
        return !1
    }
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.owns = function (a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
};
$jscomp.polyfill("WeakMap", function (a) {
    function b() {
        if (!a || !Object.seal) return !1;
        try {
            var l = Object.seal({}), p = Object.seal({}), m = new a([[l, 2], [p, 3]]);
            if (2 != m.get(l) || 3 != m.get(p)) return !1;
            m.delete(l);
            m.set(p, 4);
            return !m.has(l) && 4 == m.get(p)
        } catch (n) {
            return !1
        }
    }

    function c() {
    }

    function d(l) {
        var p = typeof l;
        return "object" === p && null !== l || "function" === p
    }

    function e(l) {
        if (!$jscomp.owns(l, g)) {
            var p = new c;
            $jscomp.defineProperty(l, g, {value: p})
        }
    }

    function f(l) {
        if (!$jscomp.ISOLATE_POLYFILLS) {
            var p = Object[l];
            p && (Object[l] =
                function (m) {
                    if (m instanceof c) return m;
                    Object.isExtensible(m) && e(m);
                    return p(m)
                })
        }
    }

    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
        if (a && $jscomp.ES6_CONFORMANCE) return a
    } else if (b()) return a;
    var g = "$jscomp_hidden_" + Math.random();
    f("freeze");
    f("preventExtensions");
    f("seal");
    var h = 0, k = function (l) {
        this.id_ = (h += Math.random() + 1).toString();
        if (l) {
            l = $jscomp.makeIterator(l);
            for (var p; !(p = l.next()).done;) p = p.value, this.set(p[0], p[1])
        }
    };
    k.prototype.set = function (l, p) {
        if (!d(l)) throw Error("Invalid WeakMap key");
        e(l);
        if (!$jscomp.owns(l, g)) throw Error("WeakMap key fail: " + l);
        l[g][this.id_] = p;
        return this
    };
    k.prototype.get = function (l) {
        return d(l) && $jscomp.owns(l, g) ? l[g][this.id_] : void 0
    };
    k.prototype.has = function (l) {
        return d(l) && $jscomp.owns(l, g) && $jscomp.owns(l[g], this.id_)
    };
    k.prototype.delete = function (l) {
        return d(l) && $jscomp.owns(l, g) && $jscomp.owns(l[g], this.id_) ? delete l[g][this.id_] : !1
    };
    return k
}, "es6", "es3");
$jscomp.MapEntry = function () {
};
$jscomp.polyfill("Map", function (a) {
    function b() {
        if ($jscomp.ASSUME_NO_NATIVE_MAP || !a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) return !1;
        try {
            var k = Object.seal({x: 4}), l = new a($jscomp.makeIterator([[k, "s"]]));
            if ("s" != l.get(k) || 1 != l.size || l.get({x: 4}) || l.set({x: 4}, "t") != l || 2 != l.size) return !1;
            var p = l.entries(), m = p.next();
            if (m.done || m.value[0] != k || "s" != m.value[1]) return !1;
            m = p.next();
            return m.done || 4 != m.value[0].x || "t" != m.value[1] || !p.next().done ? !1 : !0
        } catch (n) {
            return !1
        }
    }

    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
        if (a && $jscomp.ES6_CONFORMANCE) return a
    } else if (b()) return a;
    var c = new WeakMap, d = function (k) {
        this.data_ = {};
        this.head_ = g();
        this.size = 0;
        if (k) {
            k = $jscomp.makeIterator(k);
            for (var l; !(l = k.next()).done;) l = l.value, this.set(l[0], l[1])
        }
    };
    d.prototype.set = function (k, l) {
        k = 0 === k ? 0 : k;
        var p = e(this, k);
        p.list || (p.list = this.data_[p.id] = []);
        p.entry ? p.entry.value = l : (p.entry = {
            next: this.head_,
            previous: this.head_.previous,
            head: this.head_,
            key: k,
            value: l
        }, p.list.push(p.entry),
            this.head_.previous.next = p.entry, this.head_.previous = p.entry, this.size++);
        return this
    };
    d.prototype.delete = function (k) {
        k = e(this, k);
        return k.entry && k.list ? (k.list.splice(k.index, 1), k.list.length || delete this.data_[k.id], k.entry.previous.next = k.entry.next, k.entry.next.previous = k.entry.previous, k.entry.head = null, this.size--, !0) : !1
    };
    d.prototype.clear = function () {
        this.data_ = {};
        this.head_ = this.head_.previous = g();
        this.size = 0
    };
    d.prototype.has = function (k) {
        return !!e(this, k).entry
    };
    d.prototype.get = function (k) {
        return (k =
            e(this, k).entry) && k.value
    };
    d.prototype.entries = function () {
        return f(this, function (k) {
            return [k.key, k.value]
        })
    };
    d.prototype.keys = function () {
        return f(this, function (k) {
            return k.key
        })
    };
    d.prototype.values = function () {
        return f(this, function (k) {
            return k.value
        })
    };
    d.prototype.forEach = function (k, l) {
        for (var p = this.entries(), m; !(m = p.next()).done;) m = m.value, k.call(l, m[1], m[0], this)
    };
    d.prototype[Symbol.iterator] = d.prototype.entries;
    var e = function (k, l) {
        var p = l && typeof l;
        "object" == p || "function" == p ? c.has(l) ? p = c.get(l) :
            (p = "" + ++h, c.set(l, p)) : p = "p_" + l;
        var m = k.data_[p];
        if (m && $jscomp.owns(k.data_, p)) for (k = 0; k < m.length; k++) {
            var n = m[k];
            if (l !== l && n.key !== n.key || l === n.key) return {id: p, list: m, index: k, entry: n}
        }
        return {id: p, list: m, index: -1, entry: void 0}
    }, f = function (k, l) {
        var p = k.head_;
        return $jscomp.iteratorPrototype(function () {
            if (p) {
                for (; p.head != k.head_;) p = p.previous;
                for (; p.next != p.head;) return p = p.next, {done: !1, value: l(p)};
                p = null
            }
            return {done: !0, value: void 0}
        })
    }, g = function () {
        var k = {};
        return k.previous = k.next = k.head = k
    }, h = 0;
    return d
}, "es6", "es3");
$jscomp.polyfill("Set", function (a) {
    function b() {
        if ($jscomp.ASSUME_NO_NATIVE_SET || !a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) return !1;
        try {
            var d = Object.seal({x: 4}), e = new a($jscomp.makeIterator([d]));
            if (!e.has(d) || 1 != e.size || e.add(d) != e || 1 != e.size || e.add({x: 4}) != e || 2 != e.size) return !1;
            var f = e.entries(), g = f.next();
            if (g.done || g.value[0] != d || g.value[1] != d) return !1;
            g = f.next();
            return g.done || g.value[0] == d || 4 != g.value[0].x || g.value[1] != g.value[0] ? !1 : f.next().done
        } catch (h) {
            return !1
        }
    }

    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
        if (a && $jscomp.ES6_CONFORMANCE) return a
    } else if (b()) return a;
    var c = function (d) {
        this.map_ = new Map;
        if (d) {
            d = $jscomp.makeIterator(d);
            for (var e; !(e = d.next()).done;) this.add(e.value)
        }
        this.size = this.map_.size
    };
    c.prototype.add = function (d) {
        d = 0 === d ? 0 : d;
        this.map_.set(d, d);
        this.size = this.map_.size;
        return this
    };
    c.prototype.delete = function (d) {
        d = this.map_.delete(d);
        this.size = this.map_.size;
        return d
    };
    c.prototype.clear = function () {
        this.map_.clear();
        this.size = 0
    };
    c.prototype.has =
        function (d) {
            return this.map_.has(d)
        };
    c.prototype.entries = function () {
        return this.map_.entries()
    };
    c.prototype.values = function () {
        return this.map_.values()
    };
    c.prototype.keys = c.prototype.values;
    c.prototype[Symbol.iterator] = c.prototype.values;
    c.prototype.forEach = function (d, e) {
        var f = this;
        this.map_.forEach(function (g) {
            return d.call(e, g, g, f)
        })
    };
    return c
}, "es6", "es3");
$jscomp.polyfill("Array.from", function (a) {
    return a ? a : function (b, c, d) {
        c = null != c ? c : function (h) {
            return h
        };
        var e = [], f = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator];
        if ("function" == typeof f) {
            b = f.call(b);
            for (var g = 0; !(f = b.next()).done;) e.push(c.call(d, f.value, g++))
        } else for (f = b.length, g = 0; g < f; g++) e.push(c.call(d, b[g], g));
        return e
    }
}, "es6", "es3");
$jscomp.iteratorFromArray = function (a, b) {
    a instanceof String && (a += "");
    var c = 0, d = {
        next: function () {
            if (c < a.length) {
                var e = c++;
                return {value: b(e, a[e]), done: !1}
            }
            d.next = function () {
                return {done: !0, value: void 0}
            };
            return d.next()
        }
    };
    d[Symbol.iterator] = function () {
        return d
    };
    return d
};
$jscomp.polyfill("Array.prototype.values", function (a) {
    return a ? a : function () {
        return $jscomp.iteratorFromArray(this, function (b, c) {
            return c
        })
    }
}, "es8", "es3");
$jscomp.polyfill("Math.log10", function (a) {
    return a ? a : function (b) {
        return Math.log(b) / Math.LN10
    }
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.keys", function (a) {
    return a ? a : function () {
        return $jscomp.iteratorFromArray(this, function (b) {
            return b
        })
    }
}, "es6", "es3");
$jscomp.checkStringArgs = function (a, b, c) {
    if (null == a) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
    if (b instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
    return a + ""
};
$jscomp.polyfill("String.prototype.startsWith", function (a) {
    return a ? a : function (b, c) {
        var d = $jscomp.checkStringArgs(this, b, "startsWith");
        b += "";
        var e = d.length, f = b.length;
        c = Math.max(0, Math.min(c | 0, d.length));
        for (var g = 0; g < f && c < e;) if (d[c++] != b[g++]) return !1;
        return g >= f
    }
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.fill", function (a) {
    return a ? a : function (b, c, d) {
        var e = this.length || 0;
        0 > c && (c = Math.max(0, e + c));
        if (null == d || d > e) d = e;
        d = Number(d);
        0 > d && (d = Math.max(0, e + d));
        for (c = Number(c || 0); c < d; c++) this[c] = b;
        return this
    }
}, "es6", "es3");
$jscomp.typedArrayFill = function (a) {
    return a ? a : Array.prototype.fill
};
$jscomp.polyfill("Int8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint8ClampedArray.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Int16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Int32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Float32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Float64Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Array.prototype.entries", function (a) {
    return a ? a : function () {
        return $jscomp.iteratorFromArray(this, function (b, c) {
            return [b, c]
        })
    }
}, "es6", "es3");
$jscomp.findInternal = function (a, b, c) {
    a instanceof String && (a = String(a));
    for (var d = a.length, e = 0; e < d; e++) {
        var f = a[e];
        if (b.call(c, f, e, a)) return {i: e, v: f}
    }
    return {i: -1, v: void 0}
};
$jscomp.polyfill("Array.prototype.findIndex", function (a) {
    return a ? a : function (b, c) {
        return $jscomp.findInternal(this, b, c).i
    }
}, "es6", "es3");
$jscomp.polyfill("String.prototype.endsWith", function (a) {
    return a ? a : function (b, c) {
        var d = $jscomp.checkStringArgs(this, b, "endsWith");
        b += "";
        void 0 === c && (c = d.length);
        c = Math.max(0, Math.min(c | 0, d.length));
        for (var e = b.length; 0 < e && 0 < c;) if (d[--c] != b[--e]) return !1;
        return 0 >= e
    }
}, "es6", "es3");
$jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function (a, b) {
    for (var c = 1; c < arguments.length; c++) {
        var d = arguments[c];
        if (d) for (var e in d) $jscomp.owns(d, e) && (a[e] = d[e])
    }
    return a
};
$jscomp.polyfill("Object.assign", function (a) {
    return a || $jscomp.assign
}, "es6", "es3");
$jscomp.polyfill("Object.entries", function (a) {
    return a ? a : function (b) {
        var c = [], d;
        for (d in b) $jscomp.owns(b, d) && c.push([d, b[d]]);
        return c
    }
}, "es8", "es3");
var wpd = wpd || {};



wpd.initApp = function () {
    wpd.browserInfo.checkBrowser();
    wpd.layoutManager.initialLayout();
    wpd.handleLaunchArgs();
    // wpd.log();
    document.getElementById("loadingCurtain").style.display = "none"
};


// wpd.loadDefaultImage = function () {
//     (function () {
//         var a, b, c, d;
//         return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
//             if (1 == e.nextAddress) return e.yield(fetch("../temp/begin.png"), 2);
//             if (3 != e.nextAddress) return a = e.yieldResult, e.yield(a.blob(), 3);
//             b = e.yieldResult;
//             c = {type: "image/png"};
//             d = new File([b], "../temp/begin.png", c);
//             wpd.imageManager.initializeFileManager([d]);
//             wpd.imageManager.loadFromFile(d);
//             e.jumpToEnd()
//         })
//     })()
// };



wpd.loadDefaultImage2 = function (s) {
        (function () {
        var a, b, c, d;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {

            const filename= "../temp/"+s;
            if (1 === e.nextAddress) return e.yield(fetch(filename), 2);
            if (3 !== e.nextAddress) return a = e.yieldResult, e.yield(a.blob(), 3);
            b = e.yieldResult;
            c = {type: "image/png"};
            d = new File([b], filename, c);
            wpd.imageManager.initializeFileManager([d]);
            wpd.imageManager.loadFromFile(d);
            e.jumpToEnd()
            wpd.popup.close('axesList');
        })
    })()
};




function doNothing(){

}


wpd.handleLaunchArgs = function () {
    var a = wpd.args.getValue("projectid");
    null == a ? doNothing() : fetch("storage/project/" + a + ".tar").then(function (b) {
        if (b.ok) return b.blob();
        throw Error("Can not open project file with ID: " + a);
    }).then(function (b) {
        wpd.saveResume.readProjectFile(b)
    }).catch(function (b) {
        wpd.messagePopup.show(wpd.gettext("invalid-project"), b);
        wpd.loadDefaultImage()
    })
};
document.addEventListener("DOMContentLoaded", wpd.initApp, !0);
wpd = wpd || {};
wpd._AutoDetectionDataCounter = 0;
wpd.AutoDetectionData = function () {
    this.imageHeight = this.imageWidth = 0;
    this.fgColor = [0, 0, 255];
    this.bgColor = [255, 255, 255];
    this.mask = new Set;
    this.binaryData = new Set;
    this.colorDetectionMode = "fg";
    this.colorDistance = 120;
    this.algorithm = null;
    this.name = wpd._AutoDetectionDataCounter++
};
wpd.AutoDetectionData.prototype.serialize = function () {
    if (null == this.algorithm) return null;
    var a = this.algorithm.serialize();
    if (null == a) return null;
    var b = wpd.rle.encode(Array.from(this.mask.values()).sort(function (c, d) {
        return c - d
    }));
    return {
        fgColor: this.fgColor,
        bgColor: this.bgColor,
        mask: b,
        colorDetectionMode: this.colorDetectionMode,
        colorDistance: this.colorDistance,
        algorithm: a,
        name: this.name,
        imageWidth: this.imageWidth,
        imageHeight: this.imageHeight
    }
};
wpd.AutoDetectionData.prototype.deserialize = function (a) {
    this.fgColor = a.fgColor;
    this.bgColor = a.bgColor;
    this.imageWidth = a.imageWidth;
    this.imageHeight = a.imageHeight;
    if (null != a.mask) {
        var b = wpd.rle.decode(a.mask);
        this.mask = new Set;
        b = $jscomp.makeIterator(b);
        for (var c = b.next(); !c.done; c = b.next()) this.mask.add(c.value)
    }
    this.colorDetectionMode = a.colorDetectionMode;
    this.colorDistance = a.colorDistance;
    null != a.algorithm && (b = a.algorithm.algoType, "AveragingWindowAlgo" === b ? this.algorithm = new wpd.AveragingWindowAlgo :
        "AveragingWindowWithStepSizeAlgo" === b ? this.algorithm = new wpd.AveragingWindowWithStepSizeAlgo : "BarExtractionAlgo" === b ? this.algorithm = new wpd.BarExtractionAlgo : "BlobDetectorAlgo" === b ? this.algorithm = new wpd.BlobDetectorAlgo : "XStepWithInterpolationAlgo" === b ? this.algorithm = new wpd.XStepWithInterpolationAlgo : "CustomIndependents" === b && (this.algorithm = new wpd.CustomIndependents), this.algorithm.deserialize(a.algorithm));
    this.name = a.name
};
wpd.AutoDetectionData.prototype.generateBinaryDataFromMask = function (a) {
    this.binaryData = new Set;
    for (var b = "fg" === this.colorDetectionMode ? this.fgColor : this.bgColor, c = $jscomp.makeIterator(this.mask), d = c.next(); !d.done; d = c.next()) {
        d = d.value;
        var e = a.data[4 * d], f = a.data[4 * d + 1], g = a.data[4 * d + 2];
        0 === a.data[4 * d + 3] && (g = f = e = 255);
        e = wpd.dist3d(e, f, g, b[0], b[1], b[2]);
        "fg" === this.colorDetectionMode ? e <= this.colorDistance && this.binaryData.add(d) : e >= this.colorDistance && this.binaryData.add(d)
    }
};
wpd.AutoDetectionData.prototype.generateBinaryDataUsingFullImage = function (a) {
    this.binaryData = new Set;
    for (var b = "fg" === this.colorDetectionMode ? this.fgColor : this.bgColor, c = 0; c < a.data.length; c++) {
        var d = a.data[4 * c], e = a.data[4 * c + 1], f = a.data[4 * c + 2];
        0 === a.data[4 * c + 3] && (f = e = d = 255);
        d = wpd.dist3d(d, e, f, b[0], b[1], b[2]);
        "fg" === this.colorDetectionMode ? d <= this.colorDistance && this.binaryData.add(c) : d >= this.colorDistance && this.binaryData.add(c)
    }
};
wpd.AutoDetectionData.prototype.generateBinaryData = function (a) {
    null == this.mask || 0 == this.mask.size ? this.generateBinaryDataUsingFullImage(a) : this.generateBinaryDataFromMask(a)
};
wpd.GridDetectionData = function () {
    this.mask = {xmin: null, xmax: null, ymin: null, ymax: null, pixels: []};
    this.lineColor = [255, 255, 255];
    this.colorDistance = 10;
    this.gridData = null;
    this.gridMask = {xmin: null, xmax: null, ymin: null, ymax: null, pixels: new Set};
    this.binaryData = new Set;
    this.imageHeight = this.imageWidth = 0;
    this.backupImageData = null;
    this.gridBackgroundMode = !0
};
wpd.GridDetectionData.prototype.generateBinaryData = function (a) {
    this.binaryData = new Set;
    this.imageWidth = a.width;
    this.imageHeight = a.height;
    if (null == this.gridMask.pixels || 0 === this.gridMask.pixels.size) {
        this.gridMask.pixels = new Set;
        for (var b = 0; b < this.imageHeight; b++) for (var c = 0; c < this.imageWidth; c++) {
            var d = b * this.imageWidth + c, e = a.data[4 * d], f = a.data[4 * d + 1], g = a.data[4 * d + 2];
            0 === a.data[4 * d + 3] && (g = f = e = 255);
            e = wpd.dist3d(this.lineColor[0], this.lineColor[1], this.lineColor[2], e, f, g);
            this.gridBackgroundMode ? e >
                this.colorDistance && (this.binaryData.add(d), this.gridMask.pixels.add(d)) : e < this.colorDistance && (this.binaryData.add(d), this.gridMask.pixels.add(d))
        }
        this.gridMask.xmin = 0;
        this.gridMask.xmax = this.imageWidth;
        this.gridMask.ymin = 0;
        this.gridMask.ymax = this.imageHeight
    } else for (b = $jscomp.makeIterator(this.gridMask.pixels), c = b.next(); !c.done; c = b.next()) c = c.value, d = wpd.dist3d(this.lineColor[0], this.lineColor[1], this.lineColor[2], a.data[4 * c], a.data[4 * c + 1], a.data[4 * c + 2]), this.gridBackgroundMode ? d > this.colorDistance &&
        this.binaryData.add(c) : d < this.colorDistance && this.binaryData.add(c)
};
wpd = wpd || {};
wpd.Calibration = function (a) {
    this._dim = a;
    this._px = [];
    this._py = [];
    this._dimensions = null == a ? 2 : a;
    this._dp = [];
    this._selections = [];
    this.labels = [];
    this.labelPositions = [];
    this.maxPointCount = 0
};
wpd.Calibration.prototype.getCount = function () {
    return this._px.length
};
wpd.Calibration.prototype.getDimensions = function () {
    return this._dimensions
};
wpd.Calibration.prototype.addPoint = function (a, b, c, d, e) {
    console.log(this);
    var f = this._px.length, g = this._dp.length;
    this._px[f] = a;
    this._py[f] = b;
    this._dp[g] = c;
    this._dp[g + 1] = d;
    3 === this._dimensions && (this._dp[g + 2] = e)
};
wpd.Calibration.prototype.getPoint = function (a) {
    return 0 > a || a >= this._px.length ? null : {
        px: this._px[a],
        py: this._py[a],
        dx: this._dp[this._dimensions * a],
        dy: this._dp[this._dimensions * a + 1],
        dz: 2 === this._dimensions ? null : this._dp[this._dimensions * a + 2]
    }
};
wpd.Calibration.prototype.changePointPx = function (a, b, c) {
    0 > a || a >= this._px.length || (this._px[a] = b, this._py[a] = c)
};
wpd.Calibration.prototype.setDataAt = function (a, b, c, d) {
    0 > a || a >= this._px.length || (this._dp[this._dimensions * a] = b, this._dp[this._dimensions * a + 1] = c, 3 === this._dimensions && (this._dp[this._dimensions * a + 2] = d))
};
wpd.Calibration.prototype.findNearestPoint = function (a, b, c) {
    c = null == c ? 50 : parseFloat(c);
    for (var d = 0, e = -1, f = 0; f < this._px.length; f++) {
        var g = Math.sqrt((a - this._px[f]) * (a - this._px[f]) + (b - this._py[f]) * (b - this._py[f]));
        if (0 > e && g <= c || 0 <= e && g < d) e = f, d = g
    }
    return e
};
wpd.Calibration.prototype.selectPoint = function (a) {
    0 > this._selections.indexOf(a) && this._selections.push(a)
};
wpd.Calibration.prototype.selectNearestPoint = function (a, b, c) {
    a = this.findNearestPoint(a, b, c);
    0 <= a && this.selectPoint(a)
};
wpd.Calibration.prototype.getSelectedPoints = function () {
    return this._selections
};
wpd.Calibration.prototype.unselectAll = function () {
    this._selections = []
};
wpd.Calibration.prototype.isPointSelected = function (a) {
    return 0 <= this._selections.indexOf(a)
};
wpd.Calibration.prototype.dump = function () {
    console.log(this._px);
    console.log(this._py);
    console.log(this._dp)
};
wpd = wpd || {};
wpd.ColorGroup = function () {
    return function (a) {
        var b = 0, c = {r: 0, g: 0, b: 0};
        a = null == a ? 100 : a;
        this.getPixelCount = function () {
            return b
        };
        this.getAverageColor = function () {
            return c
        };
        this.isColorInGroup = function (d, e, f) {
            return 0 === b ? !0 : (c.r - d) * (c.r - d) + (c.g - e) * (c.g - e) + (c.b - f) * (c.b - f) <= a * a
        };
        this.addPixel = function (d, e, f) {
            c.r = (c.r * b + d) / (b + 1);
            c.g = (c.g * b + e) / (b + 1);
            c.b = (c.b * b + f) / (b + 1);
            b += 1
        }
    }
}();
wpd.colorAnalyzer = function () {
    return {
        getTopColors: function (a) {
            var b = [], c, d = [];
            b[0] = new wpd.ColorGroup(120);
            for (c = 0; c < a.data.length; c += 4) {
                var e = a.data[c];
                var f = a.data[c + 1];
                var g = a.data[c + 2];
                var h = a.data[c + 3];
                0 === h && (g = f = e = 255);
                var k = !1;
                for (h = 0; h < b.length; h++) if (b[h].isColorInGroup(e, f, g)) {
                    b[h].addPixel(e, f, g);
                    k = !0;
                    break
                }
                k || (b[b.length] = new wpd.ColorGroup(120), b[b.length - 1].addPixel(e, f, g))
            }
            b.sort(function (l, p) {
                return l.getPixelCount() > p.getPixelCount() ? -1 : l.getPixelCount() < p.getPixelCount() ? 1 : 0
            });
            for (h =
                     0; h < b.length; h++) c = b[h].getAverageColor(), d[h] = {
                r: parseInt(c.r, 10),
                g: parseInt(c.g, 10),
                b: parseInt(c.b, 10),
                pixels: b[h].getPixelCount(),
                percentage: 100 * b[h].getPixelCount() / (.25 * a.data.length)
            };
            return d
        }
    }
}();
wpd = wpd || {};
wpd.Color = function (a, b, c, d) {
    this._r = void 0 === a ? 0 : a;
    this._g = void 0 === b ? 0 : b;
    this._b = void 0 === c ? 0 : c;
    this._a = void 0 === d ? 255 : d
};
wpd.Color.prototype.toRGBString = function () {
    return "rgb(" + this._r + ", " + this._g + ", " + this._b + ")"
};
wpd.Color.prototype.toRGBAString = function () {
    return "rgba(" + this._r + ", " + this._g + ", " + this._b + ", " + this._a + ")"
};
wpd.Color.prototype.serialize = function () {
    return [this._r, this._g, this._b, this._a]
};
wpd.Color.prototype.getRGB = function () {
    return [this._r, this._g, this._b]
};
wpd.Color.prototype.deserialize = function (a) {
    this._r = a[0];
    this._g = a[1];
    this._b = a[2];
    this._a = a[3]
};
wpd = wpd || {};
wpd.ConnectedPoints = function (a) {
    this._connections = [];
    this._selectedPointIndex = this._selectedConnectionIndex = -1;
    this._connectivity = a;
    wpd.appData.isMultipage() && (this.page = 1)
};
wpd.ConnectedPoints.prototype.addConnection = function (a) {
    this._connections.push(a)
};
wpd.ConnectedPoints.prototype.clearAll = function () {
    this._connections = []
};
wpd.ConnectedPoints.prototype.getConnectionAt = function (a) {
    if (a < this._connections.length) return this._connections[a]
};
wpd.ConnectedPoints.prototype.replaceConnectionAt = function (a, b) {
    a < this._connections.length && (this._connections[a] = b)
};
wpd.ConnectedPoints.prototype.deleteConnectionAt = function (a) {
    a < this._connections.length && this._connections.splice(a, 1)
};
wpd.ConnectedPoints.prototype.connectionCount = function () {
    return this._connections.length
};
wpd.ConnectedPoints.prototype.findNearestPointAndConnection = function (a, b) {
    var c = -1, d = -1, e, f;
    for (e = 0; e < this._connections.length; e++) for (f = 0; f < this._connections[e].length; f += 2) {
        var g = (this._connections[e][f] - a) * (this._connections[e][f] - a) + (this._connections[e][f + 1] - b) * (this._connections[e][f + 1] - b);
        if (-1 === d || g < h) {
            c = e;
            d = f / 2;
            var h = g
        }
    }
    return {connectionIndex: c, pointIndex: d}
};
wpd.ConnectedPoints.prototype.selectNearestPoint = function (a, b) {
    a = this.findNearestPointAndConnection(a, b);
    0 <= a.connectionIndex && (this._selectedConnectionIndex = a.connectionIndex, this._selectedPointIndex = a.pointIndex)
};
wpd.ConnectedPoints.prototype.deleteNearestConnection = function (a, b) {
    a = this.findNearestPointAndConnection(a, b);
    0 <= a.connectionIndex && this.deleteConnectionAt(a.connectionIndex)
};
wpd.ConnectedPoints.prototype.isPointSelected = function (a, b) {
    return this._selectedPointIndex === b && this._selectedConnectionIndex === a ? !0 : !1
};
wpd.ConnectedPoints.prototype.getSelectedConnectionAndPoint = function () {
    return {connectionIndex: this._selectedConnectionIndex, pointIndex: this._selectedPointIndex}
};
wpd.ConnectedPoints.prototype.unselectConnectionAndPoint = function () {
    this._selectedPointIndex = this._selectedConnectionIndex = -1
};
wpd.ConnectedPoints.prototype.setPointAt = function (a, b, c, d) {
    this._connections[a][2 * b] = c;
    this._connections[a][2 * b + 1] = d
};
wpd.ConnectedPoints.prototype.getPointAt = function (a, b) {
    return {x: this._connections[a][2 * b], y: this._connections[a][2 * b + 1]}
};
wpd.DistanceMeasurement = function () {
    wpd.ConnectedPoints.call(this, 2)
};
$jscomp.inherits(wpd.DistanceMeasurement, wpd.ConnectedPoints);
wpd.DistanceMeasurement.prototype.getDistance = function (a) {
    if (a < this._connections.length && 2 === this._connectivity) return Math.sqrt((this._connections[a][0] - this._connections[a][2]) * (this._connections[a][0] - this._connections[a][2]) + (this._connections[a][1] - this._connections[a][3]) * (this._connections[a][1] - this._connections[a][3]))
};
wpd.AngleMeasurement = function () {
    wpd.ConnectedPoints.call(this, 3)
};
$jscomp.inherits(wpd.AngleMeasurement, wpd.ConnectedPoints);
wpd.AngleMeasurement.prototype.getAngle = function (a) {
    if (a < this._connections.length && 3 === this._connectivity) {
        var b = wpd.taninverse(-(this._connections[a][5] - this._connections[a][3]), this._connections[a][4] - this._connections[a][2]);
        a = wpd.taninverse(-(this._connections[a][1] - this._connections[a][3]), this._connections[a][0] - this._connections[a][2]);
        b = 180 * (b - a) / Math.PI;
        return 0 > b ? b + 360 : b
    }
};
wpd.AreaMeasurement = function () {
    wpd.ConnectedPoints.call(this, -1)
};
$jscomp.inherits(wpd.AreaMeasurement, wpd.ConnectedPoints);
wpd.AreaMeasurement.prototype.getArea = function (a) {
    if (a < this._connections.length && 4 <= this._connections[a].length) {
        for (var b = 0, c = 0; c < this._connections[a].length; c += 2) {
            var d = this._connections[a][c], e = this._connections[a][c + 1];
            if (c <= this._connections[a].length - 4) {
                var f = this._connections[a][c + 2];
                var g = this._connections[a][c + 3]
            } else f = this._connections[a][0], g = this._connections[a][1];
            b += d * g - f * e
        }
        return b / 2
    }
    return 0
};
wpd.AreaMeasurement.prototype.getPerimeter = function (a) {
    if (a < this._connections.length) {
        for (var b = 0, c = 0, d = 0, e = 0; e < this._connections[a].length; e += 2) {
            var f = this._connections[a][e], g = this._connections[a][e + 1];
            2 <= e && (b += Math.sqrt((f - c) * (f - c) + (g - d) * (g - d)));
            e == this._connections[a].length - 2 && 4 <= e && (c = this._connections[a][0], d = this._connections[a][1], b += Math.sqrt((f - c) * (f - c) + (g - d) * (g - d)));
            c = f;
            d = g
        }
        return b
    }
};
wpd = wpd || {};
wpd.plotDataProvider = function () {
    function a(d, e) {
        var f = [], g = [!1, !0];
        d.hasMetadata();
        var h = ["Label", "Value"], k = d.getMetadataKeys(), l = -1 < k.indexOf("overrides");
        l && (k = k.filter(function (q) {
            return "overrides" !== q
        }));
        for (k = 0; k < d.getCount(); k++) {
            var p = d.getPixel(k), m = e.pixelToData(p.x, p.y);
            f[k] = [];
            var n = "Bar" + k;
            null != p.metadata && (n = p.metadata.label);
            f[k][0] = n;
            f[k][1] = m[0];
            l && (m = null, null != p.metadata && null != p.metadata.overrides && null != p.metadata.overrides.y && (m = p.metadata.overrides.y), f[k][2] = m)
        }
        l && (h = h.concat(["Value-Override"]),
            g.push(!0));
        return {
            fields: h,
            fieldDateFormat: [],
            rawData: f,
            allowConnectivity: !1,
            connectivityFieldIndices: [],
            isFieldSortable: g
        }
    }

    function b(d, e) {
        var f = [], g = [], h = d.hasMetadata(), k = e.getAxesLabels(), l = [], p = [], m = d.getMetadataKeys(),
            n = !0 === h ? m.length : 0, q = -1 < m.indexOf("overrides");
        q && (m = m.filter(function (A) {
            return "overrides" !== A
        }), --n);
        for (var r = 0; r < d.getCount(); r++) {
            var t = d.getPixel(r), x = e.pixelToData(t.x, t.y);
            f[r] = [];
            for (var u = 0; u < x.length; u++) f[r][u] = x[u];
            u = void 0;
            for (u = 0; u < n; u++) {
                var y = m[u], v = null;
                null !=
                t.metadata && null != t.metadata[y] && (v = t.metadata[y]);
                f[r][x.length + u] = v
            }
            if (q) for (y = 0; y < k.length; y++) {
                v = k[y].toLowerCase();
                var z = null;
                null != t.metadata && null != t.metadata.overrides && null != t.metadata.overrides[v] && (z = t.metadata.overrides[v]);
                f[r][x.length + u + y] = z
            }
        }
        h && (k = k.concat(m), q && (k = k.concat(k.map(function (A) {
            return wpd.utils.toSentenceCase(A) + "-Override"
        }))));
        for (d = 0; d < k.length; d++) d < e.getDimensions() && (p[d] = d, null != e.isDate && e.isDate(d) && (l[d] = e.getInitialDateFormat(d))), g[d] = !0;
        return {
            fields: k, fieldDateFormat: l,
            rawData: f, allowConnectivity: !0, connectivityFieldIndices: p, isFieldSortable: g
        }
    }

    var c = null;
    return {
        setDataSource: function (d) {
            c = d
        }, getData: function () {
            var d = wpd.appData.getPlotData().getAxesForDataset(c);
            return d instanceof wpd.BarAxes ? a(c, d) : b(c, d)
        }
    }
}();
wpd.measurementDataProvider = function () {
    var a = null;
    return {
        getData: function () {
            var b = [], c = [], d = [], e = wpd.appData.getPlotData().getAxesForMeasurement(a),
                f = null != e && e instanceof wpd.MapAxes;
            if (a instanceof wpd.DistanceMeasurement) {
                for (b = 0; b < a.connectionCount(); b++) c[b] = [], c[b][0] = "Dist" + b, c[b][1] = f ? e.pixelToDataDistance(a.getDistance(b)) : a.getDistance(b);
                b = ["Label", "Distance"];
                d = [!1, !0]
            } else if (a instanceof wpd.AngleMeasurement) {
                for (b = 0; b < a.connectionCount(); b++) c[b] = [], c[b][0] = "Theta" + b, c[b][1] = a.getAngle(b);
                b = ["Label", "Angle"];
                d = [!1, !0]
            } else if (a instanceof wpd.AreaMeasurement) {
                for (b = 0; b < a.connectionCount(); b++) c[b] = [], c[b][0] = "Poly" + b, f ? (c[b][1] = e.pixelToDataArea(a.getArea(b)), c[b][2] = e.pixelToDataDistance(a.getPerimeter(b))) : (c[b][1] = a.getArea(b), c[b][2] = a.getPerimeter(b));
                b = ["Label", "Area", "Perimeter"];
                d = [!1, !0, !0]
            }
            return {
                fields: b,
                fieldDateFormat: [],
                rawData: c,
                allowConnectivity: !1,
                connectivityFieldIndices: [],
                isFieldSortable: d
            }
        }, setDataSource: function (b) {
            a = b
        }
    }
}();
wpd = wpd || {};
wpd.Dataset = function (a) {
    this._dim = a;
    this._dataPoints = [];
    this._connections = [];
    this._selections = [];
    this._metadataCount = 0;
    this._mkeys = [];
    this.name = "Default Dataset";
    this.variableNames = ["x", "y"];
    this.colorRGB = new wpd.Color(200, 0, 0)
};
wpd.Dataset.prototype.hasMetadata = function () {
    return 0 < this._metadataCount
};
wpd.Dataset.prototype.setMetadataKeys = function (a) {
    this._mkeys = a
};
wpd.Dataset.prototype.getMetadataKeys = function () {
    return this._mkeys
};
wpd.Dataset.prototype.addPixel = function (a, b, c) {
    this._dataPoints[this._dataPoints.length] = {x: a, y: b, metadata: c};
    null != c && this._metadataCount++
};
wpd.Dataset.prototype.getPixel = function (a) {
    return this._dataPoints[a]
};
wpd.Dataset.prototype.getAllPixels = function () {
    return this._dataPoints
};
wpd.Dataset.prototype.setPixelAt = function (a, b, c) {
    a < this._dataPoints.length && (this._dataPoints[a].x = b, this._dataPoints[a].y = c)
};
wpd.Dataset.prototype.setMetadataAt = function (a, b) {
    a < this._dataPoints.length && (null != b ? null == this._dataPoints[a].metadata && this._metadataCount++ : null != this._dataPoints[a].metadata && this._metadataCount--, this._dataPoints[a].metadata = b)
};
wpd.Dataset.prototype.insertPixel = function (a, b, c, d) {
    this._dataPoints.splice(a, 0, {x: b, y: c, metadata: d});
    null != d && this._metadataCount++
};
wpd.Dataset.prototype.removePixelAtIndex = function (a) {
    a < this._dataPoints.length && (null != this._dataPoints[a].metadata && this._metadataCount--, this._dataPoints.splice(a, 1))
};
wpd.Dataset.prototype.removeLastPixel = function () {
    removePixelAtIndex(this._dataPoints.length - 1)
};
wpd.Dataset.prototype.findNearestPixel = function (a, b, c) {
    c = null == c ? 50 : parseFloat(c);
    for (var d = 0, e = -1, f = 0; f < this._dataPoints.length; f++) {
        var g = Math.sqrt((a - this._dataPoints[f].x) * (a - this._dataPoints[f].x) + (b - this._dataPoints[f].y) * (b - this._dataPoints[f].y));
        if (0 > e && g <= c || 0 <= e && g < d) e = f, d = g
    }
    return e
};
wpd.Dataset.prototype.removeNearestPixel = function (a, b, c) {
    a = this.findNearestPixel(a, b, c);
    0 <= a && this.removePixelAtIndex(a)
};
wpd.Dataset.prototype.clearAll = function () {
    this._dataPoints = [];
    this._metadataCount = 0;
    this._mkeys = []
};
wpd.Dataset.prototype.getCount = function () {
    return this._dataPoints.length
};
wpd.Dataset.prototype.selectPixel = function (a) {
    0 <= this._selections.indexOf(a) || this._selections.push(a)
};
wpd.Dataset.prototype.selectPixels = function (a) {
    for (var b = 0; b < a.length; b++) this.selectPixel(a[b])
};
wpd.Dataset.prototype.unselectAll = function () {
    this._selections = []
};
wpd.Dataset.prototype.selectPixelsInRectangle = function (a, b) {
    var c = {
        ne: function (f, g) {
            return f >= a.x && f <= b.x && g >= a.y && g <= b.y
        }, se: function (f, g) {
            return f >= a.x && f <= b.x && g <= a.y && g >= b.y
        }, sw: function (f, g) {
            return f <= a.x && f >= b.x && g <= a.y && g >= b.y
        }, nw: function (f, g) {
            return f <= a.x && f >= b.x && g >= a.y && g <= b.y
        }
    }, d = 0 < a.x - b.x ? -1 : 1, e = null;
    e = 0 < (0 < a.y - b.y ? 1 : -1) ? 0 < d ? "se" : "sw" : 0 < d ? "ne" : "nw";
    for (d = 0; d < this._dataPoints.length; d++) c[e](this._dataPoints[d].x, this._dataPoints[d].y) && this.selectPixel(d)
};
wpd.Dataset.prototype.selectNearestPixel = function (a, b, c) {
    a = this.findNearestPixel(a, b, c);
    0 <= a && this.selectPixel(a);
    return a
};
wpd.Dataset.prototype.selectNextPixel = function () {
    for (var a = 0; a < this._selections.length; a++) this._selections[a] = (this._selections[a] + 1) % this._dataPoints.length
};
wpd.Dataset.prototype.selectPreviousPixel = function () {
    for (var a = 0; a < this._selections.length; a++) {
        var b = this._selections[a];
        b = 0 === b ? this._dataPoints.length - 1 : b - 1;
        this._selections[a] = b
    }
};
wpd.Dataset.prototype.getSelectedPixels = function () {
    return this._selections
};
wpd = wpd || {};
wpd.dateConverter = function () {
    function a(b) {
        b = b.toString();
        var c = b.split(/[/ :]/);
        b = 0 <= b.indexOf("/");
        if (0 >= c.length || 6 < c.length) return null;
        if (b) {
            b = parseInt(c[0], 10);
            var d = parseInt(void 0 === c[1] ? 0 : c[1], 10);
            var e = parseInt(void 0 === c[2] ? 1 : c[2], 10);
            var f = 3
        } else e = new Date, b = e.getFullYear(), d = e.getMonth() + 1, e = e.getDate(), f = 0;
        var g = parseInt(void 0 === c[f] ? 0 : c[f], 10);
        var h = parseInt(void 0 === c[f + 1] ? 0 : c[f + 1], 10);
        c = parseInt(void 0 === c[f + 2] ? 0 : c[f + 2], 10);
        if (isNaN(b) || isNaN(d) || isNaN(e) || isNaN(g) || isNaN(h) || isNaN(c) ||
            12 < d || 1 > d || 31 < e || 1 > e || 23 < g || 0 > g || 59 < h || 0 > h || 59 < c || 0 > c) return null;
        f = new Date;
        f.setUTCFullYear(b);
        f.setUTCMonth(d - 1);
        f.setUTCDate(e);
        f.setUTCHours(g, h, c);
        c = parseFloat(Date.parse(f));
        return isNaN(c) ? null : c
    }

    return {
        parse: function (b) {
            return null == b || "string" === typeof b && 0 > b.indexOf("/") && 0 > b.indexOf(":") ? null : a(b)
        }, getFormatString: function (b) {
            var c = b.split(/[/ :]/);
            b = 0 <= b.indexOf("/");
            var d = "yyyy/mm/dd hh:ii:ss";
            1 <= c.length && (d = b ? "yyyy" : "hh");
            2 <= c.length && (d += b ? "/mm" : ":ii");
            3 <= c.length && (d += b ? "/dd" : ":ss");
            4 <= c.length && (d += " hh");
            5 <= c.length && (d += ":ii");
            6 === c.length && (d += ":ss");
            return d
        }, formatDateNumber: function (b, c) {
            var d = 1;
            0 <= c.indexOf("s") ? d = 1E3 : 0 <= c.indexOf("i") ? d = 6E4 : 0 <= c.indexOf("h") ? d = 36E5 : 0 <= c.indexOf("d") ? d = 864E5 : 0 <= c.indexOf("m") ? d = 2629746E3 : 0 <= c.indexOf("y") && (d = 31556952E3);
            b = new Date(Math.round((new Date(b)).getTime() / d) * d);
            d = [];
            for (var e = [], f = new Date, g = 0; 12 > g; g++) f.setUTCMonth(g), d.push(f.toLocaleString(void 0, {month: "long"})), e.push(f.toLocaleString(void 0, {month: "short"}));
            c = c.replace("YYYY",
                "yyyy");
            c = c.replace("YY", "yy");
            c = c.replace("MMMM", "mmmm");
            c = c.replace("MMM", "mmm");
            c = c.replace("MM", "mm");
            c = c.replace("DD", "dd");
            c = c.replace("HH", "hh");
            c = c.replace("II", "ii");
            c = c.replace("SS", "ss");
            c = c.replace("yyyy", b.getUTCFullYear());
            f = b.getUTCFullYear() % 100;
            c = c.replace("yy", 10 > f ? "0" + f : f);
            c = c.replace("mmmm", d[b.getUTCMonth()]);
            c = c.replace("mmm", e[b.getUTCMonth()]);
            c = c.replace("mm", ("0" + (b.getUTCMonth() + 1)).slice(-2));
            c = c.replace("dd", ("0" + b.getUTCDate()).slice(-2));
            c = c.replace("hh", ("0" + b.getUTCHours()).slice(-2));
            c = c.replace("ii", ("0" + b.getUTCMinutes()).slice(-2));
            return c = c.replace("ss", ("0" + b.getUTCSeconds()).slice(-2))
        }
    }
}();
wpd = wpd || {};
wpd.gridDetectionCore = function () {
    var a, b, c = .1, d = .1;
    return {
        run: function (e) {
            var f = new Set, g, h, k = e.gridMask.xmin, l = e.gridMask.xmax, p = e.gridMask.ymin, m = e.gridMask.ymax,
                n = e.imageWidth;
            if (b) for (g = k; g <= l; g++) {
                var q = 0;
                for (h = p; h < m; h++) e.binaryData.has(h * n + g) && q++;
                if (q > d * (m - p)) for (h = p; h < m; h++) f.add(h * n + g)
            }
            if (a) for (h = p; h <= m; h++) {
                q = 0;
                for (g = k; g <= l; g++) e.binaryData.has(h * n + g) && q++;
                if (q > c * (l - k)) for (g = k; g <= l; g++) f.add(h * n + g)
            }
            return f
        }, setHorizontalParameters: function (e, f) {
            a = e;
            d = Math.abs(parseFloat(f) / 100)
        }, setVerticalParameters: function (e,
                                            f) {
            b = e;
            c = Math.abs(parseFloat(f) / 100)
        }
    }
}();
wpd = wpd || {};
wpd.InputParser = function () {
    this.isDate = this.isValid = !1;
    this.formatting = null;
    this.isArray = !1
};
wpd.InputParser.prototype.parse = function (a) {
    this.isDate = this.isValid = !1;
    this.formatting = null;
    if (null == a || "string" === typeof a && (a = a.trim(), 0 <= a.indexOf("^"))) return null;
    var b = wpd.dateConverter.parse(a);
    if (null != b) return this.isDate = this.isValid = !0, this.formatting = wpd.dateConverter.getFormatString(a), b;
    b = this._parseArray(a);
    if (null != b) return this.isArray = this.isValid = !0, b;
    a = parseFloat(a);
    return isNaN(a) ? null : (this.isValid = !0, a)
};
wpd.InputParser.prototype._parseArray = function (a) {
    a = a.replace("[", "").replace("]", "").split(",").map(function (b) {
        return parseFloat(b)
    }).filter(function (b) {
        return !isNaN(b)
    });
    return 0 == a.length ? null : a
};
wpd = wpd || {};
wpd.taninverse = function (a, b) {
    var c;
    0 < a ? c = Math.atan2(a, b) : 0 >= a && (c = Math.atan2(a, b) + 2 * Math.PI);
    c >= 2 * Math.PI && (c = 0);
    return c
};
wpd.sqDist2d = function (a, b, c, d) {
    return (a - c) * (a - c) + (b - d) * (b - d)
};
wpd.sqDist3d = function (a, b, c, d, e, f) {
    return (a - d) * (a - d) + (b - e) * (b - e) + (c - f) * (c - f)
};
wpd.dist2d = function (a, b, c, d) {
    return Math.sqrt(wpd.sqDist2d(a, b, c, d))
};
wpd.dist3d = function (a, b, c, d, e, f) {
    return Math.sqrt(wpd.sqDist3d(a, b, c, d, e, f))
};
wpd.mat = function () {
    function a(b) {
        return b[0] * b[3] - b[1] * b[2]
    }

    return {
        det2x2: a, inv2x2: function (b) {
            var c = a(b);
            return [b[3] / c, -b[1] / c, -b[2] / c, b[0] / c]
        }, mult2x2: function (b, c) {
            return [b[0] * c[0] + b[1] * c[2], b[0] * c[1] + b[1] * c[3], b[2] * c[0] + b[3] * c[2], b[2] * c[1] + b[3] * c[3]]
        }, mult2x2Vec: function (b, c) {
            return [b[0] * c[0] + b[1] * c[1], b[2] * c[0] + b[3] * c[1]]
        }, multVec2x2: function (b, c) {
            return [c[0] * b[0] + c[2] * b[1], c[1] * b[0] + c[3] * b[1]]
        }
    }
}();
wpd.cspline = function (a, b) {
    var c = a.length;
    a = {x: a, y: b, len: c, d: []};
    var d = [], e = [], f;
    if (3 > c) return null;
    e[0] = 2;
    d[0] = 3 * (b[1] - b[0]);
    for (f = 1; f < c - 1; ++f) e[f] = 4 - 1 / e[f - 1], d[f] = 3 * (b[f + 1] - b[f - 1]) - d[f - 1] / e[f - 1];
    e[c - 1] = 2 - 1 / e[c - 2];
    d[c - 1] = 3 * (b[c - 1] - b[c - 2]) - d[c - 2] / e[c - 1];
    f = c - 1;
    for (a.d[f] = d[f] / e[f]; 0 < f;) --f, a.d[f] = (d[f] - a.d[f + 1]) / e[f];
    return a
};
wpd.cspline_interp = function (a, b) {
    var c = 0;
    if (b >= a.x[a.len - 1] || b < a.x[0]) return null;
    for (; b > a.x[c];) c++;
    c = 0 < c ? c - 1 : 0;
    b = (b - a.x[c]) / (a.x[c + 1] - a.x[c]);
    return a.y[c] + a.d[c] * b + (3 * (a.y[c + 1] - a.y[c]) - 2 * a.d[c] - a.d[c + 1]) * b * b + (2 * (a.y[c] - a.y[c + 1]) + a.d[c] + a.d[c + 1]) * b * b * b
};
wpd = wpd || {};
wpd.PlotData = function () {
    this._topColors = null;
    this._axesColl = [];
    this._datasetColl = [];
    this._measurementColl = [];
    this._objectAxesMap = new Map;
    this._datasetAutoDetectionDataMap = new Map;
    this._gridDetectionData = null
};
wpd.PlotData.prototype.reset = function () {
    this._axesColl = [];
    this._datasetColl = [];
    this._measurementColl = [];
    this._objectAxesMap = new Map;
    this._datasetAutoDetectionDataMap = new Map;
    this._gridDetectionData = null
};
wpd.PlotData.prototype.setTopColors = function (a) {
    this._topColors = a
};
wpd.PlotData.prototype.getTopColors = function (a) {
    return this._topColors
};
wpd.PlotData.prototype.addAxes = function (a) {
    this._axesColl.push(a)
};
wpd.PlotData.prototype.getAxesColl = function () {
    return this._axesColl
};
wpd.PlotData.prototype.getAxesNames = function () {
    var a = [];
    this._axesColl.forEach(function (b) {
        a.push(b.name)
    });
    return a
};
wpd.PlotData.prototype.deleteAxes = function (a) {
    var b = this._axesColl.indexOf(a);
    0 <= b && (this._axesColl.splice(b, 1), this._objectAxesMap.forEach(function (c, d, e) {
        c === a && e.set(d, null)
    }))
};
wpd.PlotData.prototype.getAxesCount = function () {
    return this._axesColl.length
};
wpd.PlotData.prototype.addDataset = function (a) {
    this._datasetColl.push(a);
    var b = this._axesColl.length;
    0 < b && this.setAxesForDataset(a, this._axesColl[b - 1])
};
wpd.PlotData.prototype.getDatasets = function () {
    return this._datasetColl
};
wpd.PlotData.prototype.getDatasetNames = function () {
    var a = [];
    this._datasetColl.forEach(function (b) {
        a.push(b.name)
    });
    return a
};
wpd.PlotData.prototype.getDatasetCount = function () {
    return this._datasetColl.length
};
wpd.PlotData.prototype.addMeasurement = function (a, b) {
    this._measurementColl.push(a);
    if (!b && a instanceof wpd.DistanceMeasurement && 0 < this._axesColl.length) for (b = 0; b < this._axesColl.length; b++) if (this._axesColl[b] instanceof wpd.MapAxes || this._axesColl[b] instanceof wpd.ImageAxes) {
        this.setAxesForMeasurement(a, this._axesColl[b]);
        break
    }
};
wpd.PlotData.prototype.getMeasurementColl = function () {
    return this._measurementColl
};
wpd.PlotData.prototype.getMeasurementsByType = function (a) {
    var b = [];
    this._measurementColl.forEach(function (c) {
        c instanceof a && b.push(c)
    });
    return b
};
wpd.PlotData.prototype.deleteMeasurement = function (a) {
    var b = this._measurementColl.indexOf(a);
    0 <= b && (this._measurementColl.splice(b, 1), this._objectAxesMap.delete(a))
};
wpd.PlotData.prototype.setAxesForDataset = function (a, b) {
    this._objectAxesMap.set(a, b)
};
wpd.PlotData.prototype.setAxesForMeasurement = function (a, b) {
    this._objectAxesMap.set(a, b)
};
wpd.PlotData.prototype.setAutoDetectionDataForDataset = function (a, b) {
    this._datasetAutoDetectionDataMap.set(a, b)
};
wpd.PlotData.prototype.getAxesForDataset = function (a) {
    return this._objectAxesMap.get(a)
};
wpd.PlotData.prototype.getAxesForMeasurement = function (a) {
    return this._objectAxesMap.get(a)
};
wpd.PlotData.prototype.getAutoDetectionDataForDataset = function (a) {
    var b = this._datasetAutoDetectionDataMap.get(a);
    null == b && (b = new wpd.AutoDetectionData, this.setAutoDetectionDataForDataset(a, b));
    return b
};
wpd.PlotData.prototype.getGridDetectionData = function () {
    null == this._gridDetectionData && (this._gridDetectionData = new wpd.GridDetectionData);
    return this._gridDetectionData
};
wpd.PlotData.prototype.deleteDataset = function (a) {
    var b = this._datasetColl.indexOf(a);
    0 <= b && (this._datasetColl.splice(b, 1), this._objectAxesMap.delete(a), this._datasetAutoDetectionDataMap.delete(a))
};
wpd.PlotData.prototype._deserializePreVersion4 = function (a) {
    if (null == a.axesType) return !0;
    if ("ImageAxes" !== a.axesType && (null == a.calibration || null == a.axesParameters)) return !1;
    var b = null;
    if ("ImageAxes" !== a.axesType) {
        b = "TernaryAxes" === a.axesType ? new wpd.Calibration(3) : new wpd.Calibration(2);
        for (var c = 0; c < a.calibration.length; c++) b.addPoint(a.calibration[c].px, a.calibration[c].py, a.calibration[c].dx, a.calibration[c].dy, a.calibration[c].dz)
    }
    c = null;
    "XYAxes" === a.axesType ? (c = new wpd.XYAxes, b.labels = ["X1", "X2",
        "Y1", "Y2"], b.labelPositions = ["N", "N", "E", "E"], b.maxPointCount = 4, c.calibrate(b, a.axesParameters.isLogX, a.axesParameters.isLogY)) : "BarAxes" === a.axesType ? (c = new wpd.BarAxes, b.labels = ["P1", "P2"], b.labelPositions = ["S", "S"], b.maxPointCount = 2, c.calibrate(b, a.axesParameters.isLog)) : "PolarAxes" === a.axesType ? (c = new wpd.PolarAxes, b.labels = ["Origin", "P1", "P2"], b.labelPositions = ["E", "S", "S"], b.maxPointCount = 3, c.calibrate(b, a.axesParameters.isDegrees, a.axesParameters.isClockwise)) : "TernaryAxes" === a.axesType ? (c =
        new wpd.TernaryAxes, b.labels = ["A", "B", "C"], b.labelPositions = ["S", "S", "E"], b.maxPointCount = 3, c.calibrate(b, a.axesParameters.isRange100, a.axesParameters.isNormalOrientation)) : "MapAxes" === a.axesType ? (c = new wpd.MapAxes, b.labels = ["P1", "P2"], b.labelPositions = ["S", "S"], b.maxPointCount = 2, c.calibrate(b, a.axesParameters.scaleLength, a.axesParameters.unitString)) : "ImageAxes" === a.axesType && (c = new wpd.ImageAxes);
    null != c && this._axesColl.push(c);
    if (null != a.dataSeries) for (b = 0; b < a.dataSeries.length; b++) {
        var d = a.dataSeries[b],
            e = new wpd.Dataset;
        e.name = d.name;
        null != d.metadataKeys && 0 < d.metadataKeys.length && e.setMetadataKeys(d.metadataKeys.map(function (k) {
            return k.toLowerCase()
        }));
        for (var f = 0; f < d.data.length; f++) if (0 < d.metadataKeys.length) {
            var g = d.metadataKeys[0].toLowerCase(), h = {};
            e.addPixel(d.data[f].x, d.data[f].y, (h[g] = d.data[f].metadata[0], h))
        } else e.addPixel(d.data[f].x, d.data[f].y);
        this.addDataset(e);
        this.setAxesForDataset(e, c)
    }
    if (null != a.distanceMeasurementData) {
        b = new wpd.DistanceMeasurement;
        for (d = 0; d < a.distanceMeasurementData.length; d++) b.addConnection(a.distanceMeasurementData[d]);
        this.addMeasurement(b);
        c instanceof wpd.MapAxes && this.setAxesForMeasurement(b, c)
    }
    if (null != a.angleMeasurementData) {
        c = new wpd.AngleMeasurement;
        for (b = 0; b < a.angleMeasurementData.length; b++) c.addConnection(a.angleMeasurementData[b]);
        this.addMeasurement(c)
    }
    return !0
};
wpd.PlotData.prototype._deserializeVersion4 = function (a) {
    var b = {}, c = function (k, l, p, m) {
        b[k] || (b[k] = {});
        b[k][l] || (b[k][l] = {});
        b[k][l][p] || (b[k][l][p] = []);
        b[k][l][p].push(m)
    };
    if (null != a.axesColl) for (var d = 0; d < a.axesColl.length; d++) {
        var e = a.axesColl[d], f = null;
        if ("ImageAxes" !== e.type) {
            f = "TernaryAxes" === e.type ? new wpd.Calibration(3) : new wpd.Calibration(2);
            for (var g = 0; g < e.calibrationPoints.length; g++) f.addPoint(e.calibrationPoints[g].px, e.calibrationPoints[g].py, e.calibrationPoints[g].dx, e.calibrationPoints[g].dy,
                e.calibrationPoints[g].dz)
        }
        g = null;
        "XYAxes" === e.type ? (g = new wpd.XYAxes, f.labels = ["X1", "X2", "Y1", "Y2"], f.labelPositions = ["N", "N", "E", "E"], f.maxPointCount = 4, g.calibrate(f, e.isLogX, e.isLogY, e.noRotation)) : "BarAxes" === e.type ? (g = new wpd.BarAxes, f.labels = ["P1", "P2"], f.labelPositions = ["S", "S"], f.maxPointCount = 2, g.calibrate(f, e.isLog, null == e.isRotated ? !1 : e.isRotated)) : "PolarAxes" === e.type ? (g = new wpd.PolarAxes, f.labels = ["Origin", "P1", "P2"], f.labelPositions = ["E", "S", "S"], f.maxPointCount = 3, g.calibrate(f, e.isDegrees,
            e.isClockwise, e.isLog)) : "TernaryAxes" === e.type ? (g = new wpd.TernaryAxes, f.labels = ["A", "B", "C"], f.labelPositions = ["S", "S", "E"], f.maxPointCount = 3, g.calibrate(f, e.isRange100, e.isNormalOrientation)) : "MapAxes" === e.type ? (g = new wpd.MapAxes, f.labels = ["P1", "P2"], f.labelPositions = ["S", "S"], f.maxPointCount = 2, g.calibrate(f, e.scaleLength, e.unitString)) : "ImageAxes" === e.type && (g = new wpd.ImageAxes);
        null != g && (g.name = e.name, this._axesColl.push(g), void 0 !== e.file && c("file", "axes", e.file, g), void 0 !== e.page && c("page", "axes",
            e.page, g))
    }
    if (null != a.datasetColl) for (d = {}, e = 0; e < a.datasetColl.length; d = {$jscomp$loop$prop$dsData$63: d.$jscomp$loop$prop$dsData$63}, e++) {
        d.$jscomp$loop$prop$dsData$63 = a.datasetColl[e];
        f = new wpd.Dataset;
        f.name = d.$jscomp$loop$prop$dsData$63.name;
        null != d.$jscomp$loop$prop$dsData$63.metadataKeys && f.setMetadataKeys(d.$jscomp$loop$prop$dsData$63.metadataKeys);
        null != d.$jscomp$loop$prop$dsData$63.colorRGB && (f.colorRGB = new wpd.Color(d.$jscomp$loop$prop$dsData$63.colorRGB[0], d.$jscomp$loop$prop$dsData$63.colorRGB[1],
            d.$jscomp$loop$prop$dsData$63.colorRGB[2]));
        for (g = 0; g < d.$jscomp$loop$prop$dsData$63.data.length; g++) {
            var h = d.$jscomp$loop$prop$dsData$63.data[g].metadata;
            null != d.$jscomp$loop$prop$dsData$63.data[g].metadata && Array.isArray(h) && (h = h.reduce(function (k) {
                return function (l, p, m) {
                    var n = {};
                    return Object.assign({}, l, (n[k.$jscomp$loop$prop$dsData$63.metadataKeys[m]] = p, n))
                }
            }(d), {}));
            f.addPixel(d.$jscomp$loop$prop$dsData$63.data[g].x, d.$jscomp$loop$prop$dsData$63.data[g].y, h)
        }
        this._datasetColl.push(f);
        void 0 !==
        d.$jscomp$loop$prop$dsData$63.file && c("file", "datasets", d.$jscomp$loop$prop$dsData$63.file, f);
        void 0 !== d.$jscomp$loop$prop$dsData$63.page && c("page", "datasets", d.$jscomp$loop$prop$dsData$63.page, f);
        g = this.getAxesNames().indexOf(d.$jscomp$loop$prop$dsData$63.axesName);
        0 <= g && this.setAxesForDataset(f, this._axesColl[g]);
        null != d.$jscomp$loop$prop$dsData$63.autoDetectionData && (g = new wpd.AutoDetectionData, g.deserialize(d.$jscomp$loop$prop$dsData$63.autoDetectionData), this.setAutoDetectionDataForDataset(f,
            g))
    }
    if (null != a.measurementColl) for (d = 0; d < a.measurementColl.length; d++) if (e = a.measurementColl[d], f = null, "Distance" === e.type ? (f = new wpd.DistanceMeasurement, this._measurementColl.push(f), g = this.getAxesNames().indexOf(e.axesName), 0 <= g && this.setAxesForMeasurement(f, this._axesColl[g])) : "Angle" === e.type ? (f = new wpd.AngleMeasurement, this._measurementColl.push(f)) : "Area" === e.type && (f = new wpd.AreaMeasurement, this._measurementColl.push(f), g = this.getAxesNames().indexOf(e.axesName), 0 <= g && this.setAxesForMeasurement(f,
        this._axesColl[g])), null != f) {
        for (g = 0; g < e.data.length; g++) f.addConnection(e.data[g]);
        void 0 !== e.file && c("file", "measurements", e.file, f);
        void 0 !== e.page && c("page", "measurements", e.page, f)
    }
    null != a.misc && (b.misc = a.misc);
    return b
};
wpd.PlotData.prototype.deserialize = function (a) {
    this.reset();
    try {
        return null != a.wpd && 3 === a.wpd.version[0] ? this._deserializePreVersion4(a.wpd) : null != a.version && 4 === a.version[0] ? this._deserializeVersion4(a) : !0
    } catch (b) {
        return console.log(b), !1
    }
};
wpd.PlotData.prototype.serialize = function (a) {
    for (var b = {
        version: [4, 2],
        axesColl: [],
        datasetColl: [],
        measurementColl: []
    }, c = 0; c < this._axesColl.length; c++) {
        var d = this._axesColl[c], e = {};
        e.name = d.name;
        a && (a.file && void 0 !== a.file.axes[d.name] && (e.file = a.file.axes[d.name]), a.page && void 0 !== a.page.axes[d.name] && (e.page = a.page.axes[d.name]));
        d instanceof wpd.XYAxes ? (e.type = "XYAxes", e.isLogX = d.isLogX(), e.isLogY = d.isLogY(), e.noRotation = d.noRotation()) : d instanceof wpd.BarAxes ? (e.type = "BarAxes", e.isLog = d.isLog(),
            e.isRotated = d.isRotated()) : d instanceof wpd.PolarAxes ? (e.type = "PolarAxes", e.isDegrees = d.isThetaDegrees(), e.isClockwise = d.isThetaClockwise(), e.isLog = d.isRadialLog()) : d instanceof wpd.TernaryAxes ? (e.type = "TernaryAxes", e.isRange100 = d.isRange100(), e.isNormalOrientation = d.isNormalOrientation) : d instanceof wpd.MapAxes ? (e.type = "MapAxes", e.scaleLength = d.getScaleLength(), e.unitString = d.getUnits()) : d instanceof wpd.ImageAxes && (e.type = "ImageAxes");
        if (!(d instanceof wpd.ImageAxes)) {
            e.calibrationPoints = [];
            for (var f =
                0; f < d.calibration.getCount(); f++) e.calibrationPoints.push(d.calibration.getPoint(f))
        }
        b.axesColl.push(e)
    }
    for (c = 0; c < this._datasetColl.length; c++) {
        d = this._datasetColl[c];
        e = this.getAxesForDataset(d);
        f = this.getAutoDetectionDataForDataset(d);
        var g = {};
        g.name = d.name;
        a && (a.file && void 0 !== a.file.datasets[d.name] && (g.file = a.file.datasets[d.name]), a.page && void 0 !== a.page.datasets[d.name] && (g.page = a.page.datasets[d.name]));
        g.axesName = null != e ? e.name : "";
        g.metadataKeys = d.getMetadataKeys();
        g.colorRGB = d.colorRGB.serialize();
        g.data = [];
        for (var h = 0; h < d.getCount(); h++) {
            var k = d.getPixel(h);
            g.data[h] = k;
            null != e && (g.data[h].value = e.pixelToData(k.x, k.y))
        }
        g.autoDetectionData = null != f ? f.serialize() : null;
        b.datasetColl.push(g)
    }
    for (c = 0; c < this._measurementColl.length; c++) {
        d = this._measurementColl[c];
        f = this.getAxesForMeasurement(d);
        e = {};
        d instanceof wpd.DistanceMeasurement ? (e.type = "Distance", e.name = "Distance", e.axesName = null != f ? f.name : "") : d instanceof wpd.AngleMeasurement ? (e.type = "Angle", e.name = "Angle") : d instanceof wpd.AreaMeasurement &&
            (e.type = "Area", e.name = "Area", e.axesName = null != f ? f.name : "");
        a && (a.file && void 0 !== a.file.measurements[c] && (e.file = a.file.measurements[c]), a.page && void 0 !== a.page.measurements[c] && (e.page = a.page.measurements[c]));
        e.data = [];
        for (f = 0; f < d.connectionCount(); f++) e.data.push(d.getConnectionAt(f));
        b.measurementColl.push(e)
    }
    a && a.misc && (b.misc = a.misc);
    return b
};
wpd = wpd || {};
wpd.rle = {};
wpd.rle.encode = function (a) {
    var b = [], c = null, d = [0, 0];
    a = $jscomp.makeIterator(a);
    for (var e = a.next(); !e.done; e = a.next()) e = e.value, null == c ? d = [e, 1] : e == c + 1 ? d[1]++ : (b.push(d), d = [e, 1]), c = e;
    0 != d[1] && b.push(d);
    return b
};
wpd.rle.decode = function (a) {
    var b = [];
    a = $jscomp.makeIterator(a);
    for (var c = a.next(); !c.done; c = a.next()) {
        var d = c.value;
        c = d[0];
        d = d[1];
        for (var e = 0; e < d; ++e) b.push(c + e)
    }
    return b
};
wpd = wpd || {};
wpd.AveragingWindowCore = function (a, b, c, d, e, f) {
    this._binaryData = a;
    this._imageHeight = b;
    this._imageWidth = c;
    this._dx = d;
    this._dy = e;
    this._dataSeries = f
};
wpd.AveragingWindowCore.prototype.run = function () {
    var a = [], b = 0, c = this._imageWidth, d = this._imageHeight, e = [], f, g, h, k, l = this._dx, p = this._dy;
    this._dataSeries.clearAll();
    for (f = 0; f < c; f++) {
        var m = -1;
        var n = -2 * p;
        for (g = h = 0; g < d; g++) this._binaryData.has(g * c + f) && (g > n + p ? (m += 1, h = 1, n = e[m] = g) : (h += 1, e[m] = parseFloat((e[m] * (h - 1) + g) / parseFloat(h))));
        if (0 <= m) for (n = f + .5, g = 0; g <= m; g++) h = e[g] + .5, a[b] = [], a[b][0] = parseFloat(n), a[b][1] = parseFloat(h), a[b][2] = !0, b += 1
    }
    if (0 !== b) {
        for (c = 0; c < b; c++) if (!0 === a[c][2]) {
            d = !0;
            e = c + 1;
            f = a[c][0];
            m = a[c][1];
            g = f;
            n = m;
            for (k = 1; !0 === d && e < b;) {
                h = a[e][0];
                var q = a[e][1];
                Math.abs(h - f) <= l && Math.abs(q - m) <= p && !0 === a[e][2] && (g = (g * k + h) / (k + 1), n = (n * k + q) / (k + 1), k += 1, a[e][2] = !1);
                h > f + 2 * l && (d = !1);
                e += 1
            }
            a[c][2] = !1;
            this._dataSeries.addPixel(parseFloat(g), parseFloat(n))
        }
        return this._dataSeries
    }
};
wpd = wpd || {};
wpd.AveragingWindowAlgo = function () {
    this._yStep = this._xStep = 10;
    this._wasRun = !1
};
wpd.AveragingWindowAlgo.prototype.getParamList = function (a) {
    return {xStep: ["\u0394X", "Px", this._xStep], yStep: ["\u0394Y", "Px", this._yStep]}
};
wpd.AveragingWindowAlgo.prototype.setParams = function (a) {
    this._xStep = parseFloat(a.xStep);
    this._yStep = parseFloat(a.yStep)
};
wpd.AveragingWindowAlgo.prototype.getParams = function () {
    return {xStep: this._xStep, yStep: this._yStep}
};
wpd.AveragingWindowAlgo.prototype.serialize = function () {
    return this._wasRun ? {algoType: "AveragingWindowAlgo", xStep: this._xStep, yStep: this._yStep} : null
};
wpd.AveragingWindowAlgo.prototype.deserialize = function (a) {
    this._xStep = a.xStep;
    this._yStep = a.yStep;
    this._wasRun = !0
};
wpd.AveragingWindowAlgo.prototype.run = function (a, b, c) {
    this._wasRun = !0;
    (new wpd.AveragingWindowCore(a.binaryData, a.imageHeight, a.imageWidth, this._xStep, this._yStep, b)).run()
};
wpd = wpd || {};
wpd.AveragingWindowWithStepSizeAlgo = function () {
    this._xmax = this._xmin = 0;
    this._delx = .1;
    this._lineWidth = 30;
    this._ymax = this._ymin = 0;
    this._wasRun = !1
};
wpd.AveragingWindowWithStepSizeAlgo.prototype.getParamList = function (a) {
    !this._wasRun && null != a && a instanceof wpd.XYAxes && (a = a.getBounds(), this._xmin = a.x1, this._xmax = a.x2, this._ymin = a.y3, this._ymax = a.y4);
    return {
        xmin: ["X_min", "Units", this._xmin],
        delx: ["\u0394X Step", "Units", this._delx],
        xmax: ["X_max", "Units", this._xmax],
        ymin: ["Y_min", "Units", this._ymin],
        ymax: ["Y_max", "Units", this._ymax],
        lineWidth: ["Line width", "Px", this._lineWidth]
    }
};
wpd.AveragingWindowWithStepSizeAlgo.prototype.setParams = function (a) {
    this._xmin = parseFloat(a.xmin);
    this._delx = parseFloat(a.delx);
    this._xmax = parseFloat(a.xmax);
    this._ymin = parseFloat(a.ymin);
    this._ymax = parseFloat(a.ymax);
    this._lineWidth = parseFloat(a.lineWidth)
};
wpd.AveragingWindowWithStepSizeAlgo.prototype.getParams = function () {
    return {
        xmin: this._xmin,
        delx: this._delx,
        xmax: this._xmax,
        ymin: this._ymin,
        ymax: this._ymax,
        lineWidth: this._lineWidth
    }
};
wpd.AveragingWindowWithStepSizeAlgo.prototype.serialize = function () {
    return this._wasRun ? {
        algoType: "AveragingWindowWithStepSizeAlgo",
        xmin: this._xmin,
        delx: this._delx,
        xmax: this._xmax,
        ymin: this._ymin,
        ymax: this._ymax,
        lineWidth: this._lineWidth
    } : null
};
wpd.AveragingWindowWithStepSizeAlgo.prototype.deserialize = function (a) {
    this._xmin = a.xmin;
    this._delx = a.delx;
    this._xmax = a.xmax;
    this._ymin = a.ymin;
    this._ymax = a.ymax;
    this._lineWidth = a.lineWidth;
    this._wasRun = !0
};
wpd.AveragingWindowWithStepSizeAlgo.prototype.run = function (a, b, c) {
    this._wasRun = !0;
    var d = a.imageWidth, e = a.imageHeight, f, g;
    b.clearAll();
    for (f = this._xmin; f <= this._xmax; f += this._delx) {
        var h = c.dataToPixel(f, this._ymin);
        var k = h.x;
        var l = h.y;
        h = c.dataToPixel(f, this._ymax);
        var p = h.x;
        var m = h.y;
        k = Math.sqrt((m - l) * (m - l) + (p - k) * (p - k));
        p = (this._ymax - this._ymin) / k;
        l = !1;
        var n = m = 0;
        var q = !1;
        for (g = 0; g <= k; g++) h = -g * p + this._ymax, h = c.dataToPixel(f, h), xi_pix = h.x, yi_pix = h.y, 0 <= xi_pix && xi_pix < d && 0 <= yi_pix && yi_pix < e && (a.binaryData.has(parseInt(yi_pix,
            10) * d + parseInt(xi_pix, 10)) ? (!1 === l && (n = m = g, l = !0, q = !1), !0 === q && (n = g, q = !1)) : !1 === q && (n = g, q = !0), !0 === l && (g > m + this._lineWidth || g == k - 1) && (l = !1, m > n && (n = g), h = (m + n) / 2, h = -h * p + this._ymax, h = c.dataToPixel(f, h), b.addPixel(parseFloat(h.x), parseFloat(h.y))))
    }
};
wpd = wpd || {};
wpd.BarValue = function () {
    this.avgX = this.avgValBot = this.avgValTop = this.npoints = 0
};
wpd.BarValue.prototype.append = function (a, b, c) {
    this.avgX = (this.npoints * this.avgX + a) / (this.npoints + 1);
    this.avgValTop = (this.npoints * this.avgValTop + b) / (this.npoints + 1);
    this.avgValBot = (this.npoints * this.avgValBot + c) / (this.npoints + 1);
    this.npoints++
};
wpd.BarValue.prototype.isPointInGroup = function (a, b, c, d, e) {
    return 0 === this.npoints || Math.abs(this.avgX - a) <= d && Math.abs(this.avgValTop - b) <= e && Math.abs(this.avgValBot - c) <= e ? !0 : !1
};
wpd.BarExtractionAlgo = function () {
    this._delX = 30;
    this._delVal = 10;
    this._wasRun = !1
};
wpd.BarExtractionAlgo.prototype.getParamList = function (a) {
    return "Y" === a.getOrientation().axes ? {
        delX: ["\u0394X", "Px", this._delX],
        delVal: ["\u0394Val", "Px", this._delVal]
    } : {delX: ["\u0394Y", "Px", this._delX], delVal: ["\u0394Val", "Px", this._delVal]}
};
wpd.BarExtractionAlgo.prototype.setParams = function (a) {
    this._delX = parseFloat(a.delX);
    this._delVal = parseFloat(a.delVal)
};
wpd.BarExtractionAlgo.prototype.getParams = function (a) {
    return {delX: this._delX, delVal: this._delVal}
};
wpd.BarExtractionAlgo.prototype.serialize = function () {
    return this._wasRun ? {algoType: "BarExtractionAlgo", delX: this._delX, delVal: this._delVal} : null
};
wpd.BarExtractionAlgo.prototype.deserialize = function (a) {
    this._delX = a.delX;
    this._delVal = a.delVal;
    this._wasRun = !0
};
wpd.BarExtractionAlgo.prototype.run = function (a, b, c) {
    this._wasRun = !0;
    var d = c.getOrientation(), e = [], f, g, h, k = a.imageWidth, l = a.imageHeight, p, m,
        n = function (x, u, y, v, z) {
            p = !1;
            for (m = 0; m < e.length; m++) if (t = e[m], t.isPointInGroup(x, u, y, v, z)) {
                t.append(x, u, y);
                p = !0;
                break
            }
            p || (t = new wpd.BarValue, t.append(x, u, y), e.push(t))
        };
    b.clearAll();
    if ("Y" === d.axes) for (g = 0; g < k; g++) {
        var q = 0;
        var r = l - 1;
        for (h = f = 0; h < l; h++) if (a.binaryData.has(h * k + g)) {
            q = h;
            f++;
            break
        }
        for (h = l - 1; 0 <= h; h--) if (a.binaryData.has(h * k + g)) {
            r = h;
            f++;
            break
        }
        2 === f && n(g,
            q, r, this._delX, this._delVal)
    } else for (h = 0; h < l; h++) {
        q = k - 1;
        f = r = 0;
        for (g = k - 1; 0 <= g; g--) if (a.binaryData.has(h * k + g)) {
            q = g;
            f++;
            break
        }
        for (g = 0; g < k; g++) if (a.binaryData.has(h * k + g)) {
            r = g;
            f++;
            break
        }
        2 === f && n(h, q, r, this._delX, this._delVal)
    }
    c.dataPointsHaveLabels && (a = b.getMetadataKeys(), null != a && "label" === a[0] || b.setMetadataKeys(["label"]));
    for (m = 0; m < e.length; m++) {
        var t = e[m];
        "Y" === d.axes ? (q = c.pixelToData(t.avgX, t.avgValTop)[0], r = c.pixelToData(t.avgX, t.avgValBot)[0]) : (q = c.pixelToData(t.avgValTop, t.avgX)[0], r = c.pixelToData(t.avgValBot,
            t.avgX)[0]);
        a = 0 > q + r ? "increasing" === d.direction ? t.avgValBot : t.avgValTop : "increasing" === d.direction ? t.avgValTop : t.avgValBot;
        c.dataPointsHaveLabels ? "Y" === d.axes ? b.addPixel(t.avgX + .5, a + .5, {label: "Bar" + m}) : b.addPixel(a + .5, t.avgX + .5, {label: "Bar" + m}) : "Y" === d.axes ? b.addPixel(t.avgX + .5, a + .5) : b.addPixel(a + .5, t.avgX + .5)
    }
};
wpd = wpd || {};
wpd.BlobDetectorAlgo = function () {
    this._minDia = 0;
    this._maxDia = 5E3;
    this._wasRun = !1
};
wpd.BlobDetectorAlgo.prototype.getParamList = function (a) {
    return null != a && a instanceof wpd.MapAxes ? {
        minDia: ["Min Diameter", "Units", this._minDia],
        maxDia: ["Max Diameter", "Units", this._maxDia]
    } : {minDia: ["Min Diameter", "Px", this._minDia], maxDia: ["Max Diameter", "Px", this._maxDia]}
};
wpd.BlobDetectorAlgo.prototype.serialize = function () {
    return this._wasRun ? {algoType: "BlobDetectorAlgo", minDia: this._minDia, maxDia: this._maxDia} : null
};
wpd.BlobDetectorAlgo.prototype.deserialize = function (a) {
    this._minDia = a.minDia;
    this._maxDia = a.maxDia;
    this._wasRun = !0
};
wpd.BlobDetectorAlgo.prototype.setParams = function (a) {
    this._minDia = parseFloat(a.minDia);
    this._maxDia = parseFloat(a.maxDia)
};
wpd.BlobDetectorAlgo.prototype.getParams = function () {
    return {minDia: this._minDia, maxDia: this._maxDia}
};
wpd.BlobDetectorAlgo.prototype.run = function (a, b, c) {
    this._wasRun = !0;
    var d = a.imageWidth, e = a.imageHeight, f = [], g = [], h, k, l, p, m;
    if (!(0 >= d || 0 >= e || null == a.binaryData || 0 === a.binaryData.size)) {
        b.clearAll();
        b.setMetadataKeys(["area", "moment"]);
        for (h = 0; h < d; h++) for (k = 0; k < e; k++) if (a.binaryData.has(k * d + h) && !0 !== f[k * d + h]) {
            f[k * d + h] = !0;
            var n = g.length;
            g[n] = {pixels: [{x: h, y: k}], centroid: {x: h, y: k}, area: 1, moment: 0};
            for (l = 0; l < g[n].pixels.length;) {
                var q = g[n].pixels[l].x;
                var r = g[n].pixels[l].y;
                for (p = q - 1; p <= q + 1; p++) for (m = r -
                    1; m <= r + 1; m++) if (0 <= p && 0 <= m && p < d && m < e && !0 !== f[m * d + p] && a.binaryData.has(m * d + p)) {
                    f[m * d + p] = !0;
                    var t = g[n].pixels.length;
                    g[n].pixels[t] = {x: p, y: m};
                    g[n].centroid.x = (g[n].centroid.x * t + p) / (t + 1);
                    g[n].centroid.y = (g[n].centroid.y * t + m) / (t + 1);
                    g[n].area += 1
                }
                l += 1
            }
        }
        for (n = 0; n < g.length; n++) {
            for (l = g[n].moment = 0; l < g[n].pixels.length; l++) g[n].moment = g[n].moment + (g[n].pixels[l].x - g[n].centroid.x) * (g[n].pixels[l].x - g[n].centroid.x) + (g[n].pixels[l].y - g[n].centroid.y) * (g[n].pixels[l].y - g[n].centroid.y);
            c instanceof wpd.MapAxes &&
            (g[n].area = plotData.axes.pixelToDataArea(g[n].area));
            a = 2 * Math.sqrt(g[n].area / Math.PI);
            a <= this._maxDia && a >= this._minDia && b.addPixel(g[n].centroid.x + .5, g[n].centroid.y + .5, [g[n].area, g[n].moment])
        }
    }
};
wpd = wpd || {};
wpd.CustomIndependents = function () {
    this._xvals = [];
    this._ymax = this._ymin = 0;
    this._curveWidth = 5;
    this._wasRun = !1
};
wpd.CustomIndependents.prototype.deserialize = function (a) {
    this._xvals = a.xvals;
    this._ymin = a.ymin;
    this._ymax = a.ymax;
    this._curveWidth = a.curveWidth;
    this._wasRun = !0
};
wpd.CustomIndependents.prototype.setParams = function (a) {
    this._xvals = a.xvals;
    this._ymin = parseFloat(a.ymin);
    this._ymax = parseFloat(a.ymax);
    this._curveWidth = parseFloat(a.curveWidth)
};
wpd.CustomIndependents.prototype.getParams = function () {
    return {xvals: this._xvals, ymin: this._ymin, ymax: this._ymax, curveWidth: this._curveWidth}
};
wpd.CustomIndependents.prototype.getParamList = function (a) {
    !this._wasRun && null != a && a instanceof wpd.XYAxes && (a = a.getBounds(), this._xvals = "[" + a.x1 + ", " + a.x2 + "]", this._ymin = a.y3, this._ymax = a.y4, this._curveWidth = 5);
    return {
        xvals: ["X Values", "Array", this._xvals],
        ymin: ["Y min", "Units", this._ymin],
        ymax: ["Y max", "Units", this._ymax],
        curveWidth: ["Curve Width", "Px", this._curveWidth]
    }
};
wpd.CustomIndependents.prototype.serialize = function () {
    return this._wasRun ? {
        algoType: "CustomIndependents",
        xvals: this._xvals,
        ymin: this._ymin,
        ymax: this._ymax,
        curveWidth: this._curveWidth
    } : null
};
wpd.CustomIndependents.prototype.run = function (a, b, c) {
    this._wasRun = !0;
    b.clearAll();
    var d = new wpd.InputParser, e = d.parse(this._xvals);
    if (null != e && d.isArray) {
        e.sort(function (A, E) {
            return A - E
        });
        var f = e[0], g = e[e.length - 1], h = f, k = g, l = this._ymin, p = this._ymax;
        d = c.isLogX();
        var m = c.isLogY();
        d && (h = Math.log10(h), k = Math.log10(k));
        m && (l = Math.log10(l), p = Math.log10(p));
        var n = c.dataToPixel(f, this._ymin);
        g = c.dataToPixel(g, this._ymin);
        f = c.dataToPixel(f, this._ymax);
        g = (k - h) / Math.sqrt((n.x - g.x) * (n.x - g.x) + (n.y - g.y) * (n.y - g.y));
        var q = (p - l) / Math.sqrt((n.x - f.x) * (n.x - f.x) + (n.y - f.y) * (n.y - f.y)), r = a.imageWidth,
            t = a.imageHeight;
        n = [];
        f = [];
        var x = 2 < this._curveWidth ? this._curveWidth : 2;
        for (h -= x * g; h <= k + x * g; h += g) {
            for (var u = 0, y = 0, v = 0 < q ? l : p; 0 < q && v <= p || 0 > q && v >= l;) {
                var z = c.dataToPixel(d ? Math.pow(10, h) : h, m ? Math.pow(10, v) : v);
                0 <= z.x && 0 <= z.y && z.x < r && z.y < t && a.binaryData.has(parseInt(z.y, 10) * r + parseInt(z.x, 10)) && (u += v, y++);
                v += q
            }
            0 < y && (u /= y, n.push(parseFloat(h)), f.push(parseFloat(u)))
        }
        if (!(0 >= n.length || 0 >= f.length)) {
            a = [];
            k = [];
            if (0 < this._curveWidth) for (l =
                                               parseInt(this._curveWidth / 2, 10), 1 > l && (l = 1), p = 0; p < n.length; p += l) {
                q = h = g = 0;
                r = c.dataToPixel(d ? Math.pow(10, n[p]) : n[p], m ? Math.pow(10, f[p]) : f[p]);
                for (t = 0; t < n.length; t++) x = c.dataToPixel(d ? Math.pow(10, n[t]) : n[t], m ? Math.pow(10, f[t]) : f[t]), Math.abs(r.x - x.x) < this._curveWidth && Math.abs(r.y - x.y) < this._curveWidth && (g += n[t], h += f[t], q++);
                g /= q;
                h /= q;
                a.push(g);
                k.push(h)
            } else a = n, k = f;
            n = wpd.cspline(a, k);
            if (null != n) for (f = 0; f < e.length; f++) isNaN(e[f]) || (a = wpd.cspline_interp(n, d ? Math.log10(e[f]) : e[f]), null != a && (a = c.dataToPixel(e[f],
                m ? Math.pow(10, a) : a), b.addPixel(a.x, a.y)))
        }
    }
};
wpd = wpd || {};
wpd.XStepWithInterpolationAlgo = function () {
    this._xmin = 0;
    this._xmax = 1;
    this._delx = .1;
    this._ymax = this._ymin = this._smoothing = 0;
    this._wasRun = !1
};
wpd.XStepWithInterpolationAlgo.prototype.getParamList = function (a) {
    !this._wasRun && null != a && a instanceof wpd.XYAxes && (a = a.getBounds(), this._xmin = a.x1, this._xmax = a.x2, this._delx = (a.x2 - a.x1) / 50, this._ymin = a.y3, this._ymax = a.y4, this._smoothing = 0);
    return {
        xmin: ["X_min", "Units", this._xmin],
        delx: ["\u0394X Step", "Units", this._delx],
        xmax: ["X_max", "Units", this._xmax],
        ymin: ["Y_min", "Units", this._ymin],
        ymax: ["Y_max", "Units", this._ymax],
        smoothing: ["Smoothing", "% of \u0394X", this._smoothing]
    }
};
wpd.XStepWithInterpolationAlgo.prototype.setParams = function (a) {
    this._xmin = parseFloat(a.xmin);
    this._delx = parseFloat(a.delx);
    this._xmax = parseFloat(a.xmax);
    this._ymin = parseFloat(a.ymin);
    this._ymax = parseFloat(a.ymax);
    this._smoothing = parseFloat(a.smoothing)
};
wpd.XStepWithInterpolationAlgo.prototype.getParams = function () {
    return {
        xmin: this._xmin,
        delx: this._delx,
        xmax: this._xmax,
        ymin: this._ymin,
        ymax: this._ymax,
        smoothing: this._smoothing
    }
};
wpd.XStepWithInterpolationAlgo.prototype.serialize = function () {
    return this._wasRun ? {
        algoType: "XStepWithInterpolationAlgo",
        xmin: this._xmin,
        delx: this._delx,
        xmax: this._xmax,
        ymin: this._ymin,
        ymax: this._ymax,
        smoothing: this._smoothing
    } : null
};
wpd.XStepWithInterpolationAlgo.prototype.deserialize = function (a) {
    this._xmin = a.xmin;
    this._delx = a.delx;
    this._xmax = a.xmax;
    this._ymin = a.ymin;
    this._ymax = a.ymax;
    this._smoothing = a.smoothing;
    this._wasRun = !0
};
wpd.XStepWithInterpolationAlgo.prototype.run = function (a, b, c) {
    this._wasRun = !0;
    var d = 0, e = a.imageWidth, f = a.imageHeight, g, h, k = [], l = [],
        p = Math.abs(this._smoothing / 100 * this._delx), m = c.isLogX(), n = c.isLogY();
    c.isDate(0);
    c.isDate(1);
    var q = this._xmin;
    var r = this._xmax;
    var t = this._ymin, x = this._ymax, u = p, y = this._delx;
    b.clearAll();
    m && (r = Math.log10(r), q = Math.log10(q), u = Math.abs(Math.log10(this._delx) * this._smoothing / 100), y = Math.log10(y));
    n && (t = Math.log10(t), x = Math.log10(x));
    var v = c.dataToPixel(this._xmin, this._ymin);
    var z = c.dataToPixel(this._xmin, this._ymax);
    var A = (x - t) / Math.sqrt((v.x - z.x) * (v.x - z.x) + (v.y - z.y) * (v.y - z.y));
    z = c.dataToPixel(this._xmax, this._ymin);
    z = (r - q) / Math.sqrt((v.x - z.x) * (v.x - z.x) + (v.y - z.y) * (v.y - z.y));
    0 < Math.abs(u / z) && 1 > Math.abs(u / z) && (u = z);
    for (v = 0 < z ? q - 2 * z : q + 2 * z; 0 < z && v <= r + 2 * z || 0 > z && v >= r - 2 * z;) {
        var E = h = 0;
        for (g = t; 0 < A && g <= x || 0 > A && g >= x;) {
            var F = c.dataToPixel(m ? Math.pow(10, v) : v, n ? Math.pow(10, g) : g);
            0 <= F.x && 0 <= F.y && F.x < e && F.y < f && a.binaryData.has(parseInt(F.y, 10) * e + parseInt(F.x, 10)) && (h = (h * E + g) / parseFloat(E +
                1), E++);
            g += A
        }
        0 < E && (k[d] = parseFloat(v), l[d] = parseFloat(h), d += 1);
        v += z
    }
    if (!(0 >= k.length || 0 >= l.length)) {
        if (0 < u) for (F = [], d = [], v = k[0]; 0 < z && v <= k[k.length - 1] || 0 > z && v >= k[k.length - 1];) {
            for (a = E = f = e = 0; a < k.length; a++) k[a] <= v + u && k[a] >= v - u && (e = (e * E + k[a]) / parseFloat(E + 1), f = (f * E + l[a]) / parseFloat(E + 1), E++);
            0 < E && (F[F.length] = e, d[d.length] = f);
            v = 0 < z ? v + p : v - p
        } else F = k, d = l;
        if (!(0 >= F.length || 0 >= d.length || (k = [], a = 0, v = q, 0 > z && 0 < this._delx || 0 < z && 0 > this._delx))) {
            for (; 0 < z && v <= r || 0 > z && v >= r;) k[a] = v, a++, v += y;
            0 > z && (F = F.reverse(), d =
                d.reverse());
            r = wpd.cspline(F, d);
            if (null != r) for (q = [], a = 0; a < k.length; ++a) isNaN(k[a]) || (q[a] = wpd.cspline_interp(r, k[a]), null !== q[a] && (F = c.dataToPixel(m ? Math.pow(10, k[a]) : k[a], n ? Math.pow(10, q[a]) : q[a]), b.addPixel(F.x, F.y)))
        }
    }
};
wpd = wpd || {};
wpd.BarAxes = function () {
    var a = function () {
        var b = !1, c = !1, d = !1, e, f, g, h, k, l, p;
        this.isCalibrated = function () {
            return b
        };
        this.calibration = null;
        this.calibrate = function (m, n, q) {
            this.calibration = m;
            b = !1;
            var r = m.getPoint(0);
            m = m.getPoint(1);
            e = r.px;
            f = r.py;
            g = m.px;
            h = m.py;
            k = parseFloat(r.dy);
            l = parseFloat(m.dy);
            n ? (c = !0, k = Math.log(k) / Math.log(10), l = Math.log(l) / Math.log(10)) : c = !1;
            p = this.calculateOrientation();
            d = q;
            q || ("Y" == p.axes ? g = e : h = f, p = this.calculateOrientation());
            return b = !0
        };
        this.pixelToData = function (m, n) {
            var q = [];
            q[0] = ((n - f) * (h - f) + (g - e) * (m - e)) / ((h - f) * (h - f) + (g - e) * (g - e)) * (l - k) + k;
            c && (q[0] = Math.pow(10, q[0]));
            return q
        };
        this.dataToPixel = function (m, n) {
            return {x: 0, y: 0}
        };
        this.pixelToLiveString = function (m, n) {
            return this.pixelToData(m, n)[0].toExponential(4)
        };
        this.isLog = function () {
            return c
        };
        this.isRotated = function () {
            return d
        };
        this.dataPointsHaveLabels = !0;
        this.dataPointsLabelPrefix = "Bar";
        this.calculateOrientation = function () {
            var m = 180 * wpd.taninverse(-(h - f), g - e) / Math.PI, n = {axes: "Y", direction: "increasing", angle: m};
            30 > Math.abs(m -
                90) ? (n.axes = "Y", n.direction = "increasing") : 30 > Math.abs(m - 270) ? (n.axes = "Y", n.direction = "decreasing") : 30 > Math.abs(m - 0) || 30 > Math.abs(m - 360) ? (n.axes = "X", n.direction = "increasing") : 30 > Math.abs(m - 180) && (n.axes = "X", n.direction = "decreasing");
            return n
        };
        this.getOrientation = function () {
            return p
        };
        this.name = "Bar"
    };
    a.prototype.numCalibrationPointsRequired = function () {
        return 2
    };
    a.prototype.getDimensions = function () {
        return 2
    };
    a.prototype.getAxesLabels = function () {
        return ["Label", "Y"]
    };
    return a
}();
wpd = wpd || {};
wpd.ImageAxes = function () {
    var a = function () {
        this.isCalibrated = function () {
            return !0
        };
        this.calibrate = function () {
            return !0
        };
        this.pixelToData = function (b, c) {
            return [b, c]
        };
        this.dataToPixel = function (b, c) {
            return {x: b, y: c}
        };
        this.pixelToLiveString = function (b, c) {
            b = this.pixelToData(b, c);
            return b[0].toFixed(2) + ", " + b[1].toFixed(2)
        };
        this.name = "Image"
    };
    a.prototype.numCalibrationPointsRequired = function () {
        return 0
    };
    a.prototype.getDimensions = function () {
        return 2
    };
    a.prototype.getAxesLabels = function () {
        return ["X", "Y"]
    };
    return a
}();
wpd = wpd || {};
wpd.MapAxes = function () {
    var a = function () {
        var b = !1, c, d, e;
        this.calibration = null;
        this.isCalibrated = function () {
            return b
        };
        this.calibrate = function (f, g, h) {
            this.calibration = f;
            var k = f.getPoint(0);
            f = f.getPoint(1);
            e = Math.sqrt((k.px - f.px) * (k.px - f.px) + (k.py - f.py) * (k.py - f.py));
            c = parseFloat(g);
            d = h;
            return b = !0
        };
        this.pixelToData = function (f, g) {
            var h = [];
            h[0] = f * c / e;
            h[1] = g * c / e;
            return h
        };
        this.pixelToDataDistance = function (f) {
            return f * c / e
        };
        this.pixelToDataArea = function (f) {
            return f * c * c / (e * e)
        };
        this.dataToPixel = function (f, g,
                                     h) {
            return {x: 0, y: 0}
        };
        this.pixelToLiveString = function (f, g) {
            f = this.pixelToData(f, g);
            return f[0].toExponential(4) + ", " + f[1].toExponential(4)
        };
        this.getScaleLength = function () {
            return c
        };
        this.getUnits = function () {
            return d
        };
        this.name = "Map"
    };
    a.prototype.numCalibrationPointsRequired = function () {
        return 2
    };
    a.prototype.getDimensions = function () {
        return 2
    };
    a.prototype.getAxesLabels = function () {
        return ["X", "Y"]
    };
    return a
}();
wpd = wpd || {};
wpd.PolarAxes = function () {
    var a = function () {
        var b = !1, c = !1, d = !1, e = !1, f, g, h, k, l, p, m, n, q, r, t, x, u, y;
        this.calibration = null;
        this.isCalibrated = function () {
            return b
        };
        this.calibrate = function (v, z, A, E) {
            this.calibration = v;
            var F = v.getPoint(0), H = v.getPoint(1);
            v = v.getPoint(2);
            f = F.px;
            g = F.py;
            h = H.px;
            k = H.py;
            l = v.px;
            p = v.py;
            m = H.dx;
            n = H.dy;
            q = v.dx;
            c = z;
            d = A;
            !0 === c && (n *= Math.PI / 180);
            E && (e = !0, m = Math.log(m) / Math.log(10), q = Math.log(q) / Math.log(10));
            r = Math.sqrt((h - f) * (h - f) + (k - g) * (k - g));
            t = Math.sqrt((l - f) * (l - f) + (p - g) * (p - g));
            x = t - r;
            u =
                wpd.taninverse(-(k - g), h - f);
            y = d ? u + n : u - n;
            return b = !0
        };
        this.isThetaDegrees = function () {
            return c
        };
        this.isThetaClockwise = function () {
            return d
        };
        this.isRadialLog = function () {
            return e
        };
        this.pixelToData = function (v, z) {
            var A = [];
            v = parseFloat(v);
            var E = parseFloat(z);
            z = (q - m) / x * (Math.sqrt((v - f) * (v - f) + (E - g) * (E - g)) - r) + m;
            v = d ? y - wpd.taninverse(-(E - g), v - f) : wpd.taninverse(-(E - g), v - f) - y;
            0 > v && (v += 2 * Math.PI);
            !0 === c && (v = 180 * v / Math.PI);
            e && (z = Math.pow(10, z));
            A[0] = z;
            A[1] = v;
            return A
        };
        this.dataToPixel = function (v, z) {
            return {x: 0, y: 0}
        };
        this.pixelToLiveString = function (v, z) {
            v = this.pixelToData(v, z);
            return v[0].toExponential(4) + ", " + v[1].toExponential(4)
        };
        this.name = "Polar"
    };
    a.prototype.numCalibrationPointsRequired = function () {
        return 3
    };
    a.prototype.getDimensions = function () {
        return 2
    };
    a.prototype.getAxesLabels = function () {
        return ["r", "\u03b8"]
    };
    return a
}();
wpd = wpd || {};
wpd.TernaryAxes = function () {
    var a = function () {
        var b = !1, c, d, e, f, g, h, k, l, p;
        this.isCalibrated = function () {
            return b
        };
        this.calibration = null;
        this.calibrate = function (m, n, q) {
            this.calibration = m;
            var r = m.getPoint(0), t = m.getPoint(1);
            m.getPoint(2);
            c = r.px;
            d = r.py;
            e = t.px;
            f = t.py;
            g = Math.sqrt((c - e) * (c - e) + (d - f) * (d - f));
            h = wpd.taninverse(-(f - d), e - c);
            k = Math.sqrt(3);
            l = n;
            p = q;
            return b = !0
        };
        this.isRange100 = function () {
            return l
        };
        this.isNormalOrientation = function () {
            return p
        };
        this.pixelToData = function (m, n) {
            var q = [];
            m = parseFloat(m);
            var r = parseFloat(n);
            n = Math.sqrt((m - c) * (m - c) + (r - d) * (r - d));
            r = wpd.taninverse(-(r - d), m - c) - h;
            m = n * Math.cos(r) / g;
            r = n * Math.sin(r) / g;
            n = 1 - m - r / k;
            m -= r / k;
            r = 2 * r / k;
            if (0 == p) {
                var t = m;
                m = n;
                n = r;
                r = t
            }
            1 == l && (n *= 100, m *= 100, r *= 100);
            q[0] = n;
            q[1] = m;
            q[2] = r;
            return q
        };
        this.dataToPixel = function (m, n, q) {
            return {x: 0, y: 0}
        };
        this.pixelToLiveString = function (m, n) {
            m = this.pixelToData(m, n);
            return m[0].toExponential(4) + ", " + m[1].toExponential(4) + ", " + m[2].toExponential(4)
        };
        this.name = "Ternary"
    };
    a.prototype.numCalibrationPointsRequired = function () {
        return 3
    };
    a.prototype.getDimensions = function () {
        return 3
    };
    a.prototype.getAxesLabels = function () {
        return ["a", "b", "c"]
    };
    return a
}();
wpd = wpd || {};
wpd.XYAxes = function () {
    var a = function () {
        var b = !1, c = !1, d = !1, e = !1, f = !1, g = !1, h, k, l, p, m, n, q, r, t, x, u, y, v, z, A = [0, 0, 0, 0],
            E = [0, 0, 0, 0], F = [0, 0], H = function (D, J, N, W) {
                if (4 > D.getCount()) return !1;
                var Y = D.getPoint(0), Z = D.getPoint(1), aa = D.getPoint(2);
                D = D.getPoint(3);
                var K = new wpd.InputParser;
                l = Y.px;
                q = Y.py;
                p = Z.px;
                r = Z.py;
                m = aa.px;
                t = aa.py;
                n = D.px;
                x = D.py;
                u = Y.dx;
                y = Z.dx;
                v = aa.dy;
                z = D.dy;
                u = K.parse(u);
                if (!K.isValid) return !1;
                e = K.isDate;
                y = K.parse(y);
                if (!K.isValid || K.isDate != e) return !1;
                h = K.formatting;
                v = K.parse(v);
                if (!K.isValid) return !1;
                f = K.isDate;
                z = K.parse(z);
                if (!K.isValid || K.isDate != f) return !1;
                k = K.formatting;
                c = J;
                d = N;
                g = W;
                !0 === c && (u = Math.log(u) / Math.log(10), y = Math.log(y) / Math.log(10));
                !0 === d && (v = Math.log(v) / Math.log(10), z = Math.log(z) / Math.log(10));
                A = wpd.mat.mult2x2([u - y, 0, 0, v - z], wpd.mat.inv2x2([l - p, m - n, q - r, t - x]));
                g && (Math.abs(A[0] * A[3]) > Math.abs(A[1] * A[2]) ? (A[1] = 0, A[2] = 0, A[0] = (y - u) / (p - l), A[3] = (z - v) / (x - t)) : (A[0] = 0, A[3] = 0, A[1] = (y - u) / (r - q), A[2] = (z - v) / (n - m)));
                E = wpd.mat.inv2x2(A);
                F[0] = u - A[0] * l - A[1] * q;
                F[1] = v - A[2] * m - A[3] * t;
                return !0
            };
        this.getBounds =
            function () {
                return {
                    x1: c ? Math.pow(10, u) : u,
                    x2: c ? Math.pow(10, y) : y,
                    y3: d ? Math.pow(10, v) : v,
                    y4: d ? Math.pow(10, z) : z
                }
            };
        this.isCalibrated = function () {
            return b
        };
        this.calibration = null;
        this.calibrate = function (D, J, N, W) {
            this.calibration = D;
            return b = H(D, J, N, W)
        };
        this.pixelToData = function (D, J) {
            var N = [];
            D = parseFloat(D);
            J = parseFloat(J);
            D = wpd.mat.mult2x2Vec(A, [D, J]);
            D[0] += F[0];
            D[1] += F[1];
            J = D[0];
            D = D[1];
            !0 === c && (J = Math.pow(10, J));
            !0 === d && (D = Math.pow(10, D));
            N[0] = J;
            N[1] = D;
            return N
        };
        this.dataToPixel = function (D, J) {
            c && (D = Math.log(D) /
                Math.log(10));
            d && (J = Math.log(J) / Math.log(10));
            D = wpd.mat.mult2x2Vec(E, [D - F[0], J - F[1]]);
            return {x: D[0], y: D[1]}
        };
        this.pixelToLiveString = function (D, J) {
            var N = "";
            D = this.pixelToData(D, J);
            N = e ? N + wpd.dateConverter.formatDateNumber(D[0], h) : N + D[0].toExponential(4);
            N += ", ";
            return N = f ? N + wpd.dateConverter.formatDateNumber(D[1], k) : N + D[1].toExponential(4)
        };
        this.isDate = function (D) {
            return 0 === D ? e : f
        };
        this.getInitialDateFormat = function (D) {
            return 0 === D ? h : k
        };
        this.isLogX = function () {
            return c
        };
        this.isLogY = function () {
            return d
        };
        this.noRotation = function () {
            return g
        };
        this.getOrientation = function () {
            return {axes: "Y", direction: "increasing", angle: 90}
        };
        this.name = "XY"
    };
    a.prototype.numCalibrationPointsRequired = function () {
        return 4
    };
    a.prototype.getDimensions = function () {
        return 2
    };
    a.prototype.getAxesLabels = function () {
        return ["X", "Y"]
    };
    return a
}();
wpd = wpd || {};
wpd.dataTable = function () {
    function a() {
        wpd.graphicsWidget.removeTool();
        wpd.popup.show("csvWindow");
        document.getElementById("data-number-format-separator").value.trim() === n && (document.getElementById("data-number-format-separator").value = "," === n ? "; " : ", ");
        b()
    }

    function b() {
        h = g.getData();
        c();
        e();
        f()
    }

    function c() {
        var q = document.getElementById("data-table-dataset-list"), r = document.getElementById("data-sort-variables"),
            t = document.getElementById("dataVariables"), x = document.getElementById("data-date-formatting-container"),
            u = document.getElementById("data-date-formatting"), y = "", v = "", z = "", A = !1, E = null != m;
        null != p ? (wpd.appData.getPlotData().getDatasetNames().forEach(function (F) {
            y += '<option value="' + F + '">' + F + "</option>"
        }), q.innerHTML = y, q.value = p.name) : E && (0 < wpd.appData.getPlotData().getMeasurementsByType(wpd.AreaMeasurement).length && (y += '<option value="area">' + wpd.gettext("area-measurements") + "</option>"), 0 < wpd.appData.getPlotData().getMeasurementsByType(wpd.AngleMeasurement).length && (y += '<option value="angle">' + wpd.gettext("angle-measurements") +
            "</option>"), 0 < wpd.appData.getPlotData().getMeasurementsByType(wpd.DistanceMeasurement).length && (y += '<option value="distance">' + wpd.gettext("distance-measurements") + "</option>"), q.innerHTML = y, m instanceof wpd.AngleMeasurement ? q.value = "angle" : m instanceof wpd.DistanceMeasurement ? q.value = "distance" : m instanceof wpd.AreaMeasurement && (q.value = "area"));
        t.innerHTML = h.fields.join(", ");
        x.style.display = "none";
        v += '<option value="raw">' + wpd.gettext("raw") + "</option>";
        for (q = 0; q < h.fields.length; q++) h.isFieldSortable[q] &&
        (v += '<option value="' + h.fields[q] + '">' + h.fields[q] + "</option>"), null != h.fieldDateFormat[q] && (z += "<p>" + h.fields[q] + ' <input type="text" length="15" value="' + h.fieldDateFormat[q] + '" id="data-format-string-' + q + '"/></p>', A = !0);
        h.allowConnectivity && (v += '<option value="NearestNeighbor">' + wpd.gettext("nearest-neighbor") + "</option>");
        r.innerHTML = v;
        d();
        A ? (x.style.display = "inline-block", u.innerHTML = z) : x.style.display = "hidden"
    }

    function d() {
        var q = document.getElementById("data-sort-variables").value, r = document.getElementById("data-sort-order");
        "NearestNeighbor" === q || "raw" === q ? r.setAttribute("disabled", !0) : r.removeAttribute("disabled")
    }

    function e() {
        if (null != h && null != h.rawData) {
            k = h.rawData.slice(0);
            var q = document.getElementById("data-sort-variables").value,
                r = "ascending" === document.getElementById("data-sort-order").value, t = "NearestNeighbor" === q;
            if ("raw" !== q) if (!t) {
                var x = h.fields.indexOf(q);
                0 > x || k.sort(function (H, D) {
                    return H[x] > D[x] ? r ? 1 : -1 : H[x] < D[x] ? r ? -1 : 1 : 0
                })
            } else if (t) {
                var u, y, v = k.length, z = h.connectivityFieldIndices, A;
                for (t = 0; t < v - 1; t++) {
                    q =
                        -1;
                    for (y = t + 1; y < v; y++) {
                        for (A = u = 0; A < z.length; A++) {
                            var E = z[A];
                            u += (k[t][E] - k[y][E]) * (k[t][E] - k[y][E])
                        }
                        if (u < F || -1 === q) {
                            var F = u;
                            q = y
                        }
                    }
                    for (A = 0; A < h.fields.length; A++) u = k[q][A], k[q][A] = k[t + 1][A], k[t + 1][A] = u
                }
            }
        }
    }

    function f() {
        if (null != k) {
            var q = document.getElementById("digitizedDataTable"),
                r = parseInt(document.getElementById("data-number-format-digits").value, 10),
                t = document.getElementById("data-number-format-style").value,
                x = document.getElementById("data-number-format-separator").value, u, y, v = [];
            x = x.replace(/[^\\]\\t/,
                "\t").replace(/^\\t/, "\t");
            l = "";
            for (u = 0; u < k.length; u++) {
                var z = [];
                for (y = 0; y < h.fields.length; y++) null != h.fieldDateFormat[y] ? (void 0 === v[y] && (v[y] = document.getElementById("data-format-string-" + y).value), z[y] = wpd.dateConverter.formatDateNumber(k[u][y], v[y])) : (z[y] = "string" === typeof k[u][y] ? k[u][y] : "fixed" === t && 0 <= r ? k[u][y].toFixed(r) : "precision" === t && 0 <= r ? k[u][y].toPrecision(r) : "exponential" === t && 0 <= r ? k[u][y].toExponential(r) : k[u][y], z[y] = null === z[y] ? "" : z[y].toString().replace(".", n));
                l += z.join(x);
                l +=
                    "\n"
            }
            q.value = l
        }
    }

    var g, h, k, l, p, m, n = (1.1).toLocaleString().replace(/\d/g, "");
    return {
        showTable: function () {
            g = wpd.plotDataProvider;
            p = wpd.tree.getActiveDataset();
            m = null;
            g.setDataSource(p);
            a()
        }, showAngleData: function () {
            g = wpd.measurementDataProvider;
            m = wpd.measurementModes.angle.getData();
            p = null;
            g.setDataSource(m);
            a()
        }, showAreaData: function () {
            g = wpd.measurementDataProvider;
            m = wpd.measurementModes.area.getData();
            p = null;
            g.setDataSource(m);
            a()
        }, showDistanceData: function () {
            g = wpd.measurementDataProvider;
            m = wpd.measurementModes.distance.getData();
            p = null;
            g.setDataSource(m);
            a()
        }, updateSortingControls: d, reSort: function () {
            d();
            e();
            f()
        }, copyToClipboard: function () {
            var q = document.getElementById("digitizedDataTable");
            q.focus();
            q.select();
            try {


                var rawData = q.value.split('\n');
                var processedData = [];
                for (var i = 0 ; i < rawData.length ; i++){
                  var o = new Object();
                  var splitter = rawData[i].split(', ');
                  o.x = splitter[0];
                  o.y = splitter[1];
                  processedData.push(o);
                }

                var data = processedData;
                var titles = d3.keys(data[0]);
                const myNode = parent.document.getElementById('StandardData');
                myNode.innerHTML = '';
                var table = d3.select(myNode).append('table');
                var rows = table.append('tbody').selectAll('tr')
                    .data(data).enter()
                    .append('tr')
                    .attr('index', function (d, i) {
                        return i;
                    });

                let titleMap = new Map();
                titleMap[titles[0]] = 'x';
                titleMap[titles[1]] = 'y';
                var headers = table.append('thead').append('tr')
                    .selectAll('th')
                    .data(titles).enter()
                    .append('th')
                    .text(function (d) {
                        return titleMap[d];
                    });

                rows.selectAll('td')
                    .data(function (d) {
                        return titles.map(function (k) {
                            return {'value': d[k], 'name': k};
                        });
                    }).enter()
                    .append('td')
                    .attr('data-th', function (d) {
                        return d.name;
                    })
                    .attr('class', 'DataElements')

                    .html(function (d) {
                        return d.value;
                    });


















                document.execCommand("copy")
            } catch (r) {
                console.log("copyToClipboard", r.message)
            }
        }, generateCSV: function () {
            wpd.download.csv(l, (null != p ? p.name : m instanceof wpd.AngleMeasurement ? "angles" : "distances") + ".csv")
        }, exportToPlotly: function () {
            if (null != k) {
                var q = {data: []}, r, t;
                q.data[0] = {};
                for (r = 0; r < k.length; r++) for (t = 0; t < h.fields.length; t++) {
                    var x =
                        h.fields[t];
                    0 === t ? x = "x" : 1 === t && (x = "y");
                    0 === r && (q.data[0][x] = []);
                    q.data[0][x][r] = null != h.fieldDateFormat[t] ? wpd.dateConverter.formatDateNumber(k[r][t], "yyyy-mm-dd hh:ii:ss") : k[r][t]
                }
                wpd.plotly.send(q)
            }
        }, changeDataset: function () {
            var q = document.getElementById("data-table-dataset-list");
            null != p ? (p = wpd.appData.getPlotData().getDatasets()[q.selectedIndex], g.setDataSource(p)) : null != m && ("angle" === q.value ? m = wpd.appData.getPlotData().getMeasurementsByType(wpd.AngleMeasurement)[0] : "distance" === q.value ? m = wpd.appData.getPlotData().getMeasurementsByType(wpd.DistanceMeasurement)[0] :
                "area" === q.value && (m = wpd.appData.getPlotData().getMeasurementsByType(wpd.AreaMeasurement)[0]), g.setDataSource(m));
            b()
        }
    }
}();
wpd = wpd || {};
wpd.graphicsWidget = function () {
    function a(w) {
        var B = v.getBoundingClientRect();
        return {
            x: parseInt(w.pageX - (B.left + window.pageXOffset), 10),
            y: parseInt(w.pageY - (B.top + window.pageYOffset), 10)
        }
    }

    function b(w, B) {
        return {x: w / R, y: B / R}
    }

    function c(w, B) {
        w = parseInt(w, 10);
        B = parseInt(B, 10);
        N.style.width = w + "px";
        N.style.height = B + "px";
        v.width = w;
        z.width = w;
        A.width = w;
        E.width = w;
        F.width = w;
        v.height = B;
        z.height = B;
        A.height = B;
        E.height = B;
        F.height = B;
        ba = w;
        ca = B;
        if (null != fa) {
            W.fillStyle = "rgb(255, 255, 255)";
            W.fillRect(0, 0, ba, ca);
            W.drawImage(H,
                0, 0, ba, ca);
            if (null != P && void 0 != P.onRedraw) P.onRedraw();
            if (null != G && void 0 != G.onRedraw) G.onRedraw()
        }
    }

    function d() {
        z.width = z.width;
        A.width = A.width;
        E.width = E.width;
        F.width = F.width;
        D.width = D.width
    }

    function e() {
        if (null != P && void 0 != P.onRemove) P.onRemove();
        P = null
    }

    function f() {
        var w = wpd.layoutManager.getGraphicsViewportSize();
        w.width / (1 * w.height) > ha ? (R = w.height / (1 * L), c(w.height * ha, w.height)) : (R = w.width / (1 * M), c(w.width, w.width / ha))
    }

    function g(w) {
        R = w;
        c(M * R, L * R)
    }

    function h() {
        ia = !ia;
        var w = document.getElementById("extended-crosshair-btn");
        ia ? w.classList.add("pressed-button") : w.classList.remove("pressed-button");
        F.width = F.width
    }

    function k(w, B) {
        var C = wpd.zoomView.getSize(), I = wpd.zoomView.getZoomRatio(), S = 0, Q = 0, X = C.width, T = C.height;
        var V = C.width / I;
        C = C.height / I;
        var U = w - V / 2;
        var da = B - C / 2;
        w = U;
        B = da;
        var O = U + V;
        var ka = da + C;
        0 > U && (w = 0, S = -U * I);
        0 > da && (B = 0, Q = -da * I);
        U + V >= M && (O = M, X -= I * (M - (U + V)));
        da + C >= L && (ka = L, T -= I * (L - (da + C)));
        V = ea.getImageData(parseInt(w, 10), parseInt(B, 10), parseInt(O - w, 10), parseInt(ka - B, 10));
        C = ja.getImageData(parseInt(w, 10), parseInt(B,
            10), parseInt(O - w, 10), parseInt(ka - B, 10));
        for (O = 0; O < C.data.length; O += 4) if (0 != C.data[O] || 0 != C.data[O + 1] || 0 != C.data[O + 2]) U = C.data[O + 3] / 255, V.data[O] = (1 - U) * V.data[O] + U * C.data[O], V.data[O + 1] = (1 - U) * V.data[O + 1] + U * C.data[O + 1], V.data[O + 2] = (1 - U) * V.data[O + 2] + U * C.data[O + 2];
        w = I * (parseInt(w, 10) - w);
        I *= parseInt(B, 10) - B;
        wpd.zoomView.setZoomImage(V, parseInt(S + w, 10), parseInt(Q + I, 10), parseInt(X - S, 10), parseInt(T - Q, 10))
    }

    function l(w) {
        clearTimeout(na);
        var B = setTimeout, C = a(w);
        w = C.x;
        C = C.y;
        var I = b(w, C);
        ia && (F.width = F.width,
            K.strokeStyle = "rgba(0,0,0, 0.5)", K.beginPath(), K.moveTo(w, 0), K.lineTo(w, ca), K.moveTo(0, C), K.lineTo(ba, C), K.stroke());
        k(I.x, I.y);
        wpd.zoomView.setCoords(I.x, I.y);
        na = B(void 0, 10)
    }

    function p() {
        v = document.getElementById("mainCanvas");
        z = document.getElementById("dataCanvas");
        A = document.getElementById("drawCanvas");
        E = document.getElementById("hoverCanvas");
        F = document.getElementById("topCanvas");
        H = document.createElement("canvas");
        D = document.createElement("canvas");
        J = document.createElement("canvas");
        W = v.getContext("2d");
        Y = z.getContext("2d");
        aa = E.getContext("2d");
        K = F.getContext("2d");
        Z = A.getContext("2d");
        ea = H.getContext("2d");
        ja = D.getContext("2d");
        la = J.getContext("2d");
        N = document.getElementById("canvasDiv");
        document.addEventListener("keydown", function (w) {
            ma && 220 === w.keyCode && (w.preventDefault(), h())
        }, !1);
        F.addEventListener("mousemove", l, !1);
        F.addEventListener("dragover", function (w) {
            w.preventDefault()
        }, !0);
        F.addEventListener("drop", function (w) {
            w.preventDefault();
            wpd.busyNote.show();
            w = w.dataTransfer.files;
            1 === w.length &&
            (wpd.imageManager.initializeFileManager(w), wpd.imageManager.loadFromFile(w[0]))
        }, !0);
        F.addEventListener("mousemove", n, !1);
        F.addEventListener("click", q, !1);
        F.addEventListener("mouseup", t, !1);
        F.addEventListener("mousedown", x, !1);
        F.addEventListener("mouseout", u, !0);
        document.addEventListener("mouseup", r, !1);
        document.addEventListener("mousedown", function (w) {
            ma = w.target === F ? !0 : !1
        }, !1);
        document.addEventListener("keydown", function (w) {
            if (ma && null != G && void 0 != G.onKeyDown) G.onKeyDown(w)
        }, !0);
        wpd.zoomView.initZoom();
        window.addEventListener("paste", function (w) {
            if (void 0 !== w.clipboardData && (w = w.clipboardData.items, void 0 !== w)) for (var B = 0; B < w.length; B++) if (-1 !== w[B].type.indexOf("image")) {
                wpd.busyNote.show();
                var C = w[B].getAsFile();
                wpd.imageManager.loadFromFile(C)
            }
        }, !1)
    }

    function m() {
        if (null != G && void 0 != G.onRemove) G.onRemove();
        G = null
    }

    function n(w) {
        if (null != G && void 0 != G.onMouseMove) {
            var B = a(w), C = b(B.x, B.y);
            G.onMouseMove(w, B, C)
        }
    }

    function q(w) {
        if (null != G && void 0 != G.onMouseClick) {
            var B = a(w), C = b(B.x, B.y);
            G.onMouseClick(w,
                B, C)
        }
    }

    function r(w) {
        if (null != G && void 0 != G.onDocumentMouseUp) {
            var B = a(w), C = b(B.x, B.y);
            G.onDocumentMouseUp(w, B, C)
        }
    }

    function t(w) {
        if (null != G && void 0 != G.onMouseUp) {
            var B = a(w), C = b(B.x, B.y);
            G.onMouseUp(w, B, C)
        }
    }

    function x(w) {
        if (null != G && void 0 != G.onMouseDown) {
            var B = a(w), C = b(B.x, B.y);
            G.onMouseDown(w, B, C)
        }
    }

    function u(w) {
        if (null != G && void 0 != G.onMouseOut) {
            var B = a(w), C = b(B.x, B.y);
            G.onMouseOut(w, B, C)
        }
    }

    function y(w) {
        return new Promise(function (B, C) {
            if (w.type.match("image.*")) {
                var I = new FileReader;
                I.onload = function () {
                    var S =
                        I.result;
                    (new Promise(function (Q, X) {
                        var T = new Image;
                        T.onload = function () {
                            J.width = T.width;
                            J.height = T.height;
                            la.drawImage(T, 0, 0, T.width, T.height);
                            Q()
                        };
                        T.src = S
                    })).then(function () {
                        var Q = J.toDataURL("image/png");
                        Q = atob(Q.split(",")[1]);
                        for (var X = Q.length, T = new Uint8Array(X); X--;) T[X] = Q.charCodeAt(X);
                        B(new File([T], w.name, {type: "image/png", encoding: "utf-8"}));
                        la.clearRect(0, 0, J.width, J.height)
                    })
                };
                I.readAsDataURL(w)
            } else C()
        })
    }

    var v, z, A, E, F, H, D, J, N, W, Y, Z, aa, K, ea, ja, la, ba, ca, M, L, ha, fa, R, ia = !1, na, G, P, ma = !1;
    return {
        zoomIn: function () {
            g(1.2 * R)
        }, zoomOut: function () {
            g(R / 1.2)
        }, zoomFit: f, zoom100perc: function () {
            g(1)
        }, toggleExtendedCrosshairBtn: h, setZoomRatio: g, getZoomRatio: function () {
            return R
        }, runImageOp: function (w) {
            var B = w(fa, M, L);
            w = B.imageData;
            var C = B.width, I = B.height;
            B = B.keepZoom;
            m();
            e();
            M = C;
            L = I;
            ha = M / (1 * L);
            H.width = M;
            H.height = L;
            D.width = M;
            D.height = L;
            ea.putImageData(w, 0, 0);
            fa = w;
            v.width = v.width;
            d();
            B ? g(R) : f()
        }, setTool: function (w) {
            if (null != G && void 0 != G.onRemove) G.onRemove();
            G = w;
            if (null != G && void 0 != G.onAttach) G.onAttach()
        },
        removeTool: m, getAllContexts: function () {
            return {mainCtx: W, dataCtx: Y, drawCtx: Z, hoverCtx: aa, topCtx: K, oriImageCtx: ea, oriDataCtx: ja}
        }, resetData: function () {

            D.width = D.width;
            z.width = z.width
        }, resetHover: function () {
            E.width = E.width
        }, imagePx: b, screenPx: function (w, B) {
            return {x: w * R, y: B * R}
        }, updateZoomOnEvent: function (w) {
            w = a(w);
            w = b(w.x, w.y);
            k(w.x, w.y);
            wpd.zoomView.setCoords(w.x, w.y)
        }, updateZoomToImagePosn: function (w, B) {
            k(w, B);
            wpd.zoomView.setCoords(w, B)
        }, getDisplaySize: function () {
            return {width: ba, height: ca}
        }, getImageSize: function () {
            return {
                width: M,
                height: L
            }
        }, copyImageDataLayerToScreen: function () {
            Y.drawImage(D, 0, 0, ba, ca)
        }, setRepainter: function (w) {
            if (null != P && void 0 != P.onRemove) P.onRemove();
            P = w;
            if (null != P && void 0 != P.onAttach) P.onAttach()
        }, removeRepainter: e, forceHandlerRepaint: function () {
            if (null != P && void 0 != P.onForcedRedraw) P.onForcedRedraw()
        }, getRepainter: function () {
            return P
        }, saveImage: function () {
            var w = document.createElement("canvas"), B = w.getContext("2d"), C;
            w.width = M;
            w.height = L;
            B.drawImage(H, 0, 0, M, L);
            var I = B.getImageData(0, 0, M, L);
            var S = ja.getImageData(0,
                0, M, L);
            for (C = 0; C < I.data.length; C += 4) if (0 != S.data[C] || 0 != S.data[C + 1] || 0 != S.data[C + 2]) {
                var Q = S.data[C + 3] / 255;
                I.data[C] = (1 - Q) * I.data[C] + Q * S.data[C];
                I.data[C + 1] = (1 - Q) * I.data[C + 1] + Q * S.data[C + 1];
                I.data[C + 2] = (1 - Q) * I.data[C + 2] + Q * S.data[C + 2]
            }
            B.putImageData(I, 0, 0);
            window.open(w.toDataURL(), "_blank")
        }, loadImage: function (w) {
            null == v && p();
            m();
            e();
            M = w.width;
            L = w.height;
            ha = M / (1 * L);
            H.width = M;
            H.height = L;
            D.width = M;
            D.height = L;
            ea.drawImage(w, 0, 0, M, L);
            fa = ea.getImageData(0, 0, M, L);
            v.width = v.width;
            d();
            f();
            return fa
        }, getImageFiles: function () {
            for (var w =
                [], B = $jscomp.makeIterator(wpd.appData.getFileManager().getFiles()), C = B.next(); !C.done; C = B.next()) C = C.value, C = "application/pdf" === C.type ? C : y(C), w.push(C);
            return Promise.all(w)
        }
    }
}();
wpd = wpd || {};
wpd.layoutManager = function () {
    function a() {
        var k = parseInt(document.body.offsetWidth, 10), l = parseInt(document.body.offsetHeight, 10);
        e.style.height = l + "px";
        f.style.height = l - 280 + "px";
        g.style.width = k - e.offsetWidth - 5 + "px";
        g.style.height = l + "px";
        d.style.height = l - 85 + "px";
        h.style.height = l - 85 + "px";
        wpd.sidebar.resize()
    }

    function b(k) {
        clearTimeout(c);
        c = setTimeout(a, 80)
    }

    var c, d, e, f, g, h;
    return {
        initialLayout: function () {
            d = document.getElementById("graphicsContainer");
            e = document.getElementById("sidebarContainer");
            f = document.getElementById("sidebarControlsContainer");
            g = document.getElementById("mainContainer");
            h = document.getElementById("left-side-container");
            a();
            window.addEventListener("resize", b, !1);
            wpd.tree.init()
        }, getGraphicsViewportSize: function () {
            return {width: d.offsetWidth, height: d.offsetHeight}
        }
    }
}();
wpd = wpd || {};
wpd.popup = function () {
    function a(p) {
        document.getElementById("shadow").style.visibility = "hidden";
        document.getElementById(p).style.visibility = "hidden";
        g();
        window.removeEventListener("keydown", h, !1);
        l = null
    }

    function b(p) {
        // no popup drag mask stuff
        // var m = document.createElement("div");
        // m.className = "popup-drag-mask";
        // m.style.display = "inline-block";
        // m.addEventListener("mousemove", c, !1);
        // m.addEventListener("mouseup", d, !1);
        // m.addEventListener("mouseout", f, !1);
        // document.body.appendChild(m);
        // k = {
        //     dragMaskDiv: m, initialMouseX: p.pageX, initialMouseY: p.pageY,
        //     initialWindowX: l.offsetLeft, initialWindowY: l.offsetTop
        // };
        // p.preventDefault();
        // p.stopPropagation()
    }

    function c(p) {
        // e(p);
        p.stopPropagation();
        p.preventDefault()
    }

    function d(p) {
        // e(p);
        g();
        p.stopPropagation();
        p.preventDefault()
    }

    function e(p) {
        var m = k.initialWindowX + p.pageX - k.initialMouseX;
        p = k.initialWindowY + p.pageY - k.initialMouseY;
        var n = parseInt(document.body.offsetWidth, 10), q = parseInt(document.body.offsetHeight, 10),
            r = parseInt(l.offsetWidth, 10), t = parseInt(l.offsetHeight, 10);
        m + .7 * r < n && 0 < m && 0 < p && p + .5 * t < q && (l.style.top =
            p + "px", l.style.left = m + "px")
    }

    function f(p) {
        g()
    }

    function g() {
        null != k && null != k.dragMaskDiv && (k.dragMaskDiv.removeEventListener("mouseout", f, !1), k.dragMaskDiv.removeEventListener("mouseup", d, !1), k.dragMaskDiv.removeEventListener("mousemove", c, !1), k.dragMaskDiv.style.display = "none", document.body.removeChild(k.dragMaskDiv), k = null)
    }

    function h(p) {
        wpd.keyCodes.isEsc(p.keyCode) && a(l.id)
    }

    var k = null, l = null;
    return {
        show: function (p) {
            document.getElementById("shadow").style.visibility = "visible";
            p = document.getElementById(p);

            var m = parseInt(window.innerWidth, 10), n = parseInt(window.innerHeight, 10),
                q = parseInt(p.offsetWidth, 10), r = parseInt(p.offsetHeight, 10);
            n = (n - r) / 2;
            p.style.left = (m - q) / 2 + "px";
            p.style.top = (60 < n ? 60 : n) + "px";
            p.style.visibility = "visible";
            for (m = 0; m < p.childNodes.length; m++) if ("popupheading" === p.childNodes[m].className) {
                p.childNodes[m].addEventListener("mousedown", b, !1);
                break
            }
            window.addEventListener("keydown", h, !1);
            l = p;
            p = p.getElementsByTagName("input");
            // 0 < p.length && p[0].focus()
        }, close: a
    }
}();
wpd.busyNote = function () {
    var a, b = !1;
    return {
        show: function () {
            b || (null == a && (a = document.createElement("div"), a.id = "wait", a.innerHTML = '<p align="center">' + wpd.gettext("processing") + "...</p>"), document.body.appendChild(a), b = !0)
        }, close: function () {
            null != a && !0 === b && (document.body.removeChild(a), b = !1)
        }
    }
}();
wpd.messagePopup = function () {
    var a;
    return {
        show: function (b, c, d) {
            wpd.popup.show("messagePopup");
            document.getElementById("message-popup-heading").innerHTML = b;
            document.getElementById("message-popup-text").innerHTML = c;
            a = d
        }, close: function () {
            wpd.popup.close("messagePopup");
            null != a && a()
        }
    }
}();
wpd.okCancelPopup = function () {
    var a, b;
    return {
        show: function (c, d, e, f) {
            wpd.popup.show("okCancelPopup");
            document.getElementById("ok-cancel-popup-heading").innerHTML = c;
            document.getElementById("ok-cancel-popup-text").innerHTML = d;
            a = e;
            b = f
        }, ok: function () {
            wpd.popup.close("okCancelPopup");
            null != a && a()
        }, cancel: function () {
            wpd.popup.close("okCancelPopup");
            null != b && b()
        }
    }
}();
wpd.unsupported = function () {
    wpd.messagePopup.show(wpd.gettext("unsupported"), wpd.gettext("unsupported-text"))
};
wpd = wpd || {};
wpd.sidebar = function () {
    function a() {
        for (var b = document.getElementsByClassName("sidebar"), c = 0; c < b.length; c++) b[c].style.display = "none"
    }

    return {
        show: function (b) {
            a();
            b = document.getElementById(b);
            b.style.display = "inline-block";
            b.style.height = parseInt(document.body.offsetHeight, 10) - 280 + "px"
        }, clear: a, resize: function () {
            for (var b = document.getElementsByClassName("sidebar"), c = 0; c < b.length; c++) "inline-block" === b[c].style.display && (b[c].style.height = parseInt(document.body.offsetHeight, 10) - 280 + "px")
        }
    }
}();
wpd = wpd || {};
wpd.toolbar = function () {
    function a() {
        for (var b = document.getElementsByClassName("toolbar"), c = 0; c < b.length; c++) b[c].style.visibility = "hidden"
    }

    return {
        show: function (b) {
            a();
            document.getElementById(b).style.visibility = "visible"
        }, clear: a
    }
}();
wpd = wpd || {};
wpd.TreeWidget = function (a) {
    var b = this;
    this.$mainElem = a;
    this.treeData = null;
    this.itemColors = {};
    this.$mainElem.addEventListener("click", function (c) {
        return b._onclick(c)
    });
    this.$mainElem.addEventListener("keydown", function (c) {
        return b._onkeydown(c)
    });
    this.$mainElem.addEventListener("dblclick", function (c) {
        return b._ondblclick(c)
    });
    this.idmap = [];
    this.itemCount = 0;
    this.selectedPath = null
};
wpd.TreeWidget.prototype._renderFolder = function (a, b, c) {
    if (null != a) {
        c = c ? '<ul class="tree-list">' : '<ul class="tree-list-root">';
        for (var d = 0; d < a.length; d++) {
            var e = a[d];
            this.itemCount++;
            if ("string" === typeof e) {
                var f = b + "/" + e;
                c += '<li title="' + e + '">';
                var g = this.itemColors[f];
                "undefined" !== typeof g && (c += '<div class="tree-item-icon" style="background-color: ' + g.toRGBString() + ';"></div>');
                c += '<span class="tree-item" id="tree-item-id-' + this.itemCount + '">' + e + "</span>";
                this.idmap[this.itemCount] = f
            } else "object" ===
            typeof e && (c += "<li>", f = Object.keys(e)[0], c += '<span class="tree-folder" id="tree-item-id-' + this.itemCount + '">' + f + "</span>", this.idmap[this.itemCount] = b + "/" + f, c += this._renderFolder(e[f], b + "/" + f, !0));
            c += "</li>"
        }
        return c + "</ul>"
    }
};
wpd.TreeWidget.prototype.render = function (a, b) {
    a.splice(0,1); //removes image
    a.splice(2,1) //removes measurements
    //a is the array that contains the image, axes, datasets, and measurements,
    //remove image and measurements for now? index 0 and 3
    this.idmap = [];
    this.itemCount = 0;
    this.treeData = a;
    this.itemColors = b;
    this.$mainElem.innerHTML = this._renderFolder(this.treeData, "", !1);
    this.selectedPath = null
};
wpd.TreeWidget.prototype._unselectAll = function () {
    var a = this.$mainElem.querySelectorAll(".tree-folder"), b = this.$mainElem.querySelectorAll(".tree-item");
    a.forEach(function (c) {
        c.classList.remove("tree-selected")
    });
    b.forEach(function (c) {
        c.classList.remove("tree-selected")
    });
    this.selectedPath = null
};
wpd.TreeWidget.prototype.selectPath = function (a, b) {
    var c = this.idmap.indexOf(a);
    0 <= c && (this._unselectAll(), this.selectedPath = a, c = document.getElementById("tree-item-id-" + c), c.classList.add("tree-selected"), null != this.itemSelectionCallback && this.itemSelectionCallback(c, a, b))
};
wpd.TreeWidget.prototype._onclick = function (a) {
    var b = a.target.classList.contains("tree-item"), c = a.target.classList.contains("tree-folder");
    if (b || c) this._unselectAll(), a.target.classList.add("tree-selected"), null != this.itemSelectionCallback && (b = parseInt(a.target.id.replace("tree-item-id-", ""), 10), isNaN(b) || (this.selectedPath = this.idmap[b], this.itemSelectionCallback(a.target, this.idmap[b], !1)))
};
wpd.TreeWidget.prototype._onkeydown = function (a) {
    ("F2" === a.key || "r" === a.key.toLowerCase() && a.metaKey) && this.itemRenameCallback && (this.itemRenameCallback(a.target, this.selectedPath, !1), a.preventDefault())
};
wpd.TreeWidget.prototype._ondblclick = function (a) {
    this.itemRenameCallback && (this.itemRenameCallback(a.target, this.selectedPath, !1), a.preventDefault(), a.stopPropagation())
};
wpd.TreeWidget.prototype.onItemSelection = function (a) {
    this.itemSelectionCallback = a
};
wpd.TreeWidget.prototype.onItemRename = function (a) {
    this.itemRenameCallback = a
};
wpd.TreeWidget.prototype.getSelectedPath = function () {
    return this.selectedPath
};
wpd.tree = function () {
    function a() {
        if (null != k) {
            var m = [], n = {}, q = wpd.appData.getPlotData(), r = wpd.appData.getFileManager(),
                t = wpd.appData.getPageManager(), x = r.currentFileIndex();
            m.push(wpd.gettext("image"));
            var u = q.getAxesNames(), y = r.getAxesNameMap();
            u = u.filter(function (D) {
                return y[D] === x
            });
            var v = {};
            if (wpd.appData.isMultipage()) {
                var z = t.currentPage(), A = t.getAxesNameMap();
                v[wpd.gettext("axes")] = u.filter(function (D) {
                    return A[D] === z
                })
            } else v[wpd.gettext("axes")] = u;
            m.push(v);
            u = q.getDatasetNames();
            var E = r.getDatasetNameMap();
            u = u.filter(function (D) {
                return E[D] === x
            });
            v = {};
            if (wpd.appData.isMultipage()) {
                var F = t.currentPage(), H = t.getDatasetNameMap();
                v[wpd.gettext("datasets")] = u.filter(function (D) {
                    return H[D] === F
                })
            } else v[wpd.gettext("datasets")] = u;
            m.push(v);
            u = $jscomp.makeIterator(q.getDatasets());
            for (v = u.next(); !v.done; v = u.next()) v = v.value, null != v.colorRGB && (n["/" + wpd.gettext("datasets") + "/" + v.name] = v.colorRGB);
            u = r.filterToCurrentFileMeasurements(q.getMeasurementsByType(wpd.DistanceMeasurement));
            v = r.filterToCurrentFileMeasurements(q.getMeasurementsByType(wpd.AngleMeasurement));
            q = r.filterToCurrentFileMeasurements(q.getMeasurementsByType(wpd.AreaMeasurement));
            wpd.appData.isMultipage() && (u = t.filterToCurrentPageMeasurements(u), v = t.filterToCurrentPageMeasurements(v), q = t.filterToCurrentPageMeasurements(q));
            t = [];
            0 < q.length && t.push(wpd.gettext("area"));
            0 < v.length && t.push(wpd.gettext("angle"));
            0 < u.length && t.push(wpd.gettext("distance"));
            q = {};
            q[wpd.gettext("measurements")] = t;
            m.push(q);
            k.render(m, n);
            b(null)
        }
    }

    function b(m) {
        document.querySelectorAll(".tree-widget").forEach(function (n) {
            n.style.display =
                n.id === m ? "inline" : "none"
        })
    }

    function c() {
        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.resetData();
        wpd.sidebar.clear()
    }

    function d() {
        c();
        var m = [], n = [], q = wpd.appData.getPlotData(), r = wpd.appData.getFileManager(), t = r.getDatasetNameMap(),
            x = r.currentFileIndex();
        r = q.getDatasets().filter(function (z) {
            return t[z.name] === x
        });
        if (wpd.appData.isMultipage()) {
            var u = wpd.appData.getPageManager(), y = u.currentPage(), v = u.getDatasetNameMap();
            r = $jscomp.makeIterator(r.filter(function (z) {
                return v[z.name] === y
            }));
            for (u =
                     r.next(); !u.done; u = r.next()) u = u.value, m.push(q.getAxesForDataset(u)), n.push(u)
        } else for (r = $jscomp.makeIterator(r), u = r.next(); !u.done; u = r.next()) u = u.value, m.push(q.getAxesForDataset(u)), n.push(u);
        wpd.graphicsWidget.setRepainter(new wpd.MultipltDatasetRepainter(m, n))
    }

    function e(m) {
        var n = wpd.appData.getPlotData(), q = n.getAxesColl();
        m = m == wpd.measurementModes.distance;
        var r = wpd.appData.getFileManager(), t = r.getAxesNameMap(), x = r.currentFileIndex(),
            u = r.filterToCurrentFileMeasurements(m ? n.getMeasurementsByType(wpd.DistanceMeasurement) :
                n.getMeasurementsByType(wpd.AreaMeasurement));
        r = "<option value='-1'>None</option>";
        if (wpd.appData.isMultipage()) {
            var y = wpd.appData.getPageManager(), v = y.currentPage(), z = y.getAxesNameMap();
            u = y.filterToCurrentPageMeasurements(u);
            u = u[u.length - 1];
            for (y = 0; y < q.length; y++) t[q[y].name] === x && z[q[y].name] === v && (q[y] instanceof wpd.ImageAxes || q[y] instanceof wpd.MapAxes) && (r += "<option value='" + y + "'>" + q[y].name + "</option>")
        } else for (u = u[0], v = 0; v < q.length; v++) t[q[v].name] === x && (q[v] instanceof wpd.ImageAxes || q[v] instanceof
            wpd.MapAxes) && (r += "<option value='" + v + "'>" + q[v].name + "</option>");
        m = m ? document.getElementById("distance-item-axes-select") : document.getElementById("area-item-axes-select");
        m.innerHTML = r;
        n = n.getAxesForMeasurement(u);
        m.value = null == n ? "-1" : q.indexOf(n);
        p = n
    }

    function f(m, n, q) {
        if (n === "/" + wpd.gettext("image")) c(), p = null, b("image-item-tree-widget"), wpd.sidebar.show("image-editing-sidebar"), wpd.appData.getUndoManager().updateUI(); else if (n.startsWith("/" + wpd.gettext("image") + "/")) h("/" + wpd.gettext("image"));
        else if (n === "/" + wpd.gettext("datasets")) d(), b("dataset-group-tree-widget"), p = null; else if (n === "/" + wpd.gettext("axes")) c(), b("axes-group-tree-widget"), p = null; else if (n === "/" + wpd.gettext("measurements")) c(), b("measurement-group-tree-widget"), p = null; else if (n === "/" + wpd.gettext("measurements") + "/" + wpd.gettext("distance")) q || wpd.measurement.start(wpd.measurementModes.distance), b("distance-item-tree-widget"), e(wpd.measurementModes.distance); else if (n === "/" + wpd.gettext("measurements") + "/" + wpd.gettext("angle")) q ||
        wpd.measurement.start(wpd.measurementModes.angle), b("angle-item-tree-widget"), p = null; else if (n === "/" + wpd.gettext("measurements") + "/" + wpd.gettext("area")) q || wpd.measurement.start(wpd.measurementModes.area), b("area-item-tree-widget"), e(wpd.measurementModes.area); else if (n.startsWith("/" + wpd.gettext("datasets") + "/")) {
            m = wpd.appData.getPlotData();
            n = m.getDatasetNames().indexOf(n.replace("/" + wpd.gettext("datasets") + "/", ""));
            0 <= n && (q || c(), l = m.getDatasets()[n], q || wpd.acquireData.load());
            b("dataset-item-tree-widget");
            if (null != l) {
                n = wpd.appData.getPlotData();
                q = n.getAxesNames();
                n = n.getAxesForDataset(l);
                m = document.getElementById("dataset-item-axes-select");
                var r = wpd.appData.getFileManager(), t = r.getAxesNameMap();
                r = r.currentFileIndex();
                var x = "<option value='-1'>None</option>";
                if (wpd.appData.isMultipage()) {
                    var u = wpd.appData.getPageManager(), y = u.currentPage();
                    u = u.getAxesNameMap();
                    for (var v = 0; v < q.length; v++) t[q[v]] === r && u[q[v]] === y && (x += "<option value='" + v + "'>" + q[v] + "</option>")
                } else for (y = 0; y < q.length; y++) t[q[y]] === r &&
                (x += "<option value='" + y + "'>" + q[y] + "</option>");
                m.innerHTML = x;
                m.value = null == n ? "-1" : q.indexOf(n.name);
                p = n
            }
            null != l && (document.getElementById("dataset-display-color-picker-button").style.backgroundColor = l.colorRGB.toRGBString())
        } else n.startsWith("/" + wpd.gettext("axes") + "/") ? (c(), b("axes-item-tree-widget"), n = n.replace("/" + wpd.gettext("axes") + "/", ""), q = wpd.appData.getPlotData(), n = q.getAxesNames().indexOf(n), p = q.getAxesColl()[n], document.getElementById("tweak-axes-calibration-button").disabled = p instanceof
        wpd.ImageAxes ? !0 : !1) : (c(), b(null), p = null)
    }

    function g(m, n, q) {
        n.startsWith("/" + wpd.gettext("datasets") + "/") ? wpd.dataSeriesManagement.showRenameDataset() : n.startsWith("/" + wpd.gettext("axes") + "/") && wpd.alignAxes.showRenameAxes()
    }

    function h(m, n) {
        k.selectPath(m, n)
    }

    var k = null, l = null, p = null;
    window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = function (m, n) {
        n = n || window;
        for (var q = 0; q < this.length; q++) m.call(n, this[q], q, this)
    });
    return {
        init: function () {
            var m = document.getElementById("tree-container");
            k = new wpd.TreeWidget(m);
            k.onItemSelection(f);
            k.onItemRename(g);
            a()
        }, refresh: function () {
            a()
        }, refreshPreservingSelection: function (m) {
            if (null != k) {
                var n = k.getSelectedPath();
                a();
                k.selectPath(n, !m)
            } else a()
        }, selectPath: h, addMeasurement: function (m) {
            wpd.measurement.start(m);
            a();
            var n = !0;
            wpd.appData.isMultipage() && (n = !1);
            m === wpd.measurementModes.distance ? wpd.tree.selectPath("/" + wpd.gettext("measurements") + "/" + wpd.gettext("distance"), n) : m === wpd.measurementModes.angle ? wpd.tree.selectPath("/" + wpd.gettext("measurements") +
                "/" + wpd.gettext("angle"), n) : m === wpd.measurementModes.area && wpd.tree.selectPath("/" + wpd.gettext("measurements") + "/" + wpd.gettext("area"), n)
        }, getActiveDataset: function () {
            return l
        }, getActiveAxes: function () {
            return p
        }
    }
}();
wpd = wpd || {};
wpd.webcamCapture = function () {
    function a() {
        void 0 != b && b.stop();
        wpd.popup.close("webcamCapture")
    }

    var b;
    return {
        start: function () {
            if (null == (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)) wpd.messagePopup.show(wpd.gettext("webcam-capture"), wpd.gettext("webcam-capture-text")); else {
                wpd.popup.show("webcamCapture");
                var c = document.getElementById("webcamVideo");
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;
                navigator.getUserMedia({video: !0}, function (d) {
                    b = d;
                    c.src = window.URL.createObjectURL(d)
                }, function () {
                })
            }
        }, cancel: function () {
            a()
        }, capture: function () {
            var c = document.createElement("canvas"), d = document.getElementById("webcamVideo"),
                e = c.getContext("2d");
            c.width = d.videoWidth;
            c.height = d.videoHeight;
            e.drawImage(d, 0, 0);
            var f = e.getImageData(0, 0, c.width, c.height);
            a();
            wpd.graphicsWidget.runImageOp(function () {
                return {imageData: f, width: c.width, height: c.height}
            })
        }
    }
}();
wpd = wpd || {};
wpd.zoomView = function () {
    function a() {
        var k = document.getElementById("zoomCrossHair"), l = k.getContext("2d");
        k.width = k.width;
        l.strokeStyle = "black" === h ? "rgba(0,0,0,1)" : "red" === h ? "rgba(255,0,0,1)" : "yellow" === h ? "rgba(255,255,0,1)" : "rgba(0,0,0,1)";
        l.beginPath();
        l.moveTo(125, 0);
        l.lineTo(125, 250);
        l.moveTo(0, 125);
        l.lineTo(250, 125);
        l.stroke()
    }

    var b, c, d, e, f, g, h = "black";
    return {
        initZoom: function () {
            b = document.getElementById("zoomCanvas");
            c = b.getContext("2d");
            d = document.createElement("canvas");
            e = d.getContext("2d");
            f = document.getElementById("mousePosition");
            g = 5;
            a()
        }, setZoomImage: function (k, l, p, m, n) {
            d.width = m / g;
            d.height = n / g;
            e.putImageData(k, 0, 0);
            b.width = b.width;
            c.drawImage(d, l, p, m, n)
        }, setCoords: function (k, l) {
            var p = wpd.tree.getActiveAxes();
            f.innerHTML = null != p ? p.pixelToLiveString(k, l) : k.toFixed(2) + ", " + l.toFixed(2)
        }, setZoomRatio: function (k) {
            g = k
        }, getZoomRatio: function () {
            return g
        }, getSize: function () {
            return {width: 250, height: 250}
        }, showSettingsWindow: function () {
            document.getElementById("zoom-magnification-value").value =
                g;
            document.getElementById("zoom-crosshair-color-value").value = h;
            wpd.popup.show("zoom-settings-popup")
        }, applySettings: function () {
            g = document.getElementById("zoom-magnification-value").value;
            h = document.getElementById("zoom-crosshair-color-value").value;
            a();
            wpd.popup.close("zoom-settings-popup")
        }
    }
}();
wpd = wpd || {};
wpd.AxesCornersTool = function () {
    return function (a, b) {
        var c = 0, d = !0;
        b ? (c = a.maxPointCount, d = !1) : (c = 0, d = !0, wpd.graphicsWidget.resetData());
        console.log(this);
        this.onMouseClick = function (e, f, g) {
            console.log(e,f,g);
            d ? (c += 1, a.addPoint(g.x, g.y, 0, 0), a.unselectAll(), a.selectPoint(c - 1), wpd.graphicsWidget.forceHandlerRepaint(), c === a.maxPointCount && (d = !1, wpd.alignAxes.calibrationCompleted())) : (a.unselectAll(), a.selectNearestPoint(g.x, g.y), wpd.graphicsWidget.forceHandlerRepaint());
            wpd.graphicsWidget.updateZoomOnEvent(e)
        };
        this.onKeyDown = function (e) {
            if (0 !==
                a.getSelectedPoints().length) {
                var f = a.getPoint(a.getSelectedPoints()[0]), g = f.px;
                f = f.py;
                var h = !0 === e.shiftKey ? 5 / wpd.graphicsWidget.getZoomRatio() : .5 / wpd.graphicsWidget.getZoomRatio();
                if (wpd.keyCodes.isUp(e.keyCode)) f -= h; else if (wpd.keyCodes.isDown(e.keyCode)) f += h; else if (wpd.keyCodes.isLeft(e.keyCode)) g -= h; else if (wpd.keyCodes.isRight(e.keyCode)) g += h; else return;
                a.changePointPx(a.getSelectedPoints()[0], g, f);
                wpd.graphicsWidget.forceHandlerRepaint();
                wpd.graphicsWidget.updateZoomToImagePosn(g, f);
                e.preventDefault();
                e.stopPropagation()
            }
        }
    }
}();
wpd.AlignmentCornersRepainter = function () {
    return function (a) {
        this.painterName = "AlignmentCornersReptainer";
        this.onForcedRedraw = function () {
            wpd.graphicsWidget.resetData();
            this.onRedraw()
        };
        this.onRedraw = function () {
            if (null != a) {
                var b;
                for (b = 0; b < a.getCount(); b++) {
                    var c = a.getPoint(b);
                    c = {x: c.px, y: c.py};
                    var d = a.isPointSelected(b) ? "rgba(0,200,0,1)" : "rgba(200,0,0,1)";
                    wpd.graphicsHelper.drawPoint(c, d, a.labels[b], a.labelPositions[b])
                }
            }
        }
    }
}();
wpd = wpd || {};
wpd.ColorPickerTool = function () {
    return function () {
        var a = wpd.graphicsWidget.getAllContexts();
        this.onMouseClick = function (b, c, d) {
            var e = a.oriImageCtx.getImageData(d.x, d.y, 1, 1);
            b = e.data[0];
            c = e.data[1];
            d = e.data[2];
            0 === e.data[3] && (d = c = b = 255);
            this.onComplete([b, c, d])
        };
        this.onComplete = function (b) {
        }
    }
}();
wpd.ColorFilterRepainter = function () {
    return function () {
        this.painterName = "colorFilterRepainter";
        this.onRedraw = function () {
            var a = wpd.appData.getPlotData().getAutoDetector();
            wpd.colorSelectionWidget.paintFilteredColor(a.binaryData, a.mask)
        }
    }
}();
wpd = wpd || {};
wpd.graphicsHelper = function () {
    return {
        drawPoint: function (a, b, c, d) {
            var e = wpd.graphicsWidget.screenPx(a.x, a.y), f = wpd.graphicsWidget.getAllContexts(),
                g = wpd.graphicsWidget.getImageSize().height;
            if (null != c) {
                f.dataCtx.font = "15px sans-serif";
                var h = f.dataCtx.measureText(c).width;
                f.dataCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
                f.oriDataCtx.font = "15px sans-serif";
                f.oriDataCtx.fillStyle = b;
                switch (d) {
                    case "N":
                    case "n":
                        f.dataCtx.fillRect(e.x - 13, e.y - 24, h + 5, 35);
                        f.dataCtx.fillStyle = b;
                        f.dataCtx.fillText(c, e.x - 10, e.y -
                            7);
                        f.oriDataCtx.fillText(c, a.x - 10, a.y - 7);
                        break;
                    case "E":
                    case "e":
                        f.dataCtx.fillRect(e.x - 7, e.y - 16, h + 17, 26);
                        f.dataCtx.fillStyle = b;
                        f.dataCtx.fillText(c, e.x + 7, e.y + 5);
                        f.oriDataCtx.fillText(c, a.x + 7, a.y + 5);
                        break;
                    case "W":
                    case "w":
                        f.dataCtx.fillRect(e.x - h - 10, e.y - 16, h + 17, 26);
                        f.dataCtx.fillStyle = b;
                        f.dataCtx.fillText(c, e.x - h - 7, e.y + 5);
                        f.oriDataCtx.fillText(c, a.x - h - 7, a.y + 5);
                        break;
                    default:
                        f.dataCtx.fillRect(e.x - 13, e.y - 8, h + 5, 35), f.dataCtx.fillStyle = b, f.dataCtx.fillText(c, e.x - 10, e.y + 18), f.oriDataCtx.fillText(c, a.x -
                            10, a.y + 18)
                }
            }
            f.dataCtx.beginPath();
            f.dataCtx.fillStyle = b;
            f.dataCtx.strokeStyle = "rgb(255, 255, 255)";
            f.dataCtx.arc(e.x, e.y, 4, 0, 2 * Math.PI, !0);
            f.dataCtx.fill();
            f.dataCtx.stroke();
            f.oriDataCtx.beginPath();
            f.oriDataCtx.fillStyle = b;
            f.oriDataCtx.strokeStyle = "rgb(255, 255, 255)";
            f.oriDataCtx.arc(a.x, a.y, 1500 < g ? 4 : 2, 0, 2 * Math.PI, !0);
            f.oriDataCtx.fill();
            f.oriDataCtx.stroke()
        }
    }
}();
wpd = wpd || {};
wpd.GridColorFilterRepainter = function () {
    return function () {
        this.painterName = "gridColorFilterRepainter";
        this.onRedraw = function () {
            var a = wpd.appData.getPlotData().getGridDetectionData();
            wpd.colorSelectionWidget.paintFilteredColor(a.binaryData, a.gridMask.pixels)
        }
    }
}();
wpd.GridBoxTool = function () {
    return function () {
        var a = !1, b, c, d = wpd.graphicsWidget.getAllContexts(), e, f, g = function () {
            wpd.graphicsWidget.resetHover();
            d.hoverCtx.strokeStyle = "rgb(0,0,0)";
            d.hoverCtx.strokeRect(c.x, c.y, f.x - c.x, f.y - c.y)
        }, h = function (p, m, n) {
            !1 !== a && (clearTimeout(e), a = !1, wpd.graphicsWidget.resetHover(), d.dataCtx.fillStyle = "rgba(255,255,0,0.8)", d.dataCtx.fillRect(c.x, c.y, m.x - c.x, m.y - c.y), d.oriDataCtx.fillStyle = "rgba(255,255,0,0.8)", d.oriDataCtx.fillRect(b.x, b.y, n.x - b.x, n.y - b.y))
        }, k = null, l = null;
        this.onAttach = function () {
            wpd.graphicsWidget.setRepainter(new wpd.GridMaskPainter);
            document.getElementById("grid-mask-box").classList.add("pressed-button");
            document.getElementById("grid-mask-view").classList.add("pressed-button")
        };
        this.onMouseDown = function (p, m, n) {
            !0 !== a && (a = !0, b = n, c = m)
        };
        this.onMouseMove = function (p, m, n) {
            !1 !== a && (f = m, clearTimeout(e), e = setTimeout(g, 2))
        };
        this.onMouseOut = function (p, m, n) {
            !0 === a && (clearTimeout(e), k = m, l = n)
        };
        this.onDocumentMouseUp = function (p, m, n) {
            null != k && null != l ? h(p, k, l) :
                h(p, m, n);
            l = k = null
        };
        this.onMouseUp = function (p, m, n) {
            h(p, m, n)
        };
        this.onRemove = function () {
            document.getElementById("grid-mask-box").classList.remove("pressed-button");
            document.getElementById("grid-mask-view").classList.remove("pressed-button");
            wpd.gridDetection.grabMask()
        }
    }
}();
wpd.GridViewMaskTool = function () {
    return function () {
        this.onAttach = function () {
            wpd.graphicsWidget.setRepainter(new wpd.GridMaskPainter);
            document.getElementById("grid-mask-view").classList.add("pressed-button")
        };
        this.onRemove = function () {
            document.getElementById("grid-mask-view").classList.remove("pressed-button");
            wpd.gridDetection.grabMask()
        }
    }
}();
wpd.GridMaskPainter = function () {
    return function () {
        var a = wpd.graphicsWidget.getAllContexts(), b = wpd.appData.getPlotData().getGridDetectionData(),
            c = function () {
                if (null != b.gridMask.pixels && 0 !== b.gridMask.pixels.size) {
                    var d = wpd.graphicsWidget.getImageSize();
                    d = a.oriDataCtx.getImageData(0, 0, d.width, d.height);
                    for (var e = $jscomp.makeIterator(b.gridMask.pixels), f = e.next(); !f.done; f = e.next()) f = f.value, d.data[4 * f] = 255, d.data[4 * f + 1] = 255, d.data[4 * f + 2] = 0, d.data[4 * f + 3] = 200;
                    a.oriDataCtx.putImageData(d, 0, 0);
                    wpd.graphicsWidget.copyImageDataLayerToScreen()
                }
            };
        this.painterName = "gridMaskPainter";
        this.onRedraw = function () {
            wpd.gridDetection.grabMask();
            c()
        };
        this.onAttach = function () {
            wpd.graphicsWidget.resetData();
            c()
        }
    }
}();
wpd = wpd || {};
wpd.CropTool = function () {
    this._isResizing = this._hasCropBox = this._isDrawing = !1;
    this._hotspotCoords = this._imagePos = this._screenPos = this._moveTimer = this._topScreenCorner = this._topImageCorner = null;
    this._resizingHotspot = "";
    this._resizeStartCoords = {x: 0, y: 0};
    this._ctx = wpd.graphicsWidget.getAllContexts()
};
wpd.CropTool.prototype.onAttach = function () {
    document.getElementById("image-editing-crop").classList.add("pressed-button")
};
wpd.CropTool.prototype.onRemove = function () {
    wpd.graphicsWidget.resetHover();
    document.getElementById("image-editing-crop").classList.remove("pressed-button")
};
wpd.CropTool.prototype.onMouseDown = function (a, b, c) {
    this._hasCropBox ? (a = this._getHotspot(b), null != a && (this._isResizing = !0, this._resizeStartCoords = {
        x: b.x,
        y: b.y
    }, this._resizingHotspot = a)) : (this._isDrawing = !0, this._topImageCorner = c, this._topScreenCorner = b)
};
wpd.CropTool.prototype.onMouseMove = function (a, b, c) {
    var d = this;
    if (this._isDrawing) this._screenPos = b, this._imagePos = c, clearTimeout(this._moveTimer), this._moveTimer = setTimeout(function () {
        d._drawCropBox()
    }, 2); else if (this._hasCropBox) {
        c = this._isResizing ? this._resizingHotspot : this._getHotspot(b);
        if (null != c) {
            var e = "crosshair";
            "n" === c || "s" === c ? e = "ns-resize" : "e" == c || "w" == c ? e = "ew-resize" : "nw" == c || "se" == c ? e = "nwse-resize" : "ne" == c || "sw" == c ? e = "nesw-resize" : "c" == c && (e = "move");
            a.target.style.cursor = e
        } else a.target.style.cursor =
            "crosshair";
        this._isResizing && (a = b.x - this._resizeStartCoords.x, c = b.y - this._resizeStartCoords.y, "n" == this._resizingHotspot ? this._topScreenCorner.y += c : "s" == this._resizingHotspot ? this._screenPos.y += c : "w" == this._resizingHotspot ? this._topScreenCorner.x += a : "e" == this._resizingHotspot ? this._screenPos.x += a : "nw" == this._resizingHotspot ? (this._topScreenCorner.y += c, this._topScreenCorner.x += a) : "ne" == this._resizingHotspot ? (this._topScreenCorner.y += c, this._screenPos.x += a) : "sw" == this._resizingHotspot ? (this._screenPos.y +=
            c, this._topScreenCorner.x += a) : "se" == this._resizingHotspot ? (this._screenPos.y += c, this._screenPos.x += a) : "c" == this._resizingHotspot && (this._topScreenCorner.x += a, this._topScreenCorner.y += c, this._screenPos.x += a, this._screenPos.y += c), clearTimeout(this._moveTimer), this._moveTimer = setTimeout(function () {
            d._drawCropBox()
        }, 2), this._resizeStartCoords = {x: b.x, y: b.y})
    }
};
wpd.CropTool.prototype._drawCropBox = function () {
    wpd.graphicsWidget.resetHover();
    var a = this._ctx.hoverCtx;
    a.strokeStyle = "rgb(0,0,0)";
    a.strokeRect(this._topScreenCorner.x, this._topScreenCorner.y, this._screenPos.x - this._topScreenCorner.x, this._screenPos.y - this._topScreenCorner.y);
    this._hotspotCoords = this._getHotspotCoords();
    a.fillStyle = "rgb(255,0,0)";
    a.strokeStyle = "rgb(255,255,255)";
    for (var b = $jscomp.makeIterator(this._hotspotCoords), c = b.next(); !c.done; c = b.next()) c = c.value, a.beginPath(), a.arc(c.x, c.y,
        4, 0, 2 * Math.PI, !0), a.fill(), a.stroke()
};
wpd.CropTool.prototype.onMouseUp = function (a, b, c) {
    this._finalizeDrawing()
};
wpd.CropTool.prototype._finalizeDrawing = function () {
    clearTimeout(this._moveTimer);
    if (this._isDrawing || this._isResizing) this._isResizing = this._isDrawing = !1, this._hasCropBox = !0, this._drawCropBox()
};
wpd.CropTool.prototype._getHotspotCoords = function () {
    return [{x: this._topScreenCorner.x, y: this._topScreenCorner.y}, {
        x: this._screenPos.x,
        y: this._topScreenCorner.y
    }, {x: this._screenPos.x, y: this._screenPos.y}, {
        x: this._topScreenCorner.x,
        y: this._screenPos.y
    }, {x: (this._topScreenCorner.x + this._screenPos.x) / 2, y: this._topScreenCorner.y}, {
        x: this._screenPos.x,
        y: (this._topScreenCorner.y + this._screenPos.y) / 2
    }, {x: (this._topScreenCorner.x + this._screenPos.x) / 2, y: this._screenPos.y}, {
        x: this._topScreenCorner.x, y: (this._topScreenCorner.y +
            this._screenPos.y) / 2
    }, {x: (this._topScreenCorner.x + this._screenPos.x) / 2, y: (this._topScreenCorner.y + this._screenPos.y) / 2}]
};
wpd.CropTool.prototype._getHotspot = function (a) {
    for (var b = "nw ne se sw n e s w c".split(" "), c = this._hotspotCoords, d = 0; d < c.length; d++) {
        var e = c[d];
        if (64 > (e.x - a.x) * (e.x - a.x) + (e.y - a.y) * (e.y - a.y)) return b[d]
    }
    return null
};
wpd.CropTool.prototype.onMouseOut = function () {
    this._finalizeDrawing()
};
wpd.CropTool.prototype.onDocumentMouseUp = function () {
    this._finalizeDrawing()
};
wpd.CropTool.prototype.onKeyDown = function (a) {
    var b = wpd.keyCodes.isEsc(a.keyCode), c = wpd.keyCodes.isEnter(a.keyCode);
    if (b || c) this._isDrawing = !1, wpd.graphicsWidget.resetHover();
    b && (this._hasCropBox = !1);
    c && this._hasCropBox && (b = new wpd.CropImageAction(this._topImageCorner.x, this._topImageCorner.y, this._imagePos.x, this._imagePos.y), wpd.appData.getUndoManager().insertAction(b), b.execute());
    a.preventDefault()
};
wpd.CropTool.prototype.onRedraw = function () {
    this._hasCropBox && (this._topScreenCorner = wpd.graphicsWidget.screenPx(this._topImageCorner.x, this._topImageCorner.y), this._screenPos = wpd.graphicsWidget.screenPx(this._imagePos.x, this._imagePos.y), this._drawCropBox())
};
wpd = wpd || {};
wpd.imageOps = function () {
    function a(c, d, e) {
        var f, g, h;
        for (f = 0; f < e; f++) for (g = 0; g < d / 2; g++) {
            var k = 4 * (f * d + g);
            var l = 4 * ((f + 1) * d - (g + 1));
            for (h = 0; 4 > h; h++) {
                var p = c.data[k + h];
                c.data[k + h] = c.data[l + h];
                c.data[l + h] = p
            }
        }
        return {imageData: c, width: d, height: e}
    }

    function b(c, d, e) {
        var f, g, h;
        for (f = 0; f < e / 2; f++) for (g = 0; g < d; g++) {
            var k = 4 * (f * d + g);
            var l = 4 * ((e - (f + 2)) * d + g);
            for (h = 0; 4 > h; h++) {
                var p = c.data[k + h];
                c.data[k + h] = c.data[l + h];
                c.data[l + h] = p
            }
        }
        return {imageData: c, width: d, height: e}
    }

    return {
        hflip: function () {
            wpd.graphicsWidget.runImageOp(a)
        },
        vflip: function () {
            wpd.graphicsWidget.runImageOp(b)
        }
    }
}();
wpd = wpd || {};
wpd.keyCodes = {
    isUp: function (a) {
        return 38 === a
    }, isDown: function (a) {
        return 40 === a
    }, isLeft: function (a) {
        return 37 === a
    }, isRight: function (a) {
        return 39 === a
    }, isTab: function (a) {
        return 9 === a
    }, isDel: function (a) {
        return 46 === a
    }, isBackspace: function (a) {
        return 8 === a
    }, isAlphabet: function (a, b) {
        return 90 < a || 65 > a ? !1 : String.fromCharCode(a).toLowerCase() === b
    }, isEnter: function (a) {
        return 13 === a
    }, isEsc: function (a) {
        return 27 === a
    }
};
wpd = wpd || {};
wpd.ManualSelectionTool = function () {
    return function (a, b) {
        this.onAttach = function () {
            document.getElementById("manual-select-button").classList.add("pressed-button");
            wpd.graphicsWidget.setRepainter(new wpd.DataPointsRepainter(a, b))
        };
        this.onMouseClick = function (c, d, e) {
            if (a.dataPointsHaveLabels) {
                d = b.getMetadataKeys();
                null == d ? b.setMetadataKeys(["label"]) : "label" !== d[0] && b.setMetadataKeys(["label"].concat($jscomp.arrayFromIterable(d)));
                d = a.dataPointsLabelPrefix + b.getCount();
                var f = {};
                b.addPixel(e.x, e.y, (f.label =
                    d, f));
                wpd.graphicsHelper.drawPoint(e, b.colorRGB.toRGBString(), d)
            } else b.addPixel(e.x, e.y), wpd.graphicsHelper.drawPoint(e, b.colorRGB.toRGBString());
            wpd.graphicsWidget.updateZoomOnEvent(c);
            wpd.dataPointCounter.setCount(b.getCount());
            a.dataPointsHaveLabels && c.shiftKey && wpd.dataPointLabelEditor.show(b, b.getCount() - 1, this)
        };
        this.onRemove = function () {
            document.getElementById("manual-select-button").classList.remove("pressed-button")
        };
        this.onKeyDown = function (c) {
            var d = b.getCount() - 1, e = b.getPixel(d), f = .5 / wpd.graphicsWidget.getZoomRatio();
            if (wpd.keyCodes.isUp(c.keyCode)) e.y -= f; else if (wpd.keyCodes.isDown(c.keyCode)) e.y += f; else if (wpd.keyCodes.isLeft(c.keyCode)) e.x -= f; else if (wpd.keyCodes.isRight(c.keyCode)) e.x += f; else {
                wpd.acquireData.isToolSwitchKey(c.keyCode) && wpd.acquireData.switchToolOnKeyPress(String.fromCharCode(c.keyCode).toLowerCase());
                return
            }
            b.setPixelAt(d, e.x, e.y);
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.graphicsWidget.updateZoomToImagePosn(e.x, e.y);
            c.preventDefault()
        }
    }
}();
wpd.DeleteDataPointTool = function () {
    return function (a, b) {
        wpd.graphicsWidget.getAllContexts();
        this.onAttach = function () {
            document.getElementById("delete-point-button").classList.add("pressed-button");
            wpd.graphicsWidget.setRepainter(new wpd.DataPointsRepainter(a, b))
        };
        this.onMouseClick = function (c, d, e) {
            b.removeNearestPixel(e.x, e.y);
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.graphicsWidget.updateZoomOnEvent(c);
            wpd.dataPointCounter.setCount(b.getCount())
        };
        this.onKeyDown = function (c) {
            wpd.acquireData.isToolSwitchKey(c.keyCode) &&
            wpd.acquireData.switchToolOnKeyPress(String.fromCharCode(c.keyCode).toLowerCase())
        };
        this.onRemove = function () {
            document.getElementById("delete-point-button").classList.remove("pressed-button")
        }
    }
}();
wpd.MultipltDatasetRepainter = function (a, b) {
    this.painterName = "multipleDatasetsRepainter";
    this._datasetList = b;
    this._axesList = a;
    this._datasetRepainters = [];
    b = $jscomp.makeIterator(b.entries());
    for (var c = b.next(); !c.done; c = b.next()) {
        var d = $jscomp.makeIterator(c.value);
        c = d.next().value;
        d = d.next().value;
        this._datasetRepainters.push(new wpd.DataPointsRepainter(a[c], d))
    }
};
wpd.MultipltDatasetRepainter.prototype.drawPoints = function () {
    for (var a = $jscomp.makeIterator(this._datasetRepainters), b = a.next(); !b.done; b = a.next()) b.value.drawPoints()
};
wpd.MultipltDatasetRepainter.prototype.onAttach = function () {
    wpd.graphicsWidget.resetData();
    this.drawPoints()
};
wpd.MultipltDatasetRepainter.prototype.onRedraw = function () {
    this.drawPoints()
};
wpd.MultipltDatasetRepainter.prototype.onForcedRedraw = function () {
    wpd.graphicsWidget.resetData();
    this.drawPoints()
};
wpd.DataPointsRepainter = function (a, b) {
    this._axes = a;
    this._dataset = b;
    this.painterName = "dataPointsRepainter"
};
wpd.DataPointsRepainter.prototype.drawPoints = function () {
    var a = this._dataset.getMetadataKeys(), b = !1;
    if (null != this._axes) for (this._axes.dataPointsHaveLabels && null != a && "label" === a[0] && (b = !0), a = 0; a < this._dataset.getCount(); a++) {
        var c = this._dataset.getPixel(a),
            d = 0 <= this._dataset.getSelectedPixels().indexOf(a) ? "rgb(0,200,0)" : this._dataset.colorRGB.toRGBString();
        if (b) {
            var e = c.metadata.label;
            null == e && (e = this._axes.dataPointsLabelPrefix + a);
            wpd.graphicsHelper.drawPoint(c, d, e)
        } else wpd.graphicsHelper.drawPoint(c,
            d)
    }
};
wpd.DataPointsRepainter.prototype.onAttach = function () {
    wpd.graphicsWidget.resetData();
    this.drawPoints()
};
wpd.DataPointsRepainter.prototype.onRedraw = function () {
    this.drawPoints()
};
wpd.DataPointsRepainter.prototype.onForcedRedraw = function () {
    wpd.graphicsWidget.resetData();
    this.drawPoints()
};
wpd.AdjustDataPointTool = function () {
    return function (a, b) {
        var c = document.getElementById("manual-adjust-button"),
            d = document.getElementById("value-overrides-controls"),
            e = document.getElementById("override-data-values"), f = !1, g = !1, h = null, k = null, l = null, p = null,
            m = null;
        this.onAttach = function () {
            c.classList.add("pressed-button");
            e.classList.remove("pressed-button");
            wpd.graphicsWidget.setRepainter(new wpd.DataPointsRepainter(a, b));
            wpd.toolbar.show("adjustDataPointsToolbar")
        };
        this.onRemove = function () {
            b.unselectAll();
            wpd.graphicsWidget.forceHandlerRepaint();
            c.classList.remove("pressed-button");
            wpd.toolbar.clear();
            d.hidden = !0
        };
        this.onMouseDown = function (n, q, r) {
            f = !0;
            k = q;
            p = r;
            b.unselectAll()
        };
        this.onMouseUp = function (n, q) {
            !0 === g ? (wpd.graphicsWidget.resetHover(), b.selectPixelsInRectangle(p, m), this._onSelect(n, b.getSelectedPixels()), clearTimeout(h), setTimeout(function () {
                f = g = !1;
                l = k = null;
                wpd.graphicsWidget.resetHover()
            })) : (f = !1, l = k = null, wpd.graphicsWidget.resetHover())
        };
        this.onMouseMove = function (n, q, r) {
            !0 === f && (g = !0, l =
                q, m = r, clearTimeout(h), h = setTimeout(function () {
                this._drawSelectionBox()
            }.bind(this), 1))
        };
        this._drawSelectionBox = function () {
            wpd.graphicsWidget.resetHover();
            var n = wpd.graphicsWidget.getAllContexts().hoverCtx;
            null != k && null != l && (n.strokeStyle = "rgb(0,0,0)", n.strokeRect(k.x, k.y, l.x - k.x, l.y - k.y))
        };
        this._onSelect = function (n, q) {
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.graphicsWidget.updateZoomOnEvent(n);
            this.toggleOverrideSection(q)
        };
        this.onMouseClick = function (n, q, r) {
            !1 === g && (b.unselectAll(), q = b.selectNearestPixel(r.x,
                r.y), this._onSelect(n, [q]))
        };
        this.onKeyDown = function (n) {
            if (wpd.acquireData.isToolSwitchKey(n.keyCode)) wpd.acquireData.switchToolOnKeyPress(String.fromCharCode(n.keyCode).toLowerCase()); else {
                var q = b.getSelectedPixels();
                1 > q.length || (wpd.keyCodes.isAlphabet(n.keyCode, "r") ? wpd.dataPointValueOverrideEditor.show(b, a, q, this) : (q.forEach(function (r) {
                    var t = !0 === n.shiftKey ? 5 / wpd.graphicsWidget.getZoomRatio() : .5 / wpd.graphicsWidget.getZoomRatio(),
                        x = b.getPixel(r), u = x.x;
                    x = x.y;
                    if (wpd.keyCodes.isUp(n.keyCode)) x -=
                        t; else if (wpd.keyCodes.isDown(n.keyCode)) x += t; else if (wpd.keyCodes.isLeft(n.keyCode)) u -= t; else if (wpd.keyCodes.isRight(n.keyCode)) u += t; else if (1 === q.length) if (wpd.keyCodes.isAlphabet(n.keyCode, "q")) b.selectPreviousPixel(), r = b.getSelectedPixels()[0], x = b.getPixel(r), u = x.x, x = x.y; else if (wpd.keyCodes.isAlphabet(n.keyCode, "w")) b.selectNextPixel(), r = b.getSelectedPixels()[0], x = b.getPixel(r), u = x.x, x = x.y; else if (wpd.keyCodes.isAlphabet(n.keyCode, "e")) {
                        if (a.dataPointsHaveLabels) {
                            r = b.getSelectedPixels()[0];
                            n.preventDefault();
                            n.stopPropagation();
                            wpd.dataPointLabelEditor.show(b, r, this);
                            return
                        }
                    } else {
                        if (wpd.keyCodes.isDel(n.keyCode) || wpd.keyCodes.isBackspace(n.keyCode)) b.removePixelAtIndex(r), b.unselectAll(), 0 <= b.findNearestPixel(u, x) && (b.selectNearestPixel(u, x), r = b.getSelectedPixels()[0], x = b.getPixel(r), u = x.x, x = x.y), wpd.graphicsWidget.resetData(), wpd.graphicsWidget.forceHandlerRepaint(), wpd.graphicsWidget.updateZoomToImagePosn(u, x), wpd.dataPointCounter.setCount(b.getCount()), n.preventDefault(), n.stopPropagation();
                        return
                    } else return;
                    b.setPixelAt(r, u, x);
                    wpd.graphicsWidget.updateZoomToImagePosn(u, x)
                }.bind(this)), wpd.graphicsWidget.forceHandlerRepaint(), n.preventDefault(), n.stopPropagation()))
            }
        };
        this.toggleOverrideSection = function (n) {
            var q = document.getElementById("overridden-data-indicator");
            q.hidden = !0;
            1 === n.length && 0 <= n[0] || 1 < n.length ? (d.hidden = !1, e.onclick = wpd.dataPointValueOverrideEditor.show.bind(null, b, a, n, this), b.getSelectedPixels().some(function (r) {
                r = b.getPixel(r);
                if (r.metadata) {
                    var t = 1;
                    r.metadata.hasOwnProperty("label") &&
                    (t += 1);
                    if (Object.keys(r.metadata).length >= t) return q.hidden = !1, !0
                }
                return !1
            })) : (d.hidden = !0, e.onclick = null)
        };
        this.displayMask = function () {
            c.classList.add("pressed-button");
            wpd.toolbar.show("adjustDataPointsToolbar");
            d.hidden = !1;
            e.classList.add("pressed-button")
        }
    }
}();
wpd.EditLabelsTool = function (a, b) {
    this.onAttach = function () {
        document.getElementById("edit-data-labels").classList.add("pressed-button");
        wpd.graphicsWidget.setRepainter(new wpd.DataPointsRepainter(a, b))
    };
    this.onRemove = function () {
        document.getElementById("edit-data-labels").classList.remove("pressed-button");
        b.unselectAll()
    };
    this.onMouseClick = function (c, d, e) {
        b.unselectAll();
        d = b.selectNearestPixel(e.x, e.y);
        0 <= d && (wpd.graphicsWidget.forceHandlerRepaint(), wpd.graphicsWidget.updateZoomOnEvent(c), wpd.dataPointLabelEditor.show(b,
            d, this))
    };
    this.onKeyDown = function (c) {
        wpd.acquireData.isToolSwitchKey(c.keyCode) && wpd.acquireData.switchToolOnKeyPress(String.fromCharCode(c.keyCode).toLowerCase())
    }
};
wpd.dataPointCounter = {
    setCount: function (a) {
        for (var b = document.getElementsByClassName("data-point-counter"), c = 0; c < b.length; c++) b[c].innerHTML = a
    }
};
wpd = wpd || {};
wpd.BoxMaskTool = function () {
    return function () {
        var a = !1, b, c, d = wpd.graphicsWidget.getAllContexts(), e, f, g = function () {
            wpd.graphicsWidget.resetHover();
            d.hoverCtx.strokeStyle = "rgb(0,0,0)";
            d.hoverCtx.strokeRect(c.x, c.y, f.x - c.x, f.y - c.y)
        }, h = function (p, m, n) {
            !1 !== a && (clearTimeout(e), a = !1, wpd.graphicsWidget.resetHover(), d.dataCtx.fillStyle = "rgba(255,255,0,1)", d.dataCtx.fillRect(c.x, c.y, m.x - c.x, m.y - c.y), d.oriDataCtx.fillStyle = "rgba(255,255,0,1)", d.oriDataCtx.fillRect(b.x, b.y, n.x - b.x, n.y - b.y))
        }, k = null, l = null;
        this.onAttach =
            function () {
                wpd.graphicsWidget.setRepainter(new wpd.MaskPainter);
                document.getElementById("box-mask").classList.add("pressed-button");
                document.getElementById("view-mask").classList.add("pressed-button")
            };
        this.onMouseDown = function (p, m, n) {
            !0 !== a && (a = !0, b = n, c = m)
        };
        this.onMouseMove = function (p, m, n) {
            !1 !== a && (f = m, clearTimeout(e), e = setTimeout(g, 2))
        };
        this.onMouseOut = function (p, m, n) {
            !0 === a && (clearTimeout(e), k = m, l = n)
        };
        this.onDocumentMouseUp = function (p, m, n) {
            null != k && null != l ? h(p, k, l) : h(p, m, n);
            l = k = null
        };
        this.onMouseUp =
            function (p, m, n) {
                h(p, m, n)
            };
        this.onRemove = function () {
            document.getElementById("box-mask").classList.remove("pressed-button");
            document.getElementById("view-mask").classList.remove("pressed-button");
            wpd.dataMask.grabMask()
        }
    }
}();
wpd.PenMaskTool = function () {
    return function () {
        var a = wpd.graphicsWidget.getAllContexts(), b = !1, c, d, e, f = function () {
            a.dataCtx.strokeStyle = "rgba(255,255,0,1)";
            a.dataCtx.lineTo(d.x, d.y);
            a.dataCtx.stroke();
            a.oriDataCtx.strokeStyle = "rgba(255,255,0,1)";
            a.oriDataCtx.lineTo(e.x, e.y);
            a.oriDataCtx.stroke()
        };
        this.onAttach = function () {
            wpd.graphicsWidget.setRepainter(new wpd.MaskPainter);
            document.getElementById("pen-mask").classList.add("pressed-button");
            document.getElementById("view-mask").classList.add("pressed-button");
            document.getElementById("mask-paint-container").style.display = "block"
        };
        this.onMouseDown = function (g, h, k) {
            !0 !== b && (g = parseInt(document.getElementById("paintThickness").value, 10), b = !0, a.dataCtx.strokeStyle = "rgba(255,255,0,1)", a.dataCtx.lineWidth = g * wpd.graphicsWidget.getZoomRatio(), a.dataCtx.beginPath(), a.dataCtx.moveTo(h.x, h.y), a.oriDataCtx.strokeStyle = "rgba(255,255,0,1)", a.oriDataCtx.lineWidth = g, a.oriDataCtx.beginPath(), a.oriDataCtx.moveTo(k.x, k.y))
        };
        this.onMouseMove = function (g, h, k) {
            !1 !== b && (d = h, e =
                k, clearTimeout(c), c = setTimeout(f, 2))
        };
        this.onMouseUp = function (g, h, k) {
            clearTimeout(c);
            a.dataCtx.closePath();
            a.dataCtx.lineWidth = 1;
            a.oriDataCtx.closePath();
            a.oriDataCtx.lineWidth = 1;
            b = !1
        };
        this.onMouseOut = function (g, h, k) {
            this.onMouseUp(g, h, k)
        };
        this.onRemove = function () {
            document.getElementById("pen-mask").classList.remove("pressed-button");
            document.getElementById("view-mask").classList.remove("pressed-button");
            document.getElementById("mask-paint-container").style.display = "none";
            wpd.dataMask.grabMask();
            wpd.toolbar.clear()
        }
    }
}();
wpd.EraseMaskTool = function () {
    return function () {
        var a = wpd.graphicsWidget.getAllContexts(), b = !1, c, d, e, f = function () {
            a.dataCtx.globalCompositeOperation = "destination-out";
            a.oriDataCtx.globalCompositeOperation = "destination-out";
            a.dataCtx.strokeStyle = "rgba(255,255,0,1)";
            a.dataCtx.lineTo(d.x, d.y);
            a.dataCtx.stroke();
            a.oriDataCtx.strokeStyle = "rgba(255,255,0,1)";
            a.oriDataCtx.lineTo(e.x, e.y);
            a.oriDataCtx.stroke()
        };
        this.onAttach = function () {
            wpd.graphicsWidget.setRepainter(new wpd.MaskPainter);
            document.getElementById("erase-mask").classList.add("pressed-button");
            document.getElementById("view-mask").classList.add("pressed-button");
            document.getElementById("mask-erase-container").style.display = "block"
        };
        this.onMouseDown = function (g, h, k) {
            !0 !== b && (g = parseInt(document.getElementById("eraseThickness").value, 10), b = !0, a.dataCtx.globalCompositeOperation = "destination-out", a.oriDataCtx.globalCompositeOperation = "destination-out", a.dataCtx.strokeStyle = "rgba(0,0,0,1)", a.dataCtx.lineWidth = g * wpd.graphicsWidget.getZoomRatio(), a.dataCtx.beginPath(), a.dataCtx.moveTo(h.x, h.y),
                a.oriDataCtx.strokeStyle = "rgba(0,0,0,1)", a.oriDataCtx.lineWidth = g, a.oriDataCtx.beginPath(), a.oriDataCtx.moveTo(k.x, k.y))
        };
        this.onMouseMove = function (g, h, k) {
            !1 !== b && (d = h, e = k, clearTimeout(c), c = setTimeout(f, 2))
        };
        this.onMouseOut = function (g, h, k) {
            this.onMouseUp(g, h, k)
        };
        this.onMouseUp = function (g, h, k) {
            clearTimeout(c);
            a.dataCtx.closePath();
            a.dataCtx.lineWidth = 1;
            a.oriDataCtx.closePath();
            a.oriDataCtx.lineWidth = 1;
            a.dataCtx.globalCompositeOperation = "source-over";
            a.oriDataCtx.globalCompositeOperation = "source-over";
            b = !1
        };
        this.onRemove = function () {
            document.getElementById("erase-mask").classList.remove("pressed-button");
            document.getElementById("view-mask").classList.remove("pressed-button");
            document.getElementById("mask-erase-container").style.display = "none";
            wpd.dataMask.grabMask();
            wpd.toolbar.clear()
        }
    }
}();
wpd.ViewMaskTool = function () {
    return function () {
        this.onAttach = function () {
            wpd.graphicsWidget.setRepainter(new wpd.MaskPainter);
            document.getElementById("view-mask").classList.add("pressed-button")
        };
        this.onRemove = function () {
            document.getElementById("view-mask").classList.remove("pressed-button");
            wpd.dataMask.grabMask()
        }
    }
}();
wpd.MaskPainter = function () {
    return function () {
        var a = wpd.graphicsWidget.getAllContexts(), b = wpd.tree.getActiveDataset(),
            c = wpd.appData.getPlotData().getAutoDetectionDataForDataset(b), d = function () {
                if (null != c.mask && 0 !== c.mask.size) {
                    var e = wpd.graphicsWidget.getImageSize();
                    e = a.oriDataCtx.getImageData(0, 0, e.width, e.height);
                    for (var f = $jscomp.makeIterator(c.mask), g = f.next(); !g.done; g = f.next()) g = g.value, e.data[4 * g] = 255, e.data[4 * g + 1] = 255, e.data[4 * g + 2] = 0, e.data[4 * g + 3] = 255;
                    a.oriDataCtx.putImageData(e, 0, 0);
                    wpd.graphicsWidget.copyImageDataLayerToScreen()
                }
            };
        this.painterName = "dataMaskPainter";
        this.onRedraw = function () {
            wpd.dataMask.grabMask();
            d()
        };
        this.onAttach = function () {
            wpd.graphicsWidget.resetData();
            d()
        }
    }
}();
wpd = wpd || {};
wpd.AddMeasurementTool = function () {
    return function (a) {
        var b = wpd.graphicsWidget.getAllContexts(), c = 0, d = !0, e = [];
        this.onAttach = function () {
            document.getElementById(a.addButtonId).classList.add("pressed-button");
            0 > a.connectivity && (document.getElementById("add-polygon-info").style.display = "block")
        };
        this.onRemove = function () {
            document.getElementById(a.addButtonId).classList.remove("pressed-button");
            0 > a.connectivity && (document.getElementById("add-polygon-info").style.display = "none")
        };
        this.onKeyDown = function (f) {
            wpd.keyCodes.isAlphabet(f.keyCode,
                "a") ? (wpd.graphicsWidget.resetHover(), wpd.graphicsWidget.setTool(new wpd.AddMeasurementTool(a))) : wpd.keyCodes.isAlphabet(f.keyCode, "d") ? (wpd.graphicsWidget.resetHover(), wpd.graphicsWidget.setTool(new wpd.DeleteMeasurementTool(a))) : (wpd.keyCodes.isEnter(f.keyCode) || wpd.keyCodes.isEsc(f.keyCode)) && !0 === d && 0 > a.connectivity && (d = !1, a.getData().addConnection(e), wpd.graphicsWidget.resetHover(), wpd.graphicsWidget.forceHandlerRepaint(), wpd.graphicsWidget.setTool(new wpd.AdjustMeasurementTool(a)))
        };
        this.onMouseClick =
            function (f, g, h) {
                if (d) {
                    wpd.graphicsWidget.resetHover();
                    e[2 * c] = h.x;
                    e[2 * c + 1] = h.y;
                    c += 1;
                    if (c === a.connectivity) {
                        d = !1;
                        a.getData().addConnection(e);
                        wpd.graphicsWidget.resetHover();
                        wpd.graphicsWidget.forceHandlerRepaint();
                        wpd.graphicsWidget.setTool(new wpd.AdjustMeasurementTool(a));
                        return
                    }
                    if (1 < c) {
                        var k = wpd.graphicsWidget.screenPx(e[2 * (c - 2)], e[2 * (c - 2) + 1]);
                        b.dataCtx.beginPath();
                        b.dataCtx.strokeStyle = "rgb(0,0,10)";
                        b.dataCtx.moveTo(k.x, k.y);
                        b.dataCtx.lineTo(g.x, g.y);
                        b.dataCtx.stroke();
                        b.oriDataCtx.beginPath();
                        b.oriDataCtx.strokeStyle = "rgb(0,0,10)";
                        b.oriDataCtx.moveTo(e[2 * (c - 2)], e[2 * (c - 2) + 1]);
                        b.oriDataCtx.lineTo(h.x, h.y);
                        b.oriDataCtx.stroke()
                    }
                    b.dataCtx.beginPath();
                    b.dataCtx.fillStyle = "rgb(200, 0, 0)";
                    b.dataCtx.arc(g.x, g.y, 3, 0, 2 * Math.PI, !0);
                    b.dataCtx.fill();
                    b.oriDataCtx.beginPath();
                    b.oriDataCtx.fillStyle = "rgb(200,0,0)";
                    b.oriDataCtx.arc(h.x, h.y, 3, 0, 2 * Math.PI, !0);
                    b.oriDataCtx.fill()
                }
                wpd.graphicsWidget.updateZoomOnEvent(f)
            };
        this.onMouseMove = function (f, g, h) {
            d && 1 <= c && (wpd.graphicsWidget.resetHover(), f = wpd.graphicsWidget.screenPx(e[2 *
            (c - 1)], e[2 * (c - 1) + 1]), b.hoverCtx.beginPath(), b.hoverCtx.strokeStyle = "rgb(0,0,0)", b.hoverCtx.moveTo(f.x, f.y), b.hoverCtx.lineTo(g.x, g.y), b.hoverCtx.stroke())
        }
    }
}();
wpd.DeleteMeasurementTool = function () {
    return function (a) {
        wpd.graphicsWidget.getAllContexts();
        this.onAttach = function () {
            document.getElementById(a.deleteButtonId).classList.add("pressed-button")
        };
        this.onRemove = function () {
            document.getElementById(a.deleteButtonId).classList.remove("pressed-button")
        };
        this.onKeyDown = function (b) {
            wpd.keyCodes.isAlphabet(b.keyCode, "a") ? wpd.graphicsWidget.setTool(new wpd.AddMeasurementTool(a)) : wpd.keyCodes.isAlphabet(b.keyCode, "d") && wpd.graphicsWidget.setTool(new wpd.DeleteMeasurementTool(a))
        };
        this.onMouseClick = function (b, c, d) {
            a.getData().deleteNearestConnection(d.x, d.y);
            wpd.graphicsWidget.setTool(new wpd.AdjustMeasurementTool(a));
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.graphicsWidget.updateZoomOnEvent(b)
        }
    }
}();
wpd.AdjustMeasurementTool = function () {
    return function (a) {
        this.onAttach = function () {
        };
        this.onMouseClick = function (b, c, d) {
            a.getData().selectNearestPoint(d.x, d.y);
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.graphicsWidget.updateZoomOnEvent(b)
        };
        this.onKeyDown = function (b) {
            if (wpd.keyCodes.isAlphabet(b.keyCode, "a")) wpd.graphicsWidget.setTool(new wpd.AddMeasurementTool(a)); else if (wpd.keyCodes.isAlphabet(b.keyCode, "d")) wpd.graphicsWidget.setTool(new wpd.DeleteMeasurementTool(a)); else {
                var c = a.getData(), d = c.getSelectedConnectionAndPoint();
                if (0 <= d.connectionIndex && 0 <= d.pointIndex) {
                    var e = !0 === b.shiftKey ? 5 / wpd.graphicsWidget.getZoomRatio() : .5 / wpd.graphicsWidget.getZoomRatio(),
                        f = c.getPointAt(d.connectionIndex, d.pointIndex);
                    if (wpd.keyCodes.isUp(b.keyCode)) f.y -= e; else if (wpd.keyCodes.isDown(b.keyCode)) f.y += e; else if (wpd.keyCodes.isLeft(b.keyCode)) f.x -= e; else if (wpd.keyCodes.isRight(b.keyCode)) f.x += e; else return;
                    c.setPointAt(d.connectionIndex, d.pointIndex, f.x, f.y);
                    wpd.graphicsWidget.forceHandlerRepaint();
                    wpd.graphicsWidget.updateZoomToImagePosn(f.x,
                        f.y);
                    b.preventDefault();
                    b.stopPropagation()
                }
            }
        }
    }
}();
wpd.MeasurementRepainter = function () {
    return function (a) {
        var b = wpd.graphicsWidget.getAllContexts(), c = function (f, g, h, k, l, p, m, n) {
            b.dataCtx.beginPath();
            b.dataCtx.strokeStyle = "rgb(0,0,10)";
            b.dataCtx.moveTo(f, g);
            b.dataCtx.lineTo(h, k);
            b.dataCtx.stroke();
            b.oriDataCtx.beginPath();
            b.oriDataCtx.strokeStyle = "rgb(0,0,10)";
            b.oriDataCtx.moveTo(l, p);
            b.oriDataCtx.lineTo(m, n);
            b.oriDataCtx.stroke()
        }, d = function (f, g, h, k, l) {
            b.dataCtx.beginPath();
            b.dataCtx.fillStyle = l ? "rgb(0, 200, 0)" : "rgb(200, 0, 0)";
            b.dataCtx.arc(f, g,
                3, 0, 2 * Math.PI, !0);
            b.dataCtx.fill();
            b.oriDataCtx.beginPath();
            b.oriDataCtx.fillStyle = l ? "rgb(0,200,0)" : "rgb(200,0,0)";
            b.oriDataCtx.arc(h, k, 3, 0, 2 * Math.PI, !0);
            b.oriDataCtx.fill()
        }, e = function (f, g, h, k, l) {
            f = parseInt(f, 10);
            g = parseInt(g, 10);
            h = parseInt(h, 10);
            k = parseInt(k, 10);
            b.dataCtx.font = "14px sans-serif";
            var p = b.dataCtx.measureText(l).width;
            b.dataCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
            b.dataCtx.fillRect(f - 5, g - 15, p + 10, 25);
            b.dataCtx.fillStyle = "rgb(200, 0, 0)";
            b.dataCtx.fillText(l, f, g);
            b.oriDataCtx.font = "14px sans-serif";
            p = b.oriDataCtx.measureText(l).width;
            b.oriDataCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
            b.oriDataCtx.fillRect(h - 5, k - 15, p + 10, 25);
            b.oriDataCtx.fillStyle = "rgb(200, 0, 0)";
            b.oriDataCtx.fillText(l, h, k)
        };
        this.painterName = "measurementRepainter-" + a.name;
        this.onAttach = function () {
        };
        this.onRedraw = function () {
            if (a.name === wpd.measurementModes.distance.name) {
                var f = a.getData(), g = f.connectionCount(), h, k = a.getAxes();
                for (h = 0; h < g; h++) {
                    var l = f.getConnectionAt(h);
                    var p = l[0];
                    var m = l[1];
                    var n = l[2];
                    l = l[3];
                    var q = f.isPointSelected(h,
                        0);
                    var r = f.isPointSelected(h, 1);
                    var t = !0 === wpd.appData.isAligned() && k instanceof wpd.MapAxes ? "Dist" + h.toString() + ": " + k.pixelToDataDistance(f.getDistance(h)).toFixed(2) + " " + k.getUnits() : "Dist" + h.toString() + ": " + f.getDistance(h).toFixed(2) + " px";
                    var x = wpd.graphicsWidget.screenPx(p, m);
                    var u = wpd.graphicsWidget.screenPx(n, l);
                    c(x.x, x.y, u.x, u.y, p, m, n, l);
                    d(x.x, x.y, p, m, q);
                    d(u.x, u.y, n, l, r);
                    e(.5 * (x.x + u.x), .5 * (x.y + u.y), .5 * (p + n), .5 * (m + l), t)
                }
            } else if (a.name === wpd.measurementModes.angle.name) for (f = a.getData(),
                                                                            g = f.connectionCount(), h = 0; h < g; h++) {
                n = f.getConnectionAt(h);
                u = n[0];
                t = n[1];
                p = n[2];
                m = n[3];
                q = n[4];
                r = n[5];
                var y = f.isPointSelected(h, 0);
                var v = f.isPointSelected(h, 1);
                var z = f.isPointSelected(h, 2);
                k = "Theta" + h.toString() + ": " + f.getAngle(h).toFixed(2) + "\u00b0";
                x = Math.atan2(t - m, u - p);
                l = Math.atan2(r - m, q - p);
                var A = wpd.graphicsWidget.screenPx(u, t);
                n = wpd.graphicsWidget.screenPx(p, m);
                var E = wpd.graphicsWidget.screenPx(q, r);
                c(A.x, A.y, n.x, n.y, u, t, p, m);
                c(n.x, n.y, E.x, E.y, p, m, q, r);
                d(A.x, A.y, u, t, y);
                d(n.x, n.y, p, m, v);
                d(E.x, E.y,
                    q, r, z);
                u = n.x;
                t = n.y;
                q = p;
                r = m;
                b.dataCtx.beginPath();
                b.dataCtx.strokeStyle = "rgb(0,0,10)";
                b.dataCtx.arc(u, t, 15, x, l, !0);
                b.dataCtx.stroke();
                b.oriDataCtx.beginPath();
                b.oriDataCtx.strokeStyle = "rgb(0,0,10)";
                b.oriDataCtx.arc(q, r, 15, x, l, !0);
                b.oriDataCtx.stroke();
                e(n.x + 10, n.y + 15, p + 10, m + 15, k)
            } else if (a.name === wpd.measurementModes.area.name) for (f = a.getData(), g = f.connectionCount(), h = a.getAxes(), p = 0; p < g; p++) {
                k = f.getConnectionAt(p);
                r = q = n = m = 0;
                A = {x: 0, y: 0};
                for (l = 0; l < k.length; l += 2) x = k[l], u = k[l + 1], t = wpd.graphicsWidget.screenPx(x,
                    u), 2 <= l && c(A.x, A.y, t.x, t.y, q, r, x, u), l == k.length - 2 && (q = k[0], r = k[1], A = wpd.graphicsWidget.screenPx(q, r), c(A.x, A.y, t.x, t.y, q, r, x, u)), q = x, r = u, A = t;
                for (l = 0; l < k.length; l += 2) x = k[l], u = k[l + 1], t = wpd.graphicsWidget.screenPx(x, u), q = f.isPointSelected(p, l / 2), d(t.x, t.y, x, u, q), m += x, n += u;
                m /= k.length / 2;
                n /= k.length / 2;
                k = wpd.graphicsWidget.screenPx(m, n);
                !0 === wpd.appData.isAligned() && h instanceof wpd.MapAxes ? (l = "Area" + p + ": " + h.pixelToDataArea(f.getArea(p)).toFixed(2) + " " + h.getUnits() + "^2", x = "Perimeter" + p + ": " + h.pixelToDataDistance(f.getPerimeter(p)).toFixed(2) +
                    " " + h.getUnits()) : (l = "Area" + p + ": " + f.getArea(p).toFixed(2) + " px^2", x = "Perimeter" + p + ": " + f.getPerimeter(p).toFixed(2) + " px");
                e(k.x, k.y, m, n, l + ", " + x)
            }
        };
        this.onForcedRedraw = function () {
            wpd.graphicsWidget.resetData();
            this.onRedraw()
        }
    }
}();
wpd = wpd || {};
wpd.args = function () {
    return {
        getValue: function (a) {
            var b, c = window.location.search.substring(1).split("&");
            for (b = 0; b < c.length; b++) {
                var d = c[b].split("=");
                if (d[0] === a) return unescape(d[1])
            }
            return null
        }
    }
}();
wpd = wpd || {};
wpd.dataExport = function () {
    return {
        show: function () {
        }, generateCSV: function () {
            wpd.popup.close("export-all-data-popup");
            var a = wpd.appData.getPlotData(), b = a.getDatasets();
            if (null == b || 0 === b.length) wpd.messagePopup.show(wpd.gettext("no-datasets-to-export-error"), wpd.gettext("no-datasets-to-export")); else {
                for (var c = 0, d = [], e = [], f = [], g = 0, h = 0; h < b.length; h++) {
                    var k = a.getAxesForDataset(b[h]);
                    if (null != k) {
                        k = k.getAxesLabels();
                        var l = k.length;
                        g += l;
                        var p = b[h].getCount();
                        p > c && (c = p);
                        d.push(b[h].name);
                        for (p = 0; p < l; p++) 0 !==
                        p && d.push(""), e.push(k[p])
                    }
                }
                for (h = 0; h < c; h++) {
                    k = [];
                    for (l = 0; l < g; l++) k.push("");
                    f.push(k)
                }
                for (h = g = 0; h < b.length; h++) if (k = a.getAxesForDataset(b[h]), null != k) {
                    l = k.getAxesLabels().length;
                    p = b[h].getCount();
                    for (var m = 0; m < p; m++) {
                        var n = b[h].getPixel(m), q = m;
                        var r = k;
                        var t = n;
                        n = r.pixelToData(t.x, t.y);
                        if (r instanceof wpd.XYAxes) for (q = 0; 1 >= q; q++) r.isDate(q) && (t = r.getInitialDateFormat(q), n[q] = wpd.dateConverter.formatDateNumber(n[q], t)); else r instanceof wpd.BarAxes && (n = ["", n[0]], n[0] = null == t.metadata ? "Bar" + q : t.metadata[0]);
                        r = n;
                        for (n = 0; n < l; n++) f[m][g + n] = r[n]
                    }
                    g += l
                }
                a = d.join(",") + "\n" + e.join(",") + "\n";
                for (b = 0; b < c; b++) a += f[b].join(",") + "\n";
                wpd.download.csv(a, "wpd_datasets.csv")
            }
        }, exportToPlotly: function () {
            wpd.popup.close("export-all-data-popup");
            var a = wpd.appData.getPlotData().getDatasets(), b, c, d, e = wpd.plotDataProvider, f = {data: []};
            if (null == a || 0 === a.length) wpd.messagePopup.show(wpd.gettext("no-datasets-to-export-error"), wpd.gettext("no-datasets-to-export")); else {
                for (b = 0; b < a.length; b++) {
                    e.setDataSource(a[b]);
                    var g = e.getData();
                    f.data[b] = {};
                    for (c = 0; 2 > c; c++) {
                        var h = 0 === c ? "x" : "y";
                        f.data[b][h] = [];
                        for (d = 0; d < g.rawData.length; d++) f.data[b][h][d] = null != g.fieldDateFormat[c] ? wpd.dateConverter.formatDateNumber(g.rawData[d][c], "yyyy-mm-dd hh:ii:ss") : g.rawData[d][c]
                    }
                }
                wpd.plotly.send(f)
            }
        }
    }
}();
wpd = wpd || {};
wpd.download = function () {
    function a(b, c) {
        var d = document.createElement("a");
        d.href = URL.createObjectURL(new Blob([b]), {type: "text/plain"});
        d.download = c.replace(/[^a-zA-Z\d+\.\-_\s]/g, "_");
        d.style.display = "none";
        document.body.appendChild(d);
        d.click();
        document.body.removeChild(d)
    }

    return {
        json: function (b, c) {
            null == c && (c = "wpd_plot_data.json");
            a(b, c)
        }, csv: function (b, c) {
            null == c && (c = "data.csv");
            a(b, c)
        }
    }
}();
wpd = wpd || {};
wpd.log = function () {
    wpd.browserInfo.isElectronBrowser() || fetch("log").then(function (a) {
        return a.text()
    }).then(function (a) {
        "true" == a && (a = {}, a["screen-size"] = window.screen.width + "x" + window.screen.height, a["document-location"] = document.location.href, a["document-referrer"] = document.referrer, a.platform = window.navigator.platform, a.userAgent = window.navigator.userAgent, a.language = window.navigator.language, fetch("log", {
            method: "post", headers: {Accept: "application/json, text/plain, */*", "Content-Type": "application/json"},
            body: JSON.stringify(a)
        }))
    })
};
wpd = wpd || {};
wpd.plotly = function () {
    return {
        send: function (a) {
            var b = document.createElement("div"), c = document.createElement("form"),
                d = document.createElement("textarea");
            c.setAttribute("method", "post");
            c.setAttribute("action", "https://plot.ly/external");
            c.setAttribute("target", "_blank");
            d.setAttribute("name", "data");
            d.setAttribute("id", "data");
            c.appendChild(d);
            b.appendChild(c);
            document.body.appendChild(b);
            b.style.display = "none";
            a = JSON.stringify(a);
            d.innerHTML = a;
            c.submit();
            document.body.removeChild(b)
        }
    }
}();
wpd = wpd || {};
wpd.saveResume = function () {
    function a(g) {
        g = wpd.appData.getPlotData().deserialize(g);
        var h = {};
        g && 0 !== Object.keys(g).length && (h = g);
        wpd.appData.getFileManager().loadMetadata(h);
        wpd.tree.refresh()
    }

    function b() {
        var g = wpd.appData.getPlotData(), h = wpd.appData.getFileManager().getMetadata();
        return JSON.stringify(g.serialize(h))
    }

    function c(g, h, k, l) {
        var p = JSON.stringify({version: [4, 0], json: "wpd.json", images: l}), m = new tarball.TarWriter;
        m.addFolder(g + "/");
        m.addTextFile(g + "/info.json", p);
        m.addTextFile(g + "/wpd.json",
            h);
        for (h = 0; h < k.length; h++) m.addFile(g + "/" + l[h], k[h]);
        return m.download(g + ".tar")
    }

    function d(g) {
        var h = new FileReader;
        h.onload = function () {
            var k = JSON.parse(h.result);
            a(k);
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.removeRepainter();
            wpd.tree.refresh();
            wpd.messagePopup.show(wpd.gettext("import-json"), wpd.gettext("json-data-loaded"));
            f()
        };
        h.readAsText(g)
    }

    function e(g) {
        wpd.busyNote.show();
        var h = new tarball.TarReader;
        h.readFile(g).then(function (k) {
            wpd.busyNote.close();
            var l = k.findIndex(function (q) {
                return q.name.endsWith("/info.json")
            });
            if (0 <= l) {
                var p = k[l].name.replace("/info.json", ""), m = [];
                k.filter(function (q) {
                    return "file" === q.type && !q.name.endsWith(".json")
                }).forEach(function (q) {
                    var r = q.name.endsWith(".pdf") ? "application/pdf" : "image/png";
                    var t = new RegExp(p + "/", "i");
                    r = h.getFileBlob(q.name, r);
                    r.name = q.name.replace(t, "");
                    m.push(r)
                });
                var n = JSON.parse(h.getTextFile(p + "/wpd.json"));
                wpd.imageManager.initializeFileManager(m);
                wpd.imageManager.loadFromFile(m[0], !0).then(function () {
                    a(n);
                    wpd.tree.refresh();
                    wpd.messagePopup.show(wpd.gettext("import-json"), wpd.gettext("json-data-loaded"));
                    f()
                })
            }
        }, function (k) {
            console.log(k)
        })
    }

    function f() {
        0 < wpd.appData.getPlotData().getDatasetCount() && wpd.tree.selectPath("/" + wpd.gettext("datasets"))
    }

    return {
        save: function () {
            wpd.popup.show("export-json-window")
        }, load: function () {
            wpd.popup.show("import-json-window")
        }, downloadJSON: function () {
            var g = document.getElementById("project-name-input").value.replace(/[^a-zA-Z\d+\.\-_\s]/g, "_") + ".json";
            wpd.download.json(b(),
                g);
            wpd.popup.close("export-json-window")
        }, downloadProject: function () {
            var g = document.getElementById("project-name-input").value.replace(/[^a-zA-Z\d+\.\-_\s]/g, "_"), h = b();
            wpd.busyNote.show();
            wpd.graphicsWidget.getImageFiles().then(function (k) {
                var l = k.map(function (p) {
                    return p.name
                });
                c(g, h, k, l).then(wpd.busyNote.close())
            });
            wpd.popup.close("export-json-window")
        }, read: function () {
            var g = document.getElementById("import-json-file");
            wpd.popup.close("import-json-window");
            if (1 === g.files.length) {
                g = g.files[0];
                var h =
                    g.type;
                if ("" == h || null == h) g.name.endsWith(".json") ? h = "application/json" : g.name.endsWith(".tar") && (h = "application/x-tar");
                "application/json" == h ? d(g) : "application/x-tar" == h ? e(g) : wpd.messagePopup.show(wpd.gettext("invalid-project"), wpd.gettext("invalid-project-msg"))
            }
        }, readProjectFile: e
    }
}();
wpd = wpd || {};
wpd.scriptInjector = function () {
    return {
        start: function () {
            wpd.popup.show("runScriptPopup")
        }, cancel: function () {
            wpd.popup.close("runScriptPopup")
        }, load: function () {
            var a = document.getElementById("runScriptFileInput");
            wpd.popup.close("runScriptPopup");
            if (1 == a.files.length) {
                var b = new FileReader;
                b.onload = function () {
                    "undefined" !== typeof wpdscript && (wpdscript = null);
                    eval(b.result);
                    "wpdscript" !== typeof wpdscript && (window.wpdscript = wpdscript, wpdscript.run())
                };
                b.readAsText(a.files[0])
            }
        }
    }
}();
wpd = wpd || {};
wpd.appData = function () {
    function a() {
        null == e && (e = new wpd.PlotData);
        return e
    }

    function b() {
        if (d()) {
            var k = g.currentPage();
            null === f && (f = {});
            f.hasOwnProperty(k) || (f[k] = new wpd.UndoManager);
            return f[k]
        }
        null == f && (f = new wpd.UndoManager);
        return f
    }

    function c() {
        null == h && (h = new wpd.FileManager);
        return h
    }

    function d() {
        var k = g;
        return k ? 1 < k.pageCount() : !1
    }

    var e = null, f = null, g = null, h = null;
    return {
        isAligned: function () {
            return 0 < a().getAxesCount()
        }, isMultipage: d, getPlotData: a, getUndoManager: b, getPageManager: function () {
            return g
        },
        getFileManager: c, getMultipageUndoManager: function () {
            return d() ? f : null
        }, setPageManager: function (k) {
            g = k;
            c().refreshPageInfo()
        }, setUndoManager: function (k) {
            f = k
        }, reset: function () {
            f = e = null
        }, plotLoaded: function (k) {
            a().setTopColors(wpd.colorAnalyzer.getTopColors(k));
            b().reapply()
        }
    }
}();
wpd = wpd || {};
wpd.autoExtraction = function () {
    return {
        start: function () {
            wpd.colorPicker.init();
            wpd.algoManager.updateAlgoList()
        }
    }
}();
wpd.algoManager = function () {
    function a() {
        var f = wpd.tree.getActiveDataset();
        return wpd.appData.getPlotData().getAutoDetectionDataForDataset(f)
    }

    function b() {
        var f = document.getElementById("auto-extract-algo-name").value, g = a();
        g.algorithm = "averagingWindow" === f ? new wpd.AveragingWindowAlgo : "XStepWithInterpolation" === f ? new wpd.XStepWithInterpolationAlgo : "CustomIndependents" === f ? new wpd.CustomIndependents : "XStep" === f ? new wpd.AveragingWindowWithStepSizeAlgo : "blobDetector" === f ? new wpd.BlobDetectorAlgo : "barExtraction" ===
        f || "histogram" === f ? new wpd.BarExtractionAlgo : new wpd.AveragingWindowAlgo;
        c(g.algorithm)
    }

    function c(f) {
        var g = document.getElementById("algo-parameter-container");
        f = f.getParamList(d);
        for (var h = Object.keys(f), k = "<table>", l = 0; l < h.length; l++) {
            var p = f[h[l]];
            k += "<tr><td>" + p[0] + '</td><td><input type="text" size=3 id="algo-param-' + h[l] + '" class="algo-params" value="' + p[2] + '"/></td><td>' + p[1] + "</td></tr>"
        }
        g.innerHTML = k + "</table>"
    }

    var d, e;
    return {
        updateAlgoList: function () {
            e = wpd.tree.getActiveDataset();
            d = wpd.appData.getPlotData().getAxesForDataset(e);
            var f = "", g = document.getElementById("auto-extract-algo-name");
            d instanceof wpd.BarAxes || (f += '<option value="averagingWindow">' + wpd.gettext("averaging-window") + "</option>");
            d instanceof wpd.XYAxes && (f += '<option value="XStepWithInterpolation">' + wpd.gettext("x-step-with-interpolation") + "</option>", f += '<option value="XStep">' + wpd.gettext("x-step") + "</option>");
            d instanceof wpd.XYAxes && (f += '<option value="CustomIndependents">' + wpd.gettext("custom-independents") + "</option>");
            d instanceof wpd.BarAxes || (f +=
                '<option value="blobDetector">' + wpd.gettext("blob-detector") + "</option>");
            d instanceof wpd.BarAxes && (f += '<option value="barExtraction">' + wpd.gettext("bar-extraction") + "</option>");
            d instanceof wpd.XYAxes && (f += '<option value="histogram">' + wpd.gettext("histogram") + "</option>");
            g.innerHTML = f;
            f = a();
            null != f.algorithm ? (f.algorithm instanceof wpd.AveragingWindowAlgo ? g.value = "averagingWindow" : f.algorithm instanceof wpd.XStepWithInterpolationAlgo ? g.value = "XStepWithInterpolation" : f.algorithm instanceof wpd.CustomIndependents ?
                g.value = "CustomIndependents" : f.algorithm instanceof wpd.AveragingWindowWithStepSizeAlgo ? g.value = "XStep" : f.algorithm instanceof wpd.BlobDetectorAlgo ? g.value = "blobDetector" : f.algorithm instanceof wpd.BarExtractionAlgo && (g.value = d instanceof wpd.XYAxes ? "histogram" : "barExtraction"), c(f.algorithm)) : b()
        }, applyAlgoSelection: b, run: function () {
            wpd.busyNote.show();
            for (var f = a(), g = f.algorithm, h = new wpd.DataPointsRepainter(d, e), k = document.getElementsByClassName("algo-params"), l = wpd.graphicsWidget.getAllContexts(),
                     p = wpd.graphicsWidget.getImageSize(), m = {}, n = 0; n < k.length; n++) {
                var q = k[n].id.replace("algo-param-", "");
                m[q] = k[n].value
            }
            g.setParams(m);
            wpd.graphicsWidget.removeTool();
            k = l.oriImageCtx.getImageData(0, 0, p.width, p.height);
            f.imageWidth = p.width;
            f.imageHeight = p.height;
            f.generateBinaryData(k);
            wpd.graphicsWidget.setRepainter(h);
            g.run(f, e, d);
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.dataPointCounter.setCount(e.getCount());
            wpd.busyNote.close();
            return !0
        }
    }
}();
wpd.dataMask = function () {
    function a() {
        var b = wpd.graphicsWidget.getAllContexts(), c = wpd.graphicsWidget.getImageSize();
        b = b.oriDataCtx.getImageData(0, 0, c.width, c.height);
        c = new Set;
        var d = wpd.tree.getActiveDataset();
        d = wpd.appData.getPlotData().getAutoDetectionDataForDataset(d);
        for (var e = 0; e < b.data.length; e += 4) 255 === b.data[e] && 255 === b.data[e + 1] && 0 === b.data[e + 2] && c.add(e / 4);
        d.mask = c
    }

    return {
        grabMask: a, markBox: function () {
            var b = new wpd.BoxMaskTool;
            wpd.graphicsWidget.setTool(b)
        }, markPen: function () {
            var b = new wpd.PenMaskTool;
            wpd.graphicsWidget.setTool(b)
        }, eraseMarks: function () {
            var b = new wpd.EraseMaskTool;
            wpd.graphicsWidget.setTool(b)
        }, viewMask: function () {
            var b = new wpd.ViewMaskTool;
            wpd.graphicsWidget.setTool(b)
        }, clearMask: function () {
            wpd.graphicsWidget.resetData();
            a()
        }
    }
}();
wpd = wpd || {};
wpd.AxesCalibrator = function (a, b) {
    this._calibration = a;
    this._isEditing = b
};
wpd.XYAxesCalibrator = function () {
    wpd.AxesCalibrator.apply(this, arguments)
};
$jscomp.inherits(wpd.XYAxesCalibrator, wpd.AxesCalibrator);
wpd.XYAxesCalibrator.prototype.start = function () {
    wpd.popup.show("xyAxesInfo")
};
wpd.XYAxesCalibrator.prototype.reload = function () {
    var a = new wpd.AxesCornersTool(this._calibration, !0);
    wpd.graphicsWidget.setTool(a)
};
wpd.XYAxesCalibrator.prototype.pickCorners = function () {
    wpd.popup.close("xyAxesInfo");
    var a = new wpd.AxesCornersTool(this._calibration, !1);
    wpd.graphicsWidget.setTool(a)
};
wpd.XYAxesCalibrator.prototype.getCornerValues = function () {
    wpd.popup.show("xyAlignment");
    if (this._isEditing) {
        var a = wpd.tree.getActiveAxes(), b = a.calibration;
        4 == b.getCount() && (document.getElementById("xmin").value = b.getPoint(0).dx, document.getElementById("xmax").value = b.getPoint(1).dx, document.getElementById("ymin").value = b.getPoint(2).dy, document.getElementById("ymax").value = b.getPoint(3).dy, document.getElementById("xlog").checked = a.isLogX(), document.getElementById("ylog").checked = a.isLogY(), document.getElementById("xy-axes-no-rotation").checked =
            a.noRotation())
    }
};
wpd.XYAxesCalibrator.prototype.align = function () {
    var a = document.getElementById("xmin").value, b = document.getElementById("xmax").value,
        c = document.getElementById("ymin").value, d = document.getElementById("ymax").value,
        e = document.getElementById("xlog").checked, f = document.getElementById("ylog").checked,
        g = document.getElementById("xy-axes-no-rotation").checked,
        h = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.XYAxes;
    if (e && (0 == parseFloat(a) || 0 == parseFloat(b)) || f && (0 == parseFloat(c) || 0 == parseFloat(d))) return wpd.popup.close("xyAlignment"), wpd.messagePopup.show(wpd.gettext("calibration-invalid-log-inputs"),
        wpd.gettext("calibration-enter-valid-log"), wpd.alignAxes.getCornerValues), !1;
    this._calibration.setDataAt(0, a, c);
    this._calibration.setDataAt(1, b, c);
    this._calibration.setDataAt(2, a, c);
    this._calibration.setDataAt(3, b, d);
    if (!h.calibrate(this._calibration, e, f, g)) return wpd.popup.close("xyAlignment"), wpd.messagePopup.show(wpd.gettext("calibration-invalid-inputs"), wpd.gettext("calibration-enter-valid"), wpd.alignAxes.getCornerValues), !1;
    this._isEditing || (h.name = wpd.alignAxes.makeAxesName(wpd.XYAxes), wpd.appData.getPlotData().addAxes(h,
        wpd.appData.isMultipage()), wpd.alignAxes.postProcessAxesAdd(h));
    wpd.popup.close("xyAlignment");
    return !0
};
wpd.BarAxesCalibrator = function () {
    wpd.AxesCalibrator.apply(this, arguments)
};
$jscomp.inherits(wpd.BarAxesCalibrator, wpd.AxesCalibrator);
wpd.BarAxesCalibrator.prototype.start = function () {
    wpd.popup.show("barAxesInfo")
};
wpd.BarAxesCalibrator.prototype.reload = function () {
    var a = new wpd.AxesCornersTool(this._calibration, !0);
    wpd.graphicsWidget.setTool(a)
};
wpd.BarAxesCalibrator.prototype.pickCorners = function () {
    wpd.popup.close("barAxesInfo");
    var a = new wpd.AxesCornersTool(this._calibration, !1);
    wpd.graphicsWidget.setTool(a)
};
wpd.BarAxesCalibrator.prototype.getCornerValues = function () {
    wpd.popup.show("barAlignment");
    if (this._isEditing) {
        var a = wpd.tree.getActiveAxes(), b = a.calibration;
        2 == b.getCount() && (document.getElementById("bar-axes-p1").value = b.getPoint(0).dy, document.getElementById("bar-axes-p2").value = b.getPoint(1).dy, document.getElementById("bar-axes-log-scale").checked = a.isLog(), document.getElementById("bar-axes-rotated").checked = a.isRotated())
    }
};
wpd.BarAxesCalibrator.prototype.align = function () {
    var a = document.getElementById("bar-axes-p1").value, b = document.getElementById("bar-axes-p2").value,
        c = document.getElementById("bar-axes-log-scale").checked,
        d = document.getElementById("bar-axes-rotated").checked,
        e = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.BarAxes;
    this._calibration.setDataAt(0, 0, a);
    this._calibration.setDataAt(1, 0, b);
    if (!e.calibrate(this._calibration, c, d)) return wpd.popup.close("barAlignment"), wpd.messagePopup.show(wpd.gettext("calibration-invalid-inputs"),
        wpd.gettext("calibration-enter-valid"), wpd.alignAxes.getCornerValues), !1;
    this._isEditing || (e.name = wpd.alignAxes.makeAxesName(wpd.BarAxes), wpd.appData.getPlotData().addAxes(e, wpd.appData.isMultipage()), wpd.alignAxes.postProcessAxesAdd(e));
    wpd.popup.close("barAlignment");
    return !0
};
wpd.PolarAxesCalibrator = function () {
    wpd.AxesCalibrator.apply(this, arguments)
};
$jscomp.inherits(wpd.PolarAxesCalibrator, wpd.AxesCalibrator);
wpd.PolarAxesCalibrator.prototype.start = function () {
    wpd.popup.show("polarAxesInfo")
};
wpd.PolarAxesCalibrator.prototype.reload = function () {
    var a = new wpd.AxesCornersTool(this._calibration, !0);
    wpd.graphicsWidget.setTool(a)
};
wpd.PolarAxesCalibrator.prototype.pickCorners = function () {
    wpd.popup.close("polarAxesInfo");
    var a = new wpd.AxesCornersTool(this._calibration, !1);
    wpd.graphicsWidget.setTool(a)
};
wpd.PolarAxesCalibrator.prototype.getCornerValues = function () {
    wpd.popup.show("polarAlignment");
    if (this._isEditing) {
        var a = wpd.tree.getActiveAxes(), b = a.calibration;
        3 == b.getCount() && (document.getElementById("polar-r1").value = b.getPoint(1).dx, document.getElementById("polar-theta1").value = b.getPoint(1).dy, document.getElementById("polar-r2").value = b.getPoint(2).dx, document.getElementById("polar-theta2").value = b.getPoint(2).dy, document.getElementById("polar-degrees").checked = a.isThetaDegrees(), document.getElementById("polar-radians").checked =
            !a.isThetaDegrees(), document.getElementById("polar-clockwise").checked = a.isThetaClockwise(), document.getElementById("polar-log-scale").checked = a.isRadialLog())
    }
};
wpd.PolarAxesCalibrator.prototype.align = function () {
    var a = parseFloat(document.getElementById("polar-r1").value),
        b = parseFloat(document.getElementById("polar-theta1").value),
        c = parseFloat(document.getElementById("polar-r2").value),
        d = parseFloat(document.getElementById("polar-theta2").value),
        e = document.getElementById("polar-degrees").checked, f = document.getElementById("polar-clockwise").checked,
        g = document.getElementById("polar-log-scale").checked,
        h = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.PolarAxes;
    this._calibration.setDataAt(1, a, b);
    this._calibration.setDataAt(2, c, d);
    h.calibrate(this._calibration, e, f, g);
    this._isEditing || (h.name = wpd.alignAxes.makeAxesName(wpd.PolarAxes), wpd.appData.getPlotData().addAxes(h, wpd.appData.isMultipage()), wpd.alignAxes.postProcessAxesAdd(h));
    wpd.popup.close("polarAlignment");
    return !0
};
wpd.TernaryAxesCalibrator = function () {
    wpd.AxesCalibrator.apply(this, arguments)
};
$jscomp.inherits(wpd.TernaryAxesCalibrator, wpd.AxesCalibrator);
wpd.TernaryAxesCalibrator.prototype.start = function () {
    wpd.popup.show("ternaryAxesInfo")
};
wpd.TernaryAxesCalibrator.prototype.reload = function () {
    var a = new wpd.AxesCornersTool(this._calibration, !0);
    wpd.graphicsWidget.setTool(a)
};
wpd.TernaryAxesCalibrator.prototype.pickCorners = function () {
    wpd.popup.close("ternaryAxesInfo");
    var a = new wpd.AxesCornersTool(this._calibration, !1);
    wpd.graphicsWidget.setTool(a)
};
wpd.TernaryAxesCalibrator.prototype.getCornerValues = function () {
    wpd.popup.show("ternaryAlignment");
    if (this._isEditing) {
        var a = wpd.tree.getActiveAxes();
        3 == a.calibration.getCount() && (document.getElementById("range0to1").checked = !a.isRange100(), document.getElementById("range0to100").checked = a.isRange100(), document.getElementById("ternarynormal").checked = a.isNormalOrientation())
    }
};
wpd.TernaryAxesCalibrator.prototype.align = function () {
    var a = document.getElementById("range0to100").checked, b = document.getElementById("ternarynormal").checked,
        c = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.TernaryAxes;
    c.calibrate(this._calibration, a, b);
    this._isEditing || (c.name = wpd.alignAxes.makeAxesName(wpd.TernaryAxes), wpd.appData.getPlotData().addAxes(c, wpd.appData.isMultipage()), wpd.alignAxes.postProcessAxesAdd(c));
    wpd.popup.close("ternaryAlignment");
    return !0
};
wpd.MapAxesCalibrator = function () {
    wpd.AxesCalibrator.apply(this, arguments)
};
$jscomp.inherits(wpd.MapAxesCalibrator, wpd.AxesCalibrator);
wpd.MapAxesCalibrator.prototype.start = function () {
    wpd.popup.show("mapAxesInfo")
};
wpd.MapAxesCalibrator.prototype.reload = function () {
    var a = new wpd.AxesCornersTool(this._calibration, !0);
    wpd.graphicsWidget.setTool(a)
};
wpd.MapAxesCalibrator.prototype.pickCorners = function () {
    wpd.popup.close("mapAxesInfo");
    var a = new wpd.AxesCornersTool(this._calibration, !1);
    wpd.graphicsWidget.setTool(a)
};
wpd.MapAxesCalibrator.prototype.getCornerValues = function () {
    wpd.popup.show("mapAlignment");
    if (this._isEditing) {
        var a = wpd.tree.getActiveAxes();
        2 == a.calibration.getCount() && (document.getElementById("scaleLength").checked = a.getScaleLength(), document.getElementById("scaleUnits").checked = a.getUnits())
    }
};
wpd.MapAxesCalibrator.prototype.align = function () {
    var a = parseFloat(document.getElementById("scaleLength").value), b = document.getElementById("scaleUnits").value,
        c = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.MapAxes;
    c.calibrate(this._calibration, a, b);
    this._isEditing || (c.name = wpd.alignAxes.makeAxesName(wpd.MapAxes), wpd.appData.getPlotData().addAxes(c, wpd.appData.isMultipage()), wpd.alignAxes.postProcessAxesAdd(c));
    wpd.popup.close("mapAlignment");
    return !0
};
wpd.alignAxes = function () {
    function a() {
        var f = wpd.tree.getActiveAxes();
        document.getElementById("rename-axes-name-input").value = f.name;
        wpd.popup.show("rename-axes-popup")
    }

    function b() {
        var f = document.getElementById("rename-axes-name-input");
        wpd.popup.close("rename-axes-popup");
        f = f.value.trim();
        0 <= wpd.appData.getPlotData().getAxesNames().indexOf(f) || 0 === f.length ? wpd.messagePopup.show(wpd.gettext("rename-axes-error"), wpd.gettext("axes-exists-error"), a) : (wpd.tree.getActiveAxes().name = f, wpd.tree.refresh(),
            wpd.tree.selectPath("/" + wpd.gettext("axes") + "/" + f, !0))
    }

    function c(f) {
        var g = wpd.appData.getPlotData(), h = wpd.appData.getFileManager(), k = wpd.appData.getPageManager();
        h.addAxesToCurrentFile([f]);
        var l = h.filterToCurrentFileAxes(g.getAxesColl()), p = h.filterToCurrentFileDatasets(g.getDatasets());
        wpd.appData.isMultipage() && (k.addAxesToCurrentPage([f]), l = k.filterToCurrentPageAxes(l), p = k.filterToCurrentPageDatasets(p));
        1 === l.length && 0 === p.length && (f = new wpd.Dataset, f.name = "Default Dataset", l = wpd.dataSeriesManagement.getDatasetWithNameCount(f.name),
        0 < l && (f.name += " " + (l + 1)), g.addDataset(f), h.addDatasetsToCurrentFile([f]), wpd.appData.isMultipage() && k.addDatasetsToCurrentPage([f]))
    }

    var d = null, e = null;
    return {
        start: function () {
            var f = document.getElementById("r_xy"), g = document.getElementById("r_polar"),
                h = document.getElementById("r_ternary"), k = document.getElementById("r_map"),
                l = document.getElementById("r_image"), p = document.getElementById("r_bar");
            wpd.popup.close("axesList");
            !0 === f.checked ? (d = new wpd.Calibration(2), d.labels = ["X1", "X2", "Y1", "Y2"], d.labelPositions =
                ["N", "N", "E", "E"], d.maxPointCount = 4, e = new wpd.XYAxesCalibrator(d)) : !0 === p.checked ? (d = new wpd.Calibration(2), d.labels = ["P1", "P2"], d.labelPositions = ["S", "S"], d.maxPointCount = 2, e = new wpd.BarAxesCalibrator(d)) : !0 === g.checked ? (d = new wpd.Calibration(2), d.labels = ["Origin", "P1", "P2"], d.labelPositions = ["E", "S", "S"], d.maxPointCount = 3, e = new wpd.PolarAxesCalibrator(d)) : !0 === h.checked ? (d = new wpd.Calibration(2), d.labels = ["A", "B", "C"], d.labelPositions = ["S", "S", "E"], d.maxPointCount = 3, e = new wpd.TernaryAxesCalibrator(d)) :
                !0 === k.checked ? (d = new wpd.Calibration(2), d.labels = ["P1", "P2"], d.labelPositions = ["S", "S"], d.maxPointCount = 2, e = new wpd.MapAxesCalibrator(d)) : !0 === l.checked && (e = d = null, f = new wpd.ImageAxes, f.name = wpd.alignAxes.makeAxesName(wpd.ImageAxes), f.calibrate(), wpd.appData.getPlotData().addAxes(f, wpd.appData.isMultipage()), c(f), wpd.tree.refresh(), f = wpd.appData.getPlotData().getDatasetNames(), 0 < f.length && (f = f[f.length - 1], wpd.tree.selectPath("/" + wpd.gettext("datasets") + "/" + f, !0)), wpd.acquireData.load());
            null != e &&
            (e.start(), wpd.graphicsWidget.setRepainter(new wpd.AlignmentCornersRepainter(d)))
        }, calibrationCompleted: function () {
            wpd.sidebar.show("axes-calibration-sidebar");
            wpd.popup.show("axes-calibration-sidebar");
            //need a separate show
        }, zoomCalPoint: function (f) {
            f = d.getPoint(f);
            wpd.graphicsWidget.updateZoomToImagePosn(f.px, f.py)
        }, getCornerValues: function () {
            e.getCornerValues()
        }, pickCorners: function () {
            console.log(e);
            e.pickCorners()
        }, align: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.removeRepainter();
            wpd.graphicsWidget.resetData();
            if (e.align()) {
                wpd.sidebar.clear();
                wpd.tree.refresh();
                var f = wpd.appData.getPlotData().getDatasetNames();
                0 < f.length && (f = f[0], wpd.tree.selectPath("/" + wpd.gettext("datasets") + "/" + f))
            }
        }, editAlignment: function () {
            wpd.appData.isAligned() && null != e ? wpd.popup.show("edit-or-reset-calibration-popup") : wpd.popup.show("axesList")
        }, reloadCalibrationForEditing: function () {
            wpd.popup.close("edit-or-reset-calibration-popup");
            e = null;
            var f = wpd.tree.getActiveAxes();
            d = f.calibration;
            f instanceof wpd.XYAxes ? e = new wpd.XYAxesCalibrator(d, !0) : f instanceof wpd.BarAxes ? e = new wpd.BarAxesCalibrator(d,
                !0) : f instanceof wpd.PolarAxes ? e = new wpd.PolarAxesCalibrator(d, !0) : f instanceof wpd.TernaryAxes ? e = new wpd.TernaryAxesCalibrator(d, !0) : f instanceof wpd.MapAxes && (e = new wpd.MapAxesCalibrator(d, !0));
            null != e && (e.reload(), wpd.graphicsWidget.setRepainter(new wpd.AlignmentCornersRepainter(d)), wpd.graphicsWidget.forceHandlerRepaint(), wpd.sidebar.show("axes-calibration-sidebar"))
        }, addCalibration: function () {
            wpd.popup.show("axesList")
        }, deleteCalibration: function () {
            wpd.okCancelPopup.show(wpd.gettext("delete-axes"),
                wpd.gettext("delete-axes-text"), function () {
                    var f = wpd.appData.getPlotData(), g = wpd.tree.getActiveAxes();
                    f.deleteAxes(g);
                    wpd.appData.isMultipage() && wpd.appData.getPageManager().deleteAxesFromCurrentPage([g]);
                    wpd.tree.refresh();
                    wpd.tree.selectPath("/" + wpd.gettext("axes"))
                })
        }, showRenameAxes: a, makeAxesName: function (f) {
            var g = "", h = wpd.appData.getPlotData().getAxesNames();
            f === wpd.XYAxes ? g = wpd.gettext("axes-name-xy") : f === wpd.PolarAxes ? g = wpd.gettext("axes-name-polar") : f === wpd.MapAxes ? g = wpd.gettext("axes-name-map") :
                f === wpd.TernaryAxes ? g = wpd.gettext("axes-name-ternary") : f === wpd.BarAxes ? g = wpd.gettext("axes-name-bar") : f === wpd.ImageAxes && (g = wpd.gettext("axes-name-image"));
            f = 2;
            for (var k = g; 0 <= h.indexOf(k);) k = g + " " + f, f++;
            return k
        }, renameAxes: b, renameKeypress: function (f) {
            "Enter" === f.key && b()
        }, postProcessAxesAdd: c
    }
}();
wpd = wpd || {};
wpd.browserInfo = function () {
    return {
        checkBrowser: function () {
            window.FileReader && "object" === typeof WebAssembly && "download" in document.createElement("a") || alert("WARNING!\nYour web browser may not be fully supported. Please use a recent version of Google Chrome, Firefox or Safari browser with HTML5 and WebAssembly support.")
        }, isElectronBrowser: function () {
            return "undefined" === typeof process ? !1 : !0
        }
    }
}();
wpd = wpd || {};
wpd.colorSelectionWidget = function () {
    function a() {
        document.getElementById("color-selection-selected-color-box").style.backgroundColor = "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")";
        document.getElementById("color-selection-red").value = b[0];
        document.getElementById("color-selection-green").value = b[1];
        document.getElementById("color-selection-blue").value = b[2];
        for (var f = document.getElementById("color-selection-options"), g = wpd.appData.getPlotData().getTopColors(), h = 10 < g.length ? 10 : g.length, k = "", l = 0; l < h; l++) {
            var p = "rgb(" +
                g[l].r + "," + g[l].g + "," + g[l].b + ");", m = g[l].percentage.toFixed(3) + "%";
            k += '<div class="colorOptionBox" style="background-color: ' + p + '" title="' + m + '" onclick="wpd.colorSelectionWidget.selectTopColor(' + l + ');"></div>'
        }
        f.innerHTML = k;
        wpd.popup.show("color-selection-widget")
    }

    var b, c, d, e;
    return {
        setParams: function (f) {
            b = f.color;
            c = f.triggerElementId;
            d = f.title;
            e = f.setColorDelegate;
            document.getElementById("color-selection-title").innerHTML = d
        }, startPicker: a, pickColor: function () {
            wpd.popup.close("color-selection-widget");
            var f = new wpd.ColorPickerTool;
            f.onComplete = function (g) {
                b = g;
                e(g);
                wpd.graphicsWidget.removeTool();
                a()
            };
            wpd.graphicsWidget.setTool(f)
        }, setColor: function () {
            var f = [];
            f[0] = parseInt(document.getElementById("color-selection-red").value, 10);
            f[1] = parseInt(document.getElementById("color-selection-green").value, 10);
            f[2] = parseInt(document.getElementById("color-selection-blue").value, 10);
            b = f;
            e(f);
            wpd.popup.close("color-selection-widget");
            f = document.getElementById(c);
            f.style.backgroundColor = "rgb(" + b[0] + "," + b[1] +
                "," + b[2] + ")";
            f.style.color = 200 > b[0] + b[1] + b[2] ? "rgb(255,255,255)" : "rgb(0,0,0)"
        }, selectTopColor: function (f) {
            var g = [], h = wpd.appData.getPlotData().getTopColors();
            g[0] = h[f].r;
            g[1] = h[f].g;
            g[2] = h[f].b;
            b = g;
            e(g);
            a()
        }, paintFilteredColor: function (f, g) {
            var h = wpd.graphicsWidget.getAllContexts(), k = wpd.graphicsWidget.getImageSize();
            k = h.oriDataCtx.getImageData(0, 0, k.width, k.height);
            if (null != g && 0 !== g.size) {
                g = $jscomp.makeIterator(g);
                for (var l = g.next(); !l.done; l = g.next()) l = l.value, f.has(l) ? (k.data[4 * l] = 255, k.data[4 *
                l + 1] = 255, k.data[4 * l + 2] = 0, k.data[4 * l + 3] = 255) : (k.data[4 * l] = 0, k.data[4 * l + 1] = 0, k.data[4 * l + 2] = 0, k.data[4 * l + 3] = 150);
                h.oriDataCtx.putImageData(k, 0, 0);
                wpd.graphicsWidget.copyImageDataLayerToScreen()
            }
        }
    }
}();
wpd.colorPicker = function () {
    function a() {
        var e = wpd.tree.getActiveDataset();
        return wpd.appData.getPlotData().getAutoDetectionDataForDataset(e)
    }

    function b() {
        var e = a();
        return {
            color: e.fgColor,
            triggerElementId: "color-button",
            title: wpd.gettext("specify-foreground-color"),
            setColorDelegate: function (f) {
                e.fgColor = f
            }
        }
    }

    function c() {
        var e = a();
        return {
            color: e.bgColor,
            triggerElementId: "color-button",
            title: wpd.gettext("specify-background-color"),
            setColorDelegate: function (f) {
                e.bgColor = f
            }
        }
    }

    function d() {
        var e = document.getElementById("color-button"),
            f = document.getElementById("color-distance-value"), g = a(),
            h = document.getElementById("color-detection-mode-select");
        var k = "fg" === g.colorDetectionMode ? g.fgColor : g.bgColor;
        var l = g.colorDistance;
        e.style.backgroundColor = "rgb(" + k[0] + "," + k[1] + "," + k[2] + ")";
        f.value = l;
        h.value = g.colorDetectionMode
    }

    return {
        startPicker: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.removeRepainter();
            wpd.graphicsWidget.resetData();
            "fg" === a().colorDetectionMode ? wpd.colorSelectionWidget.setParams(b()) : wpd.colorSelectionWidget.setParams(c());
            wpd.colorSelectionWidget.startPicker()
        }, changeDetectionMode: function () {
            var e = document.getElementById("color-detection-mode-select");
            a().colorDetectionMode = e.value;
            d()
        }, changeColorDistance: function () {
            var e = parseFloat(document.getElementById("color-distance-value").value);
            a().colorDistance = e
        }, init: d, testColorDetection: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.setRepainter(new wpd.ColorFilterRepainter);
            var e = wpd.graphicsWidget.getAllContexts(), f = a(),
                g = wpd.graphicsWidget.getImageSize();
            e = e.oriImageCtx.getImageData(0, 0, g.width, g.height);
            f.generateBinaryData(e);
            wpd.colorSelectionWidget.paintFilteredColor(f.binaryData, f.mask)
        }
    }
}();
wpd = wpd || {};
wpd.dataSeriesManagement = function () {
    function a(d) {
        return 0 <= wpd.appData.getPlotData().getDatasetNames().indexOf(d) ? !0 : !1
    }

    function b() {
        var d = wpd.tree.getActiveDataset();
        document.getElementById("rename-dataset-name-input").value = d.name;
        wpd.popup.show("rename-dataset-popup")
    }

    function c() {
        var d = document.getElementById("rename-dataset-name-input");
        wpd.popup.close("rename-dataset-popup");
        if (a(d.value.trim())) wpd.messagePopup.show(wpd.gettext("rename-dataset-error"), wpd.gettext("dataset-exists-error"), b);
        else {
            var e = wpd.tree.getActiveDataset();
            e.name = d.value.trim();
            wpd.tree.refresh();
            wpd.tree.selectPath("/" + wpd.gettext("datasets") + "/" + e.name, !0)
        }
    }

    return {
        showAddDataset: function () {
            for (var d = document.getElementById("add-single-dataset-name-input"), e = wpd.appData.getPlotData().getDatasetCount(), f = wpd.gettext("dataset") + " " + e; a(f);) e++, f = wpd.gettext("dataset") + " " + e;
            d.value = f;
            wpd.popup.show("add-dataset-popup")
        }, showRenameDataset: b, renameDataset: c, renameKeypress: function (d) {
            "Enter" === d.key && c()
        }, addSingleDataset: function () {
            var d =
                document.getElementById("add-single-dataset-name-input");
            wpd.popup.close("add-dataset-popup");
            if (a(d.value.trim())) wpd.messagePopup.show(wpd.gettext("add-dataset-error"), wpd.gettext("dataset-exists-error"), function () {
                wpd.popup.show("add-dataset-popup")
            }); else {
                var e = wpd.appData.getPlotData(), f = new wpd.Dataset;
                f.name = d.value.trim();
                e.addDataset(f);
                wpd.appData.getFileManager().addDatasetsToCurrentFile([f]);
                wpd.appData.isMultipage() && wpd.appData.getPageManager().addDatasetsToCurrentPage([f]);
                wpd.tree.refreshPreservingSelection()
            }
        },
        addMultipleDatasets: function () {
            var d = document.getElementById("add-multiple-datasets-count-input");
            d = parseInt(d.value, 0);
            wpd.popup.close("add-dataset-popup");
            if (0 < d) {
                for (var e = wpd.appData.getPlotData(), f = wpd.appData.getFileManager(), g = wpd.appData.isMultipage(), h = wpd.appData.getPlotData().getDatasetCount(), k = wpd.gettext("dataset") + " ", l = 0; l < d;) {
                    var p = k + h;
                    if (!a(p)) {
                        var m = new wpd.Dataset;
                        m.name = p;
                        e.addDataset(m);
                        f.addDatasetsToCurrentFile([m]);
                        g && wpd.appData.getPageManager().addDatasetsToCurrentPage([m]);
                        l++
                    }
                    h++
                }
                wpd.tree.refreshPreservingSelection()
            } else wpd.messagePopup(wpd.gettext("add-dataset-error"), wpd.gettext("add-dataset-count-error"), function () {
                wpd.popup.show("add-dataset-popup")
            })
        }, deleteDataset: function () {
            wpd.okCancelPopup.show(wpd.gettext("delete-dataset"), wpd.gettext("delete-dataset-text"), function () {
                var d = wpd.appData.getPlotData(), e = wpd.tree.getActiveDataset();
                d.deleteDataset(e);
                wpd.appData.getFileManager().deleteDatasetsFromCurrentFile([e]);
                wpd.appData.isMultipage() && wpd.appData.getPageManager().deleteDatasetsFromCurrentPage([e]);
                wpd.tree.refresh();
                wpd.tree.selectPath("/" + wpd.gettext("datasets"))
            })
        }, changeAxes: function (d) {
            var e = wpd.appData.getPlotData(), f = e.getAxesColl(), g = wpd.tree.getActiveDataset();
            d = parseInt(d, 10);
            -1 === d ? e.setAxesForDataset(g, null) : 0 <= d && d < f.length && e.setAxesForDataset(g, f[d]);
            wpd.tree.refreshPreservingSelection(!0)
        }, startColorPicker: function () {
            wpd.colorSelectionWidget.setParams({
                color: wpd.tree.getActiveDataset().colorRGB.getRGB(),
                triggerElementId: "dataset-display-color-picker-button",
                title: "Specify Display Color for Digitized Points",
                setColorDelegate: function (d) {
                    wpd.tree.getActiveDataset().colorRGB = new wpd.Color(d[0], d[1], d[2]);
                    wpd.graphicsWidget.forceHandlerRepaint();
                    wpd.tree.refreshPreservingSelection()
                }
            });
            wpd.colorSelectionWidget.startPicker()
        }, getDatasetWithNameCount: function (d) {
            var e = wpd.appData.getPlotData().getDatasetNames(), f = 0;
            e = $jscomp.makeIterator(e);
            for (var g = e.next(); !g.done; g = e.next()) g.value.startsWith(d) && f++;
            return f
        }
    }
}();
wpd = wpd || {};
wpd.FileManager = function () {
    this.$pageInfoElements = document.getElementsByClassName("paged");
    this.$fileSelectorContainers = document.getElementsByClassName("files");
    this.$navSeparator = document.getElementById("navSeparator");
    this.$fileSelector = document.getElementById("image-file-select");
    this._init()
};
wpd.FileManager.prototype._init = function () {
    this.currentIndex = 0;
    this.pageManagers = {};
    this.undoManagers = {};
    this.axesByFile = {};
    this.datasetsByFile = {};
    this.measurementsByFile = {};
    this.files = [];
    this.$navSeparator.hidden = !0;
    this._hidePageInfo()
};
wpd.FileManager.prototype.set = function (a) {
    this.files = a;
    this._initializeInput();
    1 < a.length ? this._showFileInfo() : (this._hideFileInfo(), this.$navSeparator.hidden = !0)
};
wpd.FileManager.prototype.reset = function () {
    this._init();
    wpd.appData.setPageManager(null)
};
wpd.FileManager.prototype.getFiles = function () {
    return this.files
};
wpd.FileManager.prototype.fileCount = function () {
    return this.files.length
};
wpd.FileManager.prototype.currentFileIndex = function () {
    return this.currentIndex
};
wpd.FileManager.prototype._initializeInput = function () {
    var a = Array.prototype.map.call(this.files, function (c) {
        return c.name
    }), b = wpd.utils.integerRange(this.files.length);
    this.$fileSelector.innerHTML = wpd.utils.createOptionsHTML(a, b, this.currentIndex)
};
wpd.FileManager.prototype._showFileInfo = function () {
    wpd.utils.toggleElementsDisplay(this.$fileSelectorContainers, !1)
};
wpd.FileManager.prototype._hideFileInfo = function () {
    wpd.utils.toggleElementsDisplay(this.$fileSelectorContainers, !0)
};
wpd.FileManager.prototype._showPageInfo = function () {
    wpd.utils.toggleElementsDisplay(this.$pageInfoElements, !1)
};
wpd.FileManager.prototype._hidePageInfo = function () {
    wpd.utils.toggleElementsDisplay(this.$pageInfoElements, !0)
};
wpd.FileManager.prototype.refreshPageInfo = function () {
    wpd.appData.isMultipage() ? (this._showPageInfo(), 1 < this.files.length && (this.$navSeparator.hidden = !1)) : (this._hidePageInfo(), this.$navSeparator.hidden = !0)
};
wpd.FileManager.prototype._savePageManager = function () {
    var a = wpd.appData.getPageManager();
    a && !this.pageManagers[this.currentIndex] && (this.pageManagers[this.currentIndex] = a)
};
wpd.FileManager.prototype._loadPageManager = function (a) {
    var b = null;
    this.pageManagers[a] && (b = this.pageManagers[a], b.refreshInput());
    wpd.appData.setPageManager(b)
};
wpd.FileManager.prototype._saveUndoManager = function () {
    if (this.pageManagers[this.currentIndex]) var a = wpd.appData.getMultipageUndoManager(); else a = wpd.appData.getUndoManager(), a.canUndo() || a.canRedo() || (a = null);
    a && (this.undoManagers[this.currentIndex] = a)
};
wpd.FileManager.prototype._loadUndoManager = function (a) {
    var b = null;
    this.undoManagers[a] && (b = this.undoManagers[a]);
    wpd.appData.setUndoManager(b)
};
wpd.FileManager.prototype.switch = function (a) {
    a = parseInt(a, 10);
    a !== this.currentIndex && -1 < a && a <= this.files.length && (this._savePageManager(), this._loadPageManager(a), this._saveUndoManager(), this._loadUndoManager(a), wpd.imageManager.loadFromFile(this.files[a], !0), this.currentIndex = a, wpd.tree.refresh())
};
wpd.FileManager.prototype.addAxesToCurrentFile = function (a) {
    wpd.utils.addToCollection(this.axesByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.addDatasetsToCurrentFile = function (a) {
    wpd.utils.addToCollection(this.datasetsByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.addMeasurementsToCurrentFile = function (a) {
    wpd.utils.addToCollection(this.measurementsByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.deleteDatasetsFromCurrentFile = function (a) {
    wpd.utils.deleteFromCollection(this.datasetsByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.deleteMeasurementsFromCurrentFile = function (a) {
    wpd.utils.deleteFromCollection(this.measurementsByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.getAxesNameMap = function () {
    return wpd.utils.invertObject(this.axesByFile)
};
wpd.FileManager.prototype.getDatasetNameMap = function () {
    return wpd.utils.invertObject(this.datasetsByFile)
};
wpd.FileManager.prototype.filterToCurrentFileAxes = function (a) {
    return wpd.utils.filterCollection(this.axesByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.filterToCurrentFileDatasets = function (a) {
    return wpd.utils.filterCollection(this.datasetsByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.filterToCurrentFileMeasurements = function (a) {
    return wpd.utils.filterCollection(this.measurementsByFile, this.currentIndex, a)
};
wpd.FileManager.prototype.getMetadata = function () {
    var a = this, b = {}, c = wpd.appData.getPlotData().getMeasurementColl();
    this._savePageManager();
    1 < this.fileCount() && (b.file = {
        axes: this.getAxesNameMap(),
        datasets: this.getDatasetNameMap(),
        measurements: c.map(function (l) {
            return wpd.utils.findKey(a.measurementsByFile, l)
        })
    });
    if (0 < Object.keys(this.pageManagers).length) {
        var d = [{}], e = [{}], f = [], g = {}, h;
        for (h in this.pageManagers) {
            d.push(this.pageManagers[h].getAxesNameMap());
            e.push(this.pageManagers[h].getDatasetNameMap());
            f.push(this.pageManagers[h].getMeasurementPageMap());
            var k = this.pageManagers[h].getPageLabelMap();
            Object.keys(k).length && (g[h] = k)
        }
        b.page = {
            axes: Object.assign.apply(null, d),
            datasets: Object.assign.apply(null, e),
            measurements: c.map(function (l) {
                for (var p = $jscomp.makeIterator(f), m = p.next(); !m.done; m = p.next()) if (m = wpd.utils.findKey(m.value, l)) return m
            })
        };
        Object.keys(g).length && (b.misc = {pageLabel: g})
    }
    return b
};
wpd.FileManager.prototype.loadMetadata = function (a) {
    var b = this, c = this;
    a.file ? (c.axesByFile = a.file.axes || {}, c.datasetsByFile = a.file.datasets || {}, c.measurementsByFile = a.file.measurements || {}) : (c.axesByFile["0"] = wpd.appData.getPlotData().getAxesColl().slice(), c.datasetsByFile["0"] = wpd.appData.getPlotData().getDatasets().slice(), c.measurementsByFile["0"] = wpd.appData.getPlotData().getMeasurementColl().slice());
    for (var d = [], e = {$jscomp$loop$prop$index$65: 0}; e.$jscomp$loop$prop$index$65 < c.files.length; e = {$jscomp$loop$prop$index$65: e.$jscomp$loop$prop$index$65},
        e.$jscomp$loop$prop$index$65++) {
        var f = null;
        "application/pdf" === c.files[e.$jscomp$loop$prop$index$65].type && (0 === e.$jscomp$loop$prop$index$65 ? c._savePageManager() : f = new Promise(function (g) {
            return function (h, k) {
                var l = new FileReader;
                l.onload = function () {
                    pdfjsLib.getDocument(l.result).promise.then(function (p) {
                        return h(p)
                    })
                };
                l.readAsDataURL(b.files[g.$jscomp$loop$prop$index$65])
            }
        }(e)));
        d.push(f)
    }
    Promise.all(d).then(function (g) {
        for (var h = {$jscomp$loop$prop$index$55$69: 0}; h.$jscomp$loop$prop$index$55$69 <
        g.length; h = {$jscomp$loop$prop$index$55$69: h.$jscomp$loop$prop$index$55$69}, h.$jscomp$loop$prop$index$55$69++) {
            var k = {};
            if ("application/pdf" === c.files[h.$jscomp$loop$prop$index$55$69].type && (null !== g[h.$jscomp$loop$prop$index$55$69] && (c.pageManagers[h.$jscomp$loop$prop$index$55$69] = wpd.imageManager.initializePDFManager(g[h.$jscomp$loop$prop$index$55$69], !0)), a.page)) {
                var l = {}, p = {}, m = {}, n;
                for (n in a.page.axes) l[n] = a.page.axes[n].filter(function (t) {
                    return function (x) {
                        return c.axesByFile[t.$jscomp$loop$prop$index$55$69] &&
                            -1 < c.axesByFile[t.$jscomp$loop$prop$index$55$69].indexOf(x)
                    }
                }(h));
                for (var q in a.page.datasets) p[q] = a.page.datasets[q].filter(function (t) {
                    return function (x) {
                        return c.datasetsByFile[t.$jscomp$loop$prop$index$55$69] && -1 < c.datasetsByFile[t.$jscomp$loop$prop$index$55$69].indexOf(x)
                    }
                }(h));
                for (var r in a.page.measurements) m[r] = a.page.measurements[r].filter(function (t) {
                    return function (x) {
                        return c.measurementsByFile[t.$jscomp$loop$prop$index$55$69] && -1 < c.measurementsByFile[t.$jscomp$loop$prop$index$55$69].indexOf(x)
                    }
                }(h));
                Object.assign(k, {axes: l, datasets: p, measurements: m})
            }
            a.misc && a.misc.pageLabel && c.pageManagers.hasOwnProperty(h.$jscomp$loop$prop$index$55$69) && Object.assign(k, {pageLabels: a.misc.pageLabel[h.$jscomp$loop$prop$index$55$69]});
            c.pageManagers.hasOwnProperty(h.$jscomp$loop$prop$index$55$69) && (Object.keys(k).length && c.pageManagers[h.$jscomp$loop$prop$index$55$69].loadPageData(k), 0 === h.$jscomp$loop$prop$index$55$69 && c.pageManagers[h.$jscomp$loop$prop$index$55$69].refreshInput())
        }
        wpd.tree.refresh()
    })
};
wpd = wpd || {};
wpd.gridDetection = function () {
    function a(e, f, g) {
        for (var h = wpd.appData.getPlotData().getGridDetectionData().backupImageData, k = 0; k < h.data.length; k++) e.data[k] = h.data[k];
        return {imageData: e, width: f, height: g, keepZoom: !0}
    }

    function b() {
        wpd.graphicsWidget.removeTool();
        wpd.appData.getPlotData().getGridDetectionData().gridData = null;
        wpd.graphicsWidget.removeRepainter();
        wpd.graphicsWidget.resetData();
        null != wpd.appData.getPlotData().getGridDetectionData().backupImageData && wpd.graphicsWidget.runImageOp(a)
    }

    function c(e,
               f, g) {
        var h = wpd.appData.getPlotData().getGridDetectionData().gridData,
            k = wpd.appData.getPlotData().getTopColors()[0];
        null == k && (k = {r: 255, g: 0, b: 0});
        if (null != h) for (var l = 0; l < g; l++) for (var p = 0; p < f; p++) {
            var m = 4 * (l * f + p);
            h.has(m / 4) && (e.data[m] = k.r, e.data[m + 1] = k.g, e.data[m + 2] = k.b, e.data[m + 3] = 255)
        }
        return {imageData: e, width: f, height: g}
    }

    function d() {
        var e = parseFloat(document.getElementById("grid-color-distance").value);
        wpd.appData.getPlotData().getGridDetectionData().colorDistance = e
    }

    return {
        start: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.removeRepainter();
            wpd.graphicsWidget.resetData();
            wpd.sidebar.show("grid-detection-sidebar");
            var e = document.getElementById("grid-color-picker-button"),
                f = document.getElementById("grid-background-mode"),
                g = wpd.appData.getPlotData().getGridDetectionData(), h = g.lineColor;
            g = g.gridBackgroundMode;
            null != h && (e.style.backgroundColor = "rgb(" + h[0] + "," + h[1] + "," + h[2] + ")", e.style.color = 200 > h[0] + h[1] + h[2] ? "rgb(255,255,255)" : "rgb(0,0,0)");
            f.checked = g
        }, markBox: function () {
            var e = new wpd.GridBoxTool;
            wpd.graphicsWidget.setTool(e)
        },
        clearMask: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.removeRepainter();
            wpd.appData.getPlotData().getGridDetectionData().gridMask = {
                xmin: null,
                xmax: null,
                ymin: null,
                ymax: null,
                pixels: new Set
            };
            wpd.graphicsWidget.resetData()
        }, viewMask: function () {
            var e = new wpd.GridViewMaskTool;
            wpd.graphicsWidget.setTool(e)
        }, grabMask: function () {
            var e = wpd.graphicsWidget.getAllContexts(), f = wpd.graphicsWidget.getImageSize();
            e = e.oriDataCtx.getImageData(0, 0, f.width, f.height);
            for (var g = new Set, h = 0, k = wpd.appData.getPlotData().getGridDetectionData(),
                     l = 0; l < e.data.length; l += 4) if (255 === e.data[l] && 255 === e.data[l + 1] && 0 === e.data[l + 2]) {
                g.add(l / 4);
                h++;
                var p = parseInt(l / 4 % f.width, 10), m = parseInt(l / 4 / f.width, 10);
                1 === h ? (k.gridMask.xmin = p, k.gridMask.xmax = p, k.gridMask.ymin = m, k.gridMask.ymax = m) : (p < k.gridMask.xmin && (k.gridMask.xmin = p), p > k.gridMask.xmax && (k.gridMask.xmax = p), m < k.gridMask.ymin && (k.gridMask.ymin = m), m > k.gridMask.ymax && (k.gridMask.ymax = m))
            }
            k.gridMask.pixels = g
        }, startColorPicker: function () {
            wpd.colorSelectionWidget.setParams({
                color: wpd.appData.getPlotData().getGridDetectionData().lineColor,
                triggerElementId: "grid-color-picker-button",
                title: "Specify Grid Line Color",
                setColorDelegate: function (e) {
                    wpd.appData.getPlotData().getGridDetectionData().lineColor = e
                }
            });
            wpd.colorSelectionWidget.startPicker()
        }, changeColorDistance: d, changeBackgroundMode: function () {
            var e = document.getElementById("grid-background-mode").checked;
            wpd.appData.getPlotData().getGridDetectionData().gridBackgroundMode = e
        }, testColor: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.setRepainter(new wpd.GridColorFilterRepainter);
            var e = wpd.appData.getPlotData().getGridDetectionData();
            d();
            var f = wpd.graphicsWidget.getAllContexts(), g = wpd.graphicsWidget.getImageSize();
            f = f.oriImageCtx.getImageData(0, 0, g.width, g.height);
            e.generateBinaryData(f);
            wpd.colorSelectionWidget.paintFilteredColor(e.binaryData, e.gridMask.pixels)
        }, run: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.removeRepainter();
            wpd.graphicsWidget.resetData();
            b();
            var e = wpd.appData.getPlotData().getGridDetectionData(), f = wpd.graphicsWidget.getAllContexts(),
                g = wpd.graphicsWidget.getImageSize(), h = document.getElementById("grid-horiz-perc"),
                k = document.getElementById("grid-vert-perc"), l = document.getElementById("grid-horiz-enable").checked,
                p = document.getElementById("grid-vert-enable").checked;
            document.getElementById("grid-background-mode");
            wpd.appData.getPlotData();
            null == e.backupImageData && (e.backupImageData = f.oriImageCtx.getImageData(0, 0, g.width, g.height));
            f = f.oriImageCtx.getImageData(0, 0, g.width, g.height);
            e.generateBinaryData(f);
            wpd.gridDetectionCore.setHorizontalParameters(l,
                h.value);
            wpd.gridDetectionCore.setVerticalParameters(p, k.value);
            e.gridData = wpd.gridDetectionCore.run(e);
            wpd.graphicsWidget.runImageOp(c);
            wpd.appData.getPlotData().getGridDetectionData().gridData = null
        }, reset: b
    }
}();
wpd = wpd || {};
wpd.gettext = function (a) {
    a = document.getElementById("i18n-string-" + a);
    if (a != null){
        return a.innerHTML;
    }
    else return "";

};
wpd = wpd || {};
wpd.imageEditing = {
    showImageInfo: function () {
        var a = document.getElementById("image-info-dimensions"), b = wpd.imageManager.getImageInfo();
        a.innerHTML = "(" + b.width + "x" + b.height + ")";
        wpd.appData.isMultipage() && (document.getElementById("image-info-pages").innerHTML = wpd.appData.getPageManager().pageCount());
        wpd.popup.show("image-info-popup")
    }, startImageCrop: function () {
        wpd.graphicsWidget.setTool(new wpd.CropTool)
    }, startPerspective: function () {
        wpd.popup.show("perspective-info")
    }, startPerspectiveConfirmed: function () {
    },
    undo: function () {
        wpd.appData.getUndoManager().undo()
    }, redo: function () {
        wpd.appData.getUndoManager().redo()
    }
};
wpd.ReversibleAction = function () {
};
wpd.ReversibleAction.prototype.execute = function () {
};
wpd.ReversibleAction.prototype.undo = function () {
};
wpd.CropImageAction = function (a, b, c, d) {
    wpd.ReversibleAction.call(this);
    this._x0 = a;
    this._y0 = b;
    this._x1 = c;
    this._y1 = d;
    this._originalImage = null
};
$jscomp.inherits(wpd.CropImageAction, wpd.ReversibleAction);
wpd.CropImageAction.prototype.execute = function () {
    var a = wpd.graphicsWidget.getAllContexts(), b = wpd.graphicsWidget.getImageSize();
    this._originalImage = a.oriImageCtx.getImageData(0, 0, b.width, b.height);
    var c = a.oriImageCtx.getImageData(this._x0, this._y0, this._x1, this._y1), d = this._x1 - this._x0,
        e = this._y1 - this._y0;
    wpd.graphicsWidget.runImageOp(function (f, g, h) {
        return {imageData: c, width: d, height: e, keepZoom: !0}
    })
};
wpd.CropImageAction.prototype.undo = function () {
    var a = this._originalImage;
    wpd.graphicsWidget.runImageOp(function (b, c, d) {
        return {imageData: a, width: a.width, height: a.height}
    })
};
wpd = wpd || {};
wpd.imageManager = function () {
    function a(h, k) {
        return new Promise(function (l, p) {
            if (h.type.match("image.*")) {
                wpd.busyNote.show();
                var m = new FileReader;
                m.onload = function () {
                    b(m.result, k).then(l)
                };
                m.readAsDataURL(h)
            } else if ("application/pdf" == h.type) {
                wpd.busyNote.show();
                var n = new FileReader;
                n.onload = function () {
                    pdfjsLib.getDocument(n.result).promise.then(function (q) {
                        var r = wpd.appData.getPageManager();
                        r ? r.renderPage(r.currentPage(), k).then(l) : (q = d(q), q.renderPage(1, k).then(l), wpd.appData.setPageManager(q))
                    })
                };
                n.readAsDataURL(h)
            } else console.log(h.type), wpd.messagePopup.show(wpd.gettext("invalid-file"), wpd.gettext("invalid-file-text"))
        })
    }

    function b(h, k) {
        return new Promise(function (l, p) {
            var m = new Image;
            m.onload = function () {
                f && (wpd.appData.reset(), wpd.sidebar.clear());
                var n = wpd.graphicsWidget.loadImage(m);
                wpd.appData.plotLoaded(n);
                wpd.busyNote.close();
                f ? wpd.tree.refresh() : wpd.tree.refreshPreservingSelection();
                e =true;
                f = e = !1;
                g = {width: n.width, height: n.height};
                l()
            };
            m.src = h
        })
    }

    function c(h) {
        var k = wpd.appData.getFileManager();
        k.reset();
        k.set(h)
    }

    function d(h, k) {
        var l = new wpd.PDFManager;
        l.init(h, k);
        return l
    }

    var e = !0, f = !1, g = {width: 0, height: 0};
    return {
        saveImage: function () {
            wpd.graphicsWidget.saveImage()
        }, loadFromURL: b, loadFromFile: a, load: function () {


            //hard load from from digitizer.png
            let main_img = document.getElementById('id');

            fetch(main_img.src)
              .then(res => res.blob())
              .then(blob => {
                  const file = new File([blob], 'mainChart.png', blob);
                  console.log(file.type);
                   wpd.appData.setPageManager(null), a(file);
            wpd.popup.close("loadNewImage")
              });



        }, getImageInfo: function () {
            return g
        }, initializeFileManager: c,
        initializePDFManager: d
    }
}();
wpd = wpd || {};
wpd.acquireData = function () {
    function a() {
        var k = new wpd.ManualSelectionTool(h, g);
        wpd.graphicsWidget.setTool(k)
    }

    function b() {
        var k = new wpd.DeleteDataPointTool(h, g);
        wpd.graphicsWidget.setTool(k)
    }

    function c() {
        g.clearAll();
        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.resetData();
        wpd.dataPointCounter.setCount(g.getCount());
        wpd.graphicsWidget.removeRepainter()
    }

    function d() {
        wpd.sidebar.show("acquireDataSidebar");
        document.getElementById("edit-data-labels").style.display = h instanceof wpd.BarAxes ? "inline-block" :
            "none";
        wpd.dataPointCounter.setCount(g.getCount())
    }

    function e() {
        wpd.graphicsWidget.setTool(new wpd.AdjustDataPointTool(h, g))
    }

    function f() {
        h instanceof wpd.BarAxes && wpd.graphicsWidget.setTool(new wpd.EditLabelsTool(h, g))
    }

    var g, h;
    return {
        load: function () {
            g = wpd.tree.getActiveDataset();
            h = wpd.appData.getPlotData().getAxesForDataset(wpd.tree.getActiveDataset());
            null == h ? wpd.messagePopup.show(wpd.gettext("dataset-no-calibration"), wpd.gettext("calibrate-dataset")) : (wpd.graphicsWidget.removeTool(), wpd.graphicsWidget.resetData(),
                d(), wpd.autoExtraction.start(), wpd.dataPointCounter.setCount(), wpd.graphicsWidget.removeTool(), wpd.graphicsWidget.setRepainter(new wpd.DataPointsRepainter(h, g)), a(), wpd.graphicsWidget.forceHandlerRepaint(), wpd.dataPointCounter.setCount(g.getCount()))
        }, manualSelection: a, adjustPoints: e, deletePoint: b, clearAll: function () {
            0 >= g.getCount() || wpd.okCancelPopup.show(wpd.gettext("clear-data-points"), wpd.gettext("clear-data-points-text"), c, function () {
            })
        }, undo: function () {
            g.removeLastPixel();
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.dataPointCounter.setCount(g.getCount())
        }, showSidebar: d, switchToolOnKeyPress: function (k) {
            switch (k) {
                case "d":
                    b();
                    break;
                case "a":
                    a();
                    break;
                case "s":
                    e();
                    break;
                case "e":
                    f()
            }
        }, isToolSwitchKey: function (k) {
            return wpd.keyCodes.isAlphabet(k, "a") || wpd.keyCodes.isAlphabet(k, "s") || wpd.keyCodes.isAlphabet(k, "d") || wpd.keyCodes.isAlphabet(k, "e") ? !0 : !1
        }, editLabels: f
    }
}();
wpd.dataPointLabelEditor = function () {
    function a() {
        var f = document.getElementById("data-point-label-field").value;
        if (null != f && 0 < f.length) {
            var g = c.getPixel(d), h = {};
            null != g.metadata && (h = g.metadata);
            h.label = f;
            c.setMetadataAt(d, h);
            wpd.graphicsWidget.resetData();
            wpd.graphicsWidget.forceHandlerRepaint()
        }
        wpd.popup.close("data-point-label-editor");
        wpd.graphicsWidget.setTool(e)
    }

    function b() {
        wpd.popup.close("data-point-label-editor");
        wpd.graphicsWidget.setTool(e)
    }

    var c, d, e;
    return {
        show: function (f, g, h) {
            var k = f.getPixel(g).metadata.label;
            c = f;
            d = g;
            e = h;
            wpd.graphicsWidget.removeTool();
            wpd.popup.show("data-point-label-editor");
            f = document.getElementById("data-point-label-field");
            f.value = k;
            f.focus()
        }, ok: a, cancel: b, keydown: function (f) {
            wpd.keyCodes.isEnter(f.keyCode) ? a() : wpd.keyCodes.isEsc(f.keyCode) && b();
            f.stopPropagation()
        }
    }
}();
wpd.dataPointValueOverrideEditor = function () {
    function a(q, r, t, x) {
        k = q;
        l = r;
        m = t;
        n = x;
        p = r.getAxesLabels().map(function (u) {
            return u.toLowerCase()
        }).filter(function (u) {
            return "label" !== u
        });
        document.getElementById("data-point-value-override-editor-table").innerHTML = b();
        wpd.graphicsWidget.removeTool();
        q.selectPixels(t);
        x.displayMask();
        wpd.graphicsWidget.forceHandlerRepaint();
        window.addEventListener("keydown", d, !1)
    }

    function b() {
        var q = "";
        p.forEach(function (r) {
            var t = wpd.utils.toSentenceCase(r);
            l instanceof wpd.BarAxes &&
            "y" === r && (t = wpd.utils.toSentenceCase("value"));
            q += "<tr>";
            q += "<td>";
            q += '<span id="data-point-value-override-field-label-' + r + '">';
            q += t + "</span>:";
            q += "</td>";
            q += "<td>";
            q += '<input type="text" id="data-point-value-override-field-' + r + '"';
            q += ' onkeydown="wpd.dataPointValueOverrideEditor.keydown(event);" />';
            q += "</td>";
            q += "<td>";
            q += '<span id="data-point-value-override-indicator-' + r + '"';
            q += " hidden>&#8682;</span>";
            q += "</td>";
            q += "</tr>"
        });
        return q
    }

    function c() {
        m.forEach(function (q) {
            if ("1" !== document.getElementById("data-point-value-override-revert-flag").value) {
                var r =
                    k.getPixel(q), t = e(r), x = {}, u = {};
                null != r.metadata && (x = r.metadata, r.metadata.hasOwnProperty("overrides") && (u = x.overrides));
                var y = k.getMetadataKeys(), v = {}, z = !1;
                p.forEach(function (A) {
                    var E = document.getElementById("data-point-value-override-field-" + A).value;
                    t[A] != E && (null != E && 0 < E.length ? (z = !0, isNaN(E) || (E = parseFloat(E)), v[A] = E, 0 > y.indexOf("overrides") && k.setMetadataKeys([].concat($jscomp.arrayFromIterable(y), ["overrides"]))) : u.hasOwnProperty(A) && (z = !0, v[A] = u[A]))
                });
                z ? (x.overrides = v, k.setMetadataAt(q, x),
                    wpd.graphicsWidget.resetData()) : f(q)
            } else f(q)
        });
        g()
    }

    function d(q) {
        wpd.keyCodes.isEnter(q.keyCode) ? c() : wpd.keyCodes.isEsc(q.keyCode) && g();
        q.stopPropagation()
    }

    function e(q) {
        return l.pixelToData(q.x, q.y).reduce(function (r, t, x) {
            var u = {};
            return Object.assign({}, r, (u[p[x]] = t, u))
        }, {})
    }

    function f(q) {
        var r = void 0;
        l instanceof wpd.BarAxes ? (r = k.getPixel(q).metadata, delete r.overrides, k.getAllPixels().some(function (t) {
            return t.metadata && t.metadata.hasOwnProperty("overrides") ? !0 : !1
        }) || k.setMetadataKeys(k.getMetadataKeys().filter(function (t) {
            return "overrides" !==
                t
        }))) : k.hasMetadata() || k.setMetadataKeys([]);
        k.setMetadataAt(q, r)
    }

    function g() {
        h(!1);
        window.removeEventListener("keydown", d, !1);
        wpd.popup.close("data-point-value-override-editor");
        wpd.graphicsWidget.setTool(n);
        n.toggleOverrideSection(m);
        wpd.graphicsWidget.forceHandlerRepaint()
    }

    function h(q) {
        var r = "0";
        q && (r = "1");
        document.getElementById("data-point-value-override-revert-flag").value = r
    }

    var k, l, p, m, n;
    return {
        show: function (q, r, t, x) {
            a(q, r, t, x);
            wpd.popup.show("data-point-value-override-editor");
            var u = {},
                y = {}, v = {}, z = {};
            p.forEach(function (A) {
                y[A] = !0;
                v[A] = !1;
                z[A] = []
            });
            t.forEach(function (A) {
                A = q.getPixel(A);
                var E = e(A), F = {};
                null != A.metadata && A.metadata.hasOwnProperty("overrides") && (F = A.metadata.overrides);
                p.forEach(function (H) {
                    F.hasOwnProperty(H) ? (u[H] = F[H], z[H].push(F[H]), v[H] = !0) : (u[H] = E[H], y[H] = !1)
                })
            });
            p.forEach(function (A) {
                var E = document.getElementById("data-point-value-override-field-" + A),
                    F = document.getElementById("data-point-value-override-indicator-" + A);
                v[A] ? (y[A] ? z[A].every(function (H) {
                    return H ===
                        z[A][0]
                }) ? E.value = u[A] : E.placeholder = "Multiple override values" : E.placeholder = "Some values overridden", F.hidden = !1) : (1 === t.length ? E.value = u[A] : E.placeholder = "Multiple points selected", F.hidden = !0)
            })
        }, ok: c, cancel: function () {
            g()
        }, keydown: d, clear: function () {
            h(!0);
            m.forEach(function (q) {
                var r = e(k.getPixel(q));
                p.forEach(function (t) {
                    var x = document.getElementById("data-point-value-override-field-" + t);
                    if (1 < m.length) {
                        var u = "";
                        x.placeholder = "Multiple points selected"
                    } else u = r[t];
                    document.getElementById("data-point-value-override-field-" +
                        t).value = u;
                    document.getElementById("data-point-value-override-indicator-" + t).hidden = !0
                })
            })
        }
    }
}();
wpd = wpd || {};
wpd.measurementModes = {
    distance: {
        name: "distance",
        connectivity: 2,
        addButtonId: "add-pair-button",
        deleteButtonId: "delete-pair-button",
        sidebarId: "measure-distances-sidebar",
        init: function () {
            var a = wpd.appData.getPlotData(), b = wpd.appData.getFileManager(),
                c = b.filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.DistanceMeasurement));
            if (wpd.appData.isMultipage()) {
                var d = wpd.appData.getPageManager();
                if (0 == d.filterToCurrentPageMeasurements(c).length) {
                    c = new wpd.DistanceMeasurement;
                    var e = d.getCurrentPageAxes();
                    if (0 < e.length) for (var f = e.length - 1; -1 < f; f--) if (e[f] instanceof wpd.MapAxes || e[f] instanceof wpd.ImageAxes) {
                        a.setAxesForMeasurement(c, e[f]);
                        break
                    }
                    a.addMeasurement(c, !0);
                    b.addMeasurementsToCurrentFile([c]);
                    d.addMeasurementsToCurrentPage([c])
                }
            } else 0 == c.length && (d = new wpd.DistanceMeasurement, a.addMeasurement(d), b.addMeasurementsToCurrentFile([d]))
        },
        clear: function () {
            var a = wpd.appData.getPlotData(), b = wpd.appData.getFileManager(),
                c = b.filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.DistanceMeasurement));
            if (wpd.appData.isMultipage()) {
                var d = wpd.appData.getPageManager();
                c = d.filterToCurrentPageMeasurements(c);
                d.deleteMeasurementsFromCurrentPage(c)
            }
            b.deleteMeasurementsFromCurrentFile(c);
            c.forEach(function (e) {
                e.clearAll()
            });
            a.deleteMeasurement(c[0]);
            wpd.tree.refresh()
        },
        getData: function () {
            var a = wpd.appData.getPlotData();
            a = wpd.appData.getFileManager().filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.DistanceMeasurement));
            wpd.appData.isMultipage() && (a = wpd.appData.getPageManager().filterToCurrentPageMeasurements(a));
            return a[0]
        },
        getAxes: function () {
            var a = wpd.appData.getPlotData(),
                b = wpd.appData.getFileManager().filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.DistanceMeasurement));
            wpd.appData.isMultipage() && (b = wpd.appData.getPageManager().filterToCurrentPageMeasurements(b));
            return a.getAxesForMeasurement(b[0])
        },
        changeAxes: function (a) {
            var b = wpd.appData.getPlotData(),
                c = wpd.appData.getFileManager().filterToCurrentFileMeasurements(b.getMeasurementsByType(wpd.DistanceMeasurement));
            wpd.appData.isMultipage() &&
            (c = wpd.appData.getPageManager().filterToCurrentPageMeasurements(c));
            c = c[0];
            var d = b.getAxesColl();
            -1 == a ? b.setAxesForMeasurement(c, null) : b.setAxesForMeasurement(c, d[a]);
            wpd.tree.refreshPreservingSelection(!0)
        }
    }, angle: {
        name: "angle",
        connectivity: 3,
        addButtonId: "add-angle-button",
        deleteButtonId: "delete-angle-button",
        sidebarId: "measure-angles-sidebar",
        init: function () {
            var a = wpd.appData.getPlotData(), b = wpd.appData.getFileManager(),
                c = b.filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.AngleMeasurement));
            if (wpd.appData.isMultipage()) {
                var d = wpd.appData.getPageManager();
                0 == d.filterToCurrentPageMeasurements(c).length && (c = new wpd.AngleMeasurement, a.addMeasurement(c, !0), b.addMeasurementsToCurrentFile([c]), d.addMeasurementsToCurrentPage([c]))
            } else 0 == c.length && (d = new wpd.AngleMeasurement, a.addMeasurement(d), b.addMeasurementsToCurrentFile([d]))
        },
        clear: function () {
            var a = wpd.appData.getPlotData(), b = wpd.appData.getFileManager(),
                c = b.filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.AngleMeasurement));
            b.deleteMeasurementsFromCurrentFile(c);
            wpd.appData.isMultipage() && (b = wpd.appData.getPageManager(), c = b.filterToCurrentPageMeasurements(c), b.deleteMeasurementsFromCurrentPage(c));
            c.forEach(function (d) {
                d.clearAll()
            });
            a.deleteMeasurement(c[0]);
            wpd.tree.refresh()
        },
        getData: function () {
            var a = wpd.appData.getPlotData();
            a = wpd.appData.getFileManager().filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.AngleMeasurement));
            wpd.appData.isMultipage() && (a = wpd.appData.getPageManager().filterToCurrentPageMeasurements(a));
            return a[0]
        }
    }, area: {
        name: "area",
        connectivity: -1,
        addButtonId: "add-polygon-button",
        deleteButtonId: "delete-polygon-button",
        sidebarId: "measure-area-sidebar",
        init: function () {
            var a = wpd.appData.getPlotData(), b = wpd.appData.getFileManager(),
                c = b.filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.AreaMeasurement));
            if (wpd.appData.isMultipage()) {
                var d = wpd.appData.getPageManager();
                c = d.filterToCurrentPageMeasurements(c);
                0 == c.length && (c = new wpd.AreaMeasurement, a.addMeasurement(c, !0), b.addMeasurementsToCurrentFile([c]),
                    d.addMeasurementsToCurrentPage([c]))
            } else 0 == c.length && (d = new wpd.AreaMeasurement, a.addMeasurement(d), b.addMeasurementsToCurrentFile([d]))
        },
        clear: function () {
            var a = wpd.appData.getPlotData(), b = wpd.appData.getFileManager(),
                c = b.filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.AreaMeasurement));
            if (wpd.appData.isMultipage()) {
                var d = wpd.appData.getPageManager();
                c = d.filterToCurrentPageMeasurements(c);
                d.deleteMeasurementsFromCurrentPage(c)
            }
            b.deleteMeasurementsFromCurrentFile(c);
            c.forEach(function (e) {
                e.clearAll()
            });
            a.deleteMeasurement(c[0]);
            wpd.tree.refresh()
        },
        getData: function () {
            var a = wpd.appData.getPlotData();
            a = wpd.appData.getFileManager().filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.AreaMeasurement));
            wpd.appData.isMultipage() && (a = wpd.appData.getPageManager().filterToCurrentPageMeasurements(a));
            return a[0]
        },
        getAxes: function () {
            var a = wpd.appData.getPlotData(),
                b = wpd.appData.getFileManager().filterToCurrentFileMeasurements(a.getMeasurementsByType(wpd.AreaMeasurement));
            wpd.appData.isMultipage() &&
            (b = wpd.appData.getPageManager().filterToCurrentPageMeasurements(b));
            return a.getAxesForMeasurement(b[0])
        },
        changeAxes: function (a) {
            var b = wpd.appData.getPlotData(),
                c = wpd.appData.getFileManager().filterToCurrentFileMeasurements(b.getMeasurementsByType(wpd.AreaMeasurement));
            wpd.appData.isMultipage() && (c = wpd.appData.getPageManager().filterToCurrentPageMeasurements(c));
            c = c[0];
            var d = b.getAxesColl();
            -1 == a ? b.setAxesForMeasurement(c, null) : b.setAxesForMeasurement(c, d[a]);
            wpd.tree.refreshPreservingSelection(!0)
        }
    }
};
wpd.measurement = function () {
    var a;
    return {
        start: function (b) {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.resetData();
            b.init();
            wpd.sidebar.show(b.sidebarId);
            wpd.graphicsWidget.setTool(new wpd.AddMeasurementTool(b));
            wpd.graphicsWidget.setRepainter(new wpd.MeasurementRepainter(b));
            wpd.graphicsWidget.forceHandlerRepaint();
            a = b
        }, addItem: function () {
            wpd.graphicsWidget.setRepainter(new wpd.MeasurementRepainter(a));
            wpd.graphicsWidget.setTool(new wpd.AddMeasurementTool(a))
        }, deleteItem: function () {
            wpd.graphicsWidget.setRepainter(new wpd.MeasurementRepainter(a));
            wpd.graphicsWidget.setTool(new wpd.DeleteMeasurementTool(a))
        }, clearAll: function () {
            wpd.graphicsWidget.removeTool();
            wpd.graphicsWidget.resetData();
            a.clear()
        }, changeAxes: function (b) {
            a.changeAxes(parseInt(b, 10))
        }
    }
}();
wpd = wpd || {};
wpd.PageManager = function () {
    this.handle = null;
    this.maxPage = this.minPage = this.curPage = 0;
    this.customLabelsByPage = {};
    this.axesByPage = {};
    this.datasetsByPage = {};
    this.measurementsByPage = {};
    this.$pageSelector = document.getElementById("image-page-nav-select");
    this.$pageRelabelInput = document.getElementById("image-page-relabel-input");
    this.$pageRelabelAllCheckbox = document.getElementById("image-page-relabel-all-checkbox");
    this.$pageRelabelSetButton = document.getElementById("image-page-relabel-set-button");
    this.$pageRelabelDeleteButton =
        document.getElementById("image-page-relabel-delete-button");
    this.$pageRelabelDeleteAllButton = document.getElementById("image-page-relabel-delete-all-button")
};
wpd.PageManager.prototype.init = function (a, b) {
    this.handle = a;
    this.minPage = this.curPage = 1;
    this.maxPage = this.pageCount();
    b || this._initializeInput();
    return this
};
wpd.PageManager.prototype._initializeInput = function () {
    var a = this, b = wpd.utils.integerRange(this.maxPage, this.minPage), c = this.curPage;
    this.getPageLabels().then(function (d) {
        var e = [];
        b.forEach(function (f) {
            var g = f - 1, h = f;
            a.customLabelsByPage.hasOwnProperty(f) ? h = a.customLabelsByPage[f] + " (page " + f + " within file)" : null !== d && (h = d[g] + " (page " + f + " within file)");
            e.push(h)
        }, a);
        a.$pageSelector.innerHTML = wpd.utils.createOptionsHTML(e, b, c)
    })
};
wpd.PageManager.prototype.refreshInput = function () {
    this._initializeInput();
    this._resetRelabelPopup()
};
wpd.PageManager.prototype.validateLabel = function (a) {
    "" !== a ? (this.$pageRelabelSetButton.disabled = !1, wpd.utils.isInteger(a) ? (this.$pageRelabelAllCheckbox.disabled = !1, this.$pageRelabelAllCheckbox.parentElement.style = "color: black;") : (this.$pageRelabelAllCheckbox.checked = !1, this.$pageRelabelAllCheckbox.disabled = !0, this.$pageRelabelAllCheckbox.parentElement.style = "color: lightgray;")) : this.$pageRelabelSetButton.disabled = !0
};
wpd.PageManager.prototype._resetRelabelPopup = function () {
    this.$pageRelabelInput.value = "";
    this.$pageRelabelAllCheckbox.checked = !1;
    this.$pageRelabelAllCheckbox.disabled = !0;
    this.$pageRelabelAllCheckbox.parentElement.style = "color: lightgray;";
    this.$pageRelabelSetButton.disabled = !0;
    Object.keys(this.customLabelsByPage).length ? (this.$pageRelabelDeleteAllButton.disabled = !1, this.customLabelsByPage.hasOwnProperty(this.curPage) ? this.$pageRelabelDeleteButton.disabled = !1 : this.$pageRelabelDeleteButton.disabled =
        !0) : (this.$pageRelabelDeleteButton.disabled = !0, this.$pageRelabelDeleteAllButton.disabled = !0)
};
wpd.PageManager.prototype.setLabel = function () {
    var a = this, b = this.$pageRelabelInput.value;
    if ("" !== b) {
        if (this.$pageRelabelAllCheckbox.checked) {
            var c = wpd.utils.integerRange(this.maxPage, this.minPage), d = b - this.curPage;
            c.forEach(function (e) {
                return a.customLabelsByPage[e] = e + d
            }, this)
        } else this.customLabelsByPage[this.curPage] = b;
        this._initializeInput();
        wpd.popup.close("image-page-relabel-popup");
        this._resetRelabelPopup()
    }
};
wpd.PageManager.prototype.deleteLabel = function (a) {
    a ? this.customLabelsByPage = {} : delete this.customLabelsByPage[this.curPage];
    this._initializeInput();
    wpd.popup.close("image-page-relabel-popup");
    this._resetRelabelPopup()
};
wpd.PageManager.prototype.get = function () {
    return this.handle
};
wpd.PageManager.prototype.getPage = function () {
};
wpd.PageManager.prototype.pageCount = function () {
    return 0
};
wpd.PageManager.prototype.getPageLabels = function () {
    return new Promise(function (a) {
        return a(null)
    })
};
wpd.PageManager.prototype.currentPage = function () {
    return this.curPage
};
wpd.PageManager.prototype.previous = function () {
    this.switch(this.curPage - 1)
};
wpd.PageManager.prototype.next = function () {
    this.switch(this.curPage + 1)
};
wpd.PageManager.prototype.switch = function (a) {
    a = void 0 === a ? 1 : a;
    wpd.busyNote.show();
    var b = parseInt(a, 10);
    if (!this._validatePageNumber(b)) return wpd.busyNote.close(), wpd.messagePopup.show("Error", "Invalid page number."), !1;
    this.curPage = b;
    this.$pageSelector.value = b;
    var c = this.getAxesNameMap();
    a = Object.keys(c).some(function (d) {
        return c[d] === b
    });
    this.renderPage(b, a);
    this._resetRelabelPopup()
};
wpd.PageManager.prototype._validatePageNumber = function (a) {
    return a >= this.minPage && a <= this.maxPage
};
wpd.PageManager.prototype._pageRenderer = function (a, b, c, d) {
};
wpd.PageManager.prototype.renderPage = function (a, b) {
    var c = this;
    return new Promise(function (d, e) {
        c.getPage(a).then(function (f) {
            c._pageRenderer(f, b, d, e)
        })
    })
};
wpd.PageManager.prototype._getCurrentPageObjects = function (a) {
    return a[this.curPage] ? a[this.curPage] : []
};
wpd.PageManager.prototype.getCurrentPageAxes = function () {
    return this._getCurrentPageObjects(this.axesByPage)
};
wpd.PageManager.prototype.getCurrentPageDatasets = function () {
    return this._getCurrentPageObjects(this.datasetsByPage)
};
wpd.PageManager.prototype.addAxesToCurrentPage = function (a) {
    wpd.utils.addToCollection(this.axesByPage, this.curPage, a)
};
wpd.PageManager.prototype.addDatasetsToCurrentPage = function (a) {
    wpd.utils.addToCollection(this.datasetsByPage, this.curPage, a)
};
wpd.PageManager.prototype.addMeasurementsToCurrentPage = function (a) {
    wpd.utils.addToCollection(this.measurementsByPage, this.curPage, a)
};
wpd.PageManager.prototype.deleteAxesFromCurrentPage = function (a) {
    wpd.utils.deleteFromCollection(this.axesByPage, this.curPage, a)
};
wpd.PageManager.prototype.deleteDatasetsFromCurrentPage = function (a) {
    wpd.utils.deleteFromCollection(this.datasetsByPage, this.curPage, a)
};
wpd.PageManager.prototype.deleteMeasurementsFromCurrentPage = function (a) {
    wpd.utils.deleteFromCollection(this.measurementsByPage, this.curPage, a)
};
wpd.PageManager.prototype.getAxesNameMap = function () {
    return wpd.utils.invertObject(this.axesByPage)
};
wpd.PageManager.prototype.getDatasetNameMap = function () {
    return wpd.utils.invertObject(this.datasetsByPage)
};
wpd.PageManager.prototype.filterToCurrentPageAxes = function (a) {
    return wpd.utils.filterCollection(this.axesByPage, this.curPage, a)
};
wpd.PageManager.prototype.filterToCurrentPageDatasets = function (a) {
    return wpd.utils.filterCollection(this.datasetsByPage, this.curPage, a)
};
wpd.PageManager.prototype.filterToCurrentPageMeasurements = function (a) {
    return wpd.utils.filterCollection(this.measurementsByPage, this.curPage, a)
};
wpd.PageManager.prototype.getMeasurementPageMap = function () {
    return this.measurementsByPage
};
wpd.PageManager.prototype.getPageLabelMap = function () {
    return this.customLabelsByPage
};
wpd.PageManager.prototype.loadPageData = function (a) {
    this.axesByPage = a.axes || {};
    this.datasetsByPage = a.datasets || {};
    this.measurementsByPage = a.measurements || {};
    this.customLabelsByPage = a.pageLabels || {}
};
wpd.PDFManager = function () {
    wpd.PageManager.apply(this, arguments)
};
$jscomp.inherits(wpd.PDFManager, wpd.PageManager);
wpd.PDFManager.prototype.getPage = function (a) {
    return this.handle.getPage(a)
};
wpd.PDFManager.prototype.getPageLabels = function () {
    return this.handle.getPageLabels()
};
wpd.PDFManager.prototype.pageCount = function () {
    return this.handle.numPages
};
wpd.PDFManager.prototype._pageRenderer = function (a, b, c, d) {
    var e = a.getViewport({scale: 3}), f = document.createElement("canvas"), g = f.getContext("2d");
    f.width = e.width;
    f.height = e.height;
    a.render({canvasContext: g, viewport: e}).promise.then(function () {
        var h = f.toDataURL();
        wpd.imageManager.loadFromURL(h, b).then(c)
    }, function (h) {
        console.log(h);
        wpd.busyNote.close();
        d(h)
    })
};
wpd = wpd || {};
wpd.UndoManager = function () {
    this._actions = [];
    this._actionIndex = 0
};
wpd.UndoManager.prototype.canUndo = function () {
    return 0 < this._actionIndex && this._actions.length >= this._actionIndex
};
wpd.UndoManager.prototype.undo = function () {
    this.canUndo() && (this._actionIndex--, this._actions[this._actionIndex].undo(), this.updateUI())
};
wpd.UndoManager.prototype.canRedo = function () {
    return this._actions.length > this._actionIndex
};
wpd.UndoManager.prototype.redo = function () {
    this.canRedo() && (this._actions[this._actionIndex].execute(), this._actionIndex++, this.updateUI())
};
wpd.UndoManager.prototype.reapply = function () {
    if (this.canUndo()) {
        for (var a = 0; a < this._actionIndex; a++) this._actions[a].execute();
        this.updateUI()
    }
};
wpd.UndoManager.prototype.insertAction = function (a) {
    a instanceof wpd.ReversibleAction ? (this.canRedo() && (this._actions.length = this._actionIndex), this._actions.push(a), this._actionIndex++, this.updateUI()) : console.error("action must be a wpd.ReversibleAction!")
};
wpd.UndoManager.prototype.clear = function () {
    this._actions = [];
    this._actionIndex = 0;
    this.updateUI()
};
wpd.UndoManager.prototype.updateUI = function () {
    var a = document.getElementById("image-editing-undo"), b = document.getElementById("image-editing-redo");
    this.canUndo() ? a.disabled = !1 : a.disabled = !0;
    this.canRedo() ? b.disabled = !1 : b.disabled = !0
};
wpd = wpd || {};
wpd.utils = function () {
    return {
        addToCollection: function (a, b, c) {
            a[b] || (a[b] = []);
            Array.prototype.push.apply(a[b], c)
        }, createOptionsHTML: function (a, b, c) {
            a.length !== b.length && console.error("labels and values length mismatch");
            for (var d = "", e = 0; e < a.length; e++) d += '<option value="' + b[e] + '"', b[e] === c && (d += " selected"), d += ">" + a[e] + "</option>";
            return d
        }, deleteFromCollection: function (a, b, c) {
            a[b] && c.forEach(function (d) {
                d = a[b].indexOf(d);
                -1 < d && a[b].splice(d, 1)
            })
        }, filterCollection: function (a, b, c) {
            var d = [];
            a[b] && (d =
                c.filter(function (e) {
                    return -1 < a[b].indexOf(e)
                }));
            return d
        }, findKey: function (a, b) {
            for (var c in a) if (-1 < a[c].indexOf(b)) return parseInt(c, 10)
        }, integerRange: function (a, b) {
            b = void 0 === b ? 0 : b;
            return Array.apply(null, Array(a)).map(function (c, d) {
                return d + b
            })
        }, invertObject: function (a) {
            var b = {};
            Object.entries(a).forEach(function (c) {
                c = $jscomp.makeIterator(c);
                var d = c.next().value;
                c.next().value.forEach(function (e) {
                    return b[e.name] = parseInt(d, 10)
                })
            });
            return b
        }, isInteger: function (a) {
            return /^-?[1-9]\d*$|^0$/.test(a)
        },
        toggleElementsDisplay: function (a, b) {
            a = $jscomp.makeIterator(a);
            for (var c = a.next(); !c.done; c = a.next()) c.value.hidden = b
        }, toSentenceCase: function (a) {
            return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase()
        }
    }
}();


