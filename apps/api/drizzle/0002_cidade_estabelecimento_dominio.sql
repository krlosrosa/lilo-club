ALTER TABLE `cidades` ADD `dominio` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `cidades_dominio_unique` ON `cidades` (`dominio`);
--> statement-breakpoint
ALTER TABLE `estabelecimentos` ADD `dominio` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `estabelecimentos_dominio_unique` ON `estabelecimentos` (`dominio`);
