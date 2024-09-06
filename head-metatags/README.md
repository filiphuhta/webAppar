# Metatags in head element

Boilerplate code for a simple WebApp

## Developing

## Getting Started

1. run `npm install`
2. run `npm run build` and `npm run sign` if you should upload the app to a production server.

Configure the application with metadata attribute names as a comma separated `string` in the configuration. 

Example: `pageName,SV.title`.

This will first set `pageName`value as the content of the metatag `og:title` then `SV.Title` etc...

Html that will be added to the page `<head>` element:

```html
<meta property="og:title" content="{Value of the metadata attribute}"/>
```

## Building

- `npm run create-addon` creates an addon with the name configured in the setup task
- `npm run build` compresses `/src` into `/dist`. If you use babel to transpile your code, this target will compress a transpiled version of your `/src`
- `npm run build deploy` runs the build step and deploys to the addon configured in the setup task
- `npm run build force-deploy` runs the build step and deploys with the possibility to overwrite an existing WebApp
- `npm run dev` watches files for changes and runs `build force-deploy` on save
- `npm run sign` invokes the signing endpoint of the Sitevision developer REST API. A signed version of the WebApp will be created in the `/dist` folder
- `npm run deploy-prod` deploys the signed WebApp to a production environment
- `npm run setup-dev-properties` creates .dev-properties.json with information about the development environment

[Visit developer.sitevision.se for more information](https://developer.sitevision.se)
