# Azure Resume / Portfolio

Personal cloud engineering portfolio for [damienhenriquez.com](https://damienhenriquez.com), built and hosted on Microsoft Azure.

The site showcases my experience in cloud security, identity, Azure infrastructure, automation, and DevOps, along with several hands-on engineering projects.

## Live Site

[https://damienhenriquez.com](https://damienhenriquez.com)

## Architecture

~~~mermaid
flowchart LR
    USER[Visitor] --> DOMAIN[damienhenriquez.com]
    DOMAIN --> SWA[Azure Static Web Apps]

    SWA --> FRONTEND[HTML / CSS / JavaScript]

    FRONTEND -->|POST /api/visitor| FUNCTION[Azure Function]
    FUNCTION --> COSMOS[(Azure Cosmos DB)]
    COSMOS --> FUNCTION
    FUNCTION -->|JSON visitor count| FRONTEND

    GITHUB[GitHub Repository] --> ACTIONS[GitHub Actions CI/CD]
    ACTIONS --> SWA

    DNS[Namecheap DNS] --> DOMAIN
~~~

The frontend is hosted on **Azure Static Web Apps** and served through the custom `damienhenriquez.com` domain with managed HTTPS.

The visitor counter is backed by a managed **Azure Function** API and **Azure Cosmos DB**.

## Visitor Counter

The site includes a persistent serverless visitor counter.

When the page loads:

1. JavaScript sends a `POST` request to `/api/visitor`.
2. Azure Static Web Apps routes the request to the managed Azure Function.
3. The Function atomically increments the visitor count stored in Cosmos DB.
4. The Function returns the updated count as JSON.
5. The frontend updates the footer with the current site visit count.

The API also supports `GET /api/visitor` to retrieve the current count without incrementing it.

Cosmos DB stores the counter in the `Visitors` container using `/id` as the partition key.

## Deployment Workflow

~~~mermaid
flowchart LR
    DEV[Local Development] --> COMMIT[Git Commit]
    COMMIT --> PUSH[Push to main]
    PUSH --> GITHUB[GitHub Repository]

    GITHUB --> ACTIONS[GitHub Actions]

    ACTIONS --> FRONTEND[Deploy Static Frontend]
    ACTIONS --> API[Deploy Managed Functions API]

    FRONTEND --> AZURE[Azure Static Web Apps]
    API --> AZURE

    AZURE --> PROD[damienhenriquez.com]
~~~

Every push to the `main` branch triggers the Azure Static Web Apps GitHub Actions workflow.

The workflow deploys:

- the static frontend from `/frontend`
- the managed Functions API from `/api`

Production application settings such as the Cosmos DB connection string are stored in Azure Static Web Apps application settings and are not committed to the repository.

## Technology Stack

| Area | Technology |
| --- | --- |
| Hosting | Azure Static Web Apps |
| Serverless API | Azure Functions |
| Database | Azure Cosmos DB |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js |
| CI/CD | GitHub Actions |
| Cloud | Microsoft Azure |
| Domain | Namecheap DNS |
| Security | HTTPS, Azure-managed application settings |
| Source Control | Git / GitHub |

## Repository Structure

~~~text
azure-resume/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-blue-pebble-05fa2070f.yml
├── api/
│   ├── host.json
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       └── functions/
│           └── visitor.js
├── frontend/
│   ├── assets/
│   │   └── Damien-Henriquez-Resume.pdf
│   ├── index.html
│   ├── script.js
│   ├── staticwebapp.config.json
│   └── styles.css
├── .gitignore
└── README.md
~~~

## Security and Design Decisions

- Secrets are not stored in source control.
- Cosmos DB credentials are stored as Azure Static Web Apps application settings.
- The API is exposed through the Static Web Apps `/api` route.
- HTTPS is enabled for the custom domain.
- The visitor counter uses a Cosmos DB atomic increment operation.
- Azure Static Web Apps Free Tier and Cosmos DB Free Tier keep operating costs minimal.

## Local Development

Start the Azure Functions API from the `api` directory:

~~~bash
func start
~~~

The visitor API is available locally at:

~~~text
http://localhost:7071/api/visitor
~~~

Example requests:

~~~bash
curl http://localhost:7071/api/visitor
curl -X POST http://localhost:7071/api/visitor
~~~

Local application settings are stored in `api/local.settings.json`, which is excluded from Git.

## Featured Engineering Projects

- **Secure Azure Landing Zone** — Terraform, Azure Policy, Key Vault, networking, remote state, GitHub Actions, and OIDC.
- **Entra Identity Governance Automation** — PowerShell, Microsoft Graph, Python, Joiner-Mover-Leaver automation, access governance, and identity lifecycle workflows.
- **Microsoft Sentinel Detection Engineering Lab** — KQL detections, Azure and Entra telemetry, Sentinel analytics rules, and MITRE ATT&CK mappings.

## Author

**Damien Henriquez**

Cloud Security • Identity • Azure Infrastructure

[Website](https://damienhenriquez.com) · [GitHub](https://github.com/damienhenriquez) · [LinkedIn](https://linkedin.com/in/damien-henriquez1)

