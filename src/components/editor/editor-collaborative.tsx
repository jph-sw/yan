import { Document } from "@/utils/types";
import { Editor } from "./editor";
import { User } from "@/utils/auth";
import { useEffect, useMemo } from "react";
import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";

function useWebsocket(url: string) {
  return useMemo(
    () =>
      new HocuspocusProviderWebsocket({
        url,
      }),
    [url],
  );
}

function useProvider(documentId: string, wsUrl: string) {
  const wsProvider = useWebsocket(wsUrl);
  return useMemo(
    () =>
      new HocuspocusProvider({
        websocketProvider: wsProvider,
        name: documentId,
      }),
    [documentId, wsProvider],
  );
}

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
  wsUrl: string;
}) {
  const provider = useProvider(document.id, wsUrl);

  useEffect(() => {
    provider.attach();
  }, [provider]);

  return (
    <div>
      <Editor
        key={document.id}
        user={user!}
        users={users}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        editModeChanged={editModeChanged}
        setHtmlContent={setHtmlContent}
        wsUrl={wsUrl!}
        provider={provider}
      />
    </div>
  );
}
