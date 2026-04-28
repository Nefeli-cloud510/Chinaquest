export interface ARAnnotation {
  id: string;
  label: { zh: string; en: string };
  position: { x: number; y: number };
  popup?: { title: { zh: string; en: string }; content: { zh: string; en: string } };
}

export interface ARPOIConfig {
  poiId: string;
  markerUrl: string;
  narrative: {
    intro: { zh: string; en: string };
    hints: Array<{ zh: string; en: string }>;
  };
  annotations: ARAnnotation[];
  quizHint: { zh: string; en: string };
}

export const arPOIConfigs: Record<string, ARPOIConfig> = {
  poi_qianmen_arrow_tower: {
    poiId: 'poi_qianmen_arrow_tower',
    markerUrl: '/ar/markers/qianmen-marker.png',
    narrative: {
      intro: {
        zh: '你刚刚获得"文化探险家"的身份。你的任务从一座曾经把守帝都入口的城门开始。想象四百年前你站在这里：你是入城报到的官员、送货进城的商人，还是远道而来的旅人？在沿着中轴线继续向北之前，请停下片刻：前门从来不只是城墙，它是一道"筛选器"，也是秩序的象征。你的第一个挑战：你能看懂这座城市建立在怎样的秩序之上吗？',
        en: 'You have just received your identity as a "Cultural Explorer." Your mission begins at a gate that once controlled who could enter the heart of the empire. Imagine arriving here 400 years ago—would you be an official reporting to court, a merchant bringing goods, or a traveler curious about the capital? Before you move north along the Central Axis, pause for a moment. This gate was never just a wall. It was a filter, a symbol of order. Your first challenge: can you read what kind of order this city was built upon?',
      },
      hints: [
        {
          zh: '注意观察城门的位置：它站在一条笔直的南北线上，正对着城市核心。这个位置为什么重要？',
          en: 'Look at where the gate stands. It sits at a wide opening on a straight north–south line leading toward the heart of the city. Why might that position matter?',
        },
      ],
    },
    annotations: [
      {
        id: 'ann-qianmen-axis',
        label: { zh: '中轴线起点', en: 'Central Axis Start' },
        position: { x: 50, y: 35 },
        popup: {
          title: { zh: '北京中轴线', en: 'Beijing Central Axis' },
          content: {
            zh: '前门是北京中轴线的南端起点。这条南北直线曾是都城规划的核心，标记着权力与秩序的边界。',
            en: 'Qianmen marks the southern starting point of Beijing\'s Central Axis—a straight line that once organized the entire capital as an expression of imperial order.',
          },
        },
      },
      {
        id: 'ann-qianmen-gate',
        label: { zh: '城门结构', en: 'Gate Structure' },
        position: { x: 30, y: 50 },
        popup: {
          title: { zh: '城门设计', en: 'Gate Design' },
          content: {
            zh: '城门采用典型的中国古代城楼设计：灰砖底座、红柱、分层瓦顶。这些元素共同构成了帝都的礼仪形象。',
            en: 'The gate features classic Chinese architectural design: grey brick base, red columns, and layered tiled roofs—together forming the ceremonial image of the imperial capital.',
          },
        },
      },
    ],
    quizHint: {
      zh: '注意观察城门的位置和朝向——它为什么被建在这里？',
      en: 'Notice the gate\'s position and orientation—why was it built here?',
    },
  },

  poi_drum_tower: {
    poiId: 'poi_drum_tower',
    markerUrl: '/ar/markers/drum-marker.png',
    narrative: {
      intro: {
        zh: '传说这里曾住着一只狐仙。夜巡更夫敲完最后一通暮鼓，把鼓槌随手一丢；可到了清晨，鼓槌总会被整齐地放回原位——仿佛有人替"另一个世界"继续报时。你的任务简单得多，但同样需要眼力：你能找到这座城市沉默的报时者吗？',
        en: 'Legend has it that a fox spirit lived here. After the night watchman finished the final drumming, he would toss his drumsticks aside. But by morning, the fox spirit had neatly placed them back on the stand, quietly keeping time for the spirit world. Your task is much simpler—but just as observant: can you find the silent keeper of time?',
      },
      hints: [
        {
          zh: '想象鼓声像涟漪一样扩散：一座城市被同一段节拍同时唤醒与安静。',
          en: 'Imagine the drumbeat spreading like ripples—one rhythm reaching an entire city at once.',
        },
      ],
    },
    annotations: [
      {
        id: 'ann-drum-main',
        label: { zh: '主鼓', en: 'Main Drum' },
        position: { x: 50, y: 40 },
        popup: {
          title: { zh: '报时主鼓', en: 'Timekeeping Drum' },
          content: {
            zh: '鼓楼内置一面大鼓和24面小鼓。大鼓代表一年，24面小鼓代表二十四节气。每天傍晚，鼓声宣告城门将闭。',
            en: 'The Drum Tower houses one large drum representing the year and 24 smaller drums representing the solar terms. Each evening, the drumbeat announced that the city gates were closing.',
          },
        },
      },
      {
        id: 'ann-drum-view',
        label: { zh: '观景露台', en: 'Viewing Terrace' },
        position: { x: 75, y: 55 },
        popup: {
          title: { zh: '中轴线视野', en: 'Axis View' },
          content: {
            zh: '从鼓楼露台向南望去，可以看到中轴线一直延伸到故宫。这里是感受北京历史呼吸的最佳位置之一。',
            en: 'From this terrace, you can see the Central Axis stretching south toward the Forbidden City—one of the best spots to feel Beijing\'s history as a living rhythm.',
          },
        },
      },
    ],
    quizHint: {
      zh: '仔细听——你能感受到这座城市曾经的节拍吗？',
      en: 'Listen closely—can you feel the rhythm that once organized this city?',
    },
  },

  poi_birds_nest: {
    poiId: 'poi_birds_nest',
    markerUrl: '/ar/markers/nest-marker.png',
    narrative: {
      intro: {
        zh: '几百年来，建筑总把骨架藏在墙体背后；但在这里，结构被大胆地展示出来。为什么建筑师要让钢结构成为外表，而不是把它遮起来？你的任务：找出这座现代地标背后的"激进想法"，并解释为什么它会成为鸟巢的身份。',
        en: 'For centuries, buildings hid their frames behind walls. Here, the skeleton is on full display. Why would architects choose to expose raw steel instead of covering it up? Your mission: uncover the radical idea behind this modern icon.',
      },
      hints: [
        {
          zh: 'See the steel as breathing fabric—structure becomes the surface.',
          en: 'See the steel as breathing fabric—structure becomes the surface.',
        },
      ],
    },
    annotations: [
      {
        id: 'ann-nest-steel',
        label: { zh: '钢结构外壳', en: 'Steel Shell' },
        position: { x: 45, y: 35 },
        popup: {
          title: { zh: '42,000吨钢材', en: '42,000 Tons of Steel' },
          content: {
            zh: '鸟巢使用了42,000吨钢材织就的外壳。结构本身就是建筑的身份——这是建筑师最大胆的决定。',
            en: 'The Bird\'s Nest uses 42,000 tons of woven steel. The structure itself is the building\'s identity—the architects\' boldest decision.',
          },
        },
      },
      {
        id: 'ann-nest-concept',
        label: { zh: '巢的概念', en: 'Nest Concept' },
        position: { x: 65, y: 50 },
        popup: {
          title: { zh: '孕育生命的巢', en: 'A Nest That Breeds Life' },
          content: {
            zh: '设计灵感来自"巢"的概念——一个孕育生命的容器。建筑不只是一座体育场，更是一个象征。',
            en: 'The design draws from the concept of a "nest"—a vessel that breeds life. The building is not just a stadium but a symbol.',
          },
        },
      },
    ],
    quizHint: {
      zh: '观察钢结构的排列方式——它像什么？为什么建筑师选择这种方式？',
      en: 'Observe the steel pattern—what does it remind you of? Why did the architects choose this approach?',
    },
  },
};

export function getARConfig(poiId: string): ARPOIConfig | undefined {
  return arPOIConfigs[poiId];
}
