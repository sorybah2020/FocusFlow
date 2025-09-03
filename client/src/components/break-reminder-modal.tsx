import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coffee, Play } from "lucide-react";

interface BreakReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBreak: () => void;
  onSkipBreak: () => void;
}

export default function BreakReminderModal({
  isOpen,
  onClose,
  onStartBreak,
  onSkipBreak,
}: BreakReminderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="break-reminder-modal">
        <DialogHeader>
          <DialogTitle>Time for a break! 🎉</DialogTitle>
          <DialogDescription>
            Great job focusing! Take a 5-minute break to recharge.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="text-primary text-2xl h-8 w-8" />
          </div>
          <div className="space-y-3">
            <Button
              onClick={onStartBreak}
              className="w-full"
              data-testid="button-start-break"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Break Timer
            </Button>
            <Button
              variant="secondary"
              onClick={onSkipBreak}
              className="w-full"
              data-testid="button-skip-break-modal"
            >
              Skip Break
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
