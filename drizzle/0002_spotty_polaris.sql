PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_collection` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`created_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_collection`("id", "name", "icon", "created_at") SELECT "id", "name", "icon", "created_at" FROM `collection`;--> statement-breakpoint
DROP TABLE `collection`;--> statement-breakpoint
ALTER TABLE `__new_collection` RENAME TO `collection`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_document` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`collection_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`created_by` text,
	`updated_by` text,
	`published` integer DEFAULT false,
	FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_document`("id", "title", "content", "collection_id", "created_at", "updated_at", "created_by", "updated_by", "published") SELECT "id", "title", "content", "collection_id", "created_at", "updated_at", "created_by", "updated_by", "published" FROM `document`;--> statement-breakpoint
DROP TABLE `document`;--> statement-breakpoint
ALTER TABLE `__new_document` RENAME TO `document`;