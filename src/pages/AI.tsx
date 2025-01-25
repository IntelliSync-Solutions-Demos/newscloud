import { Chat } from "@/components/Chat";
import { AISettings } from "@/components/AISettings";

export function AI() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chat />
        </div>
        <div>
          <AISettings />
        </div>
      </div>
    </div>
  );
}