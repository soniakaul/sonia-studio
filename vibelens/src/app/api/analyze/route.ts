import { NextResponse } from "next/server";

export async function POST() {
  const mock = {
    palette: [
      { hex: "#0B0F14", rgb: [11, 15, 20] },
      { hex: "#1D2B3A", rgb: [29, 43, 58] },
      { hex: "#3B6C7A", rgb: [59, 108, 122] },
      { hex: "#E06B5A", rgb: [224, 107, 90] },
      { hex: "#F2B46D", rgb: [242, 180, 109] },
      { hex: "#F7E6C9", rgb: [247, 230, 201] },
    ],
    vibe_words: ["golden hour", "salt air", "soft glow", "calm", "wanderlust"],
    caption: "A quiet sky spilling warmth into the sea.",
    interior: {
      style: "Coastal Minimal",
      keywords: ["linen textures", "warm neutrals", "brushed brass"],
    },
    meta: { latency_ms: 120 },
  };

  return NextResponse.json(mock);
}
