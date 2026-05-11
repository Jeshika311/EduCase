# School API (Internship submission)

Simple Node.js + Express APIs to add and list schools stored in MySQL. The list endpoint sorts by proximity to a provided latitude/longitude.

Setup

1. Install dependencies:

```bash
npm install
```

2. Create a MySQL database and import schema:

```sql
-- from project root
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
```

3. Copy `.env.example` to `.env` and update DB credentials.

4. Start the server:

```bash
npm run dev    # requires nodemon
# or
npm start
```

APIs

- POST /addSchool
  - Body (JSON): `name`, `address`, `latitude`, `longitude`
  - Adds a school and returns the created record with `id`.

- GET /listSchools?lat=...&lng=...&limit=...
  - Query params: `lat` (required), `lng` (required), `limit` (optional)
  - Returns schools sorted by distance (kilometers) from the provided point.

Postman

Import `postman/SchoolAPIs.postman_collection.json` into Postman for example requests.

Notes

- Update `.env` with your MySQL settings before starting.
- Distance calculation uses the Haversine formula inside SQL.
