"use client"

import * as React from "react"

import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    TerminalSquareIcon,
    BotIcon,
    BookOpenIcon,
    Settings2Icon,
    FrameIcon,
    PieChartIcon,
    MapIcon,
    LifeBuoy,
    Send,
    Command,
    LayoutDashboardIcon,
    InboxIcon,
    UsersIcon,
    CalendarIcon,
    ShieldIcon,
} from "lucide-react"
import {dashboard} from "@/routes";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // Flat single — direct link, no submenu.
    {
      type: "single",
      title: "Dashboard",
      url: dashboard.url(),
      icon: <LayoutDashboardIcon />,
    },
    // Second flat single — demonstrates that consecutive singles share one
    // anonymous group (no label, no extra vertical gap between them).
    {
      type: "single",
      title: "Inbox",
      url: "#",
      icon: <InboxIcon />,
    },

      // Single with items — top-level collapsible parent (no group label).
      {
          type: "single",
          title: "Documentation",
          url: "#",
          icon: <BookOpenIcon />,
          items: [
              { title: "Introduction", url: "#" },
              { title: "Get Started", url: "#" },
              { title: "Tutorials", url: "#" },
              { title: "Changelog", url: "#" },
          ],
      },
    // Group with flat children — label + simple items (no nested submenu).
    {
      type: "group",
      title: "Workspace",
      items: [
        { title: "Projects", url: "#", icon: <FrameIcon /> },
        { title: "Team", url: "#", icon: <UsersIcon /> },
        { title: "Calendar", url: "#", icon: <CalendarIcon /> },
      ],
    },
    // Group with nested collapsible children — label + children that each
    // have their own submenu.
    {
      type: "group",
      title: "AI Tools",
      items: [
        {
          title: "Playground",
          url: "#",
          icon: <TerminalSquareIcon />,
          items: [
            { title: "History", url: "#" },
            { title: "Starred", url: "#", isActive: true },
            { title: "Settings", url: "#" },
          ],
        },
        {
          title: "Models",
          url: "#",
          icon: <BotIcon />,
          items: [
            { title: "Genesis", url: "#" },
            { title: "Explorer", url: "#" },
            { title: "Quantum", url: "#" },
          ],
        },
      ],
    },
    // Group with mixed children — flat + collapsible in the same group.
    {
      type: "group",
      title: "Admin",
      items: [
        { title: "Users", url: "#", icon: <UsersIcon /> },
        { title: "Permissions", url: "#", icon: <ShieldIcon /> },
        {
          title: "Settings",
          url: "#",
          icon: <Settings2Icon />,
          items: [
            { title: "General", url: "#" },
            { title: "Billing", url: "#" },
            { title: "Limits", url: "#" },
          ],
        },
      ],
    },
  ] satisfies NavMainItem[],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: <LifeBuoy />,
        },
        {
            title: "Feedback",
            url: "#",
            icon: <Send />,
        },
    ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
          <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton
                      size="lg"
                      render={
                          <a href="#">
                              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                  <Command className="size-4" />
                              </div>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                  <span className="truncate font-medium">Acme Inc</span>
                                  <span className="truncate text-xs">Enterprise</span>
                              </div>
                          </a>
                      }
                  />
              </SidebarMenuItem>
          </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
