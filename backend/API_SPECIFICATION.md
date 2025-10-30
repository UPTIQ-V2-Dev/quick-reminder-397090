# API Specification

## Database Models

```prisma
model User {
  id              Int        @id @default(autoincrement())
  email           String     @unique
  name            String?
  password        String
  role            String     @default("USER")
  isEmailVerified Boolean    @default(false)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  tokens          Token[]
  reminders       Reminder[]
}

model Token {
  id          Int      @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
}

model Reminder {
  id        String   @id @default(cuid())
  text      String
  dateTime  DateTime
  status    String   @default("upcoming")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
}
```

## Authentication APIs

---

EP: POST /auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid input or email already exists", "422":"Validation failed", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T11:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-29T10:00:00Z"}}}

---

EP: POST /auth/login
DESC: Authenticate user and return tokens.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid input", "401":"Invalid email or password", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T11:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-29T10:00:00Z"}}}

---

EP: POST /auth/logout
DESC: Logout user and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /auth/refresh-tokens
DESC: Refresh access and refresh tokens.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"400":"Invalid input", "401":"Invalid refresh token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T11:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-29T10:00:00Z"}}

---

EP: POST /auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: {}

---

EP: POST /auth/reset-password
DESC: Reset user password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/reset-password?token=resetToken123" -H "Content-Type: application/json" -d '{"password":"newPassword123"}'
EX_RES_204: {}

---

EP: POST /auth/verify-email
DESC: Verify user email address using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/verify-email?token=verifyToken123"
EX_RES_204: {}

---

EP: POST /auth/send-verification-email
DESC: Send email verification to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

## User Management APIs

---

EP: POST /users
DESC: Create a new user (Admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or email already exists", "401":"Unauthorized", "403":"Forbidden", "422":"Validation failed", "500":"Internal server error"}
EX_REQ: curl -X POST /users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:15:00Z","updatedAt":"2025-10-30T10:15:00Z"}

---

EP: GET /users
DESC: Get paginated list of users with optional filtering.
IN: headers:{Authorization:str!}, query:{name:str, role:str, sortBy:str, limit:int, page:int}
OUT: 200:{results:arr[{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Forbidden", "500":"Internal server error"}
EX_REQ: curl -X GET "/users?limit=10&page=1&role=USER" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: GET /users/:userId
DESC: Get user by ID (Own profile or Admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"}

---

EP: PATCH /users/:userId
DESC: Update user information (Own profile or Admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name:str, email:str, password:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or email already exists", "401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Updated"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Updated","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:30:00Z"}

---

EP: DELETE /users/:userId
DESC: Delete user account (Own profile or Admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

## Reminder APIs

---

EP: POST /reminders
DESC: Create a new reminder for authenticated user.
IN: headers:{Authorization:str!}, body:{text:str!, dateTime:str!}
OUT: 201:{id:str, text:str, dateTime:str, status:str, createdAt:str, updatedAt:str, userId:int}
ERR: {"400":"Invalid input", "401":"Unauthorized", "422":"Validation failed", "500":"Internal server error"}
EX_REQ: curl -X POST /reminders -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"text":"Call doctor for appointment","dateTime":"2025-10-30T14:00:00Z"}'
EX_RES_201: {"id":"clm1n2o3p4q5r6s7t8u9v0w1","text":"Call doctor for appointment","dateTime":"2025-10-30T14:00:00Z","status":"upcoming","createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z","userId":1}

---

EP: GET /reminders
DESC: Get all reminders for authenticated user.
IN: headers:{Authorization:str!}, query:{status:str, limit:int, page:int}
OUT: 200:arr[{id:str, text:str, dateTime:str, status:str, createdAt:str, updatedAt:str, userId:int}]
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /reminders -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: [{"id":"clm1n2o3p4q5r6s7t8u9v0w1","text":"Call doctor for appointment","dateTime":"2025-10-30T14:00:00Z","status":"upcoming","createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z","userId":1}]

---

EP: GET /reminders/:reminderId
DESC: Get specific reminder by ID for authenticated user.
IN: headers:{Authorization:str!}, params:{reminderId:str!}
OUT: 200:{id:str, text:str, dateTime:str, status:str, createdAt:str, updatedAt:str, userId:int}
ERR: {"401":"Unauthorized", "404":"Reminder not found", "500":"Internal server error"}
EX_REQ: curl -X GET /reminders/clm1n2o3p4q5r6s7t8u9v0w1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":"clm1n2o3p4q5r6s7t8u9v0w1","text":"Call doctor for appointment","dateTime":"2025-10-30T14:00:00Z","status":"upcoming","createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z","userId":1}

---

EP: PATCH /reminders/:reminderId
DESC: Update specific reminder for authenticated user.
IN: headers:{Authorization:str!}, params:{reminderId:str!}, body:{text:str, dateTime:str, status:str}
OUT: 200:{id:str, text:str, dateTime:str, status:str, createdAt:str, updatedAt:str, userId:int}
ERR: {"400":"Invalid input", "401":"Unauthorized", "404":"Reminder not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /reminders/clm1n2o3p4q5r6s7t8u9v0w1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"status":"completed"}'
EX_RES_200: {"id":"clm1n2o3p4q5r6s7t8u9v0w1","text":"Call doctor for appointment","dateTime":"2025-10-30T14:00:00Z","status":"completed","createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:30:00Z","userId":1}

---

EP: DELETE /reminders/:reminderId
DESC: Delete specific reminder for authenticated user.
IN: headers:{Authorization:str!}, params:{reminderId:str!}
OUT: 200:{}
ERR: {"401":"Unauthorized", "404":"Reminder not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /reminders/clm1n2o3p4q5r6s7t8u9v0w1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

## MCP APIs

---

EP: POST /mcp
DESC: Handle MCP POST requests with authentication.
IN: headers:{Authorization:str!}, body:obj
OUT: 200:obj
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{}'
EX_RES_200: {}

---

EP: GET /mcp
DESC: Handle MCP GET requests with authentication.
IN: headers:{Authorization:str!}, query:obj
OUT: 200:obj
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

---

EP: DELETE /mcp
DESC: Handle MCP DELETE requests with authentication.
IN: headers:{Authorization:str!}, body:obj
OUT: 200:obj
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X DELETE /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}