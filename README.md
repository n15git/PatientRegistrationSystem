# Patient Registration System with PGlite

A patient Registration system that runs entirely in your browser using PGlite.

- **In-Browser Database**: Full PostgreSQL database running directly in the browser with PGlite
- **Offline Support**: Works without an internet connection, with data persisted in IndexedDB
- **Multi-Tab Support**: Share database state across multiple browser tabs
- **Patient Registration**: Complete form for adding patients medical information
- **Patient Search**: Search and filter patients by name and other attributes
- **Custom SQL Queries**: Advanced interface for querying the database directly with SQL

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## 🧩 Implementation Details

### PGlite Integration

The project uses PGlite . The database is initialized in a Web Worker to support multi-tab operation and persisted using IndexedDB.

```typescript
// public/pglite-worker.js
import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

worker({
  async init() {
    return new PGlite('idb://my-pgdata');
  },
});
```

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  medical_notes TEXT,
  insurance_provider TEXT,
  insurance_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patient_name ON patients (last_name, first_name);
```



## Running the projet

- `npm run dev` - Starts the development server


## Usage Guide

### Adding a New Patient

1. Navigate to the "Register" page using the dashboard or navigation menu
2. Fill in the required patient information
3. Click "Register Patient" to save the record

### Searching for Patients

1. Go to the "Patients" page
2. Use the search bar to find patients by name
3. Click on a patient to view their details

### Running Custom Queries

1. Navigate to the "Query" page
2. Enter your SQL query in the editor
3. Click "Execute" to run the query and view results

## 🧪 Technologies Used

- **React** - UI library
- **TypeScript** - Type safety and better developer experience
- **PGlite** - In-browser PostgreSQL database
- **React Router** - Application routing
- **Lucide React** - Icon library
- **Vite** - Build tool and development server

