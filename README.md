# HMCTS Caseworker Task Management

A full-stack task management service for HMCTS caseworkers. The application supports the complete task lifecycle through an accessible React interface and a documented Spring Boot API.

## What the service does

- Create a task with a title, optional description, status, and due date and time
- View all tasks ordered by due date
- View and edit task details
- Update task status directly from the task list
- Delete a task after confirmation
- Search tasks and filter them by status
- Identify overdue and soon-due work

## Technology

| Area | Technology |
| --- | --- |
| Frontend | React, Redux Toolkit, React Router, Axios, Yup, Vite |
| Backend | Java 21, Spring Boot, Spring Data JPA, Spring Validation |
| Database | PostgreSQL with Flyway migrations |
| API documentation | OpenAPI and Swagger UI |
| Local environment | Docker Desktop and Docker Compose |
| Tests | JUnit, Mockito, Vitest |

## Run the complete application

### Prerequisites

- Docker Desktop
- At least 4 GB of memory available to Docker

From the repository root:

```bash
docker compose up --build
```

The initial build downloads dependencies and may take several minutes. When the health checks pass, open:

| Service | URL |
| --- | --- |
| Caseworker interface | http://localhost:3100 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI specification | http://localhost:8080/v3/api-docs |

The local-only defaults and their environment variable names are recorded in [.env.example](.env.example).

Stop the environment with:

```bash
docker compose down
```

To remove local database data as well:

```bash
docker compose down --volumes
```

## API endpoints

All responses use the same envelope with `message`, optional `data`, optional `errors`, and `timestamp`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks` | Retrieve all tasks |
| `GET` | `/api/tasks/{taskId}` | Retrieve one task |
| `PUT` | `/api/tasks/{taskId}` | Update a task |
| `PATCH` | `/api/tasks/{taskId}/status` | Update task status |
| `DELETE` | `/api/tasks/{taskId}` | Delete a task |

Example request:

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Review witness statement",
    "description": "Check the document before the hearing",
    "status": "TODO",
    "dueDateTime": "2030-06-20T14:30:00"
  }'
```

## Run tests

Backend tests can run without a local Maven installation:

```bash
docker run --rm \
  -v "$PWD/backend:/workspace" \
  -w /workspace \
  maven:3.9.12-eclipse-temurin-21-alpine \
  mvn clean verify
```

Frontend tests:

```bash
cd frontend
npm ci
npm test
```

GitHub Actions repeats both test suites, builds the frontend, and starts the core containers for a smoke check of the interface and API.

## Project structure

```text
.
├── backend
│   └── src
│       ├── main/java/uk/gov/hmcts/tasks
│       │   ├── config
│       │   ├── controllers
│       │   ├── dto
│       │   ├── entities
│       │   ├── enums
│       │   ├── exceptions
│       │   ├── repositories
│       │   ├── services
│       │   └── utils
│       └── main/resources/db/migration
├── frontend
│   └── src
│       ├── components
│       ├── config
│       ├── layout
│       ├── pages
│       ├── redux
│       └── utils
├── docs
└── compose.yaml
```

## Design decisions

- The solution uses a single repository so a reviewer can clone and run the whole system with one command.
- PostgreSQL is the only source of truth. Redis is intentionally excluded because the current workload does not justify cache invalidation and consistency overhead.
- The interface is a client-rendered React application because this is an internal caseworker service and does not need public search indexing.
- The runnable assessment stays focused on the requested task lifecycle, validation, error handling, tests, API documentation and reproducible setup. Production monitoring is discussed separately rather than adding services that are not required by the challenge.

Further explanation is available in:

- [Architecture](docs/ARCHITECTURE.md)
- [Security notes](docs/SECURITY.md)
- [Production considerations](docs/PRODUCTION_CONSIDERATIONS.md)

## Accessibility

The interface uses semantic headings, table markup, explicit form labels, visible keyboard focus, a skip link, keyboard-operable dialogs, plain error messages, responsive layouts and reduced-motion support. A production release would also include automated and manual WCAG 2.2 AA testing.
