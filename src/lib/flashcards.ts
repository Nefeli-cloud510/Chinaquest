// 闪卡（Flashcard）数据模型
// 每张闪卡对应一个关键地点，包含二维码URL、叙事内容、线索和标注点

export interface FlashcardClue {
  id: string;
  title: { zh: string; en: string };
  content: { zh: string; en: string };
  icon: string;
}

export interface FlashcardAnnotation {
  id: string;
  label: { zh: string; en: string };
  position: { x: number; y: number };
  popup?: { title: { zh: string; en: string }; content: { zh: string; en: string } };
}

export interface Flashcard {
  id: string;                // 闪卡ID，如 flashcard_qianmen_01
  poiId: string;             // 关联的POI ID
  title: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  qrCodeUrl: string;         // 对应的URL（扫码后跳转）
  narrative: {
    zh: string;
    en: string;
  };
  clues: FlashcardClue[];    // 可收集的线索
  annotations: FlashcardAnnotation[];  // AR标注点
  imageUrl?: string;         // 闪卡配图
}

// 前门区域闪卡
const qianmenFlashcards: Flashcard[] = [
  {
    id: 'flashcard_qianmen_gate',
    poiId: 'poi_qianmen_arrow_tower',
    title: { zh: '正阳门箭楼', en: 'Qianmen Arrow Tower' },
    subtitle: { zh: '帝国之门', en: 'Gate of the Empire' },
    qrCodeUrl: '/flashcards/flashcard_qianmen_gate',
    narrative: {
      zh: '四百年前，站在这里就意味着一件事：你正在进入帝国的核心。箭楼是外城的守护者，厚实的城墙、狭窄的箭窗——每一处设计都在诉说防御与权力。当你穿过这道门，你就踏上了中轴线的旅程。',
      en: 'Four hundred years ago, standing here meant one thing: you were entering the heart of the empire. The Arrow Tower was the guardian of the outer city—thick walls, narrow arrow windows—every design element speaks of defense and power. When you pass through this gate, you step onto the Central Axis.',
    },
    clues: [
      {
        id: 'clue_qianmen_position',
        title: { zh: '城门位置', en: 'Gate Position' },
        content: { zh: '前门正对中轴线，是进入内城的唯一正门。这条南北直线直通故宫太和殿。', en: 'Qianmen sits exactly on the Central Axis—the only proper gate into the inner city. This north-south line leads directly to the Hall of Supreme Harmony in the Forbidden City.' },
        icon: '🏛️',
      },
      {
        id: 'clue_qianmen_arch',
        title: { zh: '建筑细节', en: 'Architectural Details' },
        content: { zh: '箭楼面向南面有52个箭窗，东、西面各有46个。这些箭窗曾是冷兵器时代防御体系的一部分。', en: 'The Arrow Tower has 52 arrow windows facing south and 46 on each of the east and west sides. These were part of the defense system in the era of cold weapons.' },
        icon: '🪟',
      },
    ],
    annotations: [
      {
        id: 'ann_qianmen_axis',
        label: { zh: '中轴线方向', en: 'Central Axis' },
        position: { x: 50, y: 30 },
        popup: {
          title: { zh: '北京中轴线', en: 'Beijing Central Axis' },
          content: { zh: '前门是北京中轴线的南端起点，这条7.8公里的直线串联了北京最重要的历史建筑。', en: 'Qianmen is the southern starting point of Beijing\'s 7.8km Central Axis, connecting the city\'s most important historical buildings.' },
        },
      },
      {
        id: 'ann_qianmen_windows',
        label: { zh: '箭窗', en: 'Arrow Windows' },
        position: { x: 35, y: 50 },
      },
    ],
    imageUrl: '/qianmen_photo.png',
  },
  {
    id: 'flashcard_qianmen_street',
    poiId: 'poi_qianmen_arrow_tower',
    title: { zh: '前门大街', en: 'Qianmen Street' },
    subtitle: { zh: '百年商街', en: 'Century-Old Commercial Street' },
    qrCodeUrl: '/flashcards/flashcard_qianmen_street',
    narrative: {
      zh: '从前门箭楼向北望去，这条笔直的街道曾是帝都最繁华的商业中心。老字号、茶馆、戏院——这里是老北京人生活的缩影。2008年奥运会前，整条街进行了修复，保留了传统的建筑风貌。',
      en: 'Looking north from the Arrow Tower, this straight street was once the most bustling commercial center of the imperial capital. Time-honored brands, teahouses, theaters—this was a microcosm of old Beijing life. Before the 2008 Olympics, the entire street was restored, preserving its traditional architectural style.',
    },
    clues: [
      {
        id: 'clue_qianmen_brands',
        title: { zh: '老字号', en: 'Time-Honored Brands' },
        content: { zh: '前门大街聚集了全聚德、瑞蚨祥、内联升等众多百年老字号，代表了中国传统商业的精髓。', en: 'Qianmen Street is home to Quanjude (roast duck), Ruifuxiang (silk), Neiliansheng (shoes) and other century-old brands representing the essence of traditional Chinese commerce.' },
        icon: '🏪',
      },
    ],
    annotations: [
      {
        id: 'ann_qianmen_street',
        label: { zh: '商业街区', en: 'Commercial Street' },
        position: { x: 50, y: 60 },
      },
    ],
  },
];

// 鼓楼区域闪卡
const drumTowerFlashcards: Flashcard[] = [
  {
    id: 'flashcard_drum_main',
    poiId: 'poi_drum_tower',
    title: { zh: '鼓楼主楼', en: 'Drum Tower Main Building' },
    subtitle: { zh: '时间守望者', en: 'Keeper of Time' },
    qrCodeUrl: '/flashcards/flashcard_drum_main',
    narrative: {
      zh: '传说这里曾住着一只狐仙。夜巡更夫敲完最后一通暮鼓，把鼓槌随手一丢；可到了清晨，鼓槌总会被整齐地放回原位——仿佛有人替"另一个世界"继续报时。鼓楼内置一面大鼓和24面小鼓，大鼓代表一年，24面小鼓代表二十四节气。',
      en: 'Legend has it that a fox spirit lived here. After the night watchman finished the final drumming, he would toss his drumsticks aside. But by morning, the fox spirit had neatly placed them back on the stand, quietly keeping time for the spirit world. The Drum Tower houses one large drum representing the year and 24 smaller drums representing the solar terms.',
    },
    clues: [
      {
        id: 'clue_drum_timekeeping',
        title: { zh: '报时系统', en: 'Timekeeping System' },
        content: { zh: '每天傍晚，鼓声宣告城门将闭。鼓声按照固定节拍敲响，整个北京城都在这同一节拍中入睡。', en: 'Each evening, the drumbeat announced that the city gates were closing. The drums struck in a fixed rhythm, and all of Beijing fell asleep to the same beat.' },
        icon: '🥁',
      },
      {
        id: 'clue_drum_view',
        title: { zh: '观景视野', en: 'Viewing Perspective' },
        content: { zh: '从鼓楼露台向南望去，可以看到中轴线一直延伸到故宫。这里是感受北京历史呼吸的最佳位置之一。', en: 'From the terrace, you can see the Central Axis stretching south toward the Forbidden City—one of the best spots to feel Beijing\'s history as a living rhythm.' },
        icon: '🔭',
      },
    ],
    annotations: [
      {
        id: 'ann_drum_main',
        label: { zh: '主鼓', en: 'Main Drum' },
        position: { x: 50, y: 40 },
      },
      {
        id: 'ann_drum_view',
        label: { zh: '观景露台', en: 'Viewing Terrace' },
        position: { x: 75, y: 55 },
      },
    ],
    imageUrl: '/gulou.png',
  },
  {
    id: 'flashcard_drum_hutong',
    poiId: 'poi_drum_tower',
    title: { zh: '鼓楼胡同', en: 'Drum Tower Hutongs' },
    subtitle: { zh: '老北京的灵魂', en: 'Soul of Old Beijing' },
    qrCodeUrl: '/flashcards/flashcard_drum_hutong',
    narrative: {
      zh: '鼓楼周围的胡同是北京最古老的居住区之一。灰色的四合院、槐树下的棋局、门墩上的雕花——这里是活着的北京历史。每一条胡同都有自己的故事，每一个门楼都有自己的性格。',
      en: 'The hutongs around the Drum Tower are some of Beijing\'s oldest residential areas. Grey courtyard houses, chess games under locust trees, carved door piers—this is living Beijing history. Every hutong has its own story, every gate has its own character.',
    },
    clues: [
      {
        id: 'clue_hutong_layout',
        title: { zh: '胡同布局', en: 'Hutong Layout' },
        content: { zh: '胡同是元大都时期形成的棋盘式街区，宽度刚好容纳一辆马车通过。这种布局影响了北京人的生活方式。', en: 'Hutongs are checkerboard-style neighborhoods formed during the Yuan Dynasty, just wide enough for a horse cart. This layout shaped the Beijing lifestyle.' },
        icon: '🏘️',
      },
    ],
    annotations: [
      {
        id: 'ann_hutong',
        label: { zh: '胡同入口', en: 'Hutong Entrance' },
        position: { x: 40, y: 50 },
      },
    ],
  },
];

// 鸟巢区域闪卡
const nestFlashcards: Flashcard[] = [
  {
    id: 'flashcard_nest_structure',
    poiId: 'poi_birds_nest',
    title: { zh: '鸟巢钢结构', en: 'Bird\'s Nest Steel Structure' },
    subtitle: { zh: '裸露的力量', en: 'Exposed Strength' },
    qrCodeUrl: '/flashcards/flashcard_nest_structure',
    narrative: {
      zh: '几百年来，建筑总把骨架藏在墙体背后；但在这里，结构被大胆地展示出来。42,000吨钢材织就的外壳——结构本身就是建筑的身份。为什么建筑师要让钢结构成为外表，而不是把它遮起来？',
      en: 'For centuries, buildings hid their frames behind walls. Here, the skeleton is on full display. 42,000 tons of woven steel—the structure itself is the building\'s identity. Why would architects choose to expose raw steel instead of covering it up?',
    },
    clues: [
      {
        id: 'clue_nest_steel',
        title: { zh: '钢结构用量', en: 'Steel Quantity' },
        content: { zh: '鸟巢使用了42,000吨钢材，最粗的钢结构构件直径达到1.1米。整个外壳由不规则的钢网编织而成。', en: 'The Bird\'s Nest uses 42,000 tons of steel, with the thickest structural members reaching 1.1 meters in diameter. The entire shell is woven from irregular steel mesh.' },
        icon: '🔩',
      },
      {
        id: 'clue_nest_concept',
        title: { zh: '巢的隐喻', en: 'Nest Metaphor' },
        content: { zh: '设计灵感来自"巢"的概念——一个孕育生命的容器。建筑不只是一座体育场，更是一个象征。', en: 'The design draws from the concept of a "nest"—a vessel that breeds life. The building is not just a stadium but a symbol.' },
        icon: '🪺',
      },
    ],
    annotations: [
      {
        id: 'ann_nest_steel',
        label: { zh: '钢结构外壳', en: 'Steel Shell' },
        position: { x: 45, y: 35 },
      },
      {
        id: 'ann_nest_concept',
        label: { zh: '巢的概念', en: 'Nest Concept' },
        position: { x: 65, y: 50 },
      },
    ],
    imageUrl: '/niaochaio.png',
  },
  {
    id: 'flashcard_water_cube',
    poiId: 'poi_birds_nest',
    title: { zh: '水立方（冰立方）', en: 'Water Cube (Ice Cube)' },
    subtitle: { zh: '火与冰的对话', en: 'Fire and Ice Dialogue' },
    qrCodeUrl: '/flashcards/flashcard_water_cube',
    narrative: {
      zh: '与鸟巢相邻的水立方，2008年是游泳馆，2022年冬奥会期间改造成"冰立方"举办冰壶比赛。一座建筑、两次奥运、两种形态——这正是北京"双奥之城"身份的缩影。',
      en: 'Adjacent to the Bird\'s Nest, the Water Cube was a swimming venue in 2008 and transformed into the "Ice Cube" for curling during the 2022 Winter Olympics. One building, two Olympics, two forms—a microcosm of Beijing\'s identity as a "dual Olympic city."',
    },
    clues: [
      {
        id: 'clue_water_cube',
        title: { zh: '气泡结构', en: 'Bubble Structure' },
        content: { zh: '水立方的外墙由3,000多个ETFE气泡组成，这种材料轻如羽毛、坚固如钢铁，还能自我清洁。', en: 'The Water Cube\'s exterior is made of 3,000+ ETFE bubbles—material light as feathers, strong as steel, and self-cleaning.' },
        icon: '🫧',
      },
    ],
    annotations: [
      {
        id: 'ann_water_cube',
        label: { zh: '水立方', en: 'Water Cube' },
        position: { x: 70, y: 45 },
      },
    ],
  },
];

// 全部闪卡数据
export const allFlashcards: Flashcard[] = [
  ...qianmenFlashcards,
  ...drumTowerFlashcards,
  ...nestFlashcards,
];

// 按POI获取闪卡
export function getFlashcardsByPoi(poiId: string): Flashcard[] {
  return allFlashcards.filter(f => f.poiId === poiId);
}

// 按ID获取闪卡
export function getFlashcardById(id: string): Flashcard | undefined {
  return allFlashcards.find(f => f.id === id);
}

// 线索存储
const CLUES_STORAGE_KEY = 'cq_collected_clues_v1';

export function collectClue(clueId: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(CLUES_STORAGE_KEY) || '[]');
    if (!existing.includes(clueId)) {
      existing.push(clueId);
      localStorage.setItem(CLUES_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (e) {
    console.error('Failed to collect clue:', e);
  }
}

export function getCollectedClues(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CLUES_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function getCollectedClueObjects(): FlashcardClue[] {
  const clueIds = getCollectedClues();
  return allFlashcards.flatMap(f => f.clues).filter(c => clueIds.includes(c.id));
}

export function resetCollectedClues() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CLUES_STORAGE_KEY);
}

export function hasCollectedClue(clueId: string): boolean {
  return getCollectedClues().includes(clueId);
}
