# Publishing Packages

Libraries `core`, `instagram` and `linkedin` are built and published.

> default Nx configuration is set to Node so short-hand syntax will generate a node based app or library

## Publish Process

Step 1. Build the package i.e. `core`

```bash
nx build core
```

Step 2. Make package.json peer dependency version tweaks (see below)

Step 3. Publish with public access
cd into a distribution library folder i.e. `/dist/libs/core` then run:
```bash
npm publish --access public
```
[Read more](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#publishing-scoped-public-packages)


## package.json Specific Tweaks

### Core

Since the other packages are secondary to Core, only Core sets a Peer Dependency for Puppeteer, while the others set Core as their Peer Dependency.

Sync the lib's package.json's `puppeteer` version with the main repo's.

### Instagram

Sync the lib's package.json's `@botmation/core` version with the correct one.

### LinkedIn

Sync the lib's package.json's `@botmation/core` version with the correct one.

### Twitter

Sync the lib's packge.json's `@botmation/core` version with correct one.

# Add new Publishable Package

Command to scaffold a new package for an example library called `acme`:
```bash
nx g lib acme --buildable --publishable --importPath=@botmation/acme
```
## Package Versioning

[Semantic Versioning](https://semver.org/) with the Major version number anchored to `@botmation/core` starting at v1.0.0

For example, if Core is at v1.0.0. Then releases a new update with a breaking API change, so v2.0.0. All the auxiliary packages can keep releasing v1.x.x, but once they are updated to work with Core v2.x, their major version is updated to match the major version of Core, v2.x.

That way compatiblity between libraries can be more easily managed. As long as the major version numbers are the same, all @botmation packages should be compatible, minus a feature or bug fix.
