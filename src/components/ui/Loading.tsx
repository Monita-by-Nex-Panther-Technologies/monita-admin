import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Loading: React.FC = () => {
    return (
        <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[280px] p-6 gap-4 rounded-md shadow-lg bg-white" showClose={false}>
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#4b5708]  border-t-transparent rounded-full animate-spin" />
            
            <div>
              <p className="text-sm font-semibold text-gray-800 animate-pulse">Just a moment...</p>
              <p className="text-xs text-gray-500">Hang tight.</p>
            </div>
      
            {/* Animated pulsing dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#414b05]  rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-[#7f930d]  rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-[#b9d70d]  rounded-full animate-bounce" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
};

export default Loading;