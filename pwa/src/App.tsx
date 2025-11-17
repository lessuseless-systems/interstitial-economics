import { useState, useEffect } from 'react';
import { voiceRecorder, type VoiceRecordingResult } from './services/voice';
import { extractEntities } from './services/extraction';
import './App.css';

// Simple in-memory storage for prototype
// TODO: Replace with Jazz.tools for real sync
interface JournalEntry {
  id: string;
  created: Date;
  transcript: string;
  people: string[];
  duration?: number;
  activity?: string;
  sentiment?: string;
  tags: string[];
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if speech recognition is supported
    if (!voiceRecorder.isSupported()) {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser. Try Safari on iOS or Chrome on desktop.');
    }

    // Load entries from localStorage
    const stored = localStorage.getItem('journal-entries');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed.map((e: any) => ({
          ...e,
          created: new Date(e.created)
        })));
      } catch (err) {
        console.error('Failed to load entries:', err);
      }
    }
  }, []);

  const handleStartRecording = async () => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    let finalTranscript = '';

    await voiceRecorder.startRecording(
      {
        language: 'en-US',
        continuous: false,
        interimResults: true
      },
      // On result
      (result: VoiceRecordingResult) => {
        if (result.isFinal) {
          finalTranscript = result.transcript;
          setTranscript(result.transcript);
          setInterimTranscript('');
        } else {
          setInterimTranscript(result.transcript);
        }
      },
      // On end
      () => {
        setIsRecording(false);

        if (finalTranscript.trim()) {
          saveEntry(finalTranscript);
        }
      },
      // On error
      (errorMsg: string) => {
        setError(errorMsg);
        setIsRecording(false);
      }
    );

    setIsRecording(true);
  };

  const handleStopRecording = () => {
    voiceRecorder.stopRecording();
  };

  const saveEntry = (transcriptText: string) => {
    // Extract entities
    const entities = extractEntities(transcriptText);

    // Create entry
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      created: new Date(),
      transcript: transcriptText,
      people: entities.people,
      duration: entities.duration,
      activity: entities.activity,
      sentiment: entities.sentiment,
      tags: entities.tags
    };

    // Save to state
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);

    // Save to localStorage
    localStorage.setItem('journal-entries', JSON.stringify(updatedEntries));

    console.log('✅ Entry saved:', entry);
  };

  const clearEntries = () => {
    if (confirm('Delete all journal entries?')) {
      setEntries([]);
      localStorage.removeItem('journal-entries');
    }
  };

  return (
    <div className="app">
      {!isSupported && (
        <div className="error-banner">
          Speech recognition not supported. Use Safari (iOS) or Chrome (desktop).
        </div>
      )}

      <div className="main-container">
        {/* Voice Recording Button */}
        <div className="recording-area">
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={!isSupported}
          >
            <div className="record-icon">
              {isRecording ? '⏹' : '🎙️'}
            </div>
            <div className="record-text">
              {isRecording ? 'Tap to Stop' : 'Tap to Journal'}
            </div>
          </button>

          {/* Live Transcript */}
          {(transcript || interimTranscript) && (
            <div className="transcript-display">
              <div className="transcript-final">{transcript}</div>
              {interimTranscript && (
                <div className="transcript-interim">{interimTranscript}</div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Recent Entries */}
        <div className="entries-container">
          <div className="entries-header">
            <h2>Recent Entries ({entries.length})</h2>
            {entries.length > 0 && (
              <button className="clear-button" onClick={clearEntries}>
                Clear All
              </button>
            )}
          </div>

          <div className="entries-list">
            {entries.length === 0 ? (
              <div className="empty-state">
                <p>No entries yet.</p>
                <p>Tap the microphone to start journaling!</p>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <span className="entry-time">
                      {entry.created.toLocaleString()}
                    </span>
                    {entry.activity && (
                      <span className="entry-activity">{entry.activity}</span>
                    )}
                  </div>

                  <div className="entry-transcript">
                    "{entry.transcript}"
                  </div>

                  <div className="entry-metadata">
                    {entry.people.length > 0 && (
                      <div className="entry-people">
                        👤 {entry.people.join(', ')}
                      </div>
                    )}
                    {entry.duration && (
                      <div className="entry-duration">
                        ⏱️ {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                      </div>
                    )}
                    {entry.sentiment && (
                      <div className="entry-sentiment">
                        {entry.sentiment === 'positive' && '😊'}
                        {entry.sentiment === 'negative' && '😔'}
                        {entry.sentiment === 'mixed' && '😐'}
                        {entry.sentiment === 'neutral' && '😶'}
                      </div>
                    )}
                  </div>

                  {entry.tags.length > 0 && (
                    <div className="entry-tags">
                      {entry.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Install Prompt */}
      <div className="install-hint">
        💡 Add to home screen for app-like experience
      </div>
    </div>
  );
}

export default App;
