import { useAISettings } from '@/store/aiSettings';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function streamCompletion(
  messages: Message[],
  onChunk: (chunk: string) => void,
) {
  const settings = useAISettings.getState();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: settings.model,
        temperature: settings.temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get completion');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Convert the chunk to text and send it to the callback
      const chunk = new TextDecoder().decode(value);
      const lines = chunk
        .split('\n')
        .filter((line) => line.trim() !== '' && line.trim() !== 'data: [DONE]');

      for (const line of lines) {
        try {
          const jsonStr = line.replace(/^data: /, '');
          const json = JSON.parse(jsonStr);
          const content = json.choices[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  } catch (error) {
    console.error('Error in streamCompletion:', error);
    throw error;
  }
}

export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to convert text to speech');
  }

  return await response.arrayBuffer();
}