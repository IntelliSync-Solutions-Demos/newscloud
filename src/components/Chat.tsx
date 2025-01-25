import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send } from 'lucide-react';
import { streamCompletion, textToSpeech } from '@/services/openai';
import { useAISettings } from '@/store/aiSettings';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { systemPrompt, voiceEnabled } = useAISettings();
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
      { role: 'user' as const, content: input },
    ];

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    let fullResponse = '';
    try {
      await streamCompletion(newMessages, (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = fullResponse;
          } else {
            newMessages.push({ role: 'assistant', content: fullResponse });
          }
          return newMessages;
        });
      });

      if (voiceEnabled) {
        const audioData = await textToSpeech(fullResponse);
        const blob = new Blob([audioData], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
            {voiceEnabled && (
              <Button
                variant="outline"
                size="icon"
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
}