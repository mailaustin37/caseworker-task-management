# Architecture

## Context

The service gives HMCTS caseworkers one place to create, review, update and complete operational tasks. It is an internal transactional application, so predictable navigation, accessibility and clear status information take priority over search engine optimisation.

## Components

```text
Browser
  |
  v
React and Redux frontend
  |
  v
Spring Boot REST API
  |
  v
PostgreSQL
```

## Main decisions

### Single repository

The frontend, backend, local infrastructure and documentation are versioned together. This makes the assessment reproducible with one clone and one Docker Compose command.

### React single-page application

This is an internal caseworker tool. Server-side rendering and public search indexing would not add value. React provides a focused client interface and mirrors the team's component-based approach.

### PostgreSQL as the source of truth

Tasks are transactional records with a small and well-defined schema. PostgreSQL provides constraints, indexing, durability and straightforward operational support.

### No Redis in the core solution

The current workload does not justify a cache. Introducing one would add invalidation and consistency concerns without improving the assessment. Redis is discussed in `PRODUCTION_CONSIDERATIONS.md` as a future option for measured performance needs.

### Stable API envelope

Every API response uses the same shape: `message`, optional `data`, optional `errors`, and `timestamp`. This makes client error handling predictable and keeps future API changes easier to manage.

### Focused assessment scope

The runnable solution includes only the components required to demonstrate the task lifecycle clearly. Production monitoring, authentication and platform infrastructure should be designed against confirmed HMCTS standards rather than added speculatively to the coding exercise. The likely production approach is recorded in `PRODUCTION_CONSIDERATIONS.md`.
