const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'project',
    password: 'project123',
    database: 'expense_manager'
  });

  const sqlStatements = [];

  const tables = [
    'roles',
    'users',
    'peoples',
    'categories',
    'sub_categories',
    'projects',
    'expenses',
    'incomes',
    'budgets'
  ];

  for (const tableName of tables) {
    // Wrap tables in double quotes for PostgreSQL
    sqlStatements.push(`-- Data for ${tableName}`);
    
    try {
      const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
      if (rows.length === 0) continue;

      const keys = Object.keys(rows[0]);
      for (const row of rows) {
        const values = keys.map(key => {
          const val = row[key];
          if (val === null || val === undefined) return 'NULL';
          if (val instanceof Date) return `'${val.toISOString()}'`;
          if (typeof val === 'number') return val;
          if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
          if (Buffer.isBuffer(val)) {
              if (val.length === 1) return val[0] === 1 ? 'TRUE' : 'FALSE';
              return `'${val.toString()}'`;
          }
          return `'${String(val).replace(/'/g, "''")}'`;
        });
        
        const columns = keys.map(k => `"${k}"`).join(', ');
        const valuesStr = values.join(', ');

        sqlStatements.push(`INSERT INTO "public"."${tableName}" (${columns}) VALUES (${valuesStr});`);
      }
      sqlStatements.push("");
    } catch (e) {
      console.warn(`Could not export table ${tableName}: ${e.message}`);
    }
  }

  await connection.end();
  fs.writeFileSync('supabase_data.sql', sqlStatements.join('\n'));
  console.log('Successfully exported data to supabase_data.sql');
}

main().catch(console.error);
