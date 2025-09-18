# Family Task Manager

A complete family task management system composed of:

- **Backend API** – ASP.NET Core Web API (C#)  
- **Frontend** – React + CSS  
- **KeepAlive Function** – Azure Function App that periodically pings the API  

---

## 📂 Project Structure

FamilyTaskManager/

├── FamilyTaskManagerAPI/    **Backend API (ASP.NET Core 8, EF Core, PostgreSQL)**

├── frontend/                **Frontend (React + CSS)**

└── KeepAliveFunctionApp/    **Azure Function App (TimerTrigger keep-alive pings)**

---

## ⚙️ Backend API (FamilyTaskManagerAPI)

### Technologies
- .NET 8 Web API
- Entity Framework Core (PostgreSQL)
- JWT Authentication & Authorization
- Custom validators (TaskItemValidator, UserValidator)
- Centralized error handling middleware with unified JSON responses
- Swagger with JWT Bearer support
- Application Insights (Azure telemetry)

### Features
- **User Management** (register, login, JWT tokens, role-based access)
- **Task Management** (CRUD operations with validation rules)
- **Health Check Endpoint** (`/api/health`)

### Configuration
Required environment variables:
```env
# Database
ConnectionStrings:PostgreSQL_Connection="Host=...;Port=5432;Database=...;Username=...;Password=..."

# JWT
JwtSettings:Issuer="your-issuer"
JwtSettings:Audience="your-audience"
JwtSettings:Key="super-secret-key"

# Mail
MailSettings:SmtpServer="smtp.server.com"
MailSettings:Port=587
MailSettings:SenderName="Family Task Manager"
MailSettings:SenderEmail="noreply@example.com"
MailSettings:Password="..."

# CORS
CORS_ALLOWED_ORIGINS="http://localhost:5173,https://yourfrontend.azurewebsites.net"
```
### Run locally

```
cd FamilyTaskManagerAPI
dotnet restore
dotnet ef database update
dotnet run
 ```
Backend runs by default at https://localhost:7003/.


## 🖥️ Frontend (React)
React application with CSS, providing a user-friendly interface for managing family tasks. It connects to the backend API for authentication, task management, and real-time updates.
## Technologies
- React 18
- CSS (for a time I also used TailwindCSS)
- Axios (API calls)
- React Router

### Configuration
Required environment variables (frontend/.env):

```env
REACT_APP_API_URL=your backend location/api (usually https://localhost:7003/api)
```
### Run locally

```
cd frontend
npm install
npm run dev
```
Frontend runs by default at http://localhost:3000

## ⏱️ KeepAlive Function (KeepAliveFunctionApp)
An Azure Function running every 5 minutes that pings the backend health endpoint to check status and push logs into Application Insights.

### Technologies
- Azure Functions (Isolated Worker)
- TimerTrigger (0 */5 * * * *)
- Application Insights integration

### Configuration
Required environment variable in Function App:

```env
PING_URL=https://yourbackend.azurewebsites.net/api/health
```

### Run locally

```
cd KeepAliveFunctionApp
func start
```
### 🚀 Azure Deployment
- Backend API – deploy to App Service (with PostgreSQL Database)
- Frontend – deploy to Azure Static Web Apps or App Service
- KeepAlive Function – deploy to Azure Function App (Consumption Plan)

Recommended: set up GitHub Actions CI/CD for each component.

✅ Current Status
- Backend API running with authentication and task management
- Frontend integrated with backend (login, task management)
- Azure Function for health check / keep-alive
