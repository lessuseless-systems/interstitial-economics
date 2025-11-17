/**
 * Voice recording service using Web Speech API
 * Works in Safari on iOS and Chrome/Edge on desktop
 */

// Type definitions for Web Speech API (not in all TS libs)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface VoiceRecordingOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface VoiceRecordingResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export class VoiceRecorder {
  private recognition: SpeechRecognition | null = null;
  private isRecording = false;

  constructor() {
    // Check if browser supports Speech Recognition
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
  }

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Start recording voice
   */
  async startRecording(
    options: VoiceRecordingOptions = {},
    onResult: (result: VoiceRecordingResult) => void,
    onEnd: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return;
    }

    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    // Configure recognition
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.lang = options.language ?? 'en-US';
    this.recognition.maxAlternatives = options.maxAlternatives ?? 1;

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isRecording = true;
      console.log('Voice recording started');
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      console.log('Voice recording ended');
      onEnd();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const alternative = result[0];

      onResult({
        transcript: alternative.transcript,
        isFinal: result.isFinal,
        confidence: alternative.confidence
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isRecording = false;

      // User-friendly error messages
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Try speaking louder.',
        'audio-capture': 'Microphone not accessible. Check permissions.',
        'not-allowed': 'Microphone permission denied.',
        'network': 'Network error. Check your connection.',
        'aborted': 'Recording was stopped.'
      };

      onError(errorMessages[event.error] || `Error: ${event.error}`);
    };

    // Start recognition
    try {
      this.recognition.start();
    } catch (error) {
      this.isRecording = false;
      onError(error instanceof Error ? error.message : 'Failed to start recording');
    }
  }

  /**
   * Stop recording
   */
  stopRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  }

  /**
   * Abort recording immediately
   */
  abortRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.abort();
      this.isRecording = false;
    }
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }
}

// Export singleton instance
export const voiceRecorder = new VoiceRecorder();
