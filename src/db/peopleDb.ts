// // Postgres connection using deno-postgres
// import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// const POOL_CONNECTIONS = 3;
// const DATABASE_URL = Deno.env.get("DATABASE_URL");

// // Create a shared pool for the app
// export const pool = new Pool(DATABASE_URL, POOL_CONNECTIONS, true);

// /**
//  * Look up a row in the `apiKey` table by id and return all columns for that row.
//  * Returns null if no row is found.
//  *
//  * Usage: const row = await getApiKeyById(123);
//  */
// export async function getApiKeyById(
//   id: string | number
// ): Promise<Record<string, unknown> | null> {
//   const client = await pool.connect();
//   try {
//     // Parameterized query to avoid SQL injection. Use queryObject to get a JS object.
//     const result = await client.queryObject({
//       text: 'SELECT * FROM "apiKey" WHERE id = $1 LIMIT 1',
//       args: [id],
//     });
//     if (!result.rows || result.rows.length === 0) return null;
//     // rows[0] is a plain object with columns as keys
//     return result.rows[0] as Record<string, unknown>;
//   } finally {
//     client.release();
//   }
// }

// // For compatibility with code that may have imported default, export pool as default too
// export default pool;
