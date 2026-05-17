const UNITS: Record<string, number> = {
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function addExpiresIn(from: Date, expiresIn: string): Date {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const value = Number(match[1]);
  const unit = UNITS[match[2]];
  return new Date(from.getTime() + value * unit);
}
