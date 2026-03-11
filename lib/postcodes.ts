// Allowed postcode outward code prefixes.
// The validation checks if the user's postcode starts with any of these.
// Update this list based on the client's service area.
export const ALLOWED_POSTCODE_PREFIXES = [
  "M",    // Manchester
  "OL",   // Oldham
  "SK",   // Stockport
  "BL",   // Bolton
  "WN",   // Wigan
  "WA",   // Warrington
  "L",    // Liverpool
  "CH",   // Chester
  "CW",   // Crewe
  "ST",   // Stoke-on-Trent
  "DE",   // Derby
  "NG",   // Nottingham
  "S",    // Sheffield
  "HD",   // Huddersfield
  "HX",   // Halifax
  "BD",   // Bradford
  "LS",   // Leeds
  "WF",   // Wakefield
  "DN",   // Doncaster
  "PR",   // Preston
  "BB",   // Blackburn
  "FY",   // Blackpool
  "LA",   // Lancaster
];

export function isPostcodeAllowed(postcode: string): boolean {
  const cleaned = postcode.replace(/\s+/g, "").toUpperCase();
  const letterPrefix = cleaned.match(/^([A-Z]+)/)?.[1] || "";

  return ALLOWED_POSTCODE_PREFIXES.some((prefix) => {
    if (prefix.length === 1) {
      return letterPrefix === prefix;
    }
    return cleaned.startsWith(prefix);
  });
}

export function isValidUKPostcode(postcode: string): boolean {
  const regex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
  return regex.test(postcode.trim());
}
