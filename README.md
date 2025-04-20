# Themepark Management System
COSC 3380 Group 14 Database Project for a Theme park Management System for the course led by Professor Ramamurthy.
This project involves handing aspects of a theme park, including featured rides, shop items, ticket purchasing, maintenance information, weather affecting the park, revenue, and user profiles. 

## Deployment Link:
The application is deployed to be accessed with this link: [https://themepark-ms-git-main-cole-plagens-projects.vercel.app](https://themepark-ms-git-main-cole-plagens-projects.vercel.app)

## Features:
- User Authentication for different user roles of a Visitor, Staff Member, or Admin
- Ticket sales functionality for different types of tickets, quantities, and dates
- Pages to display populated data for the rides and shop items at the theme park
- Profile modification through a profile page, and my tickets page to look at ticket purchase history
- On the interface specifically for employees and admins, they can utilize data entry forms for insertion, modification, and deletion of data to populate the database system including reports of ticket totals, revenue, maintenance cost, total number of breakdowns for rides, most popular rides, most popular ride type, how much a ride is being ridden, all within the specified time span given.
- Semantic constraints enforced through triggers (updating the status of a ride being operational or a ride being one of the hot attractions for the theme park).

## Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/Colep39/themepark-ms.git]
   cd themepark-ms
2. Install dependencies
   ```
   npm install
   ```

## Running the app
- Frontend:
  cd themepark_ms
  npm run dev # Runs locally
- Backend:
     cd BackendGroup
     cd BackendGroup # do it twice since its nested
     dotnet build
     dotnet run

## Database Setup
- You create your database in MySQL
- Download the sql dump file
- Restore the database using that dump file


## Structure
```
├── .github/
│   └── workflows/
│       └── ...             # GitHub Actions workflows
├── BackendGroup/           # C# backend folder (API, models, etc.)
│   └── ...
├── themepark_ms/           # React frontend folder
│   ├── public/
│   │   └── images/         # Publicly accessible images, many no longer used
│   ├── src/                # React component source code
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vercel.json         # Vercel config
│   └── vite.config.js      # Vite configuration
├── README.md               
└── package-lock.json  
```
Optional Dependencies (Frontend):
npm install react-datepicker

Optional Dependencies (Backend):

dotnet add package Microsoft.EntityFrameworkCore --version 8.0.2

dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.2

dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 8.0.2

dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.2

dotnet add package Microsoft.EntityFrameworkCore.Relational --version 8.0.2

dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.2

***Very important to make sure the versions are compatible with each other
