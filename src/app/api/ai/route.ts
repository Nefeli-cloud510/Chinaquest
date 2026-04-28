import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: Message[];
  type: 'scene' | 'summary' | 'chat';
  prompt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    
    // 构建系统提示词
    const systemPrompt = `You are ChinaQuest's "Cultural Explorer", a professional cultural guide and travel advisor. Your tasks are:
1. Provide professional, friendly, and engaging cultural explanations for international tourists
2. Offer accurate information based on Chinese culture and history
3. Describe attractions and cultural phenomena in vivid language
4. Encourage tourists to deeply experience and explore Chinese culture
5. Maintain a professional and enthusiastic service attitude

Important guidelines:
- Always respond in English
- Do not repeat the user's questions or keywords
- Provide direct answers to the user's questions
- Focus on providing valuable cultural insights and practical information`;

    // 构建完整的消息列表
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...body.messages,
      { role: 'user', content: body.prompt }
    ];

    // 实际调用qwen大模型API
    try {
      const qwenResponse = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen-plus', // 或其他qwen模型
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!qwenResponse.ok) {
        throw new Error(`API请求失败: ${qwenResponse.status}`);
      }

      const qwenData = await qwenResponse.json();
      const responseContent = qwenData.choices[0].message.content;

      return NextResponse.json({
        success: true,
        message: responseContent
      });
    } catch (error) {
      console.error('Qwen API error:', error);
      //  fallback到本地响应
      let responseContent = '';
      if (body.type === 'scene') {
        responseContent = `As your Cultural Explorer, I'd like to introduce this site: \n\n${body.prompt} is a place rich in historical and cultural heritage, having witnessed countless important historical events. I recommend observing the architectural details around you and immersing yourself in the historical atmosphere. \n\nYou can deepen your understanding through: \n1. Observing architectural styles and decorative details \n2. Learning about related historical stories \n3. Interacting with local residents to understand their way of life`;
      } else if (body.type === 'summary') {
        responseContent = `Based on your experience keywords "${body.prompt}", here's your journey summary: \n\nYour Beijing cultural exploration journey was filled with wonderful moments. During your experience of ${body.prompt}, you not only felt the charm of traditional Chinese culture but also experienced the vitality of modern Beijing. \n\nHighlights of this journey include: \n- Gaining a deep understanding of the historical significance of Beijing's Central Axis \n- Experiencing the perfect integration of tradition and modernity \n- Creating unique cultural memories \n\nHope this journey left you with wonderful memories, and look forward to your next exploration of China's cultural treasures!`;
      } else {
        responseContent = `I'm your Cultural Explorer. How can I assist you today? Feel free to ask about attractions, culture, history, or any other aspects of your journey, and I'll provide detailed information and recommendations.`;
      }

      return NextResponse.json({
        success: true,
        message: responseContent
      });
    }

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { success: false, message: '抱歉，暂时无法处理您的请求，请稍后再试。' },
      { status: 500 }
    );
  }
}
