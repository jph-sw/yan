import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { User } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

interface MentionItem {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
}

interface MentionListProps {
	items: MentionItem[];
	command: (item: MentionItem) => void;
}

export interface MentionListRef {
	onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(
	({ items, command }, ref) => {
		const [selectedIndex, setSelectedIndex] = useState(0);

		useEffect(() => {
			setSelectedIndex(0);
		}, [items]);

		const selectItem = (index: number) => {
			const item = items[index];
			if (item) {
				command(item);
			}
		};

		useImperativeHandle(ref, () => ({
			onKeyDown: ({ event }: { event: KeyboardEvent }) => {
				if (event.key === "ArrowUp") {
					setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
					return true;
				}

				if (event.key === "ArrowDown") {
					setSelectedIndex((prev) => (prev + 1) % items.length);
					return true;
				}

				if (event.key === "Enter") {
					selectItem(selectedIndex);
					return true;
				}

				return false;
			},
		}));

		return (
			<Command className="rounded-lg border shadow-lg">
				<CommandList>
					{items.length === 0 ? (
						<CommandEmpty>No users found</CommandEmpty>
					) : (
						<CommandGroup>
							{items.map((item, index) => (
								<CommandItem
									key={item.id}
									value={item.id}
									onSelect={() => selectItem(index)}
									className="flex items-center gap-3 cursor-pointer"
									data-selected={index === selectedIndex}
								>
									{item.avatar ? (
										<img
											src={item.avatar}
											alt={item.name}
											className="h-8 w-8 rounded-full object-cover"
										/>
									) : (
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
											<User className="h-4 w-4" />
										</div>
									)}
									<div className="flex flex-col">
										<span className="font-medium">{item.name}</span>
										{item.email && (
											<span className="text-xs text-muted-foreground">
												{item.email}
											</span>
										)}
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</Command>
		);
	},
);

MentionList.displayName = "MentionList";

export default MentionList;
