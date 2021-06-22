# DOCGEN-NEXTJS

A simple doc generator for NextJS pages.

```bash
npx docgen-nextjs
```

will create a documentation for each and every page you have.

Add in your files:

```javascript
// __description__
```

to describe what the page is / does

```javascript
// __staticPaths__
```

to describe how the paths are generated

```javascript
// __staticProps__
```

to describe which props are going to be passed

TODO:

- Really analyze the paths (fallback ?)
- Really analyze the props (revalidate, etc.)
- maybe integrate with JSDOC
