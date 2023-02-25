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

# Using Additional Types

In case if you want to some sort of `intellisense` things for you types. Consider setting it up this way.

1. Import all the necessary things

```ts
import { asyncMw, AsyncParam } from 'express-asyncmw';

export const getUserMw = asyncMw(async (req, res, next) => {
  // Do your things
  // ...
});
```

2. Create the new additional types

```ts
type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};
```

3. Implement new types to `asyncMw`

```ts
import { asyncMw, AsyncParam } from 'express-asyncmw';

type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

export const getUserMw = asyncMw<{ extends: { user: User } }>(async (req, res, next) => {
  // Will gave an error since we already specified the types
  req.user.id = 'id'; // Type 'string' is not assignable to type 'number'.ts(2322)
  // `req.user` => User
});
```

4. Adding lot of types to `request` and `response` object

```ts
import { asyncMw } from 'express-asyncmw';

type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

type GetUserMwParam = {
  params: {
    id: string;
  };
  resBody: {
    status: number;
  };
  reqBody: {
    username: string;
  };
  reqQuery: {
    createdAt: string;
  };
  extends: {
    user: User;
  };
};

asyncMw<GetUserMwParam>((req, res, next) => {
  if (!req.params.id) return; // Params :id now exists in the types
  req.user.id = 'id'; // Type 'string' is not assignable to type 'number'.ts(2322)
  req.user.username = req.body.username; // Works since it has the same times which is a `string`
  res.json({
    status: '200', // Type 'string' is not assignable to type 'number'.ts(2322)
  });
});
```
