"use client"

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import Avvvatars from 'avvvatars-react';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { authApi, User } from '@/services/auth.service';

export function NavUser() {
  const { isMobile } = useSidebar();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: authApi.getMe,
    retry: 1,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  const handleLogout = async () => {
    try {
      authApi.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  console.log('user', user)
  
  if (!user) {
    return (
      <div className="p-4">
        <Button variant="outline" className="w-full" asChild>
          <a href="/login">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="h-8 w-8">
                <Avvvatars
                  value={user.username}
                  size={32}
                  style="shape"
                  border
                  borderColor="#e2e8f0"
                  shadow
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.username}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-2"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-2">
                <div className="h-10 w-10">
                  <Avvvatars
                    value={user?.username}
                    size={40}
                    style="shape"
                    border
                    borderColor="#e2e8f0"
                    shadow
                  />
                </div>
                <div className="grid flex-1">
                  <span className="truncate font-medium">{user?.username}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href="/account" className="w-full">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              {user.role === 'ADMIN' && (
                <DropdownMenuItem asChild>
                  <a href="/admin" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Admin Panel</span>
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  3
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
