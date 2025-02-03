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
      video: true,
      audio: true,
    });
    return stream;
  } catch (error) {
    return;
  }
}
