import { SiteShell } from "@/components/shell";
import { Card, Pill } from "@/components/ui";

export default function AboutPage() {
  return (
    <SiteShell active="about">
      <div className="grid gap-6">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="red">Cultural depth</Pill>
            <Pill tone="gold">Premium & modern</Pill>
            <Pill>Independent travel</Pill>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            About ChinaQuest
          </h1>
          <div className="mt-3 grid gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <div className="text-sm font-semibold">Who we are</div>
              <div className="whitespace-pre-line text-sm leading-6 text-[color:var(--cq-muted)]">
                We are ChinaQuest -- your deep culture partner for exploring China.
                {"\n"}
                Created by a team with cross-cultural backgrounds, ChinaQuest was designed for independent international travelers who seek meaning behind what they see. We understand that visiting a new country often comes with unfamiliar symbols, spatial logic, and social context. Our role is to help you read the city the way locals understand it.
                {"\n"}
                Through carefully structured routes and interactive storytelling, we connect architecture, history, and everyday life into a coherent experience. Each stop is crafted to reveal how space reflects values such as order, balance, and community. Our approach blends cultural research with accessible narratives, making complex traditions easy to grasp without oversimplifying them.
                {"\n"}
                At ChinaQuest, travel becomes an act of interpretation. You walk through real streets, stand before real buildings, and gradually uncover how centuries of thought shaped the environment around you. We accompany you not as a tour guide, but as a cultural translator and thoughtful companion.
              </div>
            </div>
            <div className="grid gap-3">
              <div className="text-sm font-semibold">我们是谁</div>
              <div className="whitespace-pre-line text-sm leading-6 text-[color:var(--cq-muted)]">
                我们是ChinaQuest，致力于成为您理解中国城市与文化结构的深度文化伙伴。
                {"\n"}
                团队成员拥有跨文化背景与多学科视角，专注于为自由行外国游客提供更有逻辑与连贯性的文化体验。我们理解，当人们来到陌生城市时，面对的不只是语言差异，更是空间秩序、象征意义与生活方式的差异。我们的使命，是帮助游客读懂城市背后的组织方式与文化表达。
                {"\n"}
                通过清晰的路线设计与轻量互动叙事，我们将建筑、历史与当代生活连接成一条可被理解的故事线。在ChinaQuest，旅行不仅是观看景点，更是一次关于理解与连接的过程。
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">Why the Central Axis</div>
            <div className="mt-2 whitespace-pre-line text-sm leading-6 text-[color:var(--cq-muted)]">
              The Central Axis is the structural backbone of Beijing’s historical design.
              {"\n"}
              Stretching from south to north, this carefully aligned line has organized the capital for over six centuries. Along it stand gates, ceremonial spaces, and political landmarks, each positioned with intention. The axis reflects a long-standing cultural belief that a capital city should embody clarity, hierarchy, and spatial balance.
              {"\n"}
              We chose the Central Axis because it offers a clear narrative framework for understanding Chinese urban thought. Walking this route allows visitors to experience how power, ritual, and daily life were arranged in physical form. The straight line is not merely geographic; it represents a worldview expressed through architecture.
              {"\n"}
              From the monumental southern gates to contemporary structures further north, the Axis presents continuity and transformation within a single journey. It provides an ideal setting for cross-cultural exploration, where visitors can observe how tradition and modern life coexist within one coherent urban structure.
            </div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">Design language</div>
            <div className="mt-2 whitespace-pre-line text-sm leading-6 text-[color:var(--cq-muted)]">
              Our design language is built around three principles: premium, modern, and cultural depth.
              {"\n\n"}
              Premium{"\n"}
              We create a calm and refined visual experience. The interface avoids clutter and excessive decoration, allowing space, alignment, and typography to convey quality. Inspired by the restrained elegance of traditional Beijing architecture, our palette features deep reds, muted greys, and subtle gold accents. The overall feeling is thoughtful and composed.
              {"\n\n"}
              Modern{"\n"}
              While rooted in history, the experience feels contemporary and intuitive. Clean layouts, clear navigation, and concise language ensure accessibility for international travelers. The design supports exploration with clarity and confidence, making cultural discovery feel smooth and natural.
              {"\n\n"}
              Cultural Depth{"\n"}
              Every visual and narrative element is connected to historical context. The structured layout echoes the logic of the Central Axis itself—balanced, linear, and intentional. Rather than overwhelming users with information, we guide them to observe, reflect, and gradually uncover meaning within real spaces.
              {"\n\n"}
              Experience keywords: Structured. Immersive. Refined. Modern. Culturally Grounded.
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
