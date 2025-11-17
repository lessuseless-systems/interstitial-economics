# Quick Test Checklist - START HERE

## Step 1: Enable GitHub Pages (DO THIS FIRST!)

**The site is getting a 403 error because GitHub Pages isn't enabled yet.**

1. Go to: https://github.com/lessuseless-systems/interstitial-economics/settings/pages
2. Under **"Build and deployment"** → **"Source"**:
   - Select: **GitHub Actions** (not "Deploy from branch")
3. Click **Save**
4. Wait 2-3 minutes
5. Check deployment: https://github.com/lessuseless-systems/interstitial-economics/actions
   - Look for green checkmark ✅

---

## Step 2: Quick Smoke Test (2 minutes)

### On iPhone Safari:

1. **Open**: https://lessuseless-systems.github.io/interstitial-economics/
2. **Tap** the microphone button
3. **Allow** microphone permission
4. **Speak**: "Bob asked me to paint his house on Sunday"
5. **Tap** button again to stop
6. **Check**: Entry appears below with transcript

**✅ WORKS?** → Continue to full testing (see TESTING.md)
**❌ BROKEN?** → Note the error and we'll debug

---

## Step 3: PWA Install Test (1 minute)

1. **Tap** Share button (square with arrow)
2. **Select** "Add to Home Screen"
3. **Tap** "Add"
4. **Close** Safari
5. **Tap** the new home screen icon
6. **Test**: Record another entry

**✅ WORKS?** → You have a working PWA!
**❌ BROKEN?** → Note what happened

---

## Step 4: Stress Test (5 minutes)

**Just use it naturally:**
- Record 10-20 real journal entries
- Talk about different people
- Mention time durations
- Express feelings
- See what breaks

**Note anything weird:**
- Transcription errors (expected, acceptable)
- UI glitches (tell me!)
- Crashes (definitely tell me!)
- Missing features you expected

---

## Common Issues & Fixes

### "403 Forbidden"
→ Enable GitHub Pages (Step 1 above)

### "Microphone not working"
→ Settings → Safari → Microphone → Allow

### "Speech recognition not supported"
→ Use Safari, not Chrome (iOS limitation)

### "Nothing happens when I tap mic"
→ Hard refresh (swipe down on page)

### "My entries disappeared"
→ Did you clear Safari data? That wipes localStorage

---

## What to Test Specifically

**Entity Extraction Quality**:
- Try: "Spent 3 hours helping Bob and Sarah with their move"
- Should extract: People=[Bob, Sarah], Duration=3h, Activity=helping

**Persistence**:
- Record entries
- Close Safari completely
- Reopen
- Entries should still be there

**Offline**:
- Load app online
- Turn on Airplane Mode
- Refresh page
- Should still load (Service Worker)

---

## Report Back

**Quick format:**
```
Device: iPhone [model], iOS [version]
Status: ✅ Works | ⚠️ Works with issues | ❌ Broken

What worked:
-

What didn't work:
-

Weird behavior:
-

Suggestions:
-
```

---

**For exhaustive testing, see TESTING.md (96 test cases)**

**Let's break this thing! 🧪**
