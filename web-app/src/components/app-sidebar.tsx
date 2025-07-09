"use client"

import * as React from "react"
import {
  BookOpen,
  Heart,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/default-avatar.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/overview",
      icon: PieChart,
      isActive: true,
      items: [],
    },
    {
      title: "Book List",
      url: "/books",
      icon: BookOpen,
      isActive: false,
      items: [],
    },
    {
      title: "Create Book",
      url: "/books/create",
      icon: Send,
      isActive: false,
      items: [],
    },
    {
      title: "Favorite Books",
      url: "/favorites",
      icon: Heart,
      isActive: false,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center gap-4">
                <Image 
                  src="/logo.png" 
                  alt="BookList Logo" 
                  width={32} 
                  height={32} 
                  className="rounded-lg"
                />
                <span className="text-left text-sm leading-tight">
                  <span className="text-xl font-medium">BookList</span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
