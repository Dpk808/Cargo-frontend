export function calculateMawbCheckDigit(serial: string | number): string | null {
  const serialNumber = typeof serial === 'number' ? serial : Number.parseInt(serial, 10);

  if (!Number.isInteger(serialNumber) || serialNumber < 0) {
    return null;
  }

  return String(serialNumber % 7);
}
