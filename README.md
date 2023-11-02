# My Bitburner Scripts

My remote editor config is based on [this template](https://github.com/NilsRamstoeck/bb-external-editor/)

## How to use
1. run `npm install` in your console to install all dependencies
2. run `npm start` in your console to start the RemoteAPI server
3. open Bitburner and navigate to the settings
4. open the tab labeled 'Remote API' and enter the port '12525'
5. press connect

Now any changes made to scripts inside the server folders will automatically be uploaded to Bitburner.

## Using React

The React and ReactDOM instance from the game can simply be imported as ESModules

```js
import React from 'react' //and
import ReactDOM from 'react-dom'
```

For more in-depth details have a look at the [plugin](https://github.com/NilsRamstoeck/esbuild-bitburner-plugin) powering this template!
