# Deployment Troubleshooting

## Issue: Workflow fails without output

### Step 1: Enable GitHub Pages (REQUIRED FIRST!)

The workflow **will fail** if Pages isn't enabled. Do this:

1. Go to: https://github.com/lessuseless-systems/interstitial-economics/settings/pages
2. Under **"Build and deployment"** → **"Source"**:
   - ⚠️ **MUST select**: `GitHub Actions` (NOT "Deploy from a branch")
3. Click **Save**

If you don't see GitHub Actions as an option:
- Your repo might need to be public
- Or you need admin permissions

### Step 2: Check Workflow Runs

1. Go to: https://github.com/lessuseless-systems/interstitial-economics/actions
2. Look for "Deploy PWA to GitHub Pages" workflow
3. Click on the most recent run

### Step 3: Identify the Failure

**If you see no workflow runs:**
- Workflow only triggers on changes to `pwa/**` files
- Or when `.github/workflows/deploy-pwa.yml` changes
- Or via manual trigger (Actions tab → workflow → Run workflow)

**If build step fails:**
```
Error in build step:
npm install failed → Check package.json
npm run build failed → Check vite.config.ts
```

**If deploy step fails:**
```
Error: "Resource not accessible by integration"
→ GitHub Pages not enabled (see Step 1)

Error: "Deployment failed"
→ Check permissions (Settings → Actions → General → Workflow permissions)
→ Must be: "Read and write permissions"
```

### Step 4: Manual Trigger

If you've enabled Pages but workflow hasn't run:

1. Go to: https://github.com/lessuseless-systems/interstitial-economics/actions
2. Click "Deploy PWA to GitHub Pages"
3. Click "Run workflow" button (right side)
4. Select branch: `claude/ux-review-analysis-01DoEdi4Ub899Q8vAwN4B1Tn`
5. Click "Run workflow"

### Step 5: Check Build Locally

If workflow keeps failing, test the build locally:

```bash
cd pwa
npm install
npm run build
ls -la dist/  # Should see: index.html, assets/, manifest, etc.
```

If local build works but workflow fails → deployment config issue
If local build fails → code issue (fix, commit, push)

## Common Errors & Fixes

### Error: "404 Not Found" when visiting site

**Cause**: Deployment succeeded but wrong base path

**Check**: `pwa/vite.config.ts` line:
```typescript
base: process.env.NODE_ENV === 'production' ? '/interstitial-economics/' : '/'
```

Should match your repo name exactly (case-sensitive)

### Error: "Workflow has no output"

**Cause**: Workflow not running at all

**Fix**:
1. Enable Pages (Step 1)
2. Make change to `pwa/**` file (Step 4)
3. Manually trigger workflow

### Error: "Cannot find module" during build

**Cause**: Missing dependencies

**Fix**:
```bash
cd pwa
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Error: "403 Forbidden" when visiting site

**Causes**:
1. Pages not enabled (most common)
2. Workflow hasn't completed yet (wait 2-3 min)
3. Repo is private (Pages needs public repo or GitHub Pro)

## Debug Checklist

- [ ] GitHub Pages is enabled with "GitHub Actions" source
- [ ] Workflow permissions are "Read and write"
- [ ] Workflow has run at least once (check Actions tab)
- [ ] Build step shows green checkmark ✅
- [ ] Deploy step shows green checkmark ✅
- [ ] Waited 2-3 minutes after deployment
- [ ] Visited correct URL: `https://<username>.github.io/<repo-name>/`
- [ ] Hard refresh with Ctrl+Shift+R (or Cmd+Shift+R on Mac)

## Still Broken?

### Get detailed error logs:

1. Go to failed workflow run
2. Click "build" job
3. Expand each step to see full output
4. Copy error message
5. Check what step failed:
   - Checkout → Git issue
   - Setup Node → Environment issue
   - Install deps → package.json issue
   - Build → Code issue
   - Upload artifact → Permissions issue
   - Deploy → Pages configuration issue

### Share this info for help:

```
Workflow run: [paste URL]
Failed step: [step name]
Error message: [paste error]
Repository visibility: [public/private]
Pages enabled: [yes/no]
Pages source: [GitHub Actions / Deploy from branch]
```

## Success Indicators

When everything works:

1. ✅ Actions tab shows green checkmarks
2. ✅ Pages settings shows deployment URL
3. ✅ Visiting URL loads the app (purple gradient)
4. ✅ Console has no errors (F12 → Console)
5. ✅ Can record voice entries on iPhone Safari

---

**After enabling Pages, the next commit to `pwa/**` will trigger deployment.**
