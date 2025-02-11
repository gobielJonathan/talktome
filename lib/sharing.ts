export async function getVideoSharing() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920, max: 1920 }, // Maximize resolution for high quality
        height: { ideal: 1080, max: 1080 }, // Full HD resolution
        frameRate: { ideal: 30, max: 60 }, // Balance frame rate for smoothness and performance
      },
      audio: {
        echoCancellation: true, // Reduce echo from audio feedback
        noiseSuppression: true, // Suppress background noise
        sampleRate: 48000, // Ensure high audio sampling rate
      },
    });

    return stream;
  } catch (error) {
    return;
  }
}

export async function getScreenSharing() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920, max: 1920 }, // Maximize resolution for high quality
        height: { ideal: 1080, max: 1080 }, // Full HD resolution
        frameRate: { ideal: 30, max: 60 }, // Balance frame rate for smoothness and performance
      },
      audio: {
        echoCancellation: true, // Reduce echo from audio feedback
        noiseSuppression: true, // Suppress background noise
        sampleRate: 48000, // Ensure high audio sampling rate
      },
    });
    return stream;
  } catch (error) {
    return;
  }
}
