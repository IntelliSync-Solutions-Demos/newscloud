import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAISettings } from '@/store/aiSettings';

export function AISettings() {
  const {
    temperature,
    model,
    systemPrompt,
    persistMemory,
    voiceEnabled,
    setTemperature,
    setModel,
    setSystemPrompt,
    setPersistMemory,
    setVoiceEnabled,
  } = useAISettings();

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label>Model Selection</Label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4 Optimized</SelectItem>
            <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Temperature ({temperature})</Label>
        <Slider
          value={[temperature]}
          onValueChange={([value]) => setTemperature(value)}
          min={0}
          max={1}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <Label>System Prompt</Label>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Persist Memory</Label>
        <Switch
          checked={persistMemory}
          onCheckedChange={setPersistMemory}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Voice Enabled</Label>
        <Switch
          checked={voiceEnabled}
          onCheckedChange={setVoiceEnabled}
        />
      </div>
    </Card>
  );
}