import {
  Calendar,
  Home,
  HomeIcon,
  Inbox,
  PlusIcon,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { CreateCollectionForm } from "./create-collection-form";
import { Link } from "@tanstack/react-router";
import { NavMain } from "./nav-main";
import { User } from "better-auth";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

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
    </Sidebar>
  );
}
