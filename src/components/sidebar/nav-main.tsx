import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { User } from "better-auth";
import { ChevronRight, MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createDocument } from "@/utils/data/documents";
import type { Collection, Document } from "@/utils/types";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar";
import { CreateCollectionForm } from "./create-collection-form";

const STORAGE_KEY = "doitwrite-collection-states";

function loadCollectionStates(): Record<string, boolean> {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : {};
	} catch (error) {
		console.error("Error loading collection states:", error);
		return {};
	}
}

function saveCollectionStates(states: Record<string, boolean>) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
	} catch (error) {
		console.error("Error saving collection states:", error);
	}
}

export function NavMain({
	collections,
	user,
	documents,
}: {
	collections: Collection[];
	documents: Document[];
	user: User;
}) {
	const queryClient = useQueryClient();
	const [isCreatingNewDocument, setIsCreatingNewDocument] = useState<
		Record<string, boolean>
	>({});
	const [isCreatingNewCollection, setIsCreatingNewCollection] = useState(false);
	const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const savedStates = loadCollectionStates();
		setOpenStates(savedStates);
	}, []);

	useEffect(() => {
		saveCollectionStates(openStates);
	}, [openStates]);

	const createDocumentMutation = useMutation({
		mutationFn: async (data: { collectionId: string; title: string }) => {
			const res = await createDocument({
				data: {
					title: data.title,
					collectionId: data.collectionId,
					createdBy: user.id,
				},
			});

			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["documents"] });
		},
	});

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Collections</SidebarGroupLabel>
			<SidebarMenu>
				{collections.map((collection) => (
					<Collapsible
						key={collection.id}
						render={
							<SidebarMenuItem>
								<SidebarMenuButton
									render={
										<Link to="/collection/$id" params={{ id: collection.id }}>
											<span>{collection.name}</span>
										</Link>
									}
									tooltip={collection.name}
								></SidebarMenuButton>
								<div className="absolute top-1.5 right-8 flex items-center">
									<button
										type="button"
										onClick={() => {
											if (isCreatingNewDocument[collection.id]) {
												setIsCreatingNewDocument((prev) => ({
													...prev,
													[collection.id]: false,
												}));
											} else {
												setIsCreatingNewDocument((prev) => ({
													...prev,
													[collection.id]: true,
												}));
												setOpenStates((prev) => ({
													...prev,
													[collection.id]: true,
												}));
											}
										}}
										className="flex aspect-square w-5 items-center justify-center rounded-md p-0 hover:bg-sidebar-accent"
									>
										{isCreatingNewDocument[collection.id] ? (
											<MinusIcon className="size-4" />
										) : (
											<PlusIcon className="size-4" />
										)}
									</button>
								</div>
								<CollapsibleTrigger
									render={
										<SidebarMenuAction className="data-[state=open]:rotate-90">
											<ChevronRight />
											<span className="sr-only">Toggle</span>
										</SidebarMenuAction>
									}
								></CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{isCreatingNewDocument[collection.id] && (
											<SidebarMenuSubItem key={"new_item"}>
												<form
													onSubmit={(e) => {
														e.preventDefault();
														e.stopPropagation();
														setIsCreatingNewDocument((prev) => ({
															...prev,
															[collection.id]: false,
														}));
														createDocumentMutation.mutate({
															title: (e.target as any).title.value,
															collectionId: collection.id,
														});
													}}
												>
													<SidebarMenuSubButton
														render={<Input autoFocus name="title" />}
													></SidebarMenuSubButton>
												</form>
											</SidebarMenuSubItem>
										)}
										{documents
											.filter((doc) => doc.collectionId === collection.id)
											.map((doc) => (
												<SidebarMenuSubItem key={doc.id}>
													<SidebarMenuSubButton
														render={
															<Link to="/doc/$id" params={{ id: doc.id }}>
																<span>{doc.title}</span>
															</Link>
														}
													></SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						}
						open={openStates[collection.id] ?? false}
						onOpenChange={(open) => {
							setOpenStates((prev) => ({
								...prev,
								[collection.id]: open,
							}));
						}}
					></Collapsible>
				))}
				<Dialog
					open={isCreatingNewCollection}
					onOpenChange={() =>
						setIsCreatingNewCollection(!isCreatingNewCollection)
					}
				>
					<DialogTrigger
						render={
							<SidebarMenuItem>
								<SidebarMenuButton>
									<PlusIcon />
									<span>New collection</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						}
					></DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>New collection</DialogTitle>
							<DialogDescription>
								Here you can create a new content collection
							</DialogDescription>
						</DialogHeader>
						<CreateCollectionForm
							closeDialog={() => setIsCreatingNewCollection(false)}
						/>
					</DialogContent>
				</Dialog>
			</SidebarMenu>
		</SidebarGroup>
	);
}
