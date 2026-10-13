# Security notes

## Implemented controls

- Request DTO validation with explicit length and date constraints
- Parameterised data access through Spring Data JPA
- Centralised exception handling without stack traces in client responses
- Strict CORS allow-list for local frontend origins
- Stateless API configuration
- `X-Content-Type-Options` and frame protection headers
- Explicit deny-by-default routing outside the documented API and OpenAPI endpoints
- Non-root user in the backend container
- Local credentials separated from source defaults through environment variables
- Database constraints for valid task statuses

These controls address common OWASP concerns including injection, security misconfiguration, unsafe error disclosure and unrestricted input.

Authentication was not part of the coding challenge, so the assessment does not invent users or roles. For a production caseworker service, the API should validate access tokens from the approved identity provider using OpenID Connect and OAuth 2.0, then enforce role-based permissions at both request and service boundaries. CSRF protection should be reviewed alongside the final authentication model, particularly if browser cookies are introduced.

## Further production controls

- TLS at every external boundary
- Secret storage in an approved managed vault
- Dependency and container image scanning in CI
- Audit events for task creation, modification and deletion
- Rate limiting at the API gateway
- Content Security Policy headers
- Database encryption and controlled backups
- Threat modelling and regular access reviews
