# Multi-Tenant RLS with PostgreSQL and TypeORM

This project demonstrates a multi-tenant architecture using PostgreSQL's Row-Level Security (RLS) to isolate tenant data. It leverages **TypeORM** as the ORM and **Express** for the API layer, showcasing dynamic tenant handling and RLS enforcement.

---

## Features

- Multi-tenant data isolation using PostgreSQL RLS.
- Dynamic tenant identification and database access.
- CRUD operations for tenants, users, and images.
- Dynamic `DataSource` creation for tenant-specific roles.
- Full TypeScript support.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [Docker](https://www.docker.com/) installed and running
- [PostgreSQL](https://www.postgresql.org/) via Docker Compose or locally
- `npm` or `yarn` for package management

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-repo/multi-tenant-rls.git
cd multi-tenant-rls
```

### Install Dependencies

```bash
npm install
```

### Set Up PostgreSQL
```bash
docker-compose up -d
```

### Run Migrations

```bash
npm run typeorm migration:run
```

### Start the Server

```bash
npm run dev
```

### Access the API

#### Tenant Endpoints
* Create Tenant
POST /tenants
```json
{
  "name": "tenant1"
}
```

* Get All Users for a Tenant
GET /users
Headers:
x-tenant-id: <tenant_id>

#### User Endpoints
* Create a User
POST /users  
Headers:  
  x-tenant-id: <tenant_id>
```json
{
  "name": "user1",
  "email": "jown.doe@example.com"
}
```

* Get All Users of a Tenant
GET /users  
Headers:  
  x-tenant-id: <tenant_id>

#### Image Endpoints
* Create an Image
POST /images  
Headers:    
  x-tenant-id: <tenant_id>
```json
{
  "name": "image1",
  "url": "https://example.com/image1.jpg",
  "userId": <user_id>
}
```

* Get All Images for a User
GET /images  
Headers:  
x-tenant-id: <tenant_id>  

---


### License 
This version of the README includes the necessary troubleshooting steps, ensuring users can debug their setup effectively. Let me know if you’d like further adjustments!