# Technical Specification: Gesture-Based Interface
## Interstitial Economics - Invisible Mode

**Version**: 1.0
**Date**: November 16, 2025
**Status**: Draft

---

## Table of Contents

1. [Gesture Mapping Strategy](#gesture-mapping-strategy)
2. [Platform Implementations](#platform-implementations)
3. [Hardware Integration](#hardware-integration)
4. [Code Examples](#code-examples)
5. [Privacy & Security](#privacy-security)
6. [Testing Strategy](#testing-strategy)
7. [Fallback Mechanisms](#fallback-mechanisms)

---

## Gesture Mapping Strategy

### Core Behavior → Gesture Matrix

| Behavior | Primary Gesture | Secondary Gesture | Tertiary Gesture | Voice Command |
|----------|----------------|-------------------|------------------|---------------|
| **RECORD** (Quick Journal) | Earbud: 2x tap R | Phone: 2x back tap | Watch: Tap complication | "Hey Siri, journal this" |
| **GLANCE** (Token Status) | Earbud: 2x tap L | Phone: 3x back tap | Watch: Raise to wake | "What's my token status?" |
| **GIFT** (Send Tokens) | Earbud: Hold 2s R | Phone: Hold back | Watch: Force touch → Gift | "Gift tokens to [name]" |
| **CONFIRM** (Accept prompt) | Earbud: 1x tap R | Phone: 1x back tap | Watch: Tap green | "Yes" / "Confirm" |
| **DISMISS** (Skip prompt) | Earbud: 1x tap L | Phone: Swipe notification | Watch: Tap red | "Skip" / "Later" |
| **REVIEW** (Last Entry) | Earbud: 3x tap R | Phone: Long press back | Watch: Digital crown scroll | "Review my last entry" |

### Design Principles

1. **Consistency**: Similar actions use similar patterns (2x tap = primary action)
2. **Handedness**: No left/right bias (all gestures work on either side)
3. **Discoverability**: Progressive disclosure (start simple, reveal advanced)
4. **Safety**: Destructive actions require confirmation (no single-tap delete)
5. **Fallback**: Every gesture has voice alternative

---

## Platform Implementations

### iOS Implementation

#### 1. Back Tap (iOS 14+)

**Capabilities**:
- Double tap or triple tap detection
- System-wide (works even when app is backgrounded)
- Accessibility feature (high reliability)
- No battery impact

**Setup Flow**:
```
User Setup:
Settings → Accessibility → Touch → Back Tap
  ├─ Double Tap → "Quick Journal" Shortcut
  └─ Triple Tap → "Token Status" Shortcut

Developer Setup:
1. Create iOS Shortcuts
2. Expose app intents via Intents Extension
3. Register URL schemes for deep linking
```

**Limitations**:
- Only 2 gestures (double/triple tap)
- Cannot customize sensitivity
- Requires iOS 14+
- Only on iPhone (not iPad)

#### 2. Action Button (iPhone 15 Pro+)

**Capabilities**:
- Programmable physical button
- Press, hold, double-press detection
- Haptic feedback
- Works with screen locked

**Implementation**:
```
Settings → Action Button → Shortcut
  Select: "Quick Journal"

Or map to:
  - Open app directly
  - Run specific app intent
  - Toggle modes (Record/Glance)
```

**Limitations**:
- Only on iPhone 15 Pro/Pro Max
- Single button (limited gesture vocabulary)
- Cannot detect complex patterns

#### 3. App Shortcuts & Intents

**Required Files**:
```
iOS/
├─ AppIntents/
│  ├─ QuickJournalIntent.swift
│  ├─ TokenStatusIntent.swift
│  ├─ GiftTokensIntent.swift
│  └─ ReviewEntryIntent.swift
├─ Shortcuts/
│  └─ QuickJournal.shortcut (exported)
└─ Info.plist (URL schemes)
```

**App Intent Example** (see code section below)

#### 4. AirPods Integration

**Capabilities**:
- Stem press/hold detection (AirPods Pro)
- Force sensor tap (all AirPods)
- Siri activation
- Audio routing

**Setup**:
```
Settings → Bluetooth → AirPods → Press and Hold
  Left: Quick Journal (Shortcut)
  Right: Token Status (Shortcut)

Or:
  Left: Siri → "Journal this"
  Right: Siri → "Token status"
```

**Advanced** (via Shortcuts automation):
```
When: AirPods connected
Do: Show notification "Tap to start journaling"
```

**Limitations**:
- Shortcuts integration only (no direct app control)
- Cannot detect custom tap patterns
- iOS controls gesture mapping (user must configure)

---

### Android Implementation

#### 1. Quick Tap (Android 12+, Pixel devices)

**Capabilities**:
- Double-tap back detection
- Lower latency than iOS (dedicated sensor)
- Can trigger apps, shortcuts, actions
- Works with screen off

**Setup**:
```
Settings → System → Gestures → Quick Tap
  Select: Launch "Interstitial Journal"

Or integrate with Tasker:
  Quick Tap → Tasker Task → Custom action
```

**Implementation** (via Accessibility Service):
```java
// Detect Quick Tap via broadcast receiver
<receiver android:name=".QuickTapReceiver">
    <intent-filter>
        <action android:name=
          "android.intent.action.QUICK_TAP"/>
    </intent-filter>
</receiver>
```

**Limitations**:
- Pixel-exclusive (Pixel 4a+)
- Single gesture only (no triple-tap variant)
- Requires explicit user setup

#### 2. Button Remapping (Samsung, OnePlus, etc.)

**Samsung One UI**:
```
Settings → Advanced Features → Side Button
  Double press: Launch app
  Press and hold: Custom action

Bixby Routines:
  IF: Volume down 2x (screen off)
  THEN: Launch voice journal
```

**OnePlus/OxygenOS**:
```
Settings → Buttons & Gestures → Quick Gestures
  Alert Slider positions: Map to app modes
  Power button: 2x press → Camera (remap via Tasker)
```

**Generic Android** (Root/ADB required):
```bash
# Remap volume buttons
adb shell input keyevent 25  # Volume down
# Detect pattern in background service
```

#### 3. Tasker Integration (Power User Solution)

**Full Control**:
- Detect any button combination
- Screen on/off states
- Shake/proximity patterns
- Time-based triggers
- Location-based automation

**Example Profile**:
```
Profile: "Quick Journal Trigger"
  Event: Button → Volume Down
  State: Display Off

Task: "Start Voice Journal"
  1. Vibrate Pattern [200ms, 100ms, 200ms]
  2. Launch App: "Interstitial"
     Data: interstitial://record
  3. Wait 500ms
  4. Media Control: Voice Recognition
```

**MacroDroid** (simpler alternative):
- GUI-based automation
- Pre-built gesture templates
- No coding required

#### 4. Wear OS Integration

**Capabilities**:
- Custom tiles (quick access)
- Complications (always visible)
- Hardware button mapping
- Gesture detection (shake, tilt)

**Implementation**:
```kotlin
// Tile for quick journal
class JournalTile : TileService() {
    override fun onClick() {
        startVoiceCapture()
    }
}

// Complication for token display
class TokenComplication : ComplicationProviderService() {
    override fun onComplicationUpdate(id: Int, type: Int, callback: ComplicationCallback) {
        val tokens = getTokenBalance()
        callback.onComplicationData(
            ShortTextComplicationData.Builder(
                PlainComplicationText.Builder("$tokens 🪙").build()
            ).build()
        )
    }
}
```

---

### Cross-Platform (React Native / Flutter)

#### React Native

**Packages**:
```json
{
  "react-native-shake": "^3.5.0",
  "react-native-background-actions": "^3.0.0",
  "react-native-voice": "^3.2.4",
  "react-native-bluetooth-headset-detect": "^1.2.0"
}
```

**Gesture Detection**:
```javascript
import RNShake from 'react-native-shake';

RNShake.addEventListener('ShakeEvent', () => {
  startVoiceJournal();
});

// iOS: Integrate with Shortcuts via URL scheme
Linking.addEventListener('url', handleDeepLink);

// Android: Broadcast receiver for Quick Tap
const subscription = DeviceEventEmitter.addListener(
  'QuickTap',
  handleQuickTap
);
```

#### Flutter

**Packages**:
```yaml
dependencies:
  sensors_plus: ^3.0.0
  quick_actions: ^1.0.0
  app_links: ^3.0.0
  flutter_tts: ^3.8.0
```

**Implementation**:
```dart
import 'package:quick_actions/quick_actions.dart';

final quickActions = QuickActions();
quickActions.initialize((type) {
  if (type == 'journal') {
    startVoiceJournal();
  }
});

quickActions.setShortcutItems([
  ShortcutItem(
    type: 'journal',
    localizedTitle: 'Quick Journal',
    icon: 'microphone'
  ),
]);
```

---

## Hardware Integration

### Wireless Earbuds

#### AirPods (iOS)

**Detection Methods**:

**Method 1: Shortcuts + Siri**
```
User says: "Hey Siri, journal this"
Siri → Shortcut → App Intent → Voice capture
```

**Method 2: Stem Press Shortcut**
```
AirPods Pro stem press →
  Shortcut: "Quick Journal" →
  URL: interstitial://record
```

**Method 3: Audio Route Detection**
```swift
import AVFoundation

NotificationCenter.default.addObserver(
    self,
    selector: #selector(audioRouteChanged),
    name: AVAudioSession.routeChangeNotification,
    object: nil
)

// Detect AirPods connection/disconnection
// Show contextual prompts
```

**Implementation**:
```swift
import Intents

class QuickJournalIntent: INIntent {
    @MainActor
    func perform() async throws -> some IntentResult {
        // Start voice recognition
        await VoiceService.shared.startListening()
        return .result()
    }
}

// Register in AppIntents
struct AppShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: QuickJournalIntent(),
            phrases: [
                "Journal this in \(.applicationName)",
                "Quick journal"
            ],
            shortTitle: "Quick Journal",
            systemImageName: "mic.fill"
        )
    }
}
```

#### Galaxy Buds (Android)

**Galaxy Wearable App API**:
```kotlin
// Configure via Galaxy Wearable SDK
val gestureConfig = GestureConfiguration.Builder()
    .setDoubleTapAction(GestureAction.LAUNCH_APP, "com.interstitial")
    .setLongPressAction(GestureAction.CUSTOM_INTENT, tokenIntent)
    .build()

GalaxyBudsManager.setConfiguration(gestureConfig)
```

**Fallback** (Broadcast Receiver):
```kotlin
class HeadsetButtonReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_MEDIA_BUTTON -> {
                val event = intent.getParcelableExtra<KeyEvent>(
                    Intent.EXTRA_KEY_EVENT
                )
                if (event.repeatCount == 1) {
                    // Double tap detected
                    launchVoiceJournal()
                }
            }
        }
    }
}
```

#### Generic Bluetooth Headsets

**Media Button Events**:
```java
<receiver android:name=".MediaButtonReceiver">
    <intent-filter>
        <action android:name="android.intent.action.MEDIA_BUTTON"/>
    </intent-filter>
</receiver>

// Detect tap patterns
private var lastClickTime = 0L
private var clickCount = 0

fun onMediaButton(keyCode: Int) {
    val now = System.currentTimeMillis()
    if (now - lastClickTime < 500) {
        clickCount++
    } else {
        clickCount = 1
    }
    lastClickTime = now

    when (clickCount) {
        2 -> startJournal()
        3 -> readTokenStatus()
    }
}
```

---

### Smart Watches

#### Apple Watch

**WatchOS App**:

**Complication** (always-on display):
```swift
struct TokenComplication: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: "TokenWidget",
            provider: TokenProvider()
        ) { entry in
            TokenView(tokens: entry.tokens)
        }
        .configurationDisplayName("Tokens")
        .supportedFamilies([
            .graphicCircular,
            .graphicCorner,
            .modularSmall
        ])
    }
}

// Shows: "487 🪙" on watch face
// Tap to open app
```

**Digital Crown Gesture**:
```swift
struct JournalView: View {
    @State private var crownValue = 0.0

    var body: some View {
        VStack {
            Text("Hold Crown to Journal")
        }
        .digitalCrownRotation($crownValue)
        .onChange(of: crownValue) { value in
            if value > 10 {
                startVoiceJournal()
            }
        }
    }
}
```

**Double-Tap Gesture** (Watch Series 9+):
```swift
// System gesture - maps to primary button action
// Configure via main WatchKit interface
Button("Journal") {
    startVoiceJournal()
}
.keyboardShortcut(.defaultAction) // Triggered by double-tap
```

#### Wear OS

**Tile Implementation**:
```kotlin
class JournalTile : TileService() {
    override fun onTileRequest(requestParams: TileRequest) =
        Futures.immediateFuture(Tile.Builder()
            .setResourcesVersion("1")
            .setTimeline(Timeline.Builder()
                .addTimelineEntry(TimelineEntry.Builder()
                    .setLayout(Layout.Builder()
                        .setRoot(
                            Text.Builder()
                                .setText("📝 Journal")
                                .build()
                        )
                        .build()
                    )
                    .build()
                )
                .build()
            )
            .build()
        )

    override fun onTileClick() {
        startActivityAndCollapse(
            Intent(this, VoiceJournalActivity::class.java)
        )
    }
}
```

**Hardware Button**:
```kotlin
override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
    return when (keyCode) {
        KeyEvent.KEYCODE_STEM_PRIMARY -> {
            // Side button pressed
            startVoiceJournal()
            true
        }
        else -> super.onKeyDown(keyCode, event)
    }
}
```

---

### NFC Tags

#### iOS

**Shortcuts Automation**:
```
Shortcuts → Automation → NFC
  When: Tag "Home Desk" scanned
  Do:
    1. Ask for input (voice)
    2. Run "Quick Journal" shortcut
    3. Pass input as parameter
```

**App Integration**:
```swift
import CoreNFC

class NFCReader: NSObject, NFCNDEFReaderSessionDelegate {
    func beginScanning() {
        let session = NFCNDEFReaderSession(
            delegate: self,
            queue: nil,
            invalidateAfterFirstRead: true
        )
        session.begin()
    }

    func readerSession(_ session: NFCNDEFReaderSession,
                       didDetectNDEFs messages: [NFCNDEFMessage]) {
        guard let payload = messages.first?.records.first else { return }
        let location = String(data: payload.payload, encoding: .utf8)

        // Auto-journal: "At [location]"
        JournalService.recordLocation(location)
    }
}
```

#### Android

**Native NFC**:
```kotlin
class NFCActivity : AppCompatActivity() {
    private lateinit var nfcAdapter: NfcAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
    }

    override fun onResume() {
        super.onResume()
        val intent = Intent(this, javaClass).apply {
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, 0)
        nfcAdapter.enableForegroundDispatch(this, pendingIntent, null, null)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (NfcAdapter.ACTION_NDEF_DISCOVERED == intent.action) {
            val rawMessages = intent.getParcelableArrayExtra(
                NfcAdapter.EXTRA_NDEF_MESSAGES
            )
            val message = (rawMessages?.get(0) as? NdefMessage)
            val payload = message?.records?.get(0)?.payload

            // Trigger journal with context
            startJournalWithContext(String(payload))
        }
    }
}
```

**Tasker Integration**:
```
Profile: "NFC Journal Trigger"
  Event: NFC Tag
  Tag ID: Any

Task:
  1. Get NFC content → %nfc_data
  2. Say: "Logging activity at %nfc_data"
  3. Launch: Interstitial Journal
     Extra: location:%nfc_data
  4. Wait for voice input
```

---

## Code Examples

### iOS: Complete App Intent Implementation

**QuickJournalIntent.swift**:
```swift
import AppIntents
import Speech
import AVFoundation

struct QuickJournalIntent: AppIntent {
    static var title: LocalizedStringResource = "Quick Journal"
    static var description = IntentDescription("Start voice journaling")

    static var openAppWhenRun: Bool = false

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        // Request microphone permission
        let authorized = await requestMicrophonePermission()
        guard authorized else {
            return .result(
                dialog: "Microphone access required for journaling"
            )
        }

        // Start voice recognition
        let transcript = try await captureVoiceNote()

        // Process with on-device AI
        let processed = await processJournalEntry(transcript)

        // Save locally
        try await JournalStore.shared.save(processed)

        // Mint tokens
        let tokens = TokenEngine.mint(from: processed)

        return .result(
            dialog: "Logged. \(tokens) tokens minted."
        )
    }

    private func requestMicrophonePermission() async -> Bool {
        await withCheckedContinuation { continuation in
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                continuation.resume(returning: granted)
            }
        }
    }

    private func captureVoiceNote() async throws -> String {
        let recognizer = SFSpeechRecognizer()
        let request = SFSpeechAudioBufferRecognitionRequest()

        // Start audio engine
        let audioEngine = AVAudioEngine()
        let inputNode = audioEngine.inputNode
        let recordingFormat = inputNode.outputFormat(forBus: 0)

        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            request.append(buffer)
        }

        audioEngine.prepare()
        try audioEngine.start()

        // Listen for 10 seconds or until silence
        return try await withCheckedThrowingContinuation { continuation in
            recognizer?.recognitionTask(with: request) { result, error in
                if let result = result {
                    if result.isFinal {
                        continuation.resume(returning: result.bestTranscription.formattedString)
                    }
                } else if let error = error {
                    continuation.resume(throwing: error)
                }
            }

            // Timeout after 10 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 10) {
                audioEngine.stop()
                inputNode.removeTap(onBus: 0)
            }
        }
    }

    private func processJournalEntry(_ transcript: String) async -> JournalEntry {
        // Use on-device Core ML model for entity extraction
        let extractor = try? EntityExtractor()
        let entities = extractor?.extract(from: transcript)

        return JournalEntry(
            id: UUID(),
            timestamp: Date(),
            transcript: transcript,
            people: entities?.people ?? [],
            activities: entities?.activities ?? [],
            duration: entities?.estimatedDuration ?? 0,
            sentiment: entities?.sentiment ?? .neutral
        )
    }
}

// Register shortcut
struct InterstitialShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: QuickJournalIntent(),
            phrases: [
                "Journal this in \(.applicationName)",
                "Quick journal",
                "Record interaction"
            ],
            shortTitle: "Journal",
            systemImageName: "mic.circle.fill"
        )
    }
}
```

**Info.plist** (URL Scheme):
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>interstitial</string>
        </array>
        <key>CFBundleURLName</key>
        <string>com.interstitial.journal</string>
    </dict>
</array>
```

**AppDelegate.swift** (URL handling):
```swift
func application(_ app: UIApplication,
                 open url: URL,
                 options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    guard url.scheme == "interstitial" else { return false }

    switch url.host {
    case "record":
        Task {
            try await QuickJournalIntent().perform()
        }
    case "status":
        Task {
            try await TokenStatusIntent().perform()
        }
    case "gift":
        let recipient = url.queryParameters["to"]
        let amount = url.queryParameters["amount"]
        Task {
            try await GiftTokensIntent(
                recipient: recipient,
                amount: Int(amount ?? "0") ?? 0
            ).perform()
        }
    default:
        break
    }

    return true
}
```

---

### Android: Complete Accessibility Service

**QuickTapService.kt**:
```kotlin
package com.interstitial.journal

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import kotlinx.coroutines.*

class QuickTapService : AccessibilityService() {

    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private lateinit var speechRecognizer: SpeechRecognizer

    override fun onServiceConnected() {
        super.onServiceConnected()
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this)

        // Listen for Quick Tap broadcasts
        registerQuickTapReceiver()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Handle accessibility events if needed
    }

    override fun onInterrupt() {
        // Handle service interruption
    }

    private fun registerQuickTapReceiver() {
        val filter = IntentFilter("android.intent.action.QUICK_TAP")
        registerReceiver(object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                handleQuickTap()
            }
        }, filter)
    }

    private fun handleQuickTap() {
        // Vibrate for feedback
        val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        vibrator.vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE))

        // Start voice recognition
        startVoiceRecognition()
    }

    private fun startVoiceRecognition() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                     RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        }

        speechRecognizer.setRecognitionListener(object : RecognitionListener {
            override fun onResults(results: Bundle) {
                val matches = results.getStringArrayList(
                    SpeechRecognizer.RESULTS_RECOGNITION
                )
                matches?.firstOrNull()?.let { transcript ->
                    scope.launch {
                        processJournalEntry(transcript)
                    }
                }
            }

            override fun onError(error: Int) {
                // Handle error - retry or notify user
                showToast("Voice recognition failed. Try again.")
            }

            // Other callback methods...
            override fun onReadyForSpeech(params: Bundle?) {}
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {}
            override fun onPartialResults(partialResults: Bundle?) {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })

        speechRecognizer.startListening(intent)
    }

    private suspend fun processJournalEntry(transcript: String) {
        withContext(Dispatchers.IO) {
            // Extract entities using on-device ML
            val entities = EntityExtractor.extract(transcript)

            // Create journal entry
            val entry = JournalEntry(
                id = UUID.randomUUID().toString(),
                timestamp = System.currentTimeMillis(),
                transcript = transcript,
                people = entities.people,
                activities = entities.activities,
                duration = entities.estimatedDuration,
                sentiment = entities.sentiment
            )

            // Save locally
            JournalDatabase.getInstance(applicationContext)
                .journalDao()
                .insert(entry)

            // Mint tokens
            val tokens = TokenEngine.mint(entry)

            // Show notification
            withContext(Dispatchers.Main) {
                showNotification("✓ Logged. $tokens tokens minted.")
            }
        }
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showNotification(message: String) {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_token)
            .setContentTitle("Journal Entry Saved")
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE)
            as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, notification)
    }

    companion object {
        const val CHANNEL_ID = "journal_channel"
        const val NOTIFICATION_ID = 1001
    }
}
```

**AndroidManifest.xml**:
```xml
<manifest>
    <!-- Permissions -->
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

    <application>
        <!-- Accessibility Service -->
        <service
            android:name=".QuickTapService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService"/>
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config"/>
        </service>

        <!-- Broadcast Receiver for Quick Tap -->
        <receiver
            android:name=".QuickTapReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.QUICK_TAP"/>
            </intent-filter>
        </receiver>
    </application>
</manifest>
```

**res/xml/accessibility_service_config.xml**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_description"
    android:accessibilityEventTypes="typeAllMask"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:canRetrieveWindowContent="false"
    android:notificationTimeout="100"/>
```

---

### React Native: Cross-Platform Implementation

**GestureManager.ts**:
```typescript
import { Platform, DeviceEventEmitter, NativeEventEmitter, NativeModules } from 'react-native';
import RNShake from 'react-native-shake';
import Voice from '@react-native-voice/voice';

export class GestureManager {
  private static instance: GestureManager;
  private listeners: Map<string, Function> = new Map();

  private constructor() {
    this.initializeGestureDetection();
  }

  static getInstance(): GestureManager {
    if (!GestureManager.instance) {
      GestureManager.instance = new GestureManager();
    }
    return GestureManager.instance;
  }

  private initializeGestureDetection() {
    if (Platform.OS === 'ios') {
      this.setupIOSGestures();
    } else {
      this.setupAndroidGestures();
    }

    // Cross-platform shake detection
    RNShake.addListener(() => {
      this.emit('shake');
    });
  }

  private setupIOSGestures() {
    // Listen for Shortcuts app URL schemes
    const { Linking } = require('react-native');

    Linking.addEventListener('url', ({ url }: { url: string }) => {
      const action = this.parseURLAction(url);
      if (action) {
        this.emit(action);
      }
    });

    // Check for launch URL
    Linking.getInitialURL().then((url: string | null) => {
      if (url) {
        const action = this.parseURLAction(url);
        if (action) this.emit(action);
      }
    });
  }

  private setupAndroidGestures() {
    // Listen for Quick Tap broadcasts
    DeviceEventEmitter.addListener('QuickTap', () => {
      this.emit('quickTap');
    });

    // Listen for custom button events
    DeviceEventEmitter.addListener('VolumeButton', (event: any) => {
      if (event.pattern === 'double') {
        this.emit('volumeDouble');
      }
    });
  }

  private parseURLAction(url: string): string | null {
    // interstitial://record
    // interstitial://status
    // interstitial://gift?to=bob&amount=100

    const match = url.match(/interstitial:\/\/(\w+)/);
    return match ? match[1] : null;
  }

  on(event: string, callback: Function) {
    this.listeners.set(event, callback);
  }

  off(event: string) {
    this.listeners.delete(event);
  }

  private emit(event: string) {
    const callback = this.listeners.get(event);
    if (callback) {
      callback();
    }
  }
}

// Voice Recognition Service
export class VoiceJournalService {
  async startRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      Voice.onSpeechResults = (event: any) => {
        const transcript = event.value[0];
        resolve(transcript);
      };

      Voice.onSpeechError = (event: any) => {
        reject(new Error(event.error));
      };

      Voice.start('en-US');

      // Auto-stop after 10 seconds
      setTimeout(() => {
        Voice.stop();
      }, 10000);
    });
  }

  async stopRecording() {
    await Voice.stop();
  }
}

// Usage in App
export function useGestureHandlers() {
  useEffect(() => {
    const gestureManager = GestureManager.getInstance();
    const voiceService = new VoiceJournalService();

    // Register gesture handlers
    gestureManager.on('record', async () => {
      try {
        const transcript = await voiceService.startRecording();
        await processJournalEntry(transcript);
        showToast('✓ Entry logged');
      } catch (error) {
        showToast('Failed to record');
      }
    });

    gestureManager.on('status', () => {
      speakTokenStatus();
    });

    gestureManager.on('quickTap', async () => {
      // Android Quick Tap
      const transcript = await voiceService.startRecording();
      await processJournalEntry(transcript);
    });

    gestureManager.on('shake', () => {
      // Emergency: Cancel current operation
      voiceService.stopRecording();
    });

    return () => {
      gestureManager.off('record');
      gestureManager.off('status');
      gestureManager.off('quickTap');
      gestureManager.off('shake');
    };
  }, []);
}
```

**Native Module for Android** (QuickTapModule.java):
```java
package com.interstitial.journal;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class QuickTapModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "QuickTapModule";
    private final ReactApplicationContext reactContext;
    private BroadcastReceiver quickTapReceiver;

    public QuickTapModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        registerQuickTapReceiver();
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    private void registerQuickTapReceiver() {
        quickTapReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                sendEvent("QuickTap", null);
            }
        };

        IntentFilter filter = new IntentFilter("android.intent.action.QUICK_TAP");
        reactContext.registerReceiver(quickTapReceiver, filter);
    }

    private void sendEvent(String eventName, Object params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        reactContext.unregisterReceiver(quickTapReceiver);
    }
}
```

---

## Privacy & Security

### Data Minimization

**Local-First Architecture**:
```
User Device
├─ Voice Recording (ephemeral, deleted after transcription)
├─ Transcript (encrypted at rest)
├─ Extracted Entities (hashed identifiers)
└─ Token Ledger (pseudonymous)

Network (Optional)
├─ Market Positions (anonymized)
├─ Token Flows (addresses only, no names)
└─ Attestations (cryptographic proofs)
```

### Encryption Strategy

**iOS Keychain**:
```swift
import Security

class SecureStorage {
    func saveTranscript(_ text: String, for id: UUID) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: id.uuidString,
            kSecValueData as String: text.data(using: .utf8)!,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        SecItemAdd(query as CFDictionary, nil)
    }
}
```

**Android Encrypted SharedPreferences**:
```kotlin
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class SecureStorage(context: Context) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs = EncryptedSharedPreferences.create(
        context,
        "journal_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveTranscript(id: String, text: String) {
        prefs.edit().putString(id, text).apply()
    }
}
```

### Permission Minimization

**Required Permissions**:
```
iOS:
- NSMicrophoneUsageDescription (voice recording only)
- Optional: NSLocationWhenInUseUsageDescription (context)

Android:
- android.permission.RECORD_AUDIO (voice recording)
- Optional: ACCESS_FINE_LOCATION (context)
```

**Denied by Default**:
- Contacts access (use manual entry)
- Camera access (not needed)
- Storage access (scoped storage only)
- Network access (optional for sync)

---

## Testing Strategy

### Gesture Testing Matrix

| Platform | Gesture | Test Method | Expected Result |
|----------|---------|-------------|-----------------|
| iOS | Back tap 2x | Settings → Accessibility → Test | Shortcut launches |
| iOS | AirPods stem | Shortcuts app → Run | Voice capture starts |
| Android | Quick Tap | Settings → Gestures → Test | App opens |
| Android | Volume 2x | ADB: `adb shell input keyevent 25 25` | Journal starts |
| Watch | Complication tap | Tap on watch face | App opens |
| Watch | Crown rotation | Rotate crown | Gesture detected |
| NFC | Tag scan | NFC Tools app | Shortcut triggers |

### Automated Testing

**iOS XCTest**:
```swift
import XCTest

class GestureTests: XCTestCase {
    func testQuickJournalIntent() async throws {
        let intent = QuickJournalIntent()
        let result = try await intent.perform()

        XCTAssertNotNil(result)
        // Verify journal entry created
        let entries = try await JournalStore.shared.fetchAll()
        XCTAssertFalse(entries.isEmpty)
    }

    func testURLSchemeHandling() {
        let url = URL(string: "interstitial://record")!
        let handled = application.open(url)
        XCTAssertTrue(handled)
    }
}
```

**Android Espresso**:
```kotlin
@Test
fun testQuickTapGesture() {
    // Simulate Quick Tap broadcast
    val intent = Intent("android.intent.action.QUICK_TAP")
    context.sendBroadcast(intent)

    // Verify voice recognition started
    verify(speechRecognizer).startListening(any())
}
```

### User Testing Protocol

**Week 1: Calibration**
- Users configure gestures
- Track false positives/negatives
- Measure time to complete flow

**Week 2: Real-world Usage**
- Daily journaling
- Count missed opportunities (wanted to journal but couldn't)
- Count false triggers (accidental activation)

**Success Metrics**:
- <5% false positive rate
- >90% successful captures when intended
- <3 seconds from gesture to recording start

---

## Fallback Mechanisms

### Gesture Failure Hierarchy

```
Primary: Earbud tap
   ↓ (not wearing earbuds)
Fallback 1: Phone back tap
   ↓ (phone in pocket/bag)
Fallback 2: Voice activation ("Hey Siri, journal this")
   ↓ (in loud environment)
Fallback 3: Watch complication tap
   ↓ (no watch)
Fallback 4: App icon (manual open)
```

### Degraded Mode

**When gestures unavailable**:
```
┌─────────────────────────────────┐
│ 🔴 Gestures Limited             │
├─────────────────────────────────┤
│ Quick Tap not configured        │
│                                 │
│ Alternatives:                   │
│ • Say "Hey Siri, journal this"  │
│ • Open app manually             │
│ • Use widget                    │
│                                 │
│ [Configure gestures]            │
└─────────────────────────────────┘
```

### Platform-Specific Workarounds

**iOS without Shortcuts**:
```swift
// Use Today Widget (pre-iOS 14)
// Or Action Extension (share sheet)
class JournalActionViewController: UIViewController {
    override func viewDidLoad() {
        // Quick journal from share sheet
        startVoiceCapture()
    }
}
```

**Android without Quick Tap**:
```kotlin
// Fallback to shake detection
val sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

sensorManager.registerListener(object : SensorEventListener {
    override fun onSensorChanged(event: SensorEvent) {
        val acceleration = sqrt(
            event.values[0].pow(2) +
            event.values[1].pow(2) +
            event.values[2].pow(2)
        )
        if (acceleration > 15) {
            // Shake detected
            startVoiceJournal()
        }
    }
    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {}
}, accelerometer, SensorManager.SENSOR_DELAY_NORMAL)
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up iOS App Intents
- [ ] Create Android Accessibility Service
- [ ] Implement voice recognition (both platforms)
- [ ] Build local storage (encrypted)
- [ ] Create URL scheme handlers

### Phase 2: Gestures (Weeks 3-4)
- [ ] iOS: Back Tap + Shortcuts integration
- [ ] Android: Quick Tap receiver
- [ ] Test on physical devices
- [ ] Document user setup flows
- [ ] Create onboarding tutorials

### Phase 3: Wearables (Weeks 5-6)
- [ ] Apple Watch complications
- [ ] WatchOS voice capture
- [ ] Wear OS tiles
- [ ] Test gesture detection reliability
- [ ] Optimize battery usage

### Phase 4: Audio Devices (Weeks 7-8)
- [ ] AirPods Shortcuts integration
- [ ] Galaxy Buds SDK implementation
- [ ] Generic Bluetooth headset support
- [ ] Audio feedback design
- [ ] Test in various noise environments

### Phase 5: Polish (Weeks 9-10)
- [ ] User testing (10+ participants)
- [ ] Fix false positive/negative issues
- [ ] Optimize latency (<200ms trigger to capture)
- [ ] Accessibility audit
- [ ] Security audit

---

## Appendix: Platform Support Matrix

| Feature | iOS 14+ | iOS 17+ | Android 12+ | Wear OS 3+ | watchOS 9+ |
|---------|---------|---------|-------------|------------|------------|
| Back Tap | ✅ | ✅ | ⚠️ Pixel only | ❌ | ❌ |
| Voice Shortcuts | ✅ | ✅ | ✅ | ✅ | ✅ |
| App Intents | ❌ | ✅ | N/A | N/A | ❌ |
| NFC Automation | ✅ | ✅ | ✅ | ✅ | ❌ |
| Earbud Gestures | ⚠️ Limited | ⚠️ Limited | ✅ OEM SDK | ❌ | ❌ |
| Button Remap | ❌ | ⚠️ Action btn | ✅ Tasker | ✅ | ✅ |
| Complications | ❌ | ❌ | ❌ | ✅ | ✅ |
| Background Voice | ⚠️ Limited | ⚠️ Limited | ✅ | ✅ | ⚠️ Limited |

**Legend**:
- ✅ Fully supported
- ⚠️ Partially supported / requires workarounds
- ❌ Not available

---

## Support & Documentation

### User Setup Guides

**iOS Quick Start**:
1. Install app
2. Settings → Accessibility → Touch → Back Tap → Double Tap → "Quick Journal"
3. Tap back of phone twice to test
4. Grant microphone permission
5. Done!

**Android Quick Start**:
1. Install app
2. Settings → System → Gestures → Quick Tap → Select "Interstitial Journal"
3. Tap back of phone twice to test
4. Grant microphone + accessibility permissions
5. Done!

### Troubleshooting

**Common Issues**:

| Problem | Solution |
|---------|----------|
| Back tap not working | Check phone case thickness (must be <3mm) |
| Voice not recording | Verify microphone permission in Settings |
| Shortcut not found | Re-install app, restart device |
| Earbud tap ignored | Configure in Bluetooth settings |
| High battery drain | Disable background listening, use on-demand only |

---

**End of Technical Specification**

*For questions or contributions, see `CONTRIBUTING.md`*
