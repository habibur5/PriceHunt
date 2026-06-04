# PriceHunt Architecture

## 1. Vision

PriceHunt is a Bangladesh electronics price comparison platform that aggregates product data from major stores, normalizes catalog information, tracks price history, and helps users discover the best offers with SEO-friendly public pages, wishlists, and price alerts.

The design target is production scale, not a demo. It must support millions of price observations, store expansion through plugins, reliable background processing, and operational visibility for a small team running on a VPS today and able to scale horizontally later.

## 2. Architecture Principles

- Use TypeScript across frontend, backend, shared contracts, workers, and scrapers.
- Keep domain logic independent from delivery frameworks using clean architecture.
- Isolate store-specific scraping behind plugins so new stores can be added without changing core application flows.
- Model price history as append-only facts with derived aggregates for fast reads.
- Prefer async processing for scraping, alerts, notifications, and re-indexing.
- Make all major state transitions auditable.
- Design for partition-friendly, index-friendly MySQL tables and Redis-backed operational acceleration.

## 3. Complete System Architecture

### 3.1 High-level components

- Public web app: Next.js, React, Tailwind CSS.
- API service: Node.js, Express.js, TypeScript.
- Worker services: BullMQ processors for scraping, alerts, notifications, sync, and maintenance.
- Scraper runtime: Playwright-based plugin executor.
- Primary datastore: MySQL.
- Cache and ephemeral state: Redis.
- Edge and ingress: Cloudflare in front of Nginx.
- Process supervision: PM2 on Ubuntu VPS.

### 3.2 Logical flow

1. A user searches or opens a product page on the public site.
2. Next.js calls the API for catalog, comparison, and price history data.
3. API reads normalized product data and low-latency denormalized views.
4. Scraper jobs are queued on BullMQ for each store and category.
5. Scraper workers execute plugin-specific Playwright adapters.
6. Extracted raw offers are normalized into canonical product and offer records.
7. Price changes generate price history events and alert evaluation jobs.
8. Alert jobs dispatch email or Telegram notifications.
9. Admin actions manage stores, scrapers, categories, merges, and user moderation.

### 3.3 Deployment topology

#### Phase 1 deployment on Ubuntu VPS

- One VM hosting Nginx, API, Next.js, workers, Redis, and MySQL.
- PM2 runs separate Node processes for:
  - web
  - api
  - workers
  - scheduler
  - scraper runtime
- Nginx routes:
  - `/` to Next.js
  - `/api` to Express API
  - `/admin` to Next.js admin area or protected admin routes
- Cloudflare provides TLS, caching, WAF, bot protection, and rate limiting.

#### Phase 2 horizontal scaling

- Separate app servers from data services.
- Move MySQL to managed or dedicated DB.
- Move Redis to clustered or managed Redis.
- Scale workers independently from web traffic.
- Optionally split scraping runtime into isolated nodes for browser-heavy workloads.

### 3.4 Runtime services

- Web frontend service: server-side rendering, SEO pages, static asset delivery.
- API service: auth, catalog, search, comparisons, wishlist, alerts, admin APIs.
- Scraper worker service: executes store plugins.
- Queue worker service: alert evaluation, notifications, recomputation, indexing.
- Scheduler service: enqueues periodic scraping and maintenance jobs.

## 4. Folder Structure

```text
PriceHunt/
  apps/
    web/
      src/
        app/
        components/
        features/
        lib/
        styles/
    api/
      src/
        config/
        controllers/
        middleware/
        routes/
        presentation/
    worker/
      src/
        jobs/
        processors/
        schedulers/
    scraper-runtime/
      src/
        plugins/
        runtime/
        shared/
  packages/
    shared/
      src/
        contracts/
        constants/
        utils/
    domain/
      src/
        entities/
        value-objects/
        services/
        repositories/
    infrastructure/
      src/
        db/
        redis/
        queue/
        notifications/
        search/
        observability/
    scraper-contracts/
      src/
        interfaces/
        types/
    ui/
      src/
        atoms/
        molecules/
        layout/
  plugins/
    star-tech/
    ryans/
    pickaboo/
    daraz/
    techland/
  prisma-or-migrations/
  docs/
  scripts/
  tests/
```

## 5. Module Structure

### 5.1 Core domains

- Catalog domain: products, brands, categories, product merges, specifications.
- Pricing domain: offers, price history, availability, storefront snapshots, price collection engine.
- Search domain: text search, filters, ranking, SEO pages.
- User domain: authentication, profiles, preferences, wishlists.
- Alert domain: target price rules, trigger events, notification delivery.
- Store domain: store metadata, scraper config, health, versioning.
- Audit domain: immutable admin actions and critical state transitions.

### 5.2 Application services

- ProductService: catalog read models and product management.
- ComparisonService: store-wise comparisons and best-price resolution.
- PriceHistoryService: timeline queries and derived aggregates.
- PriceUpdateService: normalize scraper output, detect deltas, and persist snapshots.
- PriceStatisticsService: rebuild aggregates and materialized summaries.
- AvailabilityTrackingService: track stock and availability transitions.
- WishlistService: user favorites and saved items.
- AlertService: create, evaluate, pause, resume, and notify.
- ScraperOrchestratorService: schedule and coordinate store scrapers.
- MergeService: reconcile duplicate products and canonical mappings.
- MonitoringService: health, job success rates, latency, and scraper status.

Detailed flow for the price engine lives in [docs/PRICE_COLLECTION_ENGINE.md](PRICE_COLLECTION_ENGINE.md).

### 5.3 Infrastructure modules

- MySQL repositories.
- Redis cache and queue adapters.
- BullMQ producer and consumer adapters.
- Playwright scraper host.
- Email and Telegram notification gateways.
- Audit logging and metrics adapters.

## 6. Database Architecture

### 6.1 Database design goals

- Preserve append-only price facts.
- Separate canonical product entities from store-specific offers.
- Support fast comparisons through indexed current-state tables.
- Keep historical data queryable without expensive full-table scans.
- Enable product merges without losing raw source evidence.

### 6.2 Core tables

- users
- user_sessions
- user_preferences
- stores
- store_scrapers
- brands
- categories
- products
- product_variants
- product_specs
- store_products
- offers_current
- offer_price_history
- product_merges
- wishlists
- wishlist_items
- price_alerts
- notification_deliveries
- audit_logs
- scraper_runs
- scraper_run_errors
- job_outbox

### 6.3 Storage strategy

- `offers_current` stores the latest normalized offer per store-product mapping.
- `offer_price_history` stores every detected price movement as an append-only record.
- `products` stores canonical catalog entities.
- `store_products` preserves source-specific SKU and URL references.
- `product_merges` keeps traceable merge decisions and canonical overrides.
- `scraper_runs` and `scraper_run_errors` support observability and troubleshooting.

### 6.4 Indexing strategy

- Composite indexes on category, brand, price, availability, and updated time.
- Unique constraints on canonical product slugs and store-specific source identifiers.
- History table indexes on `store_product_id`, `captured_at`, and `price`.
- Alert indexes on `user_id`, `target_price`, `status`, and `next_check_at`.
- Full-text or external search indexing for product names, specs, and aliases.

### 6.5 Partitioning and scale guidance

- Keep history tables append-only and partition by time once volume requires it.
- Archive old scraper logs and job telemetry to compressed storage.
- Avoid cross-table write-heavy transactions in hot paths.
- Use derived read models for listing pages and search result pages.

## 7. Entity Relationships

### 7.1 Main relationships

- A category has many products.
- A brand has many products.
- A product belongs to one canonical category and one brand.
- A product has many product variants and many specifications.
- A store has many store products.
- A store product maps one store listing to one canonical product.
- A store product has many offers over time.
- An offer has many price history records.
- A user has many wishlists, alerts, and notification preferences.
- A wishlist has many wishlist items.
- A price alert belongs to a user and references a product or variant target.
- A notification delivery belongs to a price alert and stores outcome details.
- A scraper run belongs to a store scraper version.

### 7.2 Merge relationships

- Multiple store products can map to one canonical product.
- Merge records are versioned and auditable.
- Raw store evidence is never deleted when products are merged.
- Canonical product redirects are preserved for SEO and bookmarks.

### 7.3 Relationship notes

- Merges should be soft, reversible, and reviewable.
- Price records should be attributed to the original store source.
- Notification events should reference the exact price snapshot that triggered them.

## 8. API Architecture

### 8.1 API style

- REST-first public and admin APIs.
- Stable versioning with `/api/v1`.
- Separate read APIs for public catalog access and write APIs for authenticated operations.
- Internal service boundaries preserved even if deployed in a single codebase.

### 8.2 Public API surface

- `GET /api/v1/search`
- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `GET /api/v1/products/:slug/prices`
- `GET /api/v1/products/:slug/comparison`
- `GET /api/v1/categories/:slug`
- `GET /api/v1/brands/:slug`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/wishlists`
- `POST /api/v1/alerts`
- `PATCH /api/v1/alerts/:id`
- `DELETE /api/v1/alerts/:id`

### 8.3 Admin API surface

- `GET /api/v1/admin/dashboard`
- `CRUD /api/v1/admin/products`
- `CRUD /api/v1/admin/brands`
- `CRUD /api/v1/admin/categories`
- `CRUD /api/v1/admin/stores`
- `CRUD /api/v1/admin/store-scrapers`
- `GET /api/v1/admin/scraper-runs`
- `PATCH /api/v1/admin/product-merges`
- `GET /api/v1/admin/audit-logs`
- `GET /api/v1/admin/users`

### 8.4 API contracts

- Use DTOs and schema validation at the boundary.
- Return pagination metadata and filters on listing endpoints.
- Use idempotency keys for critical alert and notification actions.
- Use consistent error envelopes and machine-readable error codes.

## 9. Scraper Plugin Architecture

### 9.1 Goals

- Add a new store by shipping a plugin, not editing core scraping logic.
- Support enable, disable, pause, resume, and version-aware rollout.
- Isolate store-specific DOM logic, extraction heuristics, and anti-bot handling.
- Capture health and error state per plugin and per run.

### 9.2 Plugin interface

Each plugin should expose:

- metadata: name, store, version, supported categories, locale.
- lifecycle hooks: `enable`, `disable`, `pause`, `resume`.
- scheduling hints: crawl frequency, priority, batch size.
- health probe: browser readiness, login state, selector validity.
- scrape methods: category listing, search results, product page, price refresh.
- error reporter: structured errors with recovery guidance.

### 9.3 Runtime design

- A plugin runner loads plugin packages dynamically.
- A shared context provides browser factory, logger, metrics, queue access, and secrets.
- Plugins emit normalized payloads only, never database writes directly.
- The orchestrator persists run metadata and enqueues downstream jobs.

### 9.4 Versioning support

- Every scraper plugin release gets a semantic version.
- Store configuration pins the active plugin version.
- Canary rollout can target a subset of categories or a subset of jobs.
- Rollback is done by switching the active version pointer.

### 9.5 State model

- enabled: active and scheduled.
- disabled: blocked from execution.
- paused: temporarily stopped but retained for resumption.
- degraded: enabled but unhealthy, requiring attention.
- retired: no longer scheduled but retained for historical reference.

## 10. Queue Architecture

### 10.1 BullMQ queues

- scrape-discovery queue
- scrape-product queue
- scrape-refresh queue
- price-change queue
- alert-evaluation queue
- notification-email queue
- notification-telegram queue
- merge-review queue
- search-index queue
- maintenance queue

### 10.2 Queue patterns

- Use retries with exponential backoff for transient scraping failures.
- Use dead-letter handling for repeated extraction failures.
- Use rate limiting and per-store concurrency caps.
- Use idempotent job payloads keyed by store product or alert id.
- Use delayed jobs for scheduled recrawls and alert rechecks.

### 10.3 Job isolation

- Scraping jobs should not block notification jobs.
- High-priority alert delivery must preempt bulk indexing and maintenance.
- Each queue should be independently monitored and tunable.

## 11. Background Job Architecture

### 11.1 Job categories

- Discovery jobs: find new products and category pages.
- Refresh jobs: re-check known products for price changes.
- Alert jobs: evaluate user target prices.
- Notification jobs: dispatch email and Telegram messages.
- Merge jobs: identify duplicate products and propose canonical mappings.
- Index jobs: update search and SEO read models.
- Maintenance jobs: clean expired sessions, stale cache, and old telemetry.

### 11.2 Scheduling strategy

- Cron-like scheduler creates jobs based on store priority and category freshness.
- Popular products refresh more often than long-tail items.
- Stores with unstable DOMs are scanned with conservative schedules.
- Alert evaluation is triggered both by price changes and periodic reconciliation.

### 11.3 Reliability strategy

- Persist a job outbox to prevent lost notifications after DB commits.
- Make processors idempotent so retries are safe.
- Record job attempts, latency, and failure causes.
- Use circuit breakers for flaky stores and notification providers.

## 12. Admin Architecture

### 12.1 Admin goals

- Keep catalog quality high.
- Make scraper operations observable and controllable.
- Support rapid merges and corrections without direct database editing.
- Preserve audit trails for all sensitive actions.

### 12.2 Admin modules

- Dashboard: KPIs, scrape health, price movement summary, alert load.
- Product management: edit canonical products and aliases.
- Product merge management: compare candidates, approve or revert merges.
- Brand management: normalize brand names and aliases.
- Category management: maintain taxonomy and category mapping.
- Store management: enable and disable stores and metadata.
- Scraper management: versions, schedules, health, retries, pause/resume.
- Price history management: inspect anomalies and source timelines.
- User management: account status, roles, and support actions.
- Alert management: review alert throughput and notification failures.
- Monitoring dashboard: queue health, worker health, latency, and error rates.

### 12.3 Admin security

- Require role-based access control.
- Restrict sensitive actions to explicit permission scopes.
- Log every mutation with actor, timestamp, before state, and after state.
- Protect admin routes with stricter rate limiting and session controls.

## 13. Public Website Architecture

### 13.1 Page model

- Home page with search and featured comparisons.
- Category listing pages with SEO text and filters.
- Product listing pages by brand, category, and store.
- Product detail pages with price comparison and timeline.
- Store pages with store-specific catalog slices.
- Wishlist pages and alert pages for logged-in users.

### 13.2 SEO strategy

- Server-render critical content.
- Generate clean slugs for categories, brands, and products.
- Use canonical URLs and structured data.
- Keep comparison pages indexable with meaningful copy and internal links.
- Pre-render stable category and brand landing pages.

### 13.3 UX strategy

- Surface lowest price first while keeping alternative offers visible.
- Show price trend indicators and availability state.
- Support powerful filtering by brand, price, store, rating, and specs.
- Make the comparison table readable on mobile.

## 14. Non-Functional Requirements

### 14.1 Scalability

- Read-heavy pages should use cache and denormalized views.
- Write-heavy ingestion should flow through queues.
- Design tables and indexes for growth to millions of price records.

### 14.2 Security

- Hash passwords securely.
- Enforce input validation and output encoding.
- Protect against scraping abuse, CSRF, brute force, and admin privilege misuse.
- Use Cloudflare and Nginx hardening.

### 14.3 Maintainability

- Keep business rules in domain services.
- Keep infrastructure code behind interfaces.
- Use strict TypeScript and shared contracts.
- Add observability from day one.

### 14.4 Auditability

- Store admin operations, scraper runs, and alert dispatches.
- Preserve source URLs and raw scrape metadata.
- Keep merge decisions reversible.

## 15. Recommended Implementation Boundaries

- Web app: presentation only, no scraping or persistence logic.
- API app: request validation, orchestration, and use-case execution.
- Worker app: queue execution and background workflows.
- Scraper runtime: store plugin execution and extraction only.
- Domain package: entities, value objects, and business rules.
- Infrastructure package: adapters for MySQL, Redis, BullMQ, Playwright, email, and Telegram.

## 16. Decision Summary

- Monolithic modular codebase first, with deployment separation by process.
- MySQL as system of record.
- Redis for cache, queue metadata, and rate limiting.
- BullMQ for all asynchronous workflows.
- Playwright plugin scrapers for store acquisition.
- Next.js for the public site and admin experience.
- Express.js for backend orchestration and API stability.
