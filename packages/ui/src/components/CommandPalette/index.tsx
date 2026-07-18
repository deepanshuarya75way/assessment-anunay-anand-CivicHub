import React from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '../Skeleton';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';

export const CommandPalette = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed left-1/2 top-1/2 z-50 max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background/80 backdrop-blur-xl border shadow-2xl p-0 overflow-hidden outline-none animate-in fade-in zoom-in-95">
        <Command className="flex h-full w-full flex-col bg-transparent text-foreground">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
            <Command.Input
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type a command or search..."
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm">
              No results found.
            </Command.Empty>
            {children}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
