function generateStringRandom(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

/**
 * 
 * @return {string} A randomly generated meeting code, format is XXX-XXX-XXX
 */
export default function generateMeetingCode() {
  return `${generateStringRandom(3)}-${generateStringRandom(
    3
  )}-${generateStringRandom(3)}`;
}
