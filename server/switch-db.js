const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const target = process.argv[2]; // 'sqlite' or 'postgresql'

if (target === 'sqlite') {
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('🔄 Switched Prisma schema to SQLite (Local Mode)');
} else if (target === 'postgresql') {
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('☁️ Switched Prisma schema to PostgreSQL (Cloud Mode)');
}

fs.writeFileSync(schemaPath, schema);
