import { useState } from 'react';
import { useAddCitizenUpdate } from '../api/civic.api';
import { Send, Image as ImageIcon } from 'lucide-react';

export default function CitizenUpdateComposer({ issueId }: { issueId: string }) {
  const [text, setText] = useState('');
  const { mutate: addUpdate, isPending } = useAddCitizenUpdate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    addUpdate({ issueId, text }, {
      onSuccess: () => setText('')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-glass rounded-xl border border-glass-border p-4 mb-8">
      <h3 className="font-semibold text-text-primary mb-3">Add an Update</h3>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Has the situation changed? Add new details here..."
        className="w-full bg-background/50 border border-glass-border rounded-lg p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
      />
      <div className="flex justify-between items-center mt-3">
        <button type="button" className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-background">
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Posting...' : 'Post Update'}
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
