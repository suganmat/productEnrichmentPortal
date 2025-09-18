import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { User as UserType } from "@shared/schema";

export function ProfileDropdown() {
  const { user } = useAuth();
  
  // Type assertion for better type safety
  const typedUser = user as UserType | undefined;

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getUserDisplayName = () => {
    if (typedUser?.firstName && typedUser?.lastName) {
      return `${typedUser.firstName} ${typedUser.lastName}`;
    }
    if (typedUser?.firstName) {
      return typedUser.firstName;
    }
    if (typedUser?.email) {
      return typedUser.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (typedUser?.firstName && typedUser?.lastName) {
      return `${typedUser.firstName[0]}${typedUser.lastName[0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="profile-button">
          <Avatar className="h-10 w-10">
            <AvatarImage src={typedUser?.profileImageUrl || ''} alt="Profile" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="flex flex-col items-start p-4" disabled>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="font-medium" data-testid="user-display-name">
              {getUserDisplayName()}
            </span>
          </div>
          {typedUser?.email && (
            <span className="text-sm text-muted-foreground mt-1" data-testid="user-email">
              {typedUser.email}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-testid="logout-button">
          <LogOut className="w-4 h-4 mr-2" />
          Logout as {getUserDisplayName()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}