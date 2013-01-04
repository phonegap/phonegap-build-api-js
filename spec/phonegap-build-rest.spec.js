/*
 * Module dependencies.
 */

var client = require('../lib/client'),
    request = require('request');

/*
 * Specification for phonegap-build-rest client.
 */

describe('phonegap-build-rest', function() {
    describe('auth(options, callback)', function() {
        var options;

        it('should be a function', function() {
            expect(client.auth).toEqual(jasmine.any(Function));
        });

        describe('using username and password', function() {
            beforeEach(function() {
                options = { username: 'zelda', password: 'tr1force' };
            });

            it('should require options.username', function() {
                expect(function() {
                    options.username = undefined;
                    client.auth(options, function(e, api) {});
                }).toThrow();
            });

            it('should require options.password', function() {
                expect(function() {
                    options.password = undefined;
                    client.auth(options, function(e, api) {});
                }).toThrow();
            });

            it('should require callback', function() {
                expect(function() {
                    client.auth(options, null);
                }).toThrow();
            });

            it('should try to authenticate with server', function() {
                spyOn(request, 'post');
                client.auth(options, function(e, api) {});
                expect(request.post).toHaveBeenCalledWith(
                    'https://build.phonegap.com:443/token',
                    jasmine.any(Object),
                    jasmine.any(Function)
                );
            });

            describe('successful authentication', function() {
                beforeEach(function() {
                    spyOn(request, 'post').andCallFake(function(uri, opts, callback) {
                        callback(null, { statusCode: 200 }, '{ "token": "abc123" }');
                    });
                });

                it('should trigger callback without an error', function(done) {
                    client.auth(options, function(e, api) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with an API object', function(done) {
                    client.auth(options, function(e, api) {
                        expect(api).toBeDefined();
                        done();
                    });
                });
            });

            describe('failed authentication request', function() {
                beforeEach(function() {
                    spyOn(request, 'post').andCallFake(function(uri, opts, callback) {
                        callback(new Error('request timeout'), {}, '');
                    });
                });

                it('should trigger callback with an error', function(done) {
                    client.auth(options, function(e, api) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger callback without an API object', function(done) {
                    client.auth(options, function(e, api) {
                        expect(api).not.toBeDefined();
                        done();
                    });
                });
            });

            describe('failed authentication response', function() {
                beforeEach(function() {
                    spyOn(request, 'post').andCallFake(function(uri, opts, callback) {
                        callback(null, { statusCode: 404 }, '');
                    });
                });

                it('should trigger callback with an error', function(done) {
                    client.auth(options, function(e, api) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger callback without an API object', function(done) {
                    client.auth(options, function(e, api) {
                        expect(api).not.toBeDefined();
                        done();
                    });
                });
            });

            describe('failed authentication credentials', function() {
                beforeEach(function() {
                    spyOn(request, 'post').andCallFake(function(uri, opts, callback) {
                        callback(null, { statusCode: 200 }, ' { "error": "incorrect password" }');
                    });
                });

                it('should trigger callback with an error', function(done) {
                    client.auth(options, function(e, api) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger callback without an API object', function(done) {
                    client.auth(options, function(e, api) {
                        expect(api).not.toBeDefined();
                        done();
                    });
                });
            });
        });

        describe('using token', function() {
            beforeEach(function() {
                options = { token: 'abc123' };
            });

            it('should require options.token', function() {
                expect(function() {
                    options.token = undefined;
                    client.auth(options, function(e, api) {});
                }).toThrow();
            });

            it('should require callback', function() {
                expect(function() {
                    client.auth(options, null);
                }).toThrow();
            });

            it('should trigger callback without an error', function(done) {
                client.auth(options, function(e, api) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with an API object', function(done) {
                client.auth(options, function(e, api) {
                    expect(api).toBeDefined();
                    done();
                });
            });
        });
    });
});
