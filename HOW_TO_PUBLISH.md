# 🚀 How to Publish react-hook-form-devtools to NPM

## 📦 Your Package is Ready!

Location: `packages/rhf-devtools/`

Everything has been set up for you. Follow these simple steps to publish.

## 🎯 Quick Publish (5 Minutes)

### Step 1: Create NPM Account (if you don't have one)

1. Go to [npmjs.com](https://npmjs.com/)
2. Click "Sign Up"
3. Verify your email

### Step 2: Check Package Name Availability

```bash
# Check if the name is available
npm view react-hook-form-devtools
```

**If the name is taken**, you have two options:

#### Option A: Use a Scoped Package (Recommended)

```bash
cd packages/rhf-devtools
```

Edit `package.json` and change:

```json
{
  "name": "@yourusername/react-hook-form-devtools"
}
```

#### Option B: Choose a Different Name

Some alternatives:

- `rhf-devtools`
- `react-hook-form-dev-tools`
- `rhf-debug-tools`
- `@yourusername/rhf-devtools`

### Step 3: Update Package Information

Navigate to the package:

```bash
cd packages/rhf-devtools
```

Edit `package.json` and update these fields:

```json
{
  "name": "your-chosen-name", // ← Change this
  "version": "0.1.0", // ← Start with 0.1.0 or 1.0.0
  "author": "Your Name <email@example.com>", // ← Add your info
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/repo.git" // ← Your GitHub URL
  },
  "bugs": {
    "url": "https://github.com/yourusername/repo/issues" // ← Your issues URL
  },
  "homepage": "https://github.com/yourusername/repo#readme" // ← Your homepage
}
```

### Step 4: Build the Package

```bash
# Make sure you're in packages/rhf-devtools
bun run build
```

You should see output like:

```
✓ Build success
```

### Step 5: Login to NPM

```bash
npm login
```

Enter your:

- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Verify you're logged in:

```bash
npm whoami
```

### Step 6: Publish!

```bash
npm publish --access public
```

**That's it!** 🎉

Your package is now live at: `https://www.npmjs.com/package/your-package-name`

## 📖 After Publishing

### Install Your Package

Anyone can now install it:

```bash
npm install your-package-name
```

### Use Your Package

```tsx
import { RHFDevtoolsPanel, useRHFDevtools } from "your-package-name";
```

## 🔄 Publishing Updates

When you make changes:

1. **Update version**:

   ```bash
   npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
   npm version minor   # 1.0.0 → 1.1.0 (new features)
   npm version major   # 1.0.0 → 2.0.0 (breaking changes)
   ```

2. **Build**:

   ```bash
   bun run build
   ```

3. **Publish**:
   ```bash
   npm publish
   ```

## ❓ Common Issues

### "Package name already taken"

Use a scoped package: `@yourusername/react-hook-form-devtools`

### "You do not have permission to publish"

Make sure you're logged in: `npm whoami`

### "You need to verify your email"

Check your email and click the verification link from npm.

### Build fails

1. Make sure dependencies are installed: `bun install`
2. Check for TypeScript errors
3. Make sure you're in the right directory: `packages/rhf-devtools`

## 📚 Additional Resources

- **Detailed Guide**: See `packages/rhf-devtools/PUBLISHING_GUIDE.md`
- **Package Summary**: See `packages/rhf-devtools/PACKAGE_SUMMARY.md`
- **README**: See `packages/rhf-devtools/README.md`

## 🎊 Success Checklist

- [ ] NPM account created and verified
- [ ] Package name is available (or changed to unique name)
- [ ] Updated package.json with your information
- [ ] Build successful (`bun run build`)
- [ ] Logged into npm (`npm whoami` works)
- [ ] Published (`npm publish --access public`)
- [ ] Package visible on npmjs.com

## 🎯 What You Get

After publishing, your package will have:

- ✅ NPM page at npmjs.com
- ✅ Installable via npm/yarn/pnpm/bun
- ✅ Automatic documentation from README
- ✅ Version badges
- ✅ Download statistics

## 🔗 Share Your Package

After publishing, share it:

- On Twitter/X with #reactjs #npm
- On Reddit r/reactjs
- In React Discord servers
- On your blog/portfolio
- Add it to your GitHub README

## 💡 Pro Tips

1. **Semantic Versioning**:

   - MAJOR.MINOR.PATCH
   - 1.0.0 → 1.0.1 (bug fix)
   - 1.0.0 → 1.1.0 (new feature)
   - 1.0.0 → 2.0.0 (breaking change)

2. **Test Locally First**:

   ```bash
   npm link                    # In package directory
   npm link your-package-name  # In test project
   ```

3. **Create GitHub Release**:

   - Tag your releases
   - Write release notes
   - Link npm and GitHub versions

4. **Add Badges** to README:
   ```markdown
   ![npm](https://img.shields.io/npm/v/your-package-name)
   ![downloads](https://img.shields.io/npm/dm/your-package-name)
   ![license](https://img.shields.io/npm/l/your-package-name)
   ```

## 🎉 You're Done!

Your package is built, configured, and ready to publish. Just follow the 6 steps above and you'll be live on NPM in minutes!

Good luck! 🚀
