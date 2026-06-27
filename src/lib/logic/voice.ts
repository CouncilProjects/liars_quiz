
// NOTE: old function that was used in the webapp version. after the port to tauri it needed to use the plugin 
//
/*export const useTTS = (message: string, rate = 1, pitch = 1) => {
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
};*/

// Isolated fallback helper function
const playFallbackBeep = () => {
  try {
    const beep = new Audio('/confirm.mp3');
    beep.play().catch(err => console.error("Audio playback blocked or failed:", err));
  } catch (e) {
    console.error("Audio fallback failed:", e);
  }
};

import { getVoices, speak } from "tauri-plugin-tts-api";


let hasVoice = -1;

// NOTE: Based on https://github.com/brenogonzaga/tauri-plugin-tts
// It 2 main problems were encountered
//  1) Missing libclang.so
//    It needed clang to be installed
//  2) Missing speech-dispatcher/libspeechd.h
//    It needed the development files of speech-dispacher while the machine had only the binaries.
//    dnf install speech-dispatcher-devel was enough to fix it
export const useTTS = async (message: string, rate = 1.0, pitch = 1.0) => {
  if (hasVoice == -1) {
    const voices = await getVoices("en");
    if (voices.length == 0) {
      hasVoice = 0;
    } else {
      hasVoice = 1;
    }
  }
  if (hasVoice == 0) {
    playFallbackBeep();
    return;
  }
  await speak({ text: message, rate: rate, pitch: pitch });
}
