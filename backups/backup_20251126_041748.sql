--
-- PostgreSQL database dump
--

\restrict wXrxpdYdhfdQ9J2dhyuELy4dTp97jmze5YMKgA4CncU8x94SgEztQ1XuefDEmuk

-- Dumped from database version 14.20
-- Dumped by pg_dump version 14.20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Partner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Partner" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text,
    location text,
    whatsapp text,
    instagram text,
    email text,
    "priceRange" text,
    "portfolioUrl" text,
    "avatarUrl" text,
    tags text[] DEFAULT ARRAY[]::text[],
    notes text,
    "collaborationCount" integer DEFAULT 0 NOT NULL,
    "internalRank" double precision DEFAULT 0 NOT NULL,
    "manualScore" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Partner" OWNER TO postgres;

--
-- Name: Portfolio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Portfolio" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    summary text,
    images text[] DEFAULT ARRAY[]::text[],
    tags text[] DEFAULT ARRAY[]::text[],
    categories text[] DEFAULT ARRAY[]::text[],
    brands text[] DEFAULT ARRAY[]::text[],
    featured boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Portfolio" OWNER TO postgres;

--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSettings" (
    id text NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    "headerTaglineOne" text DEFAULT ''::text NOT NULL,
    "headerTaglineTwo" text DEFAULT ''::text NOT NULL,
    "headerTaglineThree" text DEFAULT ''::text NOT NULL,
    "headerTaglineFour" text DEFAULT ''::text NOT NULL,
    "showCursor" boolean DEFAULT false NOT NULL,
    "showBlog" boolean DEFAULT false NOT NULL,
    "darkMode" boolean DEFAULT false NOT NULL,
    "showResume" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "aboutPara" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."SiteSettings" OWNER TO postgres;

--
-- Name: Social; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Social" (
    id text NOT NULL,
    title text NOT NULL,
    link text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Social" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Partner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Partner" (id, name, category, description, location, whatsapp, instagram, email, "priceRange", "portfolioUrl", "avatarUrl", tags, notes, "collaborationCount", "internalRank", "manualScore", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Portfolio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Portfolio" (id, title, slug, summary, images, tags, categories, brands, featured, "order", "createdAt", "updatedAt") FROM stdin;
392a4e18-1d47-41ad-8c02-9b345781ce00	asdasd	e917e7164ab84b08a85b426a8d15030a	asdasd a	{https://bucket.nisaaulia.com/dev/portfolio/e917e7164ab84b08a85b426a8d15030a/1763877009264-1000481663.jpg,https://bucket.nisaaulia.com/dev/portfolio/e917e7164ab84b08a85b426a8d15030a/1763877012636-1000474441.jpg}	{asdasd}	{asda}	{fsdfasqw}	t	0	2025-11-23 05:50:13.858	2025-11-23 05:50:13.858
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, title, description, "order", "createdAt", "updatedAt") FROM stdin;
131c246d-72ae-4f34-aa79-b6e02e61e291	Commercial Modeling	With a strong background in commercial work, I bring brand stories to life through movement, poise, and polished presence. I model for beauty brands, lifestyle labels, and campaigns that seek both authenticity and allure.	1	2025-11-23 06:00:28.346	2025-11-23 06:02:45.726
30d22f14-7e13-42be-b8af-e78bb483db71	Beauty Direction	I offer creative direction tailored to beauty and commercial shoots—curating concepts, styling, and visual mood that elevate your campaign's essence. From soft elegance to bold editorial, I help shape visuals that speak.	0	2025-11-23 06:00:28.346	2025-11-23 06:02:45.726
a7d3a27c-b938-400f-9216-d4a598b59998	Makeup Artistry Collaboration	Specializing in the harmony between face and frame, I collaborate with top makeup artists or offer guided looks to create visually cohesive, stunning results for photo and film.	2	2025-11-23 06:00:28.346	2025-11-23 06:02:45.726
94c39894-3ad1-4511-90b0-7c610061e7e8	Brand Aesthetics Consulting	I assist brands in defining their visual identity within beauty, fashion, and lifestyle. Whether it's selecting the right palette, textures, or atmosphere, I help ensure every image aligns with your brand's refined voice.	3	2025-11-23 06:00:28.346	2025-11-23 06:02:45.726
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSettings" (id, name, "headerTaglineOne", "headerTaglineTwo", "headerTaglineThree", "headerTaglineFour", "showCursor", "showBlog", "darkMode", "showResume", "createdAt", "updatedAt", "aboutPara") FROM stdin;
default	Nisa Aulia 🌸	Hello 👋	I'm Nisa Aulia - Model	Muse and Makeup Aficionado	based in Jakarta, Indonesia.	t	t	f	t	2025-11-23 05:56:12.254	2025-11-23 06:06:22.59	Modeling, for me, is more than a profession—it is an intimate dialogue between soul and surface, a dance between light, emotion, and the silent language of expression. My name is Nisa Aulia, and I specialize in makeup artistry and commercial shoots, where every detail is curated, every glance intentional. \nMy journey began not in the spotlight, but in the quiet moments of transformation—watching colors bloom on skin, seeing faces light up under the right contour or the perfect shade. Makeup became my medium, the lens through which I understood beauty: nuanced, evolving, powerful.\nI used to believe modeling was simply about standing before a camera. Now I know it's about embodying a story. It’s about how you move, what you wear, the textures that touch your skin, and the brand of self you choose to reflect. Each shoot is a canvas. Each look, a mood. Each campaign, a memory in motion.\nElegance, to me, is not just style—it is intention. It is the ability to communicate grace without words, to hold space with presence alone.\nI don’t just model—I become the Muse. For brands. For beauty. For the story waiting to be seen.
\.


--
-- Data for Name: Social; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Social" (id, title, link, "order", "createdAt", "updatedAt") FROM stdin;
19b8dc2c-6279-405e-829a-b838e881de0b	Instagram	https://instagram.com/nisa_wly	0	2025-11-23 06:08:16.522	2025-11-23 06:08:16.522
26491401-5ef4-4490-b846-000b85dcb1c4	TikTok	https://www.tiktok.com/@racunnyacacaaa	1	2025-11-23 06:08:16.522	2025-11-23 06:08:16.522
ff0b3402-e818-4d44-88b0-073ee138edb8	Email	mailto:contact@nisaaulia.com	2	2025-11-23 06:08:16.522	2025-11-23 06:08:16.522
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
397e6300-f485-4a7e-adde-72ea449052dd	e303aa04e182f531186ce5dd3f1225f9bc6b1910ea0201e3ad9e5ab0caee848b	2025-11-23 05:44:44.072562+00	20251119040256_init_partners	\N	\N	2025-11-23 05:44:44.060256+00	1
4df369af-7bf0-4a96-b646-0b6f32b3a8df	2e4607f941eaf5143779aa3bba108dc8d7a04e30d50b6c7c8c0da727ed8eb638	2025-11-23 05:56:07.251245+00	20251123130000_add_site_settings		\N	2025-11-23 05:56:07.251245+00	0
ed164b85-c810-4a05-b346-9c65a5c92a46	41e97ba1569d2abb249cb2a4eea332780667d5bff0c9991551f062f3c917c44d	2025-11-23 05:45:00.361277+00	20251119094039_rename_photographers_to_tags		\N	2025-11-23 05:45:00.361277+00	0
073cfea2-04f8-4631-b7ea-ba8d09b0b552	fa8f32c69058cfc959c42468d10bb0cfcab7339584e2d5fdb3f314a6edd1a11e	2025-11-23 05:45:06.542329+00	20251119150000_add_portfolio	\N	\N	2025-11-23 05:45:06.528258+00	1
bb1fd1c0-f7dc-4bf0-a1ac-fbee1742bd00	41e97ba1569d2abb249cb2a4eea332780667d5bff0c9991551f062f3c917c44d	2025-11-23 09:08:05.034631+00	20251119094039_rename_photographers_to_tags	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251119094039_rename_photographers_to_tags\n\nDatabase error code: 42P01\n\nDatabase error:\nERROR: relation "Portfolio" does not exist\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42P01), message: "relation \\"Portfolio\\" does not exist", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("namespace.c"), line: Some(433), routine: Some("RangeVarGetRelidExtended") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251119094039_rename_photographers_to_tags"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20251119094039_rename_photographers_to_tags"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260	2025-11-23 05:45:00.359285+00	2025-11-23 05:44:44.074264+00	1
70b39f7a-c8c7-4c0e-96ae-ca2a87d21cfd	ef57a9e51f1866d00baaa121c34260c500b292513f388ca1eead927f2f515d06	2025-11-23 05:45:06.547019+00	20251120000000_rename_portfolio_fields	\N	\N	2025-11-23 05:45:06.543436+00	1
f2a684b1-376c-413b-bc59-dfcfd2b5f87b	f1bab56ee882b657cea7aac1740ac93dea25168c801227c26d49dfab24456e76	2025-11-23 06:00:28.391711+00	20251123140000_add_services	\N	\N	2025-11-23 06:00:28.342437+00	1
f4ebb3b7-0611-484e-95d7-3ad4a46aae4e	4a3aee1297fb0937e5e46c17c9354ddc7a208cbd499ef1a16fc41cd67069472e	2025-11-23 05:46:36.656626+00	20251120120000_fix_portfolio_tags	\N	\N	2025-11-23 05:46:36.625156+00	1
f6137ea7-8b8d-40a8-bd61-6216891129cc	da9068fe2ea2ca268429a2d9978ea80cafb5730e5922232a0331c58237d5814e	2025-11-23 06:04:28.300672+00	20251123150000_add_about_para_to_site_settings		\N	2025-11-23 06:04:28.300672+00	0
a683bcc6-ee2a-4a3d-8730-2dbe88ec137d	e6822d10abcefccf32481f5b8d5943afdcab5f0c9b08c139acddb60345020aac	2025-11-23 06:08:10.787801+00	20251123160000_add_socials		\N	2025-11-23 06:08:10.787801+00	0
8a07400e-81d1-4e7a-a1bf-b4aa9cd96dd6	d6d83d821050e05fb8f8800e4c32e7071717a06f78856bbf7311708b751cae36	2025-11-23 09:08:09.070111+00	20251123130000_add_site_settings	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251123130000_add_site_settings\n\nDatabase error code: 23502\n\nDatabase error:\nERROR: null value in column "updatedAt" of relation "SiteSettings" violates not-null constraint\nDETAIL: Failing row contains (default, Nisa Aulia, Hello 👋, I'm Nisa Aulia - Model, Muse and Makeup Aficionado,  based in Jakarta, Indonesia., t, t, f, t, 2025-11-23 05:55:57.033, null).\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23502), message: "null value in column \\"updatedAt\\" of relation \\"SiteSettings\\" violates not-null constraint", detail: Some("Failing row contains (default, Nisa Aulia, Hello 👋, I'm Nisa Aulia - Model, Muse and Makeup Aficionado,  based in Jakarta, Indonesia., t, t, f, t, 2025-11-23 05:55:57.033, null)."), hint: None, position: None, where_: None, schema: Some("public"), table: Some("SiteSettings"), column: Some("updatedAt"), datatype: None, constraint: None, file: Some("execMain.c"), line: Some(1907), routine: Some("ExecConstraints") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251123130000_add_site_settings"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20251123130000_add_site_settings"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260	2025-11-23 05:56:07.249153+00	2025-11-23 05:55:57.023098+00	1
29c00b86-b12f-41bc-83e6-90f9ac49ed97	manual	2025-11-23 09:08:35.178511+00	20251123160639_add_tags_to_portfolio		\N	2025-11-23 09:08:35.178511+00	1
\.


--
-- Name: Partner Partner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partner"
    ADD CONSTRAINT "Partner_pkey" PRIMARY KEY (id);


--
-- Name: Portfolio Portfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Portfolio"
    ADD CONSTRAINT "Portfolio_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSettings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


--
-- Name: Social Social_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Social"
    ADD CONSTRAINT "Social_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Portfolio_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Portfolio_featured_idx" ON public."Portfolio" USING btree (featured);


--
-- Name: Portfolio_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Portfolio_slug_idx" ON public."Portfolio" USING btree (slug);


--
-- Name: Portfolio_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Portfolio_slug_key" ON public."Portfolio" USING btree (slug);


--
-- Name: Service_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Service_order_idx" ON public."Service" USING btree ("order");


--
-- Name: SiteSettings_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SiteSettings_id_key" ON public."SiteSettings" USING btree (id);


--
-- Name: Social_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Social_order_idx" ON public."Social" USING btree ("order");


--
-- PostgreSQL database dump complete
--

\unrestrict wXrxpdYdhfdQ9J2dhyuELy4dTp97jmze5YMKgA4CncU8x94SgEztQ1XuefDEmuk

