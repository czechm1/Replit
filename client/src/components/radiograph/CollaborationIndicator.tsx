import React from 'react';
import { Users } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { CollaborativeUser } from '@/hooks/useCollaborativeAnnotation';

interface CollaborationIndicatorProps {
  users: CollaborativeUser[];
  currentUserId: string;
  isConnected: boolean;
}

export function CollaborationIndicator({
  users,
  currentUserId,
  isConnected
}: CollaborationIndicatorProps) {
  // Filter out the current user
  const otherUsers = users.filter(user => user.id !== currentUserId);
  
  // Generate a color based on the username (simple hash)
  const getUserColor = (username: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
    ];
    
    // Simple hash to consistently assign colors to usernames
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    hash = Math.abs(hash % colors.length);
    return colors[hash];
  };
  
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Users size={18} className="text-gray-400" />
        <Badge variant="outline" className="text-gray-400">Offline</Badge>
      </div>
    );
  }
  
  if (otherUsers.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Users size={18} className="text-gray-400" />
        <Badge variant="outline" className="text-green-500">Only you</Badge>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Users size={18} className="text-blue-500" />
            <Badge variant="outline" className="text-blue-500">
              {otherUsers.length} collaborator{otherUsers.length > 1 ? 's' : ''}
            </Badge>
            
            {/* User avatars */}
            <div className="flex -space-x-2 overflow-hidden">
              {otherUsers.slice(0, 3).map((user, index) => (
                <div 
                  key={user.id} 
                  className={`inline-block h-6 w-6 rounded-full ring-2 ring-white flex items-center justify-center text-xs text-white font-bold ${getUserColor(user.username)}`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              ))}
              {otherUsers.length > 3 && (
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                  +{otherUsers.length - 3}
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-2">
            <h3 className="font-bold text-sm mb-1">Current collaborators</h3>
            <ul className="text-sm">
              {otherUsers.map(user => (
                <li key={user.id} className="flex items-center gap-2 py-1">
                  <div 
                    className={`h-4 w-4 rounded-full ${getUserColor(user.username)}`}
                  />
                  {user.username}
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}