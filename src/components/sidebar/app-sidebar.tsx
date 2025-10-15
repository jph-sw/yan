import { HomeIcon } from "lucide-react";

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

export function AppSidebar({
  collections,
  documents,
  user,
}: {
  collections: {
    id: string;
    name: string;
    createdAt: Date | null;
  }[];
  documents: {
    id: string;
    title: string;
    createdAt: Date | null;
    collectionId: string | null;
    createdBy: string | null;
    updatedBy: string | null;
    content: string;
  }[];
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
