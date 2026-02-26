This project imas to create a collection of Rancher's extension that will be
used in production environment to help SRE opevator in their tasks.

For this, small extensions is better since it will have good understantability
and an explicit documentation for future development.

Vue does not offer garbage collection so memery leaks needs to be watch for. But
it permit the usage of api to display information need for the team.

Need to see if it's possible to directly interact with kubernetes

The user who need to add extension need to have an account that can add extension
(need access to upstream's extension cluster)
(in preference -> advanced features -> Enable Extension developer features)
The application can use the same account as the user since at the first connection
it will ask for a connection.

Error enconters so far:

Problem with the command `API=<url> yarn dev` wich launch the app on localhost:8005
but this port seems to already be in used. Fixed -> change the port in package.json
by adding `"dev": "NODE_ENV=dev ./node_modules/.bin/vue-cli-service serve --port ${PORT:-8080}",` 
in the script part

Problem with the extension menu wich launch 
```Extension support is not enabled
Automatic installation is not available - required Helm Charts could not be found
```
Fixed -> update the package.json and revert seems to remove this error

Problem with the node/npm version wich make impossible for `yarn install` to completed
Fixed -> use the docker to have strictly the good version and don't modify it

Problem with the yarn dev environment with launch
```ERROR
[object Object]
handleError@https://localhost:8080/js/chunk-vendors.js:406831:58
./node_modules/webpack-dev-server/client/overlay.js/createOverlay/<@https://localhost:8080/js/chunk-vendors.js:406854:18
```
Fixed -> ?

Source

[Getting started with rancher extension](http://extensions.rancher.io/extensions/next/extensions-getting-started)
The official documentation will provoke crash even when stricty following the instruction
and the version. You really should stick with the docker

[Youtube follow along guide](https://www.youtube.com/watch?v=7xBUvNI__uc)

[Rancher ui Components](http://extensions.rancher.io/extensions/next/api/cards)

