# Realtime Chat Application with AI Sentiment Analysis
## Live Demo
<p align="center">
  <img width="500" height="390" alt="image" src="https://github.com/user-attachments/assets/17dc607c-539e-426a-96dc-b1917389a793" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img width="200" height="400" alt="image" src="https://github.com/user-attachments/assets/46b7d571-a7a4-4ea5-92ad-88667d9e8194" />
</p>


## Live Demo
* **Frontend:** https://realtime-chat-ui-azc5ced4b4cca9bb.westeurope-01.azurewebsites.net
* **Backend API (Swagger):** https://realtime-chat-api-debcf5fcbyc0h4fy.westeurope-01.azurewebsites.net/swagger

## Overview
A full-stack, event-driven web application designed to provide real-time messaging capabilities integrated with artificial intelligence. The application leverages Azure SignalR for seamless bi-directional communication and Azure AI Cognitive Services to perform real-time sentiment analysis on user messages.

## Features
* **Real-time Messaging:** Instant message delivery and broadcasting using Azure SignalR Service.
* **Sentiment Analysis:** Synchronous evaluation of every message using Azure AI Language.
* **Visual Sentiment Indicators:** Color-coded messages and precise sentiment scores displayed under each message.
* **Active User Tracking:** Online users sidebar with avatars and live status updates.
* **Rich Interactions:** Integrated emoji picker powered by `emoji-picker-react`.
* **Persistent Storage:** Transactional storage of chat history in Azure SQL Database.
* **Responsive Design:** Optimized UI for both desktop and mobile environments.
* **Automated CI/CD:** Continuous Integration and Deployment via GitHub Actions.

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | ASP.NET Core 10, SignalR |
| **Frontend** | React 18, TypeScript, Vite |
| **Real-time** | Azure SignalR Service |
| **AI** | Azure AI Language (Text Analytics) |
| **Database** | Azure SQL Database + Entity Framework Core |
| **Hosting** | Azure App Service |
| **CI/CD** | GitHub Actions |

## System Architecture

```text
Browser (Client)
└── React SPA (Azure Web App)
    └── Azure SignalR Service
        └── ASP.NET Core API (Azure App Service)
            ├── Azure SQL Database
            └── Azure AI Language Service
````

## Project Structure

```text
RealtimeChatApp/
├── Backend/
│   ├── RealtimeChat.Api/          # ASP.NET Core Web API
│   │   ├── Hubs/
│   │   │   └── ChatHub.cs         # SignalR Hub implementation
│   │   ├── Services/
│   │   │   └── SentimentService.cs# Azure AI integration service
│   │   └── Program.cs
│   └── RealtimeChatApp.Data/      # Entity Framework Data Access Layer
│       ├── Models/
│       │   └── ChatMessage.cs
│       └── AppDbContext.cs
├── Frontend/
│   └── src/
│       ├── components/
│       │   ├── Chat.tsx           # Main chat container
│       │   ├── Sidebar.tsx        # Online users panel
│       │   ├── MessageList.tsx    # Messages display logic
│       │   └── InputArea.tsx      # Message input and emoji picker
│       └── types/
│           └── index.ts
├── .github/
│   └── workflows/
│       ├── backend.yml            # Backend CI/CD pipeline
│       └── frontend.yml           # Frontend CI/CD pipeline
└── README.md
```

## Sentiment Analysis Details

Each message is processed by Azure AI Language and classified based on confidence scores:

| Sentiment | Color Coding | Description |
| :--- | :--- | :--- |
| **Positive** | Green | Confidence score \> 50% positive |
| **Negative** | Red | Confidence score \> 50% negative |
| **Mixed** | Yellow | Mixed signals detected in the text |
| **Neutral** | White/Default | No strong emotional sentiment detected |

## Local Development Setup

### Prerequisites

  * .NET 10 SDK
  * Node.js 24 LTS
  * Active Azure Account (SignalR Service, SQL Database, AI Language Service)

### 1\. Backend Setup

Navigate to the API directory:

```bash
cd Backend/RealtimeChat.Api/RealtimeChat.Api
```

Configure environment variables in `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "SqlDbConnection": "YOUR_SQL_CONNECTION_STRING"
  },
  "AzureSignalR": {
    "ConnectionString": "YOUR_SIGNALR_CONNECTION_STRING"
  },
  "AzureAI": {
    "Endpoint": "YOUR_AI_ENDPOINT",
    "ApiKey": "YOUR_AI_KEY"
  }
}
```

Restore dependencies and run:

```bash
dotnet restore
dotnet ef database update
dotnet run
```

### 2\. Frontend Setup

Navigate to the frontend directory:

```bash
cd Frontend
```

Create a `.env.local` file for local development:

```env
VITE_BACKEND_URL=https://localhost:7000
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Git Workflow

  * `main` — Production branch, deployed automatically via CI/CD.
  * `develop` — Integration branch for testing.
  * `feature/*` — Branches for individual features and bug fixes.

## Deployment Configuration

Deployment is fully automated using GitHub Actions. Every push to the `main` branch triggers:

1.  Restoration, building, and publishing of the ASP.NET Core API to Azure Web App.
2.  Building of the React SPA and deployment of static assets to Azure Web App.

Required GitHub Secrets:

  * `AZURE_API_PUBLISH_PROFILE`
  * `AZURE_UI_PUBLISH_PROFILE`

## Future Plans (Roadmap)
* **Message Encryption:** Implementation of end-to-end encryption for enhanced user privacy.
* **File Sharing:** Support for uploading and sharing images and documents within chat rooms.
* **Advanced AI Features:** Integration of automated message translation and AI-generated smart replies.
* **User Profiles:** Customizable user profiles with avatars and personal bios.
* **Push Notifications:** Web push notifications for incoming messages when the application is in the background.

## Contact & Socials

**Alina**
* **GitHub:** [D0naL1ka](https://github.com/D0naL1ka)
* **LinkedIn:** [www.linkedin.com/in/alina-suchok](https://www.linkedin.com/in/alina-suchok/)
* **Email:** alina.suchok00@gmail.com
