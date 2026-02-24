import { readJson, updateJson } from "./store";

export type I18nText = { zh: string; en: string };

export type Route = {
  id: string;
  title: I18nText;
  summary: I18nText;
  estimatedMinutes: number;
  city: string;
  poiIds: string[];
  rules: { zh: string[]; en: string[] };
  cover: { gradient: string; accent: "red" | "gold" };
};

export type Poi = {
  id: string;
  routeId: string;
  order: number;
  geo: { lat: number; lng: number };
  title: I18nText;
  short: I18nText;
  arriveHint: I18nText;
  scanHint: I18nText;
  story: {
    intro: I18nText;
    arBeat: I18nText;
  };
  quizId: string;
  rewards: { badgeId: string };
};

export type QuizChoice = { key: string; zh: string; en: string };
export type Quiz = {
  id: string;
  type: "single_choice";
  question: I18nText;
  choices: QuizChoice[];
  answerKey: string;
  hints: { level: 1 | 2; zh: string; en: string }[];
  explain: I18nText;
};

export type Badge = {
  id: string;
  title: I18nText;
  desc: I18nText;
  color: "red" | "gold" | "ink";
  icon: "gate" | "drum" | "nest" | "axis";
};

export type Content = {
  version: number;
  routes: Route[];
  pois: Poi[];
  quizzes: Quiz[];
  badges: Badge[];
};

const CONTENT_FILE = "content.json";

const seed: Content = {
  version: 1,
  routes: [
    {
      id: "route_beijing_axis_3p_v1",
      title: { zh: "北京中轴线·三点闯关", en: "Beijing Central Axis · 3-Stop Quest" },
      summary: {
        zh: "从城门到鼓声，再到现代结构美学：用三次轻量互动解锁北京秩序的线索。",
        en: "From gate to drumbeat to modern structure—unlock Beijing’s sense of order in three missions.",
      },
      estimatedMinutes: 120,
      city: "Beijing",
      poiIds: ["poi_qianmen_arrow_tower", "poi_drum_tower", "poi_birds_nest"],
      rules: {
        zh: ["每个点位完成1道谜题即可点亮徽章", "体验可离线浏览，识别互动后续再接入"],
        en: [
          "Complete one puzzle per stop to earn a badge",
          "Works offline for reading; AR is wired in later",
        ],
      },
      cover: {
        gradient:
          "linear-gradient(135deg, rgba(180,0,34,0.95) 0%, rgba(242,194,0,0.85) 55%, rgba(17,19,24,0.55) 100%)",
        accent: "gold",
      },
    },
  ],
  badges: [
    {
      id: "badge_axis_gatekeeper",
      title: { zh: "中轴守门人", en: "Gatekeeper of the Axis" },
      desc: { zh: "你读懂了城门的第一枚线索。", en: "You decoded the first signal of the gate." },
      color: "red",
      icon: "gate",
    },
    {
      id: "badge_axis_timekeeper",
      title: { zh: "时间掌鼓人", en: "Timekeeper" },
      desc: { zh: "你听见了古都的节奏。", en: "You heard the rhythm of the old capital." },
      color: "gold",
      icon: "drum",
    },
    {
      id: "badge_axis_modern_weaver",
      title: { zh: "结构织梦者", en: "Modern Weaver" },
      desc: { zh: "你在钢网中找到现代秩序。", en: "You found modern order inside woven steel." },
      color: "ink",
      icon: "nest",
    },
    {
      id: "badge_axis_complete",
      title: { zh: "中轴探秘官", en: "Axis Explorer" },
      desc: { zh: "你完成了北京中轴线三点闯关。", en: "You completed the 3-stop Central Axis quest." },
      color: "gold",
      icon: "axis",
    },
  ],
  pois: [
    {
      id: "poi_qianmen_arrow_tower",
      routeId: "route_beijing_axis_3p_v1",
      order: 1,
      geo: { lat: 39.8993, lng: 116.3975 },
      title: { zh: "正阳门箭楼", en: "Qianmen Arrow Tower" },
      short: {
        zh: "秩序从入口开始。",
        en: "Order begins at the threshold.",
      },
      arriveHint: {
        zh: "建议在视野开阔处停留，避开强反光与逆光。",
        en: "Stand in an open spot and avoid strong glare or backlight.",
      },
      scanHint: {
        zh: "MVP阶段先用“进入答题”继续；AR将作为下一阶段接入。",
        en: "For MVP, tap “Start puzzle” to continue; AR will be wired in next.",
      },
      story: {
        intro: {
          zh: "欢迎来到正阳门箭楼。你的第一项任务：从城门的结构与位置，找到秩序的线索。",
          en: "Welcome to Qianmen Arrow Tower. Mission one: read order through the gate’s structure and position.",
        },
        arBeat: {
          zh: "想象一条防线从城门扩散。你要找的是“它为什么存在”。",
          en: "Imagine a defense line expanding from the gate. Find why it exists.",
        },
      },
      quizId: "quiz_qianmen_001",
      rewards: { badgeId: "badge_axis_gatekeeper" },
    },
    {
      id: "poi_drum_tower",
      routeId: "route_beijing_axis_3p_v1",
      order: 2,
      geo: { lat: 39.9410, lng: 116.3893 },
      title: { zh: "鼓楼", en: "Drum Tower" },
      short: {
        zh: "鼓楼是中轴线上重要的文化符号。",
        en: "The Drum Tower is an important cultural symbol on the central axis.",
      },
      arriveHint: {
        zh: "在广场或入口附近停留更适合阅读与答题。",
        en: "Stay near the plaza or entrance for an easier read and puzzle solving.",
      },
      scanHint: {
        zh: "MVP阶段先用“进入答题”继续；AR将作为下一阶段接入。",
        en: "For MVP, tap “Start puzzle” to continue; AR will be wired in next.",
      },
      story: {
        intro: {
          zh: "鼓楼是中轴线上重要的文化符号。你的任务：解码时间如何组织城市生活。",
          en: "The Drum Tower is an important cultural symbol on the central axis. Decode how time organized city life.",
        },
        arBeat: {
          zh: "把鼓点想象成节拍环：它连接每个人的日常。",
          en: "Imagine beats as a rhythm ring—linking everyone’s daily life.",
        },
      },
      quizId: "quiz_drum_001",
      rewards: { badgeId: "badge_axis_timekeeper" },
    },
    {
      id: "poi_birds_nest",
      routeId: "route_beijing_axis_3p_v1",
      order: 3,
      geo: { lat: 39.9917, lng: 116.3906 },
      title: { zh: "鸟巢", en: "National Stadium (Bird’s Nest)" },
      short: { zh: "结构即美学：现代公共空间的象征。", en: "Structure as aesthetics: a symbol of modern public space." },
      arriveHint: {
        zh: "建议在外立面钢网结构清晰可见的位置停留。",
        en: "Stand where the woven steel façade is clearly visible.",
      },
      scanHint: {
        zh: "MVP阶段先用“进入答题”继续；AR将作为下一阶段接入。",
        en: "For MVP, tap “Start puzzle” to continue; AR will be wired in next.",
      },
      story: {
        intro: {
          zh: "你已走过城门与鼓声。终章：在“编织的钢”里寻找现代秩序。",
          en: "You’ve passed the gate and the drumbeat. Final chapter: find modern order in woven steel.",
        },
        arBeat: {
          zh: "把钢网想象成一张会呼吸的织物：结构成为外观。",
          en: "See the steel as breathing fabric—structure becomes the surface.",
        },
      },
      quizId: "quiz_nest_001",
      rewards: { badgeId: "badge_axis_modern_weaver" },
    },
  ],
  quizzes: [
    {
      id: "quiz_qianmen_001",
      type: "single_choice",
      question: { zh: "箭楼在城防体系里更接近哪种功能？", en: "In a city defense system, what is the Arrow Tower primarily used for?" },
      choices: [
        { key: "A", zh: "礼仪庆典的观礼台", en: "A ceremonial viewing platform" },
        { key: "B", zh: "防御与瞭望的战斗节点", en: "A defensive and lookout strongpoint" },
        { key: "C", zh: "民间集市的管理所", en: "A market administration office" }
      ],
      answerKey: "B",
      hints: [
        { level: 1, zh: "想想“箭楼”这个名字里最关键的两个字。", en: "Look at the key words: “arrow” and “tower.”" },
        { level: 2, zh: "它与射击孔、瞭望、防御相关，而不是仪式或商业管理。", en: "It relates to firing positions, lookout, and defense—not ceremonies or commerce." }
      ],
      explain: { zh: "箭楼是城门防御体系的重要节点，兼具瞭望与防守功能。", en: "The Arrow Tower is a key defensive node of the city gate system, combining lookout and protection." }
    },
    {
      id: "quiz_drum_001",
      type: "single_choice",
      question: {
        zh: "在没有手机和钟表的年代，城市如何把“时间”传递给所有人？",
        en: "Before phones and personal clocks, how did a city broadcast time to everyone?"
      },
      choices: [
        { key: "A", zh: "通过集市广播", en: "Market announcements" },
        { key: "B", zh: "通过鼓声、钟声等公共信号", en: "Public signals like drums and bells" },
        { key: "C", zh: "每家每户派人挨家挨户询问", en: "Messengers door-to-door" }
      ],
      answerKey: "B",
      hints: [
        { level: 1, zh: "想想“鼓楼/钟楼”的组合意味着什么。", en: "Think about what “drum tower / bell tower” means as a pair." },
        { level: 2, zh: "公共声响覆盖面最大，是古代的“通知系统”。", en: "Public sounds had the widest reach—an ancient notification system." }
      ],
      explain: { zh: "公共鼓钟用于向城市播报时间与秩序信号。", en: "Drums and bells broadcast time and civic order through public signals." }
    },
    {
      id: "quiz_nest_001",
      type: "single_choice",
      question: { zh: "鸟巢最典型的“结构美学”来自什么？", en: "The Bird’s Nest’s signature structural aesthetics come from what?" },
      choices: [
        { key: "A", zh: "砖石砌筑", en: "Masonry" },
        { key: "B", zh: "木构榫卯", en: "Timber joinery" },
        { key: "C", zh: "钢结构编织", en: "Woven steel structure" }
      ],
      answerKey: "C",
      hints: [
        { level: 1, zh: "观察外立面更像“编织网”还是“层层砌筑”。", en: "Does the façade look woven like a nest, or stacked like masonry?" },
        { level: 2, zh: "材料与结构直接成为外观表达。", en: "Material and structure directly become the visual expression." }
      ],
      explain: { zh: "鸟巢以钢结构交织形成独特外观，结构即美学。", en: "Its iconic look comes from interwoven steel—structure as aesthetics." }
    }
  ]
};

export async function getContent() {
  return readJson<Content>(CONTENT_FILE, seed);
}

export async function updateContent(updater: (current: Content) => Content) {
  return updateJson<Content>(CONTENT_FILE, seed, updater);
}

export async function getRoute(routeId: string) {
  const content = await getContent();
  return content.routes.find((r) => r.id === routeId) ?? null;
}

export async function getPoi(poiId: string) {
  const content = await getContent();
  return content.pois.find((p) => p.id === poiId) ?? null;
}

export async function getQuiz(quizId: string) {
  const content = await getContent();
  return content.quizzes.find((q) => q.id === quizId) ?? null;
}

export async function getBadge(badgeId: string) {
  const content = await getContent();
  return content.badges.find((b) => b.id === badgeId) ?? null;
}
