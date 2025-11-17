# Deploying to GitHub Pages

The PWA will automatically deploy to GitHub Pages when you push to the main branch or the current feature branch.

## Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy-pwa.yml`) will:
1. Build the PWA on every push to `pwa/` directory
2. Deploy to GitHub Pages automatically
3. Make it available at: `https://lessuseless-systems.github.io/interstitial-economics/`

## Enable GitHub Pages

First, you need to enable GitHub Pages in your repo:

1. Go to your repo: https://github.com/lessuseless-systems/interstitial-economics
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. Save

That's it! The workflow will handle the rest.

## Deploy Now

To trigger a deployment right now:

```bash
# Make sure all changes are committed
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin claude/ux-review-analysis-01DoEdi4Ub899Q8vAwN4B1Tn
```

Or just merge to main:
```bash
git checkout main
git merge claude/ux-review-analysis-01DoEdi4Ub899Q8vAwN4B1Tn
git push origin main
```

## Check Deployment Status

1. Go to **Actions** tab in your GitHub repo
2. You'll see "Deploy PWA to GitHub Pages" workflow running
3. Wait ~1-2 minutes for it to complete
4. Click on the workflow to see progress

## Access Your App

Once deployed, your app will be live at:

**https://lessuseless-systems.github.io/interstitial-economics/**

### Test on iPhone

1. Open Safari on your iPhone
2. Go to the URL above
3. Grant microphone permission
4. Start journaling!
5. Add to home screen for app-like experience

## Troubleshooting

### Deployment Failed

Check the Actions tab for error messages. Common issues:

**Pages not enabled:**
- Go to Settings → Pages
- Enable GitHub Pages with Source: GitHub Actions

**Permission denied:**
- The workflow needs `pages: write` permission
- Check repo Settings → Actions → General → Workflow permissions
- Enable "Read and write permissions"

**Build errors:**
- Check the build logs in Actions tab
- Make sure `pwa/package.json` dependencies are correct
- Try building locally: `cd pwa && npm install && npm run build`

### App Not Working After Deploy

**404 errors:**
- Make sure the base path is set correctly in `vite.config.ts`
- Should be: `base: '/interstitial-economics/'`

**Assets not loading:**
- Check that paths in HTML/CSS don't use absolute paths
- Use relative paths or `import` statements

**Service Worker issues:**
- Clear browser cache: Settings → Safari → Clear History
- Hard reload: Hold reload button → "Request Desktop Website"

### Microphone Not Working

Same as local testing:
- Must use HTTPS (GitHub Pages provides this automatically)
- Must use Safari on iOS or Chrome on desktop
- Grant permission when prompted

## Manual Deploy (Alternative)

If you want to deploy manually without GitHub Actions:

```bash
cd pwa

# Build
npm run build

# The dist/ folder is your static site
# Upload it to any static host:
# - Netlify: drag & drop dist/ folder
# - Vercel: vercel --prod
# - Firebase: firebase deploy
```

## Custom Domain (Optional)

To use a custom domain like `journal.yourdomain.com`:

1. Add a `CNAME` file to `pwa/public/`:
   ```
   journal.yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record: `journal` → `lessuseless-systems.github.io`

3. In GitHub repo settings → Pages:
   - Set custom domain
   - Enable "Enforce HTTPS"

## Update After Deploy

Every time you push changes to `pwa/`, it auto-deploys:

```bash
# Make changes to pwa/src/App.tsx or other files
cd pwa
# Test locally first
npm run dev

# Commit and push
git add .
git commit -m "Update PWA features"
git push

# Automatically builds and deploys!
# Check Actions tab for progress
# Live in 1-2 minutes
```

## Deploy from Different Branch

The workflow is configured to deploy from:
- `main` branch
- `claude/ux-review-analysis-01DoEdi4Ub899Q8vAwN4B1Tn` branch

To add more branches, edit `.github/workflows/deploy-pwa.yml`:

```yaml
on:
  push:
    branches: ['main', 'your-branch-name']
```

## Environment Variables (If Needed Later)

When you add Jazz.tools or other services needing API keys:

1. Go to Settings → Secrets and variables → Actions
2. Add secrets (e.g., `JAZZ_API_KEY`)
3. Reference in workflow:
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_JAZZ_KEY: ${{ secrets.JAZZ_API_KEY }}
   ```

## Monitor Usage

GitHub Pages has limits:
- 100 GB bandwidth/month (soft limit)
- 1 GB storage
- 10 builds per hour

For personal projects, this is more than enough!

---

**Your app will be live at:**
## https://lessuseless-systems.github.io/interstitial-economics/

Just push your code and wait ~2 minutes! 🚀
