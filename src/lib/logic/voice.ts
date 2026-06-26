export const useTTS = (message: string, rate = 1, pitch = 1) => {
  // 1. Safe guard: Check if the Web Speech API even exists in this Android WebView
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    console.warn("Speech Synthesis is not supported on this device/environment. Using fallback.");
    playFallbackBeep();
    return;
  }

  try {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(message);

    utterThis.rate = rate || 1;
    utterThis.pitch = pitch || 1;

    // 2. Check if there are voices loaded
    if (synth.getVoices().length > 0) {
      synth.speak(utterThis);
    } else {
      playFallbackBeep();
    }
  } catch (e) {
    console.error("TTS failed:", e);
    playFallbackBeep();
  }
};

// Isolated fallback helper function
const playFallbackBeep = () => {
  try {
    const beep = new Audio('/confirm.mp3');
    beep.play().catch(err => console.error("Audio playback blocked or failed:", err));
  } catch (e) {
    console.error("Audio fallback failed:", e);
  }
};
