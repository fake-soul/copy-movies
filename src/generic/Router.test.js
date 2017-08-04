import Router, {
    ERROR_NOT_INITIALISED,
    ERROR_INVALID_ROUTES,
    ERROR_INVALID_PATH,
    ERROR_NOT_FOUND
} from './Router';

import Capture from './Capture';
import Route   from './Route';

import chai, {assert} from 'chai';
import deepEqual from 'chai-shallow-deep-equal';

chai.use(deepEqual);

describe('Router', () => {
    it('should return a `Router` instance when instantiated', () => {
        const router = new Router();

        assert.instanceOf(router, Router);
    });

    it('should throw an error if used before initialisation', () => {
        const router = new Router();

        assert.throws(() => router.findMatchingRoute('/'), ERROR_NOT_INITIALISED);
    });

    describe('#init()', () => {
        it('should throw an error if consumer-provided routes are invalid', () => {
            const router = new Router();

            assert.throws(() => router.init(void(0)), ERROR_INVALID_ROUTES);
        });

        it('should throw an error if no routes are passed', () => {
            const router = new Router();

            assert.throws(() => router.init([]), ERROR_INVALID_ROUTES);
        });

        it('should map consumer-provided routes in an array of `Route` instances', () => {
            const router = new Router();

            router.init([
                {
                    pattern: '/',
                    action: null
                }
            ]);

            assert.equal(router.routes.length, 1);
            assert.instanceOf(router.routes[0], Route);
            assert.equal(router.routes[0].pattern, '/');
        });

        it('should parse consumer-provided routes in an array of built `Capture` instances', () => {
            const router = new Router();

            router.init([
                {pattern: '/'}
            ]);

            assert.equal(router.captures.length, 1);
            assert.instanceOf(router.captures[0], Capture);
            assert.deepEqual(router.captures[0].re, /^\/$/g);
        });
    });

    describe('#findMatchingRoute', () => {
        it('should throw an error if an invalid path is passed', () => {
            const router = new Router();

            router.init([
                {pattern: '/'}
            ]);

            assert.throws(() => router.findMatchingRoute(void(0)), ERROR_INVALID_PATH);
        });

        it('should throw an error if no matching route is found', () => {
            const router = new Router();

            router.init([
                {pattern: '/'}
            ]);

            assert.throws(() => router.findMatchingRoute('/foo/'), ERROR_NOT_FOUND);
        });

        it('should return a populated instance of a `Route` for matching paths', () => {
            const router = new Router();
            const action = () => (void(0));

            router.init([
                {pattern: '/', action}
            ]);

            const route = router.findMatchingRoute('/');

            assert.instanceOf(route, Route);
            assert.equal(route.pattern, '/');
            assert.equal(route.action, action);
        });

        it('should return a populated instance of a `Route` for matching paths with dynamic segments', () => {
            const router = new Router();

            router.init([
                {pattern: '/:dynamicSegment/'}
            ]);

            const route = router.findMatchingRoute('/foo/');

            assert.instanceOf(route, Route);
            assert.equal(route.pattern, '/:dynamicSegment/');
            assert.equal(route.request.path, '/foo/');
            assert.equal(route.request.params.dynamicSegment, 'foo');
        });

        it('should parse an associated query string into a hash', () => {
            const router = new Router();

            router.init([
                {pattern: '/:dynamicSegment/'}
            ]);

            const route = router.findMatchingRoute('/foo/', '?bar=baz');

            assert.instanceOf(route, Route);
            assert.equal(route.pattern, '/:dynamicSegment/');
            assert.equal(route.request.path, '/foo/');
            assert.equal(route.request.params.dynamicSegment, 'foo');
            assert.equal(route.request.queryString, '?bar=baz');
            assert.equal(route.request.query.bar, 'baz');
        });

        it('should sanitize the provided path', () => {
            const router = new Router();

            router.init([
                {pattern: '/required-segment/'}
            ]);

            const route = router.findMatchingRoute(' /required-segment ');

            assert.instanceOf(route, Route);
            assert.equal(route.request.path, '/required-segment/');
        });
    });
});