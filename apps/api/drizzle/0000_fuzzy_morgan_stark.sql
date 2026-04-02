CREATE TABLE "meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nome" text,
	"telefone" text,
	"avatar_url" text,
	"tipo_usuario" text,
	"platform_role" text DEFAULT 'none' NOT NULL,
	"created_at" integer NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "oauth_identities" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"slug" text,
	"stripe_customer_id" text,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL,
	CONSTRAINT "accounts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "accounts_users" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nome" text NOT NULL,
	"max_estabelecimentos" integer NOT NULL,
	"max_midias_por_estabelecimento" integer,
	"selo_premium" boolean DEFAULT false NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"created_at" integer NOT NULL,
	CONSTRAINT "plans_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"status" text NOT NULL,
	"provider_subscription_id" text,
	"current_period_start" integer,
	"current_period_end" integer,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cidades" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"uf" text NOT NULL,
	"slug" text NOT NULL,
	"dominio" text,
	"created_at" integer NOT NULL,
	CONSTRAINT "cidades_slug_unique" UNIQUE("slug"),
	CONSTRAINT "cidades_dominio_unique" UNIQUE("dominio")
);
--> statement-breakpoint
CREATE TABLE "cidades_afiliados" (
	"id" text PRIMARY KEY NOT NULL,
	"cidade_id" text NOT NULL,
	"user_id" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modulos" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"ordem" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "modulos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "plan_modulos" (
	"plan_id" text NOT NULL,
	"modulo_id" text NOT NULL,
	CONSTRAINT "plan_modulos_plan_id_modulo_id_pk" PRIMARY KEY("plan_id","modulo_id")
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estabelecimentos" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"cidade_id" text NOT NULL,
	"categoria_id" text NOT NULL,
	"nome" text NOT NULL,
	"slug" text,
	"dominio" text,
	"descricao" text,
	"conteudo_semantico" text,
	"peso_destaque" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'rascunho' NOT NULL,
	"publicado" boolean DEFAULT false NOT NULL,
	"destaque" boolean DEFAULT false NOT NULL,
	"score_medio" real,
	"total_avaliacoes" integer DEFAULT 0 NOT NULL,
	"codigo_publico" integer,
	"created_by_user_id" text,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL,
	CONSTRAINT "estabelecimentos_dominio_unique" UNIQUE("dominio")
);
--> statement-breakpoint
CREATE TABLE "estabelecimentos_avaliacoes" (
	"id" text PRIMARY KEY NOT NULL,
	"estabelecimento_id" text NOT NULL,
	"autor_id" text,
	"nota" integer NOT NULL,
	"comentario" text,
	"resposta" text,
	"respondido_em" integer,
	"destaque_positivo" boolean DEFAULT false,
	"tem_midia" boolean DEFAULT false NOT NULL,
	"util_count" integer DEFAULT 0 NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estabelecimentos_enderecos" (
	"estabelecimento_id" text PRIMARY KEY NOT NULL,
	"cep" text,
	"logradouro" text,
	"bairro" text,
	"cidade" text,
	"uf" text,
	"latitude" real,
	"longitude" real,
	"local_verificado" boolean DEFAULT false NOT NULL,
	"atualizado_em" integer
);
--> statement-breakpoint
CREATE TABLE "estabelecimentos_horario_intervalos" (
	"id" text PRIMARY KEY NOT NULL,
	"estabelecimento_id" text NOT NULL,
	"dia_semana" integer NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"abre" text NOT NULL,
	"fecha" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estabelecimentos_midias" (
	"id" text PRIMARY KEY NOT NULL,
	"estabelecimento_id" text NOT NULL,
	"tipo" text NOT NULL,
	"storage_key" text NOT NULL,
	"url_publica" text,
	"ordem" integer DEFAULT 0 NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "oauth_identities" ADD CONSTRAINT "oauth_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts_users" ADD CONSTRAINT "accounts_users_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts_users" ADD CONSTRAINT "accounts_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cidades_afiliados" ADD CONSTRAINT "cidades_afiliados_cidade_id_cidades_id_fk" FOREIGN KEY ("cidade_id") REFERENCES "public"."cidades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cidades_afiliados" ADD CONSTRAINT "cidades_afiliados_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_modulos" ADD CONSTRAINT "plan_modulos_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_modulos" ADD CONSTRAINT "plan_modulos_modulo_id_modulos_id_fk" FOREIGN KEY ("modulo_id") REFERENCES "public"."modulos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_cidade_id_cidades_id_fk" FOREIGN KEY ("cidade_id") REFERENCES "public"."cidades"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos_avaliacoes" ADD CONSTRAINT "estabelecimentos_avaliacoes_estabelecimento_id_estabelecimentos_id_fk" FOREIGN KEY ("estabelecimento_id") REFERENCES "public"."estabelecimentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos_avaliacoes" ADD CONSTRAINT "estabelecimentos_avaliacoes_autor_id_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos_enderecos" ADD CONSTRAINT "estabelecimentos_enderecos_estabelecimento_id_estabelecimentos_id_fk" FOREIGN KEY ("estabelecimento_id") REFERENCES "public"."estabelecimentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos_horario_intervalos" ADD CONSTRAINT "estabelecimentos_horario_intervalos_estabelecimento_id_estabelecimentos_id_fk" FOREIGN KEY ("estabelecimento_id") REFERENCES "public"."estabelecimentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estabelecimentos_midias" ADD CONSTRAINT "estabelecimentos_midias_estabelecimento_id_estabelecimentos_id_fk" FOREIGN KEY ("estabelecimento_id") REFERENCES "public"."estabelecimentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_oauth_identities_provider_sub" ON "oauth_identities" USING btree ("provider","provider_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_accounts_users_account_user" ON "accounts_users" USING btree ("account_id","user_id");