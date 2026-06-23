import {
	HocuspocusProvider,
	HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import type { User } from "@/utils/auth";
import type { Document } from "@/utils/types";
import { Editor } from "./editor";

export function CollaborativeEditor({
	document,
	user,
	users,
	isEditMode,
	setIsEditMode,
	editModeChanged,
	setHtmlContent,
	wsUrl,
}: {
	document: Document;
	user: User;
	users: User[];
	isEditMode: boolean;
	setIsEditMode: (isEditMode: boolean) => void;
	editModeChanged: () => void;
	setHtmlContent: (content: string) => void;
	wsUrl: string | undefined;
}) {
	const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
	const [synced, setSynced] = useState(false);

	useEffect(() => {
		if (!wsUrl) return;

		setSynced(false);
		setProvider(null);

		const socket = new HocuspocusProviderWebsocket({ url: wsUrl });
		const hocuspocusProvider = new HocuspocusProvider({
			websocketProvider: socket,
			name: document.id,
			onSynced: () => setSynced(true),
		});
		hocuspocusProvider.attach();
		setProvider(hocuspocusProvider);

		return () => {
			hocuspocusProvider.destroy();
			socket.destroy();
		};
	}, [document.id, wsUrl]);

	if (!wsUrl) {
		return <div>No WebSocket URL provided</div>;
	}

	if (!provider || !synced) {
		return (
			<div className="text-muted-foreground p-4 text-sm">Loading document…</div>
		);
	}

	return (
		<Editor
			key={document.id}
			user={user}
			users={users}
			isEditMode={isEditMode}
			setIsEditMode={setIsEditMode}
			editModeChanged={editModeChanged}
			setHtmlContent={setHtmlContent}
			provider={provider}
		/>
	);
}
