---
applyTo: "**"
---

# Project Overview
The project is an **Electronic Voting System** for an academic Final Year Project (TCC).
The main goal is to create a secure, efficient, and anonymous web application to replace manual election processes.
The architecture is a **TypeScript** backend with **NestJS** and a **Vue.js** frontend.
The absolute top priorities are **security**, **data integrity**, and the **complete anonymity of the vote**.
This is a MVP (Minimum Viable Product) and should focus on core functionalities only.
Avoid overengineering or adding unnecessary features.

---
## Core Non-Functional Requirements (RNF)
The entire system must adhere to these quality attributes:
- **Security & Anonymity (RNF01):** All communication must be encrypted (HTTPS). The vote must be completely anonymous, with no possible technical link between a voter's identity and their cast vote.
- **Usability (RNF02):** The UI must be clean, intuitive, and responsive. The Voting Booth interface, in particular, must be extremely simple to prevent user error.
- **Data Integrity (RNF04):** A vote, once cast, cannot be altered. A voting credential can only be used once. All critical operations that change data (e.g., casting a vote) must be atomic and transactional.
- **Auditability (RNF05):** The system must log critical events (e.g., user login, voter authorization attempts, vote casting events) to allow for transparent process verification. Logs must not contain sensitive voter-vote information.

---
## Functional Requirements (RF)
### Admin Module
- `ADMIN` users must be able to log in.
- `ADMIN` users must be able to create a new election, defining its name, candidates (chapas), and their unique numbers.
- `ADMIN` users must be able to upload the list of eligible voters for an election.
- `ADMIN` users must be able to start and end an election period, following the linear progression: Created → Active → Closed.
- `ADMIN` users must be able to view the final, consolidated results only after an election is closed.

### Poll Worker (`Mesário`) Module
- `POLL_WORKER` users must be able to log in.
- The system must allow a `POLL_WORKER` to search for a voter by their student ID.
- The system must display the voter's status (`ELIGIBLE_TO_VOTE`, `HAS_VOTED`, or `HAS_ACTIVE_CREDENTIAL`).
- The system must allow a `POLL_WORKER` to authorize an eligible voter only if the election is `ACTIVE`, which triggers the generation of a credential.
- The system must prevent re-authorization of voters who have already voted or have an active credential.

### Voting Booth (`Urna`) Module
- **RF10:** The booth must prompt the user to enter a unique voting credential.
- **RF11:** The booth must validate that the credential is authentic, has not been previously used, and has not expired (5-minute validity).
- **RF12:** Upon successful validation, the booth must display the candidates (chapas) with their unique numbers for the associated election.
- **RF13:** The booth must support three types of votes: valid (selecting a chapa), blank, and null.
- **RF14:** A confirmation screen must be shown to the voter before finalizing the vote.
- **RF15:** The vote must be recorded completely anonymously.
- **RF16:** The credential must be permanently invalidated immediately after the vote is recorded.

---
## Core Business Rules (RN)
All generated code must strictly enforce the following rules:

### Election Management
- **RN05:** Election results are only visible after the election's status is `CLOSED`.
- **RN06:** The number of each chapa (candidate list) must be unique within the same election.
- **RN08:** The status of an election must progress linearly: Created → Active → Closed.

### Voter Eligibility & Authorization
- **RN01:** A voter can only cast one vote per election.
- **RN04:** Only voters registered in the official list of an election can vote.
- **RN09:** A voter who has already voted or has an active credential cannot be re-authorized.
- **RN10:** The same voter can participate in multiple elections (different elections, not the same one multiple times).
- **RN12:** Poll workers can only authorize voters in elections with status `ACTIVE`.

### Credential Management
- **RN02:** A voting credential has single use and expires in 5 minutes after generation.
- **RN15:** Generated credential tokens must be unique across the entire system to prevent any collision.

### Vote Anonymity & Integrity
- **RN03:** The system must guarantee complete vote anonymity, with no tracking or linkage between voter identity and cast vote.
- **RN07:** A confirmed vote in the system is immutable and cannot be altered.
- **RN11:** The system must process three types of votes: valid (for a chapa), blank, and null.

### Results & Abstention
- **RN14:** Abstention count is the difference between the total number of eligible voters and the total number of recorded votes.

### Access Control
- **RN13:** User profiles (Administrator, Poll Worker, Voter) have distinct functions with no overlap.

---
## Technology Stack & Architectural Patterns
- **Backend:** TypeScript with NestJS (built on Express).
- **Frontend:** Vue.js 3 (Composition API), TypeScript, Vite, Vuetify.
- **State Management:** Pinia for Vue.js.
- **Database:** PostgreSQL with Prisma ORM.
- **Authentication:** JWT tokens with role-based access control (RBAC).
- **Data Transfer:** Use DTOs for all API payloads, validated with class-validator and class-transformer.
- **Security:** HTTPS/TLS encryption, JWT Auth Guard, Roles Guard.

---
## Architectural Layers
### Frontend Layer (Presentation)
- **Modules:** Admin Module, Poll Worker Module, Voting Booth Module.
- **State Management:** Auth Store (authentication/authorization), Election Store (election data).
- **Routing:** Vue Router with navigation guards for access control.
- **HTTP Client:** Axios for secure HTTPS requests.

### Backend Layer (Application)
- **Controllers:** Auth Controller, Admin Controller, Mesario Controller, Urna Controller.
- **Services:** Auth Service, Admin Service, Mesario Service, Urna Service (business logic).
- **Repositories:** Admin Repository, Mesario Repository, Urna Repository (data access).
- **Guards:** JWT Auth Guard (token validation), Roles Guard (RBAC).

### Data Layer (Persistence)
- **ORM:** Prisma (type-safe database access).
- **Database:** PostgreSQL.
- **Entities:** Administrador, Mesario, Eleicao, Chapa, Eleitor, Credencial, Voto.

---
## Coding Style and Conventions
- **TypeScript:** Follow standard TypeScript Naming Conventions (PascalCase for classes/interfaces, camelCase for variables/functions).
- **Vue.js:** Use the Composition API with `<script setup lang="ts">`.
- **NestJS:** Use decorators for controllers, services, and guards. Follow module-based organization.
- **General:** Code must be clean, readable, and include JSDoc/TSDoc comments for public APIs and complex logic.
- **Patterns:** Use MVC pattern with Service and Repository layers to ensure separation of concerns.
- **REST API:** Ensure all API endpoints follow RESTful principles.
- **Validation:** Use class-validator decorators in DTOs for input validation.
- **Error Handling:** Use NestJS exception filters and custom exceptions.
- **DO NOT OVERENGINEER.** Focus on core functionalities only.

---
## Database Schema Requirements
- **Eleicao:** Must have status field (CREATED, ACTIVE, CLOSED) and enforce linear progression.
- **Chapa:** Must have unique number within each election.
- **Eleitor:** Must track status (ELIGIBLE_TO_VOTE, HAS_VOTED, HAS_ACTIVE_CREDENTIAL) and be associated with specific elections.
- **Credencial:** Must have unique token, expiration timestamp (5 minutes), status (ACTIVE, USED, EXPIRED), and reference to election (but NOT to voter for anonymity).
- **Voto:** Must be completely anonymous with no reference to voter identity. Must record vote type (VALID, BLANK, NULL) and optionally the chapa (if valid).
- **Relationships:** Ensure proper foreign keys and cascading rules. The Voto table must never have a direct or indirect foreign key to Eleitor.

---
## Security Considerations
- **Password Storage:** Hash all passwords with bcrypt before storage.
- **JWT Tokens:** Sign with strong secret, include role in payload, implement proper expiration.
- **Credential Tokens:** Generate cryptographically secure random tokens for voting credentials.
- **Vote Anonymity:** The system architecture must make it technically impossible to link a voter's identity to their cast vote. Never log voter-vote associations.
- **Input Validation:** Validate and sanitize all user inputs to prevent injection attacks.
- **HTTPS Only:** All production deployments must use HTTPS/TLS.

---
## Testing Requirements
- **Unit Tests:** Test services and repositories with mocked dependencies.
- **Integration Tests:** Test API endpoints with test database.
- **E2E Tests:** Test critical user flows (authorization, voting, result viewing).
- **Security Tests:** Verify that vote anonymity cannot be compromised through any system query or log analysis.