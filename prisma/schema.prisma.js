datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(DISCIPLINEE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model InviteCode {
  id        String    @id @default(cuid())
  code      String    @unique
  role      Role
  usedBy    User?     @relation(fields: [usedById], references: [id])
  usedById  String?   @unique
  createdBy String
  createdAt DateTime  @default(now())
  expiresAt DateTime?
}

enum Role {
  ADMIN
  DISCIPLINER
  DISCIPLINEE
}