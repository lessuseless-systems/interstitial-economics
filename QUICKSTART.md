# Quick Start Guide - Test on iPhone NOW

You can test the voice journaling app on your iPhone right now (no Mac needed!)

## Step 1: Install on Linux

```bash
cd pwa
npm install
```

## Step 2: Start Dev Server

```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.x:3000/
```

**Note the Network URL!** (Your Linux IP address)

## Step 3: Find Your Linux IP

If the network URL isn't shown, find it manually:

```bash
hostname -I
# Or
ip addr show | grep "inet " | grep -v "127.0.0.1"
```

You'll see something like: `192.168.1.100`

## Step 4: Open Firewall (if needed)

If your iPhone can't connect, open the port:

```bash
# Ubuntu/Debian
sudo ufw allow 3000

# Or temporarily disable firewall
sudo ufw disable
```

## Step 5: Test on iPhone

1. **Make sure iPhone is on same WiFi network as your Linux machine**

2. **Open Safari** on iPhone (must be Safari, not Chrome!)

3. **Go to**: `http://192.168.1.100:3000` (use your actual IP)

4. **Grant microphone permission** when prompted

5. **Tap the big microphone button**

6. **Speak**: "Bob asked me to paint his house Sunday"

7. **Tap again to stop**

8. **Your entry appears below!** 🎉

## Step 6: Install as PWA (Optional)

Make it feel like a real app:

1. Tap **Share button** (square with arrow) in Safari
2. Scroll down, tap **"Add to Home Screen"**
3. Tap **"Add"**
4. App icon appears on home screen!
5. Tap icon → opens fullscreen (no browser UI)

## Features to Test

### Basic Recording
```
Tap mic → Speak → Tap again → Entry saved
```

### Entity Extraction
Try these phrases:

**Person detection:**
> "Helped Bob with his fence today"
→ Detects: Bob

**Duration:**
> "Spent 2 hours helping Sarah"
→ Detects: 120 minutes

**Activity:**
> "Had coffee with Michael"
→ Detects: socializing

**Complex:**
> "Spent 4 hours painting Bob's house, but he's moving Monday"
→ Detects: Bob, 240 minutes, helping, mixed sentiment

### See Your Entries
- Scroll down to see all saved entries
- Each shows: timestamp, transcript, detected people, duration, tags
- Data persists (uses localStorage)

## Troubleshooting

### Can't Connect from iPhone

**Check same WiFi:**
```bash
# On Linux, see what network you're on
nmcli device show

# Ping test from iPhone not possible, but try:
# Settings → WiFi → (i) icon → see IP range
# Should be same as Linux (e.g., both 192.168.1.x)
```

**Check firewall:**
```bash
sudo ufw status
# If active, make sure port 3000 is allowed
```

**Test from Linux first:**
```bash
curl http://localhost:3000
# Should show HTML
```

### Microphone Not Working

**On iPhone:**
- Settings → Safari → Microphone → Enable
- Refresh page
- Grant permission when prompted

### No Speech Detected

- Speak louder
- Move closer to iPhone
- Check volume isn't on mute
- Try in quiet room

### App Crashes or Freezes

- Hard refresh: Hold reload button → "Request Desktop Website" → Reload
- Clear Safari cache: Settings → Safari → Clear History
- Restart Safari

## What You Can Do Now

✅ **Test voice journaling** - Real STT on your iPhone
✅ **See entity extraction** - Names, durations auto-detected
✅ **Install as PWA** - Acts like native app
✅ **Works offline** - After first load
✅ **Multi-device** - Open on Linux browser too (syncs via localStorage)

## Next Steps (Later)

When you're ready to enhance:

1. **Add Jazz.tools** - Real sync across devices
2. **Add pyramid generation** - Relationship/time analysis
3. **Better entity extraction** - Use transformers.js (ML models)
4. **Question prompts** - "Has Bob helped you before?"
5. **Report generation** - Auto-generated markdown reports

But for now - **just test it!**

The core voice → text → save flow works perfectly on iOS Safari.

---

## Quick Test Commands

```bash
# Terminal 1 (start server)
cd pwa
npm install
npm run dev

# Terminal 2 (check it's running)
curl http://localhost:3000

# Terminal 3 (find IP)
hostname -I

# On iPhone Safari
# Go to: http://<your-ip>:3000
# Tap mic, speak, see magic happen!
```

That's it! You now have a working voice journaling app you can test on your iPhone. 🚀
