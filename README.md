# express-asyncmw

Async handler for express.js

# How to Use

1. Import the library in your code

JavaScript

```js
const { asyncMw, errorAsyncMw } = require('express-asyncmw');
```

TypeScript

```ts
import { asyncMw, errorAsyncMw } from 'express-asyncmw';
```

2. Use the imported functions

JavaScript

```js
const { asyncMw, errorAsyncMw } = require('express-asyncmw');

// asyncMw for express middleware handling without any error
const getUserMw = asyncMw(async (req, res, next) => {
  // Do your things
  // ...
});

// errorAsyncMw for express middleware handling with an error
const getUserMw = errorAsyncMw(async (err, req, res, next) => {
  // Do your things
  // ...
});
```

TypeScript

```ts
import { asyncMw, errorAsyncMw } from 'express-asyncmw';

// asyncMw for express middleware handling without any error
const getUserMw = asyncMw(async (req, res, next) => {
  // Do your things
  // ...
});

// errorAsyncMw for express middleware handling with an error
const getUserMw = errorAsyncMw(async (err, req, res, next) => {
  // Do your things
  // ...
});
```
