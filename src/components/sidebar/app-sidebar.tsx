import { Link } from "@tanstack/react-router";
import type { User } from "better-auth";
import { DownloadCloud, HomeIcon, LucideIcon, LucideProps } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import React from "react";
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
import type { Collection, Document } from "@/utils/types";
import { NavMain } from "./nav-main";
import { NavSearch } from "./nav-search";
import { NavUser } from "./nav-user";

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
								<SidebarMenuButton
									render={
										<Link className="w-full" to="/home">
											<HomeIcon /> Home
										</Link>
									}
								></SidebarMenuButton>
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
