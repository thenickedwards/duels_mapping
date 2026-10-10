// FBref records nationality as a FIFA trigram, which often differs from the ISO
// 3166 alpha-2 code that flag emoji are built from (GER is DE, SUI is CH, NED is
// NL). Covers every code in the database; an unknown one simply gets no flag.
const FIFA_TO_ISO = {
  ALB: "AL", ALG: "DZ", ANG: "AO", ARG: "AR", ARM: "AM", ATG: "AG", AUS: "AU",
  AUT: "AT", AZE: "AZ", BAN: "BD", BDI: "BI", BEL: "BE", BEN: "BJ", BFA: "BF", BIH: "BA",
  BLZ: "BZ", BOL: "BO", BRA: "BR", BUL: "BG", CAN: "CA", CHI: "CL", CIV: "CI",
  CMR: "CM", COD: "CD", COL: "CO", CPV: "CV", CRC: "CR", CRO: "HR", CTA: "CF",
  CUB: "CU", CUW: "CW", CYP: "CY", CZE: "CZ", DEN: "DK", DOM: "DO", ECU: "EC",
  EGY: "EG", EQG: "GQ", ESP: "ES", EST: "EE", FIN: "FI", FRA: "FR", GAB: "GA",
  GAM: "GM", GEO: "GE", GER: "DE", GHA: "GH", GLP: "GP", GNB: "GW", GRE: "GR",
  GRN: "GD", GUA: "GT", GUI: "GN", GUM: "GU", GUY: "GY", HAI: "HT", HON: "HN",
  HUN: "HU", IDN: "ID", IRL: "IE", IRN: "IR", IRQ: "IQ", ISL: "IS", ISR: "IL",
  ITA: "IT", JAM: "JM", JPN: "JP", KEN: "KE", KOR: "KR", LBR: "LR", LBY: "LY",
  LIE: "LI", LTU: "LT", LUX: "LU", MAD: "MG", MAR: "MA", MAS: "MY", MDA: "MD", MEX: "MX",
  MLI: "ML", MNE: "ME", MTQ: "MQ", NED: "NL", NGA: "NG", NOR: "NO", NZL: "NZ",
  PAN: "PA", PAR: "PY", PER: "PE", PHI: "PH", PLE: "PS", POL: "PL", POR: "PT",
  PUR: "PR", ROU: "RO", RSA: "ZA", RUS: "RU", RWA: "RW", SEN: "SN", SEY: "SC",
  SKN: "KN", SLE: "SL", SLV: "SV", SOM: "SO", SRB: "RS", SSD: "SS", SUI: "CH",
  SUR: "SR", SVK: "SK", SVN: "SI", SWE: "SE", SYR: "SY", TAN: "TZ", TOG: "TG",
  TRI: "TT", TUN: "TN", TUR: "TR", UGA: "UG", UKR: "UA", URU: "UY", USA: "US",
  VEN: "VE", VIE: "VN", ZAM: "ZM", ZIM: "ZW",
};

// The home nations have no ISO code; their flags are tag sequences on the black
// flag. Northern Ireland has no emoji flag at all, so NIR is left flagless.
const SUBDIVISION_FLAGS = {
  ENG: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  SCO: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  WAL: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}",
};

export function nationalityFlag(fifaCode) {
  const code = fifaCode?.trim().toUpperCase();
  if (!code) return "";
  if (SUBDIVISION_FLAGS[code]) return SUBDIVISION_FLAGS[code];
  const iso = FIFA_TO_ISO[code];
  if (!iso) return "";
  // Each letter maps to its regional indicator symbol (A = U+1F1E6).
  return String.fromCodePoint(
    ...[...iso].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}
