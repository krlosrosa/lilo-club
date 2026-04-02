CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nome` text,
	`telefone` text,
	`avatar_url` text,
	`tipo_usuario` text,
	`platform_role` text DEFAULT 'none' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `cidades` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`uf` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cidades_slug_unique` ON `cidades` (`slug`);--> statement-breakpoint
CREATE TABLE `cidades_afiliados` (
	`id` text PRIMARY KEY NOT NULL,
	`cidade_id` text NOT NULL,
	`user_id` text NOT NULL,
	`ativo` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`cidade_id`) REFERENCES `cidades`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`slug` text,
	`stripe_customer_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_slug_unique` ON `accounts` (`slug`);--> statement-breakpoint
CREATE TABLE `accounts_users` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_accounts_users_account_user` ON `accounts_users` (`account_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`nome` text NOT NULL,
	`max_estabelecimentos` integer NOT NULL,
	`max_midias_por_estabelecimento` integer,
	`selo_premium` integer DEFAULT false NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plans_slug_unique` ON `plans` (`slug`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`status` text NOT NULL,
	`provider_subscription_id` text,
	`current_period_start` integer,
	`current_period_end` integer,
	`cancel_at_period_end` integer DEFAULT false,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `modulos` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `modulos_slug_unique` ON `modulos` (`slug`);--> statement-breakpoint
CREATE TABLE `plan_modulos` (
	`plan_id` text NOT NULL,
	`modulo_id` text NOT NULL,
	PRIMARY KEY(`plan_id`, `modulo_id`),
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`modulo_id`) REFERENCES `modulos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `categorias` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `estabelecimentos` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`cidade_id` text NOT NULL,
	`categoria_id` text NOT NULL,
	`nome` text NOT NULL,
	`slug` text,
	`descricao` text,
	`conteudo_semantico` text,
	`peso_destaque` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'rascunho' NOT NULL,
	`publicado` integer DEFAULT false NOT NULL,
	`destaque` integer DEFAULT false NOT NULL,
	`score_medio` real,
	`total_avaliacoes` integer DEFAULT 0 NOT NULL,
	`codigo_publico` integer,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cidade_id`) REFERENCES `cidades`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `estabelecimentos_avaliacoes` (
	`id` text PRIMARY KEY NOT NULL,
	`estabelecimento_id` text NOT NULL,
	`autor_id` text,
	`nota` integer NOT NULL,
	`comentario` text,
	`resposta` text,
	`respondido_em` integer,
	`destaque_positivo` integer DEFAULT false,
	`tem_midia` integer DEFAULT false NOT NULL,
	`util_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`autor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `estabelecimentos_enderecos` (
	`estabelecimento_id` text PRIMARY KEY NOT NULL,
	`cep` text,
	`logradouro` text,
	`bairro` text,
	`cidade` text,
	`uf` text,
	`latitude` real,
	`longitude` real,
	`local_verificado` integer DEFAULT false NOT NULL,
	`atualizado_em` integer,
	FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `estabelecimentos_horario_intervalos` (
	`id` text PRIMARY KEY NOT NULL,
	`estabelecimento_id` text NOT NULL,
	`dia_semana` integer NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`abre` text NOT NULL,
	`fecha` text NOT NULL,
	FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `estabelecimentos_midias` (
	`id` text PRIMARY KEY NOT NULL,
	`estabelecimento_id` text NOT NULL,
	`tipo` text NOT NULL,
	`storage_key` text NOT NULL,
	`url_publica` text,
	`ordem` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos`(`id`) ON UPDATE no action ON DELETE cascade
);
