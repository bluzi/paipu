
## paipu 
Piapue is Japanese for Pipe, and it's also a pipes library for Node. 

### Install
```
npm i paipu
```

### Usage

You can throw anything into the pipe:
* Functions and Promises will be evaluated and the result will be the context for the next pipe
* Other pipes will extend the current pipe
* Anything else will set the context for the rest of the pipe

To execute a pipe, call `resolve()` at the end of it.

### Examples
Simple pipe:
```js
const paipu = require('paipu');

const result = 
	await paipu
		.pipe('hello')
		.pipe(context => context.substr(0, 4))
		.resolve();

// Result = 'hell'
```

Pipe with promises:
```js
const  paipu  =  require('paipu');

const  result  =
	await paipu
		.pipe('abcdefg')
		.pipe(async context => context.substr(0, 3))
		.resolve();

// Result = 'abc'
```

Pipe with nested pipes:
```js
const paipu = require('paipu');

const encrypt =  
	paipu
		.pipe(context => context.replace('a', 'b'))
		.pipe(context => context.replace('c', 'd'))
  

const result =
	await paipu
		.pipe('abcdefg')
		.pipe(encrypt)
		.resolve();
		
// Result = 'bbddefg'
```

There are also before/after pipe hooks and aliases:
```js
const paipu = require('paipu');

paipu
	.beforePipe((alias, context) => console.log(`executing '${alias}'...`))
	.afterPipe((alias, context) => console.log(`'${alias}' has finished!`))
	.pipe('throw in a string', 'abcdefg')
	.pipe('cut that goddamn string', async context => context.substr(0, 3))
	.resolve();
```
And they will effect nested pipes too!

### Contribution

Any type of feedback, pull request or issue is welcome
