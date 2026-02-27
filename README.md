This project aims to create a collection of Rancher extensions that will be
used in a production environment to help SRE operators with their tasks.

a) For this, smaller extensions are better since they offer good understandability
and explicit documentation for future development. SO we'll need one project that will host
all of the extension.

b) Vue applications can suffer from memory leaks if resources are not properly managed, so memory usage needs to be watched specifically.
However, it permits the usage of APIs to display information needed by the team.

c) It doesn't seems to be possible to directly interract with the kubernetes environment,
you can interact through rancher

d) Users who need to add extensions must have an account with permission to add extensions
(needs access to the upstream extension cluster).
(In Preferences -> Advanced Features -> Enable Extension Developer Features)

The application can use the same account as the user, since at the first connection
it will ask for authentication.

Errors encountered so far:

Problem with the command `API=<url> yarn dev` which launches the app on localhost:8005
but this port seems to already be in use. 
Fixed -> change the port in package.json by adding:
`"dev": "NODE_ENV=dev ./node_modules/.bin/vue-cli-service serve --port ${PORT:-8080}",` 
in the scripts section.

Problem with the extension menu which launches:
```
Extension support is not enabled
Automatic installation is not available - required Helm Charts could not be found
```
Fixed -> updating the package.json and reverting seemed to remove this error.

Problem with the node/npm version which makes it impossible for `yarn install` to complete.
Fixed -> use Docker to have strictly the correct version and do not modify it.

Problem with the yarn dev environment which launches:
```ERROR
[object Object]
handleError@https://localhost:8080/js/chunk-vendors.js:406831:58
./node_modules/webpack-dev-server/client/overlay.js/createOverlay/<@https://localhost:8080/js/chunk-vendors.js:406854:18
```
Fixed -> ?

Source

[Getting started with rancher extension](http://extensions.rancher.io/extensions/next/extensions-getting-started)
The official documentation will provoke a crash even when strictly following the instructions
and the version. You really should stick with Docker.

[Youtube follow along guide](https://www.youtube.com/watch?v=7xBUvNI__uc)

[Rancher ui Components](http://extensions.rancher.io/extensions/next/api/cards)

