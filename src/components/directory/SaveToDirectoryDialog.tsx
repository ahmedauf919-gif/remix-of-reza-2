import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addEntry, MODEL_META } from "@/lib/directoryStore";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  modelId: string;
  inputs: Record<string, unknown>;
  defaultName?: string;
}

export function SaveToDirectoryDialog({ open, onClose, modelId, inputs, defaultName }: Props) {
  const [name, setName] = useState(defaultName ?? "");
  const [notes, setNotes] = useState("");

  const meta = MODEL_META[modelId];

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please enter a scenario name");
      return;
    }
    if (!meta) {
      toast.error("Unknown model");
      return;
    }
    addEntry({
      name: trimmed,
      notes: notes.trim() || undefined,
      category: meta.category,
      modelId,
      modelLabel: meta.label,
      modelHref: meta.href,
      inputsSnapshot: inputs,
    });
    toast.success("Saved to Directory");
    setName(defaultName ?? "");
    setNotes("");
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#002060]">Save to Directory</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {meta && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.tagColor}`}>
                {meta.tag}
              </span>
              <span className="text-sm text-muted-foreground">{meta.label}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="scenario-name">Scenario name</Label>
            <Input
              id="scenario-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Base case – 150 MW"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scenario-notes">Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              id="scenario-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Brief description…"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            className="bg-[#002060] hover:bg-[#002060]/90 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
