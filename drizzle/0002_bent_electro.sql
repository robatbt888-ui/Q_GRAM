CREATE TABLE `accountSettings` (
	`userId` int NOT NULL,
	`privateAccount` boolean NOT NULL DEFAULT false,
	`allowComments` boolean NOT NULL DEFAULT true,
	`allowTags` enum('everyone','following','nobody') NOT NULL DEFAULT 'everyone',
	`allowMentions` enum('everyone','following','nobody') NOT NULL DEFAULT 'everyone',
	`pushNotifications` boolean NOT NULL DEFAULT true,
	`emailNotifications` boolean NOT NULL DEFAULT true,
	`archiveStories` boolean NOT NULL DEFAULT true,
	`activityStatus` boolean NOT NULL DEFAULT true,
	`language` varchar(16) NOT NULL DEFAULT 'fa',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accountSettings_userId` PRIMARY KEY(`userId`)
);
