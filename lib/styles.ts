export type Style = {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  seed: string;
};

export const STYLES: Style[] = [
  {
    id: "roblox",
    label: "Roblox",
    emoji: "🟦",
    blurb: "Blocky avatar",
    seed: "Roblox avatar style: blocky cylindrical body, cubic head, classic Roblox face details, vibrant solid colors, low-poly 3D render with the iconic Roblox aesthetic. Maintain the subject's hair color, skin tone, and any distinctive features.",
  },
  {
    id: "fortnite",
    label: "Fortnite",
    emoji: "🎯",
    blurb: "Battle royale",
    seed: "Fortnite character art: stylized Epic Games 3D look, semi-realistic proportions, chunky athletic outfit, expressive cartoon-realism face, vibrant saturated colors, dramatic rim lighting, key-art quality render.",
  },
  {
    id: "pixar",
    label: "Pixar 3D",
    emoji: "✨",
    blurb: "Animated film",
    seed: "Pixar/Disney 3D animated movie character: warm cinematic lighting, large expressive eyes, soft subsurface scattering on skin, exaggerated friendly proportions, rich material detail, key-art composition.",
  },
  {
    id: "anime",
    label: "Anime",
    emoji: "🌸",
    blurb: "Manga-style",
    seed: "High-quality anime character: sharp clean linework, cel-shaded coloring, vibrant key-visual aesthetic, detailed eyes with highlights, dynamic hair flow, modern anime production art style.",
  },
  {
    id: "superhero",
    label: "Superhero",
    emoji: "🦸",
    blurb: "Comic book",
    seed: "Comic-book superhero character: bold form-fitting costume with chest emblem, dramatic dynamic pose, ink and paint illustration, halftone shading, dramatic backlit cinematic atmosphere.",
  },
  {
    id: "gta",
    label: "GTA",
    emoji: "🚗",
    blurb: "Loading-screen art",
    seed: "GTA loading screen illustrated portrait style: gritty stylized digital painting, semi-realistic, bold cel shading with cross-hatched detail, urban backdrop, Rockstar Games key art aesthetic.",
  },
  {
    id: "minecraft",
    label: "Minecraft",
    emoji: "⛏️",
    blurb: "Pixel blocks",
    seed: "Minecraft character: blocky pixel-art skin rendered as a 3D character, signature 16x16 face proportions, low-resolution texture aesthetic, simple cuboid limbs, voxel-world background ambiance.",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    emoji: "🌆",
    blurb: "Neon future",
    seed: "Cyberpunk 2077 character art: neon-lit night-city ambiance, subtle cybernetic augmentations, tech-noir wardrobe, magenta and teal rim lighting, gritty futuristic detail, painterly key art.",
  },
  {
    id: "fantasy",
    label: "Fantasy RPG",
    emoji: "⚔️",
    blurb: "Heroic quest",
    seed: "Fantasy RPG character portrait: ornate armor or arcane robes, painterly digital illustration, atmospheric lighting, mystical background hints, ArtStation-quality concept art with rich material detail.",
  },
];

export function findStyle(id: string): Style | undefined {
  return STYLES.find((s) => s.id === id);
}
