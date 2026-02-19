# Skill Exchange API

This repository contains the backend scaffold for our Software Engineering group project: a Skill Exchange platform.

The goal of the system is to allow users to offer their skills and connect with others who need specific services.  
This version represents the initial Node.js + Express scaffold created for Sprint 1.

---

## Project Purpose

The Skill Exchange platform is designed as a lightweight system where users can discover and communicate with people who provide useful skills (for example tutoring, technical help, design, etc.).

At this stage, the repository only includes the minimal backend structure required to support the development workflow.

---

## Tech Stack

- Node.js (18 LTS)
- Express.js
- Docker

---

## Local Development

Requires Node.js 18 LTS.

npm install  
npm run dev  

The server will start on port 3000 (or process.env.PORT if provided).

---

## Running with Docker

Make sure Docker Desktop is installed and running.

From the project root directory:

docker compose up --build

Then open:

http://localhost:3000
