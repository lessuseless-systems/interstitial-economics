# Interstitial Journal PWA

Voice-first pyramid journaling Progressive Web App. Works on iOS Safari, Chrome, and other modern browsers.

## Features

✅ **Voice Recording** - Tap to speak, automatic transcription
✅ **Entity Extraction** - Auto-detects people, duration, activities, sentiment
✅ **Offline Support** - Works without internet (via Service Worker)
✅ **PWA Install** - Add to home screen like a native app
✅ **Local Storage** - All data stays on your device
✅ **Mobile Optimized** - Touch-friendly, responsive design

## Live Demo

**Try it now:** https://lessuseless-systems.github.io/interstitial-economics/

Works on iPhone Safari and desktop Chrome. No installation needed!

> 🚀 **Last deployed:** 2025-11-17

## Quick Start

### Option 1: Use Live Version (Easiest)

Just visit the link above on your iPhone - it's already deployed and ready to use!

### Option 2: Run Locally

### 1. Install Dependencies

```bash
cd pwa
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at:
- **On Linux**: http://localhost:3000
- **On iPhone** (same network): http://<your-linux-ip>:3000

To find your Linux IP:
```bash
ip addr show | grep "inet "
# Or
hostname -I
```

### 3. Test on iPhone

1. **Open Safari** on your iPhone
2. Navigate to `http://<your-linux-ip>:3000`
3. **Grant microphone permission** when prompted
4. **Tap the microphone button** to start journaling
5. Speak: "Bob asked me to paint his house Sunday"
6. Tap again to stop recording
7. Entry appears in the list below!

### 4. Install as PWA (Optional)

On iPhone:
1. Tap the **Share** button (square with arrow)
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"**
4. App icon appears on your home screen!
5. Opens fullscreen like a native app

## Usage

### Basic Journaling

```
1. Tap microphone button
2. Speak your journal entry
3. Tap again to stop
4. Entry auto-saves with extracted metadata
```

### Example Entries

**Helping someone:**
> "Helped Bob paint his house today, took about 4 hours"

Extracts:
- People: Bob
- Activity: helping
- Duration: 240 minutes
- Tags: #helping, #home

**Social activity:**
> "Had coffee with Sarah for an hour, was great catching up"

Extracts:
- People: Sarah
- Activity: socializing
- Duration: 60 minutes
- Sentiment: positive

**Work:**
> "Spent 2 hours on the project with Michael"

Extracts:
- People: Michael
- Activity: working
- Duration: 120 minutes

## Browser Compatibility

| Browser | Platform | Speech API | Status |
|---------|----------|------------|--------|
| Safari | iOS 14.5+ | ✅ WebKit | **Full support** |
| Chrome | Desktop | ✅ | **Full support** |
| Edge | Desktop | ✅ | **Full support** |
| Firefox | Desktop | ❌ | Not supported |

**Best experience:** Safari on iOS or Chrome on desktop

## Development

### Project Structure

```
pwa/
├── src/
│   ├── App.tsx              # Main app component
│   ├── App.css              # Styling
│   ├── main.tsx             # Entry point
│   ├── services/
│   │   ├── voice.ts         # Web Speech API wrapper
│   │   └── extraction.ts    # Entity extraction
│   └── index.css            # Global styles
├── package.json
├── vite.config.ts           # Vite + PWA config
└── tsconfig.json
```

### Key Technologies

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool + dev server
- **Web Speech API** - Browser-native STT
- **Service Worker** - Offline support
- **LocalStorage** - Data persistence

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory. Can be served with any static file server.

### Deploy to Web

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy
```

**Option 3: GitHub Pages**
```bash
npm run build
# Copy dist/ to gh-pages branch
```

## Troubleshooting

### Microphone Permission Denied

**On iOS:**
1. Settings → Safari → Microphone
2. Enable microphone access
3. Refresh the page

**On Desktop:**
1. Click the lock icon in address bar
2. Allow microphone access
3. Refresh the page

### No Speech Detected

- Speak louder or move closer to mic
- Check that mic is not muted
- Try in a quieter environment
- Ensure correct language (English)

### App Not Working Offline

- Make sure you visited the app online first
- Check that Service Worker registered (see console)
- Try clearing cache and revisiting

### Can't Find Linux IP on Network

**Firewall might be blocking:**
```bash
# Open port 3000 (Ubuntu/Debian)
sudo ufw allow 3000

# Or temporarily disable firewall
sudo ufw disable
```

**Check if server is listening:**
```bash
curl http://localhost:3000
```

If this works but iPhone can't connect, it's a firewall issue.

## Next Steps

### Planned Features

- [ ] **Jazz.tools integration** - Real sync across devices
- [ ] **Pyramid generation** - Relationship/time/pattern analysis
- [ ] **Report generation** - Auto-generated markdown reports
- [ ] **Question prompts** - AI asks follow-up questions
- [ ] **Export** - Download entries as JSON/markdown
- [ ] **Search** - Find entries by person/date/tag
- [ ] **Better entity extraction** - Use ML models (transformers.js)

### Integration with Existing Schemas

The Zod schemas we built earlier are ready to integrate:

```typescript
import { JournalEntrySchema } from '../schemas/journal-entry.schema';

// Validate entries
const entry = JournalEntrySchema.parse({
  id: crypto.randomUUID(),
  created: new Date(),
  transcript: 'Bob asked me...',
  people: ['Bob'],
  // ...
});
```

### Adding Jazz.tools Sync

Replace localStorage with Jazz:

```typescript
import { useCoState } from 'jazz-tools';

const { entries } = useCoState(JournalEntriesSchema);
```

Entries will sync across all devices automatically!

## License

MIT

## Contributing

This is a prototype. Feel free to experiment and improve!

---

**Questions?** Check the main project README or open an issue.
