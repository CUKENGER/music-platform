# Backend for music platform

1 - cd "C:\Program Files\PostgreSQL\16\bin"
2 - .\pg_restore -U postgres -W -d postgres -v "C:\Users\kol\Desktop\music-platform_React-pc\server\database_dump.sql"
3 - yarn
4 - npx prisma migrate dev --name init
5 - yarn start:dev