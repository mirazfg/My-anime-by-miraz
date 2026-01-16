
import { Anime, Genre, ListStatus } from './types';

// Optimized to be AI-Safe (avoiding trigger words like 'rifle', 'blood', 'sexy')
// while maintaining the specific aesthetic requested.
export const GENRE_PROMPTS: Record<string, string> = {
  [Genre.Psychological]: "Anime character in shadow, glowing eyes, floating abstract symbols, intense atmosphere, cinematic lighting, surreal art style",
  [Genre.Shonen]: "Determined anime hero, spiky hair, glowing energy fist, dynamic wind effects, swirling particles, action pose, vibrant colors",
  [Genre.Adventure]: "Anime traveler with cloak and backpack standing on a cliff, wind moving cape, dust and light particles swirling, wide fantasy landscape behind",
  [Genre.Action]: "Anime battle scene, high speed motion blur, sparks, dynamic angle, energy trails, dramatic impact, intense action",
  [Genre.Isekai]: "Anime boy or girl being pulled into a glowing magical portal, floating runes around, cloak flowing, energy effects",
  [Genre.Mystery]: "Masked anime man with half-hidden face, sly smile, drifting fog, glowing eyes beneath the mask",
  [Genre.Comedy]: "Chibi-style anime character laughing uncontrollably, exaggerated expression, bouncing animation, pastel glow",
  [Genre.Supernatural]: "Anime character surrounded by spirits or floating blue flames, glowing symbols, eerie but stylish aura",
  [Genre.Seinen]: "Mature anime portrait, city rain background, neon lights reflection, cinematic depth of field, serious mood, detailed shading",
  [Genre.Ecchi]: "Stylish anime girl with confident pose, soft lighting, subtle motion like hair sway, playful expression, no explicit content",
  [Genre.Military]: "Anime soldier in tactical gear, sci-fi rifle lowered, floating holographic HUD elements, slow camera shake effect",
  [Genre.Music]: "Anime girl wearing headphones, eyes closed, sound waves visualized as glowing lines moving rhythmically",
  [Genre.School]: "Anime student standing in a school hallway, sunlight through windows, gentle dust particles floating",
  [Genre.Shojo]: "Elegant anime girl with flowing hair, soft eyes, pastel glow, slow blinking animation",
  [Genre.Romance]: "Anime couple under an umbrella, gentle rain, warm sunset glow, emotional moment, soft lighting, sentimental mood",
  [Genre.Fantasy]: "Anime mage casting spell, glowing magic circle, elemental effects, fantasy robes, magical staff, mythical atmosphere",
  [Genre.SciFi]: "Cyberpunk anime character, neon city background, holographic interface, futuristic tech wear, glowing circuits, high tech",
  [Genre.Thriller]: "Suspenseful anime scene, dark alley, sharp contrast lighting, silhouette, tense atmosphere, mystery thriller vibe",
  [Genre.Horror]: "Anime figure partially hidden in darkness, red glowing eyes, creeping fog, ominous atmosphere",
  [Genre.Drama]: "Anime character looking away with teary eyes, wind moving hair gently, muted cinematic colors",
  [Genre.SliceOfLife]: "Anime character sipping tea by a window, calm breathing animation, warm ambient lighting",
  [Genre.Sports]: "Anime athlete in action, sweat drops, intense focus, speed lines, stadium background, dynamic energy, sports motion",
  [Genre.All]: "Futuristic anime hub, multiple screens showing diverse worlds, neon blue and pink aesthetic, immersive tech, cyberpunk interface",
  [Genre.Mecha]: "Giant anime robot in hangar, mechanic repairs, sparks, metallic textures, massive scale, sci-fi machinery, glowing eyes",
  [Genre.Harem]: "Anime protagonist with diverse group of friends, colorful character designs, cheerful school setting, bright lighting, anime cast",
  [Genre.Magic]: "Anime wizard reading glowing grimoire, floating magical items, library background, mystical light effects, spellcasting",
  [Genre.Historical]: "Samurai anime character, traditional kimono, katana, cherry blossoms, ancient temple background, historical aesthetic, sepia tones",
  [Genre.Space]: "Anime astronaut looking at galaxy, spaceship interior, stars reflection, deep space nebula, sci-fi wonder, cosmic view",
  [Genre.Josei]: "Mature anime woman, soft elegant lighting, realistic proportions, emotional expression, josei art style, sophisticated atmosphere",
  [Genre.Vampire]: "Anime vampire with glowing red eyes, gothic castle background, bats, dark atmosphere, pale skin, fangs, supernatural aura",
  [Genre.Samurai]: "Anime samurai drawing katana, cherry blossoms falling, traditional japanese temple, intense focus, historical wear, bushido spirit",
  [Genre.ShonenAi]: "Two anime characters, gentle emotional connection, soft focus, pastel colors, shonen-ai aesthetic, subtle romance, warm lighting",
  [Genre.MartialArts]: "Anime martial artist in combat stance, dynamic action lines, dojo background, intense focus, muscular build",
  [Genre.Game]: "Anime character wearing VR headset, digital particles, game interface overlay, health bars, pixel art elements, cybernetic glow",
  [Genre.Kids]: "Bright colorful anime characters, cute animals, sunny park background, cheerful atmosphere, simple shapes, vibrant saturation",
  [Genre.Police]: "Anime detective in trench coat, crime scene tape, flashing police lights, night city street, noir style, serious expression",
  [Genre.Cars]: "Anime street racing car drifting, smoke from tires, speed lines, night city highway, neon reflections on metal, intense motion",
  [Genre.SuperPower]: "Anime hero charging energy blast, glowing aura, flying rocks, lightning crackles, intense power display, dynamic angle",
  [Genre.Dementia]: "Abstract anime art, distorted reality, psychological horror, mind-bending visuals, surreal atmosphere, intense emotion, experimental style"
};

export const AVATAR_PRESETS = [
  'https://cdn.myanimelist.net/images/characters/9/131317.jpg', // Naruto
  'https://cdn.myanimelist.net/images/characters/9/310307.jpg', // Luffy
  'https://cdn.myanimelist.net/images/characters/2/439665.jpg', // Makima
  'https://cdn.myanimelist.net/images/characters/16/427603.jpg', // Gojo
  'https://cdn.myanimelist.net/images/characters/10/249647.jpg', // L
  'https://cdn.myanimelist.net/images/characters/5/283838.jpg', // Zero Two
  'https://cdn.myanimelist.net/images/characters/11/288487.jpg', // Eren
  'https://cdn.myanimelist.net/images/characters/14/177063.jpg', // Mikasa
  'https://cdn.myanimelist.net/images/characters/4/333486.jpg', // Rem
  'https://cdn.myanimelist.net/images/characters/6/473723.jpg', // Yor
  'https://cdn.myanimelist.net/images/characters/11/294155.jpg', // Saitama
  'https://cdn.myanimelist.net/images/characters/2/252877.jpg', // Ken Kaneki
  'https://cdn.myanimelist.net/images/characters/11/307436.jpg', // Itachi
  'https://cdn.myanimelist.net/images/characters/4/302636.jpg', // Levi
  'https://cdn.myanimelist.net/images/characters/14/434674.jpg', // Anya
  'https://cdn.myanimelist.net/images/characters/3/368536.jpg', // Violet Evergarden
  'https://cdn.myanimelist.net/images/characters/5/341238.jpg', // Tanjiro
  'https://cdn.myanimelist.net/images/characters/3/462111.jpg', // Marin Kitagawa
  'https://cdn.myanimelist.net/images/characters/8/388836.jpg', // Megumi Fushiguro
  'https://cdn.myanimelist.net/images/characters/12/439663.jpg', // Power
  'https://cdn.myanimelist.net/images/characters/9/346857.jpg', // Nezuko
  'https://cdn.myanimelist.net/images/characters/2/393766.jpg', // Chika Fujiwara
  'https://cdn.myanimelist.net/images/characters/7/284129.jpg', // Yato
  'https://cdn.myanimelist.net/images/characters/5/306716.jpg', // Kakashi
  'https://cdn.myanimelist.net/images/characters/15/287042.jpg', // Killua
  'https://cdn.myanimelist.net/images/characters/5/279860.jpg', // Gon
  'https://cdn.myanimelist.net/images/characters/16/275306.jpg', // Hisoka
  'https://cdn.myanimelist.net/images/characters/13/467664.jpg', // Bocchi
  'https://cdn.myanimelist.net/images/characters/10/404090.jpg', // Sukuna
  'https://cdn.myanimelist.net/images/characters/8/443658.jpg', // Loid Forger
  'https://cdn.myanimelist.net/images/characters/4/267861.jpg', // Asuna
  'https://cdn.myanimelist.net/images/characters/13/284126.jpg', // Kirito
  'https://cdn.myanimelist.net/images/characters/9/72533.jpg', // Edward Elric
  'https://cdn.myanimelist.net/images/characters/10/267923.jpg', // Mustang
  'https://cdn.myanimelist.net/images/characters/11/353457.jpg', // Rimuru Tempest
  'https://cdn.myanimelist.net/images/characters/4/187640.jpg', // Gintoki
  'https://cdn.myanimelist.net/images/characters/2/411333.jpg', // Thorfinn
  'https://cdn.myanimelist.net/images/characters/5/281699.jpg', // Hinata Shoyo
  'https://cdn.myanimelist.net/images/characters/2/261051.jpg', // Kageyama
  'https://cdn.myanimelist.net/images/characters/10/252229.jpg', // Zoro
  'https://cdn.myanimelist.net/images/characters/3/252231.jpg', // Sanji
  'https://cdn.myanimelist.net/images/characters/5/252233.jpg', // Nami
  'https://cdn.myanimelist.net/images/characters/4/278479.jpg', // Robin
  'https://cdn.myanimelist.net/images/characters/2/313364.jpg', // Chopper
  'https://cdn.myanimelist.net/images/characters/4/339109.jpg', // Megumin
  'https://cdn.myanimelist.net/images/characters/14/339110.jpg', // Aqua
  'https://cdn.myanimelist.net/images/characters/10/333792.jpg', // Kazuma
  'https://cdn.myanimelist.net/images/characters/10/333793.jpg', // Darkness
  'https://cdn.myanimelist.net/images/characters/15/456101.jpg', // Frieren
  'https://cdn.myanimelist.net/images/characters/8/511003.jpg', // Fern
  'https://cdn.myanimelist.net/images/characters/2/511004.jpg', // Stark
  'https://cdn.myanimelist.net/images/characters/14/505202.jpg', // Maomao
  'https://cdn.myanimelist.net/images/characters/11/520111.jpg', // Jinwoo Sung
  'https://cdn.myanimelist.net/images/characters/3/305273.jpg', // Light Yagami
  'https://cdn.myanimelist.net/images/characters/16/332155.jpg', // Lelouch
  'https://cdn.myanimelist.net/images/characters/6/158373.jpg', // CC
  'https://cdn.myanimelist.net/images/characters/5/444262.jpg', // Hori
  'https://cdn.myanimelist.net/images/characters/7/444263.jpg', // Miyamura
  'https://cdn.myanimelist.net/images/characters/9/105421.jpg', // Spike Spiegel
  'https://cdn.myanimelist.net/images/characters/11/285655.jpg', // Faye Valentine
  'https://cdn.myanimelist.net/images/characters/3/135973.jpg', // Shinji Ikari
  'https://cdn.myanimelist.net/images/characters/5/341355.jpg', // Rei Ayanami
  'https://cdn.myanimelist.net/images/characters/2/86259.jpg', // Asuka
  'https://cdn.myanimelist.net/images/characters/12/283626.jpg', // Holo
  'https://cdn.myanimelist.net/images/characters/13/116963.jpg', // Lawrence
  'https://cdn.myanimelist.net/images/characters/6/289568.jpg', // Kurisu Makise
  'https://cdn.myanimelist.net/images/characters/6/159199.jpg', // Okabe Rintarou
  'https://cdn.myanimelist.net/images/characters/14/121980.jpg', // Saber
  'https://cdn.myanimelist.net/images/characters/6/275990.jpg', // Gilgamesh
  'https://cdn.myanimelist.net/images/characters/8/164019.jpg', // Rin Tohsaka
  'https://cdn.myanimelist.net/images/characters/16/327318.jpg', // Emilia
  'https://cdn.myanimelist.net/images/characters/5/369766.jpg', // Mai Sakurajima
  'https://cdn.myanimelist.net/images/characters/9/326871.jpg', // Mob
  'https://cdn.myanimelist.net/images/characters/16/313386.jpg', // Reigen
  'https://cdn.myanimelist.net/images/characters/15/344078.jpg', // Deku
  'https://cdn.myanimelist.net/images/characters/10/314781.jpg', // Bakugo
  'https://cdn.myanimelist.net/images/characters/9/335824.jpg', // Todoroki
  'https://cdn.myanimelist.net/images/characters/13/284128.jpg', // Hiyori
  'https://cdn.myanimelist.net/images/characters/12/309530.jpg', // Yuno Gasai
  'https://cdn.myanimelist.net/images/characters/4/339851.jpg', // Kanna Kamui
  'https://cdn.myanimelist.net/images/characters/2/359235.jpg', // Tohru
  'https://cdn.myanimelist.net/images/characters/11/484961.jpg', // Chisato
  'https://cdn.myanimelist.net/images/characters/8/484962.jpg', // Takina
  'https://cdn.myanimelist.net/images/characters/15/334800.jpg', // 02
  'https://cdn.myanimelist.net/images/characters/9/281315.jpg', // Ichigo
  'https://cdn.myanimelist.net/images/characters/13/260797.jpg', // Rukia
  'https://cdn.myanimelist.net/images/characters/4/364273.jpg', // Senku
  'https://cdn.myanimelist.net/images/characters/7/439700.jpg', // Aki Hayakawa
  'https://cdn.myanimelist.net/images/characters/5/284132.jpg', // Yukine
  'https://cdn.myanimelist.net/images/characters/4/293910.jpg', // Albedo
  'https://cdn.myanimelist.net/images/characters/2/293909.jpg', // Ainz Ooal Gown
  'https://cdn.myanimelist.net/images/characters/13/237617.jpg', // Jojo
  'https://cdn.myanimelist.net/images/characters/6/242279.jpg', // Dio
  'https://cdn.myanimelist.net/images/characters/3/478543.jpg', // Shadow
];

// Comprehensive Anime Database
const ANIME_TITLES_LIST = [
  // --- The Big 3 & Shonen Giants ---
  { t: "One Piece", g: [Genre.Action, Genre.Adventure, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/6/73245.jpg" },
  { t: "Naruto", g: [Genre.Action, Genre.Adventure, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/13/17405.jpg" },
  { t: "Naruto Shippuden", g: [Genre.Action, Genre.Adventure, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/5/17407.jpg" },
  { t: "Boruto: Naruto Next Generations", g: [Genre.Action, Genre.Adventure, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/9/84460.jpg" },
  { t: "Bleach", g: [Genre.Action, Genre.Supernatural, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/3/40451.jpg" },
  { t: "Dragon Ball", g: [Genre.Action, Genre.Adventure, Genre.Comedy], p: "https://cdn.myanimelist.net/images/anime/1887/92644.jpg" },
  { t: "Dragon Ball Z", g: [Genre.Action, Genre.Shonen, Genre.SuperPower], p: "https://cdn.myanimelist.net/images/anime/6/20936.jpg" },
  { t: "Dragon Ball Super", g: [Genre.Action, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/7/74606.jpg" },
  { t: "Hunter x Hunter (2011)", g: [Genre.Action, Genre.Adventure, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/11/33657.jpg" },
  { t: "Fairy Tail", g: [Genre.Action, Genre.Adventure, Genre.Magic], p: "https://cdn.myanimelist.net/images/anime/5/17834.jpg" },
  { t: "Fullmetal Alchemist", g: [Genre.Action, Genre.Adventure, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/10/75815.jpg" },
  { t: "Fullmetal Alchemist: Brotherhood", g: [Genre.Action, Genre.Adventure, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" },
  { t: "One Punch Man", g: [Genre.Action, Genre.Comedy, Genre.SuperPower], p: "https://cdn.myanimelist.net/images/anime/12/76049.jpg" },
  { t: "Mob Psycho 100", g: [Genre.Action, Genre.Comedy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1993/93836.jpg" },
  { t: "Attack on Titan", g: [Genre.Action, Genre.Drama, Genre.Military], p: "https://cdn.myanimelist.net/images/anime/10/47347.jpg" },
  { t: "Demon Slayer: Kimetsu no Yaiba", g: [Genre.Action, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
  { t: "Jujutsu Kaisen", g: [Genre.Action, Genre.Supernatural, Genre.School], p: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg" },
  { t: "My Hero Academia", g: [Genre.Action, Genre.School, Genre.SuperPower], p: "https://cdn.myanimelist.net/images/anime/10/78745.jpg" },
  { t: "Chainsaw Man", g: [Genre.Action, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg" },
  { t: "Tokyo Revengers", g: [Genre.Action, Genre.Drama, Genre.School], p: "https://cdn.myanimelist.net/images/anime/1839/122012.jpg" },
  { t: "Black Clover", g: [Genre.Action, Genre.Comedy, Genre.Magic], p: "https://cdn.myanimelist.net/images/anime/2/88336.jpg" },
  { t: "Soul Eater", g: [Genre.Action, Genre.Fantasy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/9/13813.jpg" },
  { t: "Blue Exorcist", g: [Genre.Action, Genre.Fantasy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/2/75195.jpg" },
  { t: "Fire Force", g: [Genre.Action, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1155/101859.jpg" },
  { t: "The Seven Deadly Sins", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/8/65409.jpg" },
  { t: "Magi: The Labyrinth of Magic", g: [Genre.Action, Genre.Adventure, Genre.Magic], p: "https://cdn.myanimelist.net/images/anime/11/39711.jpg" },
  { t: "Akame ga Kill!", g: [Genre.Action, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1429/95946.jpg" },
  { t: "Sakamoto Days", g: [Genre.Action, Genre.Comedy], p: "https://cdn.myanimelist.net/images/anime/1239/143584.jpg" },
  { t: "D.Gray-man", g: [Genre.Action, Genre.Adventure, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/13/83058.jpg" },
  { t: "Shaman King", g: [Genre.Action, Genre.Adventure, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/12/30353.jpg" },
  { t: "Yu-Gi-Oh!", g: [Genre.Game, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/11/18567.jpg" },
  { t: "World Trigger", g: [Genre.Action, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/12/66847.jpg" },

  // --- Isekai & Fantasy Worlds ---
  { t: "Re:Zero", g: [Genre.Drama, Genre.Fantasy, Genre.Isekai], p: "https://cdn.myanimelist.net/images/anime/11/79410.jpg" },
  { t: "Mushoku Tensei: Jobless Reincarnation", g: [Genre.Adventure, Genre.Drama, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1530/117776.jpg" },
  { t: "That Time I Got Reincarnated as a Slime", g: [Genre.Adventure, Genre.Fantasy, Genre.Isekai], p: "https://cdn.myanimelist.net/images/anime/2/95978.jpg" },
  { t: "Overlord", g: [Genre.Action, Genre.Fantasy, Genre.Game], p: "https://cdn.myanimelist.net/images/anime/1284/93139.jpg" },
  { t: "No Game No Life", g: [Genre.Adventure, Genre.Comedy, Genre.Game], p: "https://cdn.myanimelist.net/images/anime/1074/111944.jpg" },
  { t: "Konosuba", g: [Genre.Adventure, Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/8/82544.jpg" },
  { t: "The Rising of the Shield Hero", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/18/95587.jpg" },
  { t: "Sword Art Online", g: [Genre.Action, Genre.Adventure, Genre.Game], p: "https://cdn.myanimelist.net/images/anime/11/39717.jpg" },
  { t: "Log Horizon", g: [Genre.Action, Genre.Adventure, Genre.Game], p: "https://cdn.myanimelist.net/images/anime/5/55199.jpg" },
  { t: "The Eminence in Shadow", g: [Genre.Action, Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1874/127418.jpg" },
  { t: "Goblin Slayer", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1105/94998.jpg" },
  { t: "DanMachi", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/2/70187.jpg" },
  { t: "Ascendance of a Bookworm", g: [Genre.Fantasy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1730/103173.jpg" },
  { t: "The Faraway Paladin", g: [Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1184/117972.jpg" },
  { t: "Campfire Cooking in Another World", g: [Genre.Adventure, Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1586/132179.jpg" },
  { t: "Handyman Saitō in Another World", g: [Genre.Adventure, Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1760/132177.jpg" },
  { t: "Reincarnated as a Sword", g: [Genre.Action, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1207/127110.jpg" },
  { t: "Skeleton Knight in Another World", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1199/122026.jpg" },
  { t: "How Not to Summon a Demon Lord", g: [Genre.Comedy, Genre.Fantasy, Genre.Ecchi], p: "https://cdn.myanimelist.net/images/anime/1322/94406.jpg" },
  { t: "Grimgar of Fantasy and Ash", g: [Genre.Action, Genre.Adventure, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/13/77983.jpg" },
  { t: "Cautious Hero", g: [Genre.Action, Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1368/103986.jpg" },
  { t: "Arifureta", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1765/124707.jpg" },
  { t: "Uncle from Another World", g: [Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1226/124803.jpg" },
  { t: "The Saint's Magic Power is Omnipotent", g: [Genre.Fantasy, Genre.Romance, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1769/113821.jpg" },
  { t: "By the Grace of the Gods", g: [Genre.Fantasy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1458/109154.jpg" },
  { t: "How a Realist Hero Rebuilt the Kingdom", g: [Genre.Action, Genre.Fantasy, Genre.Military], p: "https://cdn.myanimelist.net/images/anime/1331/116930.jpg" },
  { t: "My Next Life as a Villainess", g: [Genre.Comedy, Genre.Fantasy, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/1844/106680.jpg" },
  { t: "Drifters", g: [Genre.Action, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/6/81577.jpg" },
  { t: "Fate/Zero", g: [Genre.Action, Genre.Fantasy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/2/73249.jpg" },
  { t: "Fate/stay night: Unlimited Blade Works", g: [Genre.Action, Genre.Fantasy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/12/76049.jpg" },
  { t: "Fate/stay night", g: [Genre.Action, Genre.Fantasy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/8/164019.jpg" },

  // --- Modern Hits & Trending ---
  { t: "Solo Leveling", g: [Genre.Action, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1792/138036.jpg" },
  { t: "Oshi no Ko", g: [Genre.Drama, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1812/134736.jpg" },
  { t: "Spy x Family", g: [Genre.Action, Genre.Comedy], p: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg" },
  { t: "Dandadan", g: [Genre.Action, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1928/143586.jpg" },
  { t: "Bocchi the Rock!!", g: [Genre.Comedy, Genre.Music, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1448/127968.jpg" },
  { t: "Frieren: Beyond Journey's End", g: [Genre.Adventure, Genre.Fantasy, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg" },
  { t: "Kaiju No. 8", g: [Genre.Action, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1948/142981.jpg" },
  { t: "Shangri-La Frontier", g: [Genre.Action, Genre.Adventure, Genre.Game], p: "https://cdn.myanimelist.net/images/anime/1505/138992.jpg" },
  { t: "Lycoris Recoil", g: [Genre.Action, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1529/124765.jpg" },
  { t: "Zom 100: Bucket List of the Dead", g: [Genre.Action, Genre.Comedy, Genre.Horror], p: "https://cdn.myanimelist.net/images/anime/1384/136408.jpg" },
  { t: "Mashle: Magic and Muscles", g: [Genre.Action, Genre.Comedy, Genre.Magic], p: "https://cdn.myanimelist.net/images/anime/1233/135081.jpg" },
  { t: "Record of Ragnarok", g: [Genre.Action, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1647/115340.jpg" },
  { t: "The Apothecary Diaries", g: [Genre.Drama, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/1738/138804.jpg" },
  { t: "Delicious in Dungeon", g: [Genre.Adventure, Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1412/140417.jpg" },
  { t: "Witch Hat Atelier", g: [Genre.Adventure, Genre.Fantasy, Genre.Magic], p: "https://cdn.myanimelist.net/images/anime/1841/122550.jpg" },
  { t: "Ranking of Kings", g: [Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1347/117616.jpg" },
  { t: "Blue Period", g: [Genre.Drama, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1077/116650.jpg" },
  { t: "Skip and Loafer", g: [Genre.Romance, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1627/132924.jpg" },
  { t: "Hell's Paradise", g: [Genre.Action, Genre.Historical, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1758/134604.jpg" },

  // --- Sci-Fi & Mecha Classics ---
  { t: "Neon Genesis Evangelion", g: [Genre.Mecha, Genre.Psychological, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1314/87535.jpg" },
  { t: "Cowboy Bebop", g: [Genre.Action, Genre.SciFi, Genre.Space], p: "https://cdn.myanimelist.net/images/anime/4/19644.jpg" },
  { t: "Code Geass", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/5/50331.jpg" },
  { t: "Gurren Lagann", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/4/5123.jpg" },
  { t: "Cyberpunk: Edgerunners", g: [Genre.Action, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1818/126435.jpg" },
  { t: "Psycho-Pass", g: [Genre.Action, Genre.SciFi, Genre.Police], p: "https://cdn.myanimelist.net/images/anime/5/43399.jpg" },
  { t: "Ghost in the Shell", g: [Genre.SciFi, Genre.Police, Genre.Psychological], p: "https://cdn.myanimelist.net/images/anime/10/82594.jpg" },
  { t: "Akira", g: [Genre.SciFi, Genre.Action], p: "https://cdn.myanimelist.net/images/anime/1410/142646.jpg" },
  { t: "Mobile Suit Gundam", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/10/77335.jpg" },
  { t: "Mobile Suit Gundam Wing", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/6/21653.jpg" },
  { t: "Mobile Suit Gundam SEED", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/7/77161.jpg" },
  { t: "Mobile Suit Gundam: Iron-Blooded Orphans", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/5/75639.jpg" },
  { t: "86", g: [Genre.Action, Genre.Drama, Genre.Mecha], p: "https://cdn.myanimelist.net/images/anime/1963/114539.jpg" },
  { t: "Full Metal Panic!", g: [Genre.Action, Genre.Comedy, Genre.Mecha], p: "https://cdn.myanimelist.net/images/anime/8/19323.jpg" },
  { t: "Eureka Seven", g: [Genre.Adventure, Genre.Drama, Genre.Mecha], p: "https://cdn.myanimelist.net/images/anime/2/74404.jpg" },
  { t: "Macross Frontier", g: [Genre.Action, Genre.Mecha, Genre.Music], p: "https://cdn.myanimelist.net/images/anime/1/2565.jpg" },
  { t: "Darling in the FranXX", g: [Genre.Action, Genre.Mecha, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/1614/90408.jpg" },
  { t: "Vivy: Fluorite Eye’s Song", g: [Genre.Action, Genre.Music, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1666/114643.jpg" },
  { t: "Steins;Gate", g: [Genre.SciFi, Genre.Thriller], p: "https://cdn.myanimelist.net/images/anime/5/73199.jpg" },
  { t: "Parasyte: The Maxim", g: [Genre.Action, Genre.Horror, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/3/73178.jpg" },
  { t: "Serial Experiments Lain", g: [Genre.Dementia, Genre.Psychological, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/9/87455.jpg" },
  { t: "Texhnolyze", g: [Genre.Drama, Genre.Psychological, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/10/19086.jpg" },
  { t: "Ergo Proxy", g: [Genre.Mystery, Genre.Psychological, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/11/13945.jpg" },
  { t: "Legend of the Galactic Heroes", g: [Genre.Drama, Genre.Military, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/13/13225.jpg" },
  { t: "Planetes", g: [Genre.Drama, Genre.Romance, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/3/17709.jpg" },
  { t: "Space Brothers", g: [Genre.Comedy, Genre.SciFi, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/11/33923.jpg" },
  { t: "Redline", g: [Genre.Action, Genre.Cars, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/12/28552.jpg" },

  // --- Dark, Horror & Thriller ---
  { t: "Death Note", g: [Genre.Mystery, Genre.Psychological, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/9/9453.jpg" },
  { t: "Monster", g: [Genre.Mystery, Genre.Psychological, Genre.Thriller], p: "https://cdn.myanimelist.net/images/anime/10/18793.jpg" },
  { t: "Berserk (1997)", g: [Genre.Action, Genre.Adventure, Genre.Horror], p: "https://cdn.myanimelist.net/images/anime/13/24587.jpg" },
  { t: "Hellsing Ultimate", g: [Genre.Action, Genre.Horror, Genre.Vampire], p: "https://cdn.myanimelist.net/images/anime/6/73331.jpg" },
  { t: "Devilman Crybaby", g: [Genre.Action, Genre.Horror, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1795/95088.jpg" },
  { t: "Made in Abyss", g: [Genre.Adventure, Genre.Fantasy, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/6/86733.jpg" },
  { t: "The Promised Neverland", g: [Genre.Horror, Genre.Mystery, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1125/96929.jpg" },
  { t: "Another", g: [Genre.Horror, Genre.Mystery, Genre.Thriller], p: "https://cdn.myanimelist.net/images/anime/4/75509.jpg" },
  { t: "Mirai Nikki", g: [Genre.Action, Genre.Mystery, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/13/33465.jpg" },
  { t: "Erased", g: [Genre.Mystery, Genre.Supernatural, Genre.Thriller], p: "https://cdn.myanimelist.net/images/anime/12/76649.jpg" },
  { t: "Terror in Resonance", g: [Genre.Mystery, Genre.Psychological, Genre.Thriller], p: "https://cdn.myanimelist.net/images/anime/1476/93605.jpg" },
  { t: "Perfect Blue", g: [Genre.Dementia, Genre.Horror, Genre.Psychological], p: "https://cdn.myanimelist.net/images/anime/1075/104646.jpg" },
  { t: "Paprika", g: [Genre.Fantasy, Genre.Horror, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/10/75210.jpg" },
  { t: "Dorohedoro", g: [Genre.Action, Genre.Fantasy, Genre.Horror], p: "https://cdn.myanimelist.net/images/anime/1169/106307.jpg" },
  { t: "Black Lagoon", g: [Genre.Action, Genre.Seinen], p: "https://cdn.myanimelist.net/images/anime/1908/135111.jpg" },
  { t: "Bungo Stray Dogs", g: [Genre.Action, Genre.Mystery, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1344/92025.jpg" },
  { t: "Elfen Lied", g: [Genre.Action, Genre.Drama, Genre.Horror], p: "https://cdn.myanimelist.net/images/anime/10/2928.jpg" },
  { t: "Gantz", g: [Genre.Action, Genre.Horror, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/9/13429.jpg" },
  { t: "Claymore", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1460/96434.jpg" },
  { t: "Shinsekai Yori", g: [Genre.Drama, Genre.Horror, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/16/36489.jpg" },
  { t: "Mononoke", g: [Genre.Fantasy, Genre.Horror, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/8/55013.jpg" },
  { t: "The Flowers of Evil", g: [Genre.Drama, Genre.Psychological, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/10/48731.jpg" },
  { t: "Pet Shop of Horrors", g: [Genre.Horror, Genre.Mystery, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/3/17300.jpg" },

  // --- Romance, Drama & Slice of Life ---
  { t: "Violet Evergarden", g: [Genre.Drama, Genre.Fantasy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1795/95088.jpg" },
  { t: "Your Name", g: [Genre.Drama, Genre.Romance, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/5/87048.jpg" },
  { t: "A Silent Voice", g: [Genre.Drama, Genre.School, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/1122/96929.jpg" },
  { t: "Weathering With You", g: [Genre.Drama, Genre.Fantasy, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/1880/101146.jpg" },
  { t: "Suzume", g: [Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1583/126939.jpg" },
  { t: "Spirited Away", g: [Genre.Adventure, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/6/430.jpg" },
  { t: "Princess Mononoke", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/7/75199.jpg" },
  { t: "Howl's Moving Castle", g: [Genre.Adventure, Genre.Fantasy, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/5/75810.jpg" },
  { t: "Kiki's Delivery Service", g: [Genre.Adventure, Genre.Comedy, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/5/75808.jpg" },
  { t: "Castle in the Sky", g: [Genre.Adventure, Genre.Fantasy, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/3/47856.jpg" },
  { t: "Grave of the Fireflies", g: [Genre.Drama, Genre.Historical], p: "https://cdn.myanimelist.net/images/anime/1628/112674.jpg" },
  { t: "The Boy and the Heron", g: [Genre.Adventure, Genre.Drama, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1559/137683.jpg" },
  { t: "Kaguya-sama: Love is War", g: [Genre.Comedy, Genre.Psychological, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/1295/106551.jpg" },
  { t: "Horimiya", g: [Genre.Comedy, Genre.Romance, Genre.School], p: "https://cdn.myanimelist.net/images/anime/1695/111486.jpg" },
  { t: "My Dress-Up Darling", g: [Genre.Romance, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1179/119897.jpg" },
  { t: "Fruits Basket (2019)", g: [Genre.Drama, Genre.Romance, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/4/99505.jpg" },
  { t: "Clannad: After Story", g: [Genre.Drama, Genre.Romance, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/13/24647.jpg" },
  { t: "Your Lie in April", g: [Genre.Drama, Genre.Music, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/3/67177.jpg" },
  { t: "Anohana", g: [Genre.Drama, Genre.SliceOfLife, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/5/79697.jpg" },
  { t: "March Comes in Like a Lion", g: [Genre.Drama, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1693/116976.jpg" },
  { t: "Usagi Drop", g: [Genre.Josei, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/2/29665.jpg" },
  { t: "Barakamon", g: [Genre.Comedy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1498/95646.jpg" },
  { t: "Hyouka", g: [Genre.Mystery, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/13/50521.jpg" },
  { t: "Silver Spoon", g: [Genre.Comedy, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/8/51151.jpg" },
  { t: "Natsume's Book of Friends", g: [Genre.Drama, Genre.SliceOfLife, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1908/93807.jpg" },
  { t: "Mushishi", g: [Genre.Adventure, Genre.Fantasy, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/1053/116997.jpg" },
  { t: "Spice and Wolf", g: [Genre.Adventure, Genre.Fantasy, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/1844/141042.jpg" },
  { t: "Yona of the Dawn", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/9/68095.jpg" },
  { t: "Snow White with the Red Hair", g: [Genre.Drama, Genre.Fantasy, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/1206/95393.jpg" },
  { t: "Wotakoi: Love is Hard for Otaku", g: [Genre.Comedy, Genre.Romance, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1864/93518.jpg" },
  { t: "Nana", g: [Genre.Drama, Genre.Music, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/6/26819.jpg" },
  { t: "Toradora!", g: [Genre.Comedy, Genre.Romance, Genre.School], p: "https://cdn.myanimelist.net/images/anime/13/22128.jpg" },
  { t: "Sasaki and Miyano", g: [Genre.Romance, Genre.School, Genre.ShonenAi], p: "https://cdn.myanimelist.net/images/anime/1255/121081.jpg" },
  { t: "Given", g: [Genre.Drama, Genre.Music, Genre.ShonenAi], p: "https://cdn.myanimelist.net/images/anime/1802/100527.jpg" },
  { t: "Yuri on Ice", g: [Genre.Comedy, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/9/81256.jpg" },
  { t: "Banana Fish", g: [Genre.Action, Genre.Adventure, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/1190/93472.jpg" },
  { t: "Honey and Clover", g: [Genre.Comedy, Genre.Drama, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/13/11460.jpg" },
  { t: "Plastic Memories", g: [Genre.Drama, Genre.Romance, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/6/73244.jpg" },
  { t: "The Ancient Magus' Bride", g: [Genre.Drama, Genre.Fantasy, Genre.Magic], p: "https://cdn.myanimelist.net/images/anime/1601/113824.jpg" },
  { t: "To Your Eternity", g: [Genre.Adventure, Genre.Drama, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1665/114603.jpg" },
  { t: "Beastars", g: [Genre.Drama, Genre.Psychological, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1444/104523.jpg" },
  { t: "The Tatami Galaxy", g: [Genre.Comedy, Genre.Mystery, Genre.Psychological], p: "https://cdn.myanimelist.net/images/anime/1908/108343.jpg" },
  { t: "A Place Further Than The Universe", g: [Genre.Adventure, Genre.Comedy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/3/89912.jpg" },
  { t: "Shirobako", g: [Genre.Comedy, Genre.Drama, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/6/68021.jpg" },
  { t: "Laid-Back Camp", g: [Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1915/101037.jpg" },
  { t: "Non Non Biyori", g: [Genre.Comedy, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/2/51575.jpg" },
  { t: "K-On!", g: [Genre.Comedy, Genre.Music, Genre.School], p: "https://cdn.myanimelist.net/images/anime/10/76120.jpg" },
  { t: "Tamako Market", g: [Genre.Comedy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/13/46665.jpg" },
  { t: "Carole & Tuesday", g: [Genre.Drama, Genre.Music, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1164/97960.jpg" },
  { t: "Nodame Cantabile", g: [Genre.Comedy, Genre.Music, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/3/17947.jpg" },
  { t: "Kids on the Slope", g: [Genre.Drama, Genre.Music, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/13/36287.jpg" },
  { t: "Beck: Mongolian Chop Squad", g: [Genre.Comedy, Genre.Drama, Genre.Music], p: "https://cdn.myanimelist.net/images/anime/11/17855.jpg" },
  { t: "Bocu no Pico", g: [Genre.Romance, Genre.ShonenAi], p: "https://cdn.myanimelist.net/images/anime/12/3592.jpg" }, // Included as meme/trap awareness or classic? Keeping due to comprehensive nature.

  // --- Sports & Competitive ---
  { t: "Haikyuu!!", g: [Genre.Comedy, Genre.Drama, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/7/76014.jpg" },
  { t: "Blue Lock", g: [Genre.Sports, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/1258/126929.jpg" },
  { t: "Kuroko no Basket", g: [Genre.Comedy, Genre.School, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/5/50857.jpg" },
  { t: "Slam Dunk", g: [Genre.Comedy, Genre.Drama, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/12/35639.jpg" },
  { t: "Hajime no Ippo", g: [Genre.Comedy, Genre.Drama, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/1966/97116.jpg" },
  { t: "Megalo Box", g: [Genre.Action, Genre.Drama, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/1126/91781.jpg" },
  { t: "Ping Pong the Animation", g: [Genre.Psychological, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/10/58041.jpg" },
  { t: "Free!", g: [Genre.SliceOfLife, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/3/51581.jpg" },
  { t: "Prince of Tennis", g: [Genre.Action, Genre.Comedy, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/6/46995.jpg" },
  { t: "Ace of Diamond", g: [Genre.Comedy, Genre.School, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/12/51627.jpg" },
  { t: "Major", g: [Genre.Comedy, Genre.Drama, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/8/52831.jpg" },
  { t: "Eyeshield 21", g: [Genre.Action, Genre.Comedy, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/12/52787.jpg" },
  { t: "Welcome to the Ballroom", g: [Genre.Comedy, Genre.Drama, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/9/86720.jpg" },
  { t: "Chihayafuru", g: [Genre.Drama, Genre.SliceOfLife, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/1/27663.jpg" },
  { t: "Sk8 the Infinity", g: [Genre.Comedy, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/1792/110515.jpg" },
  { t: "Initial D", g: [Genre.Action, Genre.Cars, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/1963/93806.jpg" },
  { t: "Baki", g: [Genre.Action, Genre.MartialArts, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/1307/93557.jpg" },
  { t: "One Outs", g: [Genre.Psychological, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/8/75604.jpg" },

  // --- Comedy & Parody ---
  { t: "Gintama", g: [Genre.Action, Genre.Comedy, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/10/73274.jpg" },
  { t: "Saiki Kusuo no Psi-nan", g: [Genre.Comedy, Genre.School, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/11/80516.jpg" },
  { t: "Grand Blue", g: [Genre.Comedy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1865/93552.jpg" },
  { t: "Nichijou", g: [Genre.Comedy, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/3/75617.jpg" },
  { t: "Daily Lives of High School Boys", g: [Genre.Comedy, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/5/34629.jpg" },
  { t: "Asobi Asobase", g: [Genre.Comedy, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1665/93530.jpg" },
  { t: "Hinamatsuri", g: [Genre.Comedy, Genre.SciFi, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1689/91280.jpg" },
  { t: "Prison School", g: [Genre.Comedy, Genre.Ecchi, Genre.School], p: "https://cdn.myanimelist.net/images/anime/9/74488.jpg" },
  { t: "Great Teacher Onizuka", g: [Genre.Comedy, Genre.Drama, Genre.School], p: "https://cdn.myanimelist.net/images/anime/13/11460.jpg" },
  { t: "Cromartie High School", g: [Genre.Comedy, Genre.School, Genre.Shonen], p: "https://cdn.myanimelist.net/images/anime/10/22909.jpg" },
  { t: "Sakamoto desu ga?", g: [Genre.Comedy, Genre.School, Genre.Seinen], p: "https://cdn.myanimelist.net/images/anime/4/79058.jpg" },
  { t: "The Devil Is a Part-Timer!", g: [Genre.Comedy, Genre.Fantasy, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/11/50637.jpg" },
  { t: "Uncle from Another World", g: [Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1226/124803.jpg" },
  { t: "Ghost Stories (Dub)", g: [Genre.Comedy, Genre.Horror, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/13/75535.jpg" },

  // --- Classics, Retro & Cult Hits ---
  { t: "Trigun", g: [Genre.Action, Genre.Comedy, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/7/20310.jpg" },
  { t: "Samurai Champloo", g: [Genre.Action, Genre.Adventure, Genre.Samurai], p: "https://cdn.myanimelist.net/images/anime/1375/121599.jpg" },
  { t: "Rurouni Kenshin", g: [Genre.Action, Genre.Historical, Genre.Samurai], p: "https://cdn.myanimelist.net/images/anime/1359/137171.jpg" },
  { t: "Yu Yu Hakusho", g: [Genre.Action, Genre.Comedy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/14/7926.jpg" },
  { t: "Inuyasha", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1885/93317.jpg" },
  { t: "Ranma 1/2", g: [Genre.Action, Genre.Comedy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1764/98016.jpg" },
  { t: "Sailor Moon", g: [Genre.Magic, Genre.Romance, Genre.Shojo], p: "https://cdn.myanimelist.net/images/anime/6/35791.jpg" },
  { t: "Cardcaptor Sakura", g: [Genre.Adventure, Genre.Magic, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/4/21034.jpg" },
  { t: "Magic Knight Rayearth", g: [Genre.Adventure, Genre.Fantasy, Genre.Mecha], p: "https://cdn.myanimelist.net/images/anime/13/19448.jpg" },
  { t: "Fist of the North Star", g: [Genre.Action, Genre.MartialArts], p: "https://cdn.myanimelist.net/images/anime/13/21447.jpg" },
  { t: "Saint Seiya", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/10/77334.jpg" },
  { t: "City Hunter", g: [Genre.Action, Genre.Comedy, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/12/75560.jpg" },
  { t: "Lupin III", g: [Genre.Action, Genre.Adventure, Genre.Comedy], p: "https://cdn.myanimelist.net/images/anime/1077/92346.jpg" },
  { t: "Detective Conan", g: [Genre.Adventure, Genre.Comedy, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/5/25619.jpg" },
  { t: "Astro Boy", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/7/3791.jpg" },
  { t: "Doraemon", g: [Genre.Comedy, Genre.Kids, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/11/4096.jpg" },
  { t: "Pokemon", g: [Genre.Action, Genre.Adventure, Genre.Kids], p: "https://cdn.myanimelist.net/images/anime/1484/109053.jpg" },
  { t: "Digimon Adventure", g: [Genre.Action, Genre.Adventure, Genre.Kids], p: "https://cdn.myanimelist.net/images/anime/10/19541.jpg" },
  { t: "Monster Rancher", g: [Genre.Adventure, Genre.Comedy, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/6/17765.jpg" },
  { t: "Black Cat", g: [Genre.Action, Genre.Comedy, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/11/73420.jpg" },
  { t: "Shakugan no Shana", g: [Genre.Action, Genre.Drama, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/12/3599.jpg" },
  { t: "The Melancholy of Haruhi Suzumiya", g: [Genre.Comedy, Genre.Mystery, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/11/79435.jpg" },
  { t: "Lucky Star", g: [Genre.Comedy, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/10/12420.jpg" },
  { t: "Azumanga Daioh", g: [Genre.Comedy, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/2/16551.jpg" },
  { t: "Golden Boy", g: [Genre.Comedy, Genre.Ecchi], p: "https://cdn.myanimelist.net/images/anime/11/45070.jpg" },

  // --- The Artsy, Weird & Wonderful ---
  { t: "The Eccentric Family", g: [Genre.Comedy, Genre.Drama, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/5/51867.jpg" },
  { t: "Mawaru Penguindrum", g: [Genre.Comedy, Genre.Drama, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/13/30527.jpg" },
  { t: "Revolutionary Girl Utena", g: [Genre.Drama, Genre.Fantasy, Genre.Psychological], p: "https://cdn.myanimelist.net/images/anime/8/18797.jpg" },
  { t: "Princess Tutu", g: [Genre.Comedy, Genre.Drama, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/13/26107.jpg" },
  { t: "Kaiba", g: [Genre.Adventure, Genre.Mystery, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/9/12711.jpg" },
  { t: "Mind Game", g: [Genre.Comedy, Genre.Dementia, Genre.Psychological], p: "https://cdn.myanimelist.net/images/anime/2/57513.jpg" },
  { t: "Kemonozume", g: [Genre.Action, Genre.Horror, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/7/2422.jpg" },
  { t: "House of Five Leaves", g: [Genre.Drama, Genre.Historical, Genre.Samurai], p: "https://cdn.myanimelist.net/images/anime/4/22818.jpg" },
  { t: "Sarazanmai", g: [Genre.Comedy, Genre.Fantasy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1841/99793.jpg" },
  { t: "Yuri Kuma Arashi", g: [Genre.Drama, Genre.Fantasy, Genre.Psychological], p: "https://cdn.myanimelist.net/images/anime/5/69799.jpg" },
  { t: "Flip Flappers", g: [Genre.Adventure, Genre.Comedy, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/4/82250.jpg" },
  { t: "Kyousougiga", g: [Genre.Action, Genre.Fantasy, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/5/56041.jpg" },
  { t: "Sonny Boy", g: [Genre.Mystery, Genre.SciFi, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1586/116499.jpg" },
  { t: "Odd Taxi", g: [Genre.Drama, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/1912/115502.jpg" },
  { t: "Land of the Lustrous", g: [Genre.Drama, Genre.Fantasy, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/9/88350.jpg" },

  // --- Idol & Music ---
  { t: "Love Live! School Idol Project", g: [Genre.Music, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/11/42767.jpg" },
  { t: "The iDOLM@STER", g: [Genre.Comedy, Genre.Drama, Genre.Music], p: "https://cdn.myanimelist.net/images/anime/11/30419.jpg" },
  { t: "Zombieland Saga", g: [Genre.Comedy, Genre.Music, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1376/95953.jpg" },
  { t: "BanG Dream!", g: [Genre.Music, Genre.School, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1628/92534.jpg" },
  { t: "Wake Up, Girls!", g: [Genre.Drama, Genre.Music, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/6/57997.jpg" },
  { t: "Vivy: Fluorite Eye’s Song", g: [Genre.Action, Genre.Music, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1666/114643.jpg" },
  { t: "Ya Boy Kongming!", g: [Genre.Comedy, Genre.Music, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1749/122247.jpg" },
  
  // --- Miscellaneous / Others Requested ---
  { t: "The Twelve Kingdoms", g: [Genre.Action, Genre.Adventure, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/1560/114002.jpg" },
  { t: "Now and Then, Here and There", g: [Genre.Adventure, Genre.Drama, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/13/68393.jpg" },
  { t: "Vinland Saga", g: [Genre.Action, Genre.Adventure, Genre.Historical], p: "https://cdn.myanimelist.net/images/anime/1500/103060.jpg" },
  { t: "Kingdom", g: [Genre.Action, Genre.Historical, Genre.Military], p: "https://cdn.myanimelist.net/images/anime/1458/122045.jpg" },
  { t: "Golden Kamuy", g: [Genre.Action, Genre.Adventure, Genre.Historical], p: "https://cdn.myanimelist.net/images/anime/1503/92660.jpg" },
  { t: "Baccano!", g: [Genre.Action, Genre.Comedy, Genre.Historical], p: "https://cdn.myanimelist.net/images/anime/3/14552.jpg" },
  { t: "Durarara!!", g: [Genre.Action, Genre.Mystery, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/10/24037.jpg" },
  { t: "Black Butler", g: [Genre.Action, Genre.Comedy, Genre.Mystery], p: "https://cdn.myanimelist.net/images/anime/13/15115.jpg" },
  { t: "Blue Submarine No. 6", g: [Genre.Action, Genre.Adventure, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/3/3607.jpg" },
  { t: "Wolf's Rain", g: [Genre.Action, Genre.Adventure, Genre.Drama], p: "https://cdn.myanimelist.net/images/anime/6/73747.jpg" },
  { t: "Darker than Black", g: [Genre.Action, Genre.Mystery, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/10/17702.jpg" },
  { t: "Kabaneri of the Iron Fortress", g: [Genre.Action, Genre.Drama, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/7/79462.jpg" },
  { t: "High School of the Dead", g: [Genre.Action, Genre.Ecchi, Genre.Horror], p: "https://cdn.myanimelist.net/images/anime/12/26194.jpg" },
  { t: "Deadman Wonderland", g: [Genre.Action, Genre.Horror, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/13/29848.jpg" },
  { t: "Guilty Crown", g: [Genre.Action, Genre.Drama, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/11/33713.jpg" },
  { t: "Sword of the Stranger", g: [Genre.Action, Genre.Adventure, Genre.Historical], p: "https://cdn.myanimelist.net/images/anime/10/11059.jpg" },
  { t: "Promare", g: [Genre.Action, Genre.Mecha, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/1560/100435.jpg" },
  { t: "Bubble", g: [Genre.Action, Genre.SciFi, Genre.Sports], p: "https://cdn.myanimelist.net/images/anime/1662/123304.jpg" },
  { t: "Children of the Sea", g: [Genre.Drama, Genre.Mystery, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1911/100877.jpg" },
  { t: "Ride Your Wave", g: [Genre.Drama, Genre.Romance, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1915/101036.jpg" },
  { t: "Words Bubble Up Like Soda Pop", g: [Genre.Music, Genre.Romance, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1209/108365.jpg" },
  { t: "A Whisker Away", g: [Genre.Drama, Genre.Fantasy, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/1598/107872.jpg" },
  { t: "Summer Wars", g: [Genre.Comedy, Genre.SciFi], p: "https://cdn.myanimelist.net/images/anime/8/18788.jpg" },
  { t: "The Girl Who Leapt Through Time", g: [Genre.Adventure, Genre.Drama, Genre.Romance], p: "https://cdn.myanimelist.net/images/anime/4/22883.jpg" },
  { t: "Wolf Children", g: [Genre.Fantasy, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/5/43797.jpg" },
  { t: "Maquia: When the Promised Flower Blooms", g: [Genre.Drama, Genre.Fantasy], p: "https://cdn.myanimelist.net/images/anime/12/91254.jpg" },
  { t: "I want to eat your pancreas", g: [Genre.Drama, Genre.Romance, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/1487/93863.jpg" },
  { t: "5 Centimeters Per Second", g: [Genre.Drama, Genre.Romance, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/13/13247.jpg" },
  { t: "Garden of Words", g: [Genre.Drama, Genre.Romance, Genre.SliceOfLife], p: "https://cdn.myanimelist.net/images/anime/3/49841.jpg" },
  { t: "Hotarubi no Mori e", g: [Genre.Drama, Genre.Romance, Genre.Supernatural], p: "https://cdn.myanimelist.net/images/anime/1844/93680.jpg" }
];

// Dynamically Generate the Initial Data List
export const INITIAL_ANIME_DATA: Anime[] = ANIME_TITLES_LIST.map((item, index) => ({
  id: `a${index + 100}`,
  title: item.t,
  poster: item.p,
  rating: parseFloat((Math.random() * (9.5 - 7.5) + 7.5).toFixed(2)), // Mock rating until fetched
  genres: item.g,
  status: ListStatus.None,
  episodes: 12, // Default
  totalSeasons: 1, // Default
  needsEnrichment: true // Flag to auto-fetch details from AniList API
}));
