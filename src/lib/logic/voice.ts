
const synth = window.speechSynthesis;

export const useTTS = (message: string,rate=1,pitch=1) => {
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.rate = rate || 1;
    utterThis.pitch = pitch || 1;
    try {

        // Check if there are voices loaded
        if (synth.getVoices().length > 0) {
            synth.speak(utterThis);
        } else {
            // No voices loaded — fallback
            const beep = new Audio('/confirm.mp3');
            beep.play();
        }
    } catch (e) {
        // Any other error — fallback
        const beep = new Audio('/confirm.mp3');
        beep.play();
    }
}