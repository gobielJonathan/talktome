export async function getVideoSharing() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
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
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 60 },
      },
      audio: true,
    });
    return stream;
  } catch (error) {
    return;
  }
}
