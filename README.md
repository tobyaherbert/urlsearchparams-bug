# URLSearchParams, the Fetch API, and Content-Type bug

This sample project demonstrates the bug caused by using a polyfilled `URLSearchParams` object in a *Fetch API* request.

When the following are true:
1. The `URLSearchParams` object has been polyfilled.
2. A *POST* request is made using the *Fetch API*.
3. The *POST* request's body is set to an instance of the polyfilled `URLSearchParams` object.
4. The *POST* request's `Content-Type` header has NOT been set manually.

The fetch request should set the `Content-Type` to `application/x-www-form-urlencoded` but instead chooses `text/plain`
which causes the request to be misunderstood by servers checking this header.

## Demo

This demo site has been published at
[urlsearchparams-bug.nialto.workers.dev](https://urlsearchparams-bug.nialto.workers.dev/).

Visiting the site with a browser that does not require the polyfill (such as Google Chrome and Safari on a mac) will
log messages to the console reflecting the expected behaviour. The correct `URLSearchParams` object will be returned
and the sample *POST* request will have used the correct `Content-Type` header of `application/x-www-form-urlencoded`.

However, visiting the site with a browser that does require the polyfill (such as Safari on iOS or the iOS Simulator)
will log messages to the console indicating a mysterious `o` type instead of the expected `URLSearchParams`, and the
sample *POST* request will have used the incorrect `Content-Type` header of `text/plain`.

