import { DownloadCloud, HomeIcon, LucideIcon, LucideProps } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { NavMain } from "./nav-main";
import { User } from "better-auth";
import { NavUser } from "./nav-user";
import React from "react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { Collection, Document } from "@/utils/types";
import { NavSearch } from "./nav-search";

export function AppSidebar({
  collections,
  documents,
  user,
}: {
  collections: Collection[];
  documents: Document[];
  user: User;
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/home">
                    <HomeIcon /> Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <NavSearch collections={collections} documents={documents} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavMain collections={collections} user={user} documents={documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
