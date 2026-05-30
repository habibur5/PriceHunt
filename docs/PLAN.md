# PriceHunt Delivery Plan

## 1. Development Roadmap

### Phase 0: Foundation

- Define domain model, module boundaries, and shared TypeScript contracts.
- Set up monorepo structure, linting, formatting, testing, and CI.
- Establish MySQL schema, migrations, and environment configuration.
- Add Redis, BullMQ, and observability primitives.

### Phase 1: Core Catalog

- Build product, brand, category, and store models.
- Implement public search, listing, product detail, and comparison pages.
- Add canonical slug generation and SEO metadata.
- Create initial admin screens for catalog management.

### Phase 2: Scraping and Ingestion

- Implement scraper plugin framework.
- Build plugins for Star Tech, Ryans, Pickaboo, Daraz, and TechLand.
- Add scheduling, job orchestration, retries, and health reporting.
- Capture current prices and append-only price history.

### Phase 3: Users and Alerts

- Implement registration, login, sessions, and profile settings.
- Add wishlists and alert subscriptions.
- Build target price evaluation jobs and email/Telegram delivery.

### Phase 4: Operations and Scale

- Add monitoring dashboard and scraper lifecycle controls.
- Improve search performance with read models and caching.
- Add product merge workflows and manual review tools.
- Harden security, auditing, and failure recovery.

### Phase 5: Expansion

- Add more stores and categories via plugins.
- Improve ranking, personalization, and trend analysis.
- Consider search infrastructure expansion if MySQL full-text becomes limiting.
- Separate services if traffic or ingestion volume requires it.

## 2. GitHub Milestone Plan

### Milestone 1: Platform Foundation

- Repo architecture and shared contracts.
- Database schema and migrations.
- Core app scaffolding for web, API, worker, and scraper runtime.
- CI, linting, and release hygiene.

### Milestone 2: Catalog Experience

- Public product search and listing.
- Product detail page and comparison view.
- Category and brand pages.
- SEO foundation.

### Milestone 3: Ingestion Engine

- Plugin-based scraper runtime.
- First two store scrapers.
- BullMQ scheduling and retry strategy.
- Price capture and history persistence.

### Milestone 4: User Features

- Authentication and profiles.
- Wishlist and alert creation.
- Notification delivery pipeline.

### Milestone 5: Admin and Operations

- Admin dashboard.
- Store, scraper, product, and merge management.
- Monitoring and audit logs.
- Health checks and operational controls.

### Milestone 6: Scale and Expansion

- Additional store plugins.
- Performance tuning and caching.
- Advanced analytics and alert reliability improvements.
- Deployment hardening on VPS and beyond.

## 3. GitHub Issue Breakdown

### Epic: Platform Foundation

- Define monorepo layout and package boundaries.
- Add TypeScript project references and build pipeline.
- Create migration strategy and base schema.
- Add shared validation and error handling.
- Add observability baseline.

### Epic: Catalog and Search

- Create category, brand, store, and product repositories.
- Implement search endpoint and ranking.
- Build product listing pages.
- Build product detail pages with comparison data.
- Add SEO metadata and schema markup.

### Epic: Price Ingestion

- Create scraper plugin contract.
- Build scraper runtime host.
- Implement store plugin for Star Tech.
- Implement store plugin for Ryans.
- Implement store plugin for Pickaboo.
- Implement store plugin for Daraz.
- Implement store plugin for TechLand.
- Add scraper health and error reporting.

### Epic: Price History

- Store current offers.
- Append price history events.
- Compute lowest and highest price aggregates.
- Build price timeline API and UI.

### Epic: Accounts and Alerts

- Implement authentication and sessions.
- Add profile management.
- Add wishlist management.
- Add price alert CRUD.
- Add email notifications.
- Add Telegram notifications.

### Epic: Admin Console

- Build admin dashboard.
- Add product management screens.
- Add merge review flow.
- Add brand, category, and store management.
- Add scraper version control and lifecycle actions.
- Add audit logs and monitoring views.

### Epic: Operations

- Add queue monitoring.
- Add retry and dead-letter handling.
- Add rate limiting and security controls.
- Add deployment scripts for Ubuntu, PM2, Nginx, and Cloudflare.
- Add backup and restore procedures.

### Epic: Quality and Scale

- Add integration tests for ingestion.
- Add load-sensitive caching.
- Add performance benchmarks for search and comparison.
- Add data retention and archiving strategy.
- Add store expansion playbook.
