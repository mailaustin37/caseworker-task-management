# Production considerations

## Azure deployment

The local containers deliberately avoid requiring an Azure subscription. A production design could map the solution to:

- Azure Front Door or an approved ingress for routing and TLS
- Static frontend hosting or a container platform
- Azure Kubernetes Service or Azure Container Apps for the Spring Boot API
- Azure Database for PostgreSQL
- Azure Monitor and managed log aggregation
- Azure Key Vault for secrets

Kubernetes manifests and Terraform would be added once the target HMCTS platform conventions were confirmed. Infrastructure should follow the platform team's modules rather than inventing assessment-specific standards.

## Redis

Redis is not needed for the current task volume. If measurements identified repeated expensive reads, it could be introduced for short-lived dashboard aggregates or task-list summaries. PostgreSQL would remain the source of truth. Cache entries would use explicit expiry times and be invalidated after relevant writes.

## Availability and resilience

- Run multiple stateless API replicas across failure zones
- Use readiness and liveness probes
- Apply connection and request timeouts
- Use managed database backups and tested restoration procedures
- Define service-level indicators for availability, latency and errors
- Alert on sustained error rates, latency and resource saturation

## Observability

Observability is deliberately described rather than bundled into this coding exercise. In production, the service could use Spring Boot Actuator and Micrometer to expose narrowly selected health and application metrics. A Prometheus-compatible platform could collect the time-series data, while Grafana or Azure Monitor could present dashboards and alerting. Structured logs and distributed traces should carry correlation identifiers so an operational issue can be followed across the frontend, API and database boundary.

The initial service-level indicators should cover request volume, latency, error rate and resource saturation. Business-level signals, such as overdue tasks and failed task updates, should be added only when they lead to a clear operational action. Management endpoints must not expose secrets or unnecessary environment details and should be restricted to the internal monitoring network.

## Data growth

The current due-date and status indexes support the primary access patterns. At larger scale, the list endpoint should use server-side pagination and indexed filters. An audit history should be stored separately from the current task record.
