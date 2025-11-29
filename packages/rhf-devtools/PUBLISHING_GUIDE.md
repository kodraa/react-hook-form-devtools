# Publishing Guide for react-hook-form-devtools

This guide will walk you through publishing the package to npm.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/) if you don't have one
2. **Login to NPM**: Run `npm login` in your terminal and enter your credentials
3. **Package Name**: The package name `react-hook-form-devtools` might be taken. Check availability:
   ```bash
   npm view react-hook-form-devtools
   ```
   If it's taken, update the `name` field in `package.json` to something unique like:
   - `@yourusername/react-hook-form-devtools`
   - `rhf-devtools`
   - `react-hook-form-dev-tools`

## Step-by-Step Publishing

### 1. Install Dependencies

Navigate to the package directory and install dependencies:

```bash
cd packages/rhf-devtools
bun install
# or
npm install
```

### 2. Update Package Information

Edit `package.json` and update:

- `name`: Make sure it's unique (check npm registry)
- `version`: Start with `0.1.0` or `1.0.0`
- `author`: Your name or organization
- `repository.url`: Your GitHub repo URL
- `bugs.url`: Your GitHub issues URL
- `homepage`: Your GitHub repo homepage

Example:

```json
{
  "name": "@yourusername/react-hook-form-devtools",
  "version": "0.1.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/react-hook-form-devtools.git"
  }
}
```

### 3. Build the Package

```bash
bun run build
# or
npm run build
```

This will create a `dist` folder with:

- `index.js` (CommonJS)
- `index.mjs` (ESM)
- `index.d.ts` (TypeScript types)

### 4. Test Locally (Optional but Recommended)

Before publishing, test the package locally:

```bash
# In the package directory
npm link

# In a test project
npm link react-hook-form-devtools
# or your package name
```

### 5. Publish to NPM

#### For Public Package (Free):

```bash
npm publish --access public
```

#### For Scoped Package (@username/package):

```bash
npm publish --access public
```

### 6. Verify Publication

Check that your package is live:

```bash
npm view your-package-name
```

Or visit: `https://www.npmjs.com/package/your-package-name`

## Publishing Updates

When you make changes and want to publish a new version:

### 1. Update Version

Use semantic versioning (MAJOR.MINOR.PATCH):

```bash
# Patch release (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# Minor release (new features): 1.0.0 -> 1.1.0
npm version minor

# Major release (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

### 2. Build and Publish

```bash
bun run build
npm publish
```

## Using Your Published Package

After publishing, others can install it:

```bash
npm install your-package-name
# or
npm install @yourusername/react-hook-form-devtools
```

And use it:

```tsx
import { RHFDevtoolsPanel, RHFDevtools } from "your-package-name";
```

## Troubleshooting

### Package Name Already Taken

If the name is taken, either:

1. Use a scoped package: `@yourusername/react-hook-form-devtools`
2. Choose a different name: `rhf-devtools`, `react-hook-form-dev-tools`, etc.

### Publishing Fails

- Make sure you're logged in: `npm whoami`
- Check your email is verified on npmjs.com
- For scoped packages, use `--access public`

### Build Errors

- Ensure all dependencies are installed: `bun install`
- Check TypeScript errors: `tsc --noEmit`
- Verify tsup is installed: `bun add -D tsup`

## Best Practices

1. **Semantic Versioning**: Follow semver (MAJOR.MINOR.PATCH)
2. **Changelog**: Keep a CHANGELOG.md to track changes
3. **Git Tags**: Tag releases in git: `git tag v1.0.0`
4. **Test Before Publishing**: Always test locally first
5. **Documentation**: Keep README.md up to date
6. **License**: Include a LICENSE file (MIT is recommended)

## Automated Publishing (Optional)

You can automate publishing with GitHub Actions:

1. Create `.github/workflows/publish.yml`
2. Add npm token to GitHub secrets
3. Auto-publish on release or tag push

Example workflow:

```yaml
name: Publish to NPM
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Support

If you encounter issues:

1. Check [npm documentation](https://docs.npmjs.com/)
2. Verify package.json format
3. Ensure build succeeds locally
4. Check npm registry status

## Quick Commands Reference

```bash
# Login to npm
npm login

# Check if logged in
npm whoami

# Check package name availability
npm view package-name

# Install dependencies
bun install

# Build package
bun run build

# Test build output
ls -la dist/

# Publish (first time)
npm publish --access public

# Update version and publish
npm version patch
bun run build
npm publish

# View published package
npm view your-package-name
```
