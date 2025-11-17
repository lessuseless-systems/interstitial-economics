# Comprehensive Testing Plan: Interstitial Journal PWA

**Status**: Ready to test after GitHub Pages deployment completes
**URL**: https://lessuseless-systems.github.io/interstitial-economics/
**Last updated**: 2025-11-17

---

## Pre-Flight Checklist

### Enable GitHub Pages (Required First!)

1. Go to: https://github.com/lessuseless-systems/interstitial-economics/settings/pages
2. Under **"Build and deployment"** → **"Source"**: Select **GitHub Actions**
3. Save
4. Wait 2-3 minutes for deployment
5. Check Actions tab: https://github.com/lessuseless-systems/interstitial-economics/actions

**Current status**: Getting 403 error (Pages not enabled yet)

---

## Test Plan

### Phase 1: Deployment Verification (Desktop)

**Desktop Chrome/Edge** (https://lessuseless-systems.github.io/interstitial-economics/)

- [ ] Page loads without errors
- [ ] No console errors (F12 → Console)
- [ ] CSS loads correctly (purple gradient background)
- [ ] Service Worker registers (Console: "PWA registered")
- [ ] Manifest loads (Application tab → Manifest)
- [ ] Icons visible

**Expected**: Clean load, no 404s, purple gradient interface

---

### Phase 2: Core Voice Recording (iPhone Safari)

**Test Device**: iPhone (Safari only - Chrome on iOS doesn't support Web Speech API)

#### Test 2.1: Basic Recording
- [ ] Open https://lessuseless-systems.github.io/interstitial-economics/
- [ ] Microphone button visible and centered
- [ ] Tap microphone button
- [ ] **Permission prompt appears**: "Allow microphone access?"
- [ ] Tap "Allow"
- [ ] Button changes to red (recording state)
- [ ] Speak clearly: **"Bob asked me to paint his house on Sunday"**
- [ ] Watch for interim transcript appearing in real-time
- [ ] Tap button again to stop
- [ ] **Expected**: Entry appears below with:
  - Timestamp
  - Full transcript
  - Extracted entities (People: Bob, etc.)

**Pass criteria**: Transcript accurate, entry saved, entities extracted

#### Test 2.2: Multiple Entries
- [ ] Record 5 different entries:
  1. "Helped Sarah with her kids for about 2 hours"
  2. "Spent 4 hours working on my app project"
  3. "Had coffee with Michael, great conversation"
  4. "Declined Steve's request to help move, too exhausted"
  5. "Community cleanup at the park, felt good about it"
- [ ] Each entry appears in list
- [ ] Entries show different people extracted
- [ ] Timestamps are sequential

**Pass criteria**: All 5 entries saved and visible

#### Test 2.3: Entity Extraction Quality
For each entry above, verify extraction:

| Entry | Expected People | Expected Activity | Expected Duration |
|-------|----------------|-------------------|-------------------|
| #1 | Sarah | helping | ~2h |
| #2 | - | working | 4h |
| #3 | Michael | socializing | - |
| #4 | Steve | declined | - |
| #5 | - | community | - |

- [ ] People names extracted correctly
- [ ] Activities categorized reasonably
- [ ] Durations parsed when mentioned

**Pass criteria**: 70%+ accuracy on entity extraction

---

### Phase 3: Persistence & Offline

#### Test 3.1: Page Reload
- [ ] Record 3 entries
- [ ] Refresh page (swipe down)
- [ ] **Expected**: All 3 entries still visible
- [ ] Check localStorage (Safari: Settings → Advanced → Website Data)

**Pass criteria**: Data persists across reload

#### Test 3.2: Offline Mode
- [ ] Record entry online
- [ ] Enable Airplane Mode
- [ ] Refresh page
- [ ] **Expected**: Page loads (Service Worker cache)
- [ ] **Expected**: Previous entries visible
- [ ] Try recording new entry
- [ ] **Expected**: Error (no network for STT) OR queued for later

**Pass criteria**: Offline viewing works, graceful degradation for recording

#### Test 3.3: Clear and Restart
- [ ] Clear Safari data (Settings → Safari → Clear History)
- [ ] Revisit app
- [ ] **Expected**: Entries gone (localStorage wiped)
- [ ] Record new entry
- [ ] **Expected**: Fresh start works

**Pass criteria**: Clean slate after data clear

---

### Phase 4: PWA Installation (iPhone)

#### Test 4.1: Add to Home Screen
- [ ] Open app in Safari
- [ ] Tap **Share** button (square with arrow up)
- [ ] Scroll and tap **"Add to Home Screen"**
- [ ] Edit name (optional)
- [ ] Tap **"Add"**
- [ ] **Expected**: Icon appears on home screen
- [ ] Close Safari

**Pass criteria**: Icon visible on home screen

#### Test 4.2: Launch as PWA
- [ ] Tap home screen icon
- [ ] **Expected**: App opens fullscreen (no Safari UI)
- [ ] **Expected**: No address bar, no browser chrome
- [ ] **Expected**: App feels native

**Pass criteria**: Fullscreen PWA experience

#### Test 4.3: PWA Functionality
- [ ] Record entry from PWA (not Safari)
- [ ] **Expected**: Works identically
- [ ] Close PWA (swipe up)
- [ ] Reopen from home screen
- [ ] **Expected**: Entry persists

**Pass criteria**: PWA works same as browser version

---

### Phase 5: Edge Cases & Stress Tests

#### Test 5.1: Long Transcript
- [ ] Record 2-minute monologue
- [ ] Include multiple people: "Bob, Sarah, Michael, Clara, and Steve all came over..."
- [ ] **Expected**: Full transcript captured
- [ ] **Expected**: All people extracted
- [ ] Check for cutoff or truncation

**Pass criteria**: Handles long input gracefully

#### Test 5.2: Noisy Environment
- [ ] Record in noisy place (outside, music playing)
- [ ] **Expected**: Transcript may be inaccurate (acceptable)
- [ ] **Expected**: No crashes

**Pass criteria**: Degrades gracefully, doesn't break

#### Test 5.3: Rapid Entry Creation
- [ ] Record 10 entries rapidly (one after another)
- [ ] **Expected**: All 10 save
- [ ] **Expected**: No UI lag
- [ ] **Expected**: List scrolls properly

**Pass criteria**: Handles burst activity

#### Test 5.4: Special Names
- [ ] Record: "Helped María with José's quinceañera planning"
- [ ] Record: "O'Brien asked me about the project"
- [ ] Record: "Talked to Dr. Smith-Jones about health"
- [ ] **Expected**: Special characters handled
- [ ] **Expected**: Names extracted (may be imperfect)

**Pass criteria**: Doesn't crash on unicode/hyphens/apostrophes

#### Test 5.5: Empty or Nonsense
- [ ] Tap record, say nothing, stop immediately
- [ ] **Expected**: Empty entry or graceful skip
- [ ] Record: "um... uh... hmm..."
- [ ] **Expected**: Transcript captured (even if meaningless)

**Pass criteria**: Handles silence and filler gracefully

#### Test 5.6: Permission Denied
- [ ] Fresh install or cleared data
- [ ] Tap microphone
- [ ] Tap **"Don't Allow"** on permission prompt
- [ ] **Expected**: Error message shown
- [ ] **Expected**: Instructions to re-enable in Settings

**Pass criteria**: Clear error message, recovery path shown

---

### Phase 6: UI/UX Polish

#### Test 6.1: Visual Design
- [ ] Purple gradient background renders correctly
- [ ] Text is readable (white on purple)
- [ ] Microphone button is large enough to tap easily
- [ ] Entry cards are well-spaced
- [ ] Timestamps are human-readable

**Pass criteria**: Looks professional, easy to use

#### Test 6.2: Responsive Layout
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone Pro Max (large screen)
- [ ] Test in landscape mode
- [ ] **Expected**: Layout adapts, no overflow

**Pass criteria**: Works on all iPhone sizes

#### Test 6.3: Animation & Feedback
- [ ] Recording button animates on tap
- [ ] Clear visual state for recording vs idle
- [ ] Interim transcript updates smoothly
- [ ] Entry appears with animation (if implemented)

**Pass criteria**: Feels responsive and polished

---

### Phase 7: Browser Compatibility

#### Test 7.1: Desktop Chrome
- [ ] Open on desktop Chrome
- [ ] Test voice recording (may require microphone permission)
- [ ] **Expected**: Works identically to iPhone

**Pass criteria**: Desktop support confirmed

#### Test 7.2: Desktop Edge
- [ ] Same as Chrome test
- [ ] **Expected**: Works (Chromium-based)

**Pass criteria**: Edge support confirmed

#### Test 7.3: Firefox (Known Limitation)
- [ ] Open on Firefox desktop or mobile
- [ ] **Expected**: Error message: "Speech recognition not supported"
- [ ] **Expected**: Graceful degradation (manual entry option?)

**Pass criteria**: Clear error, doesn't break silently

#### Test 7.4: Chrome on iOS (Known Limitation)
- [ ] Open in Chrome on iPhone (not Safari)
- [ ] **Expected**: Speech API not available (iOS WebKit limitation)
- [ ] **Expected**: Error or fallback

**Pass criteria**: User informed to use Safari

---

### Phase 8: Performance

#### Test 8.1: Load Time
- [ ] Hard refresh (clear cache)
- [ ] Time from URL entry to interactive
- [ ] **Expected**: < 3 seconds on good connection
- [ ] **Expected**: < 10 seconds on slow 3G

**Pass criteria**: Fast initial load

#### Test 8.2: Battery Impact
- [ ] Use app for 30 minutes (multiple recordings)
- [ ] Check battery drain
- [ ] **Expected**: No excessive drain (voice recording is native API)

**Pass criteria**: Reasonable battery usage

#### Test 8.3: Storage Growth
- [ ] Record 50 entries
- [ ] Check Safari storage (Settings → Safari → Advanced → Website Data)
- [ ] **Expected**: Grows linearly (~1KB per entry)

**Pass criteria**: No storage leak

---

### Phase 9: Data Integrity

#### Test 9.1: Export Data (Manual)
Since no export feature yet, verify data in localStorage:

- [ ] Safari: Settings → Advanced → Web Inspector (on Mac)
- [ ] Inspect localStorage
- [ ] **Expected**: JSON array of entries
- [ ] **Expected**: All fields present (id, timestamp, transcript, entities)

**Pass criteria**: Data structured correctly

#### Test 9.2: Data Corruption Recovery
- [ ] Manually corrupt localStorage JSON (advanced)
- [ ] Reload app
- [ ] **Expected**: Graceful error handling (not crash)

**Pass criteria**: App handles corrupted data safely

---

### Phase 10: Security & Privacy

#### Test 10.1: HTTPS Only
- [ ] Verify URL starts with `https://`
- [ ] Check certificate (tap lock icon)
- [ ] **Expected**: Valid GitHub Pages cert

**Pass criteria**: Secure connection

#### Test 10.2: Data Privacy
- [ ] Verify no network requests after initial load (check Network tab)
- [ ] **Expected**: Voice data processed locally (Web Speech API is on-device)
- [ ] **Expected**: No analytics, no tracking, no 3rd party requests

**Pass criteria**: Fully local, private

#### Test 10.3: Microphone Permission
- [ ] Verify permission is request-based (not automatic)
- [ ] Deny permission, verify app explains how to re-enable
- [ ] Grant permission, verify it's remembered

**Pass criteria**: Permission model correct

---

## Issue Tracker

### Known Issues (Pre-Test)

| Issue | Severity | Status |
|-------|----------|--------|
| GitHub Pages 403 error | Blocker | Need to enable Pages in settings |
| No export feature | Medium | Planned for later |
| Firefox not supported | Low | Documented limitation |
| Chrome iOS not supported | Low | Platform limitation |

### Discovered During Testing

| Issue | Severity | Repro Steps | Status |
|-------|----------|-------------|--------|
| _To be filled during testing_ | | | |

---

## Test Results Summary

**Test Date**: _________
**Tester**: _________
**Device**: iPhone _____ (iOS _____)
**Browser**: Safari _____

### Pass/Fail Checklist

- [ ] Phase 1: Deployment ___/6
- [ ] Phase 2: Voice Recording ___/12
- [ ] Phase 3: Persistence ___/9
- [ ] Phase 4: PWA Install ___/6
- [ ] Phase 5: Edge Cases ___/18
- [ ] Phase 6: UI/UX ___/9
- [ ] Phase 7: Browsers ___/12
- [ ] Phase 8: Performance ___/9
- [ ] Phase 9: Data ___/6
- [ ] Phase 10: Security ___/9

**Total**: ___/96 tests passed

**Overall Status**: ⬜ PASS | ⬜ PASS WITH ISSUES | ⬜ FAIL

### Critical Blockers
_List any showstoppers_

### Nice-to-Fix
_List polish items_

### Works Great!
_List what exceeded expectations_

---

## Next Steps After Testing

### If Tests Pass
1. Document any quirks or limitations
2. Create user guide with tips
3. Consider adding export feature
4. Plan pyramid generation implementation

### If Tests Fail
1. Document failures with screenshots
2. Prioritize by severity
3. Fix critical issues first
4. Re-test after fixes

---

**Ready to test! Enable GitHub Pages and let's break this thing.**
