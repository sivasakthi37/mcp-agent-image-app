# Image Upload & Payment System (AI Agents + MCP Server)

A modern **Next.js PWA** that allows organizations to upload and manage images with quota limits.
Users can purchase additional upload slots via **Razorpay**. Images are stored in **AWS S3**.

The system also includes **AI Agents connected through an MCP Server** to automate workflows such as uploads, quota checks, tagging, and analytics.

The AI layer is designed to run **completely free using Gemini, Groq, or local models (Ollama)**.

---

# Tech Stack

Frontend

* Next.js (PWA)
* TypeScript
* Mantine UI
* NextAuth

Backend

* Node.js
* Express / Fastify
* Prisma ORM
* PostgreSQL

Storage

* AWS S3

Payments

* Razorpay

AI Layer (Free Models)

* MCP Server
* AI Agents
* Google Gemini API (free tier)
* Groq API (free tier)
* Ollama (local models)

---

# System Architecture

Main Application Flow

User → Next.js Frontend → Backend API → Database / AWS S3

AI Automation Flow

User → AI Agent → MCP Server → Backend API → Database / S3

AI agents call MCP tools to perform tasks automatically.

---

# Roles

## Product Owner

* Create organizations
* Edit organizations
* Delete organizations
* Each organization automatically receives a default Admin

## Admin

* Manage users inside the organization
* View all uploaded images
* Manage organization users

## User

* Upload images
* View organization images
* Tag users in images
* Purchase additional upload slots

---

# Core Features

Authentication

* Login
* Optional registration
* Role based access control

Organization Management

* Create organization
* Manage organization details

User Management

* Add users
* Edit users
* Delete users

Image Upload

* Upload images to AWS S3
* Tag users
* Store metadata in database

Quota System

* Each user receives 5 free uploads
* Additional uploads require payment

Payments

* Razorpay integration
* ₹100 per 5 images

Notifications

* Tagged users receive notifications
* Untagged uploads notify all users in organization

---

# Database Models

User

* id
* name
* email
* role
* organization_id
* image_quota
* created_at

Organization

* id
* name
* logo_url
* address
* phone
* admin_id
* created_at

Image

* id
* url
* uploaded_by
* organization_id
* tags
* created_at

Payment

* id
* user_id
* organization_id
* amount
* slots_purchased
* transaction_id
* status
* created_at

Notification

* id
* organization_id
* sender_id
* receiver_ids
* image_id
* message
* created_at

---

# MCP Server

The MCP server exposes backend capabilities as **tools that AI agents can use**.

Example MCP Tools

get_user_quota
upload_image
purchase_slots
get_organization_images
send_notification
create_user
create_organization

These tools allow AI agents to control the system safely.

Example Flow

User request

"Upload this image and tag Raj"

AI Agent → MCP Tool `upload_image` → Backend API → AWS S3

---

# AI Agents

AI agents automate workflows using MCP tools.

Example AI Agents

Upload Assistant

* Upload images
* Suggest user tags
* Send notifications

Quota Assistant

* Check upload limits
* Suggest purchasing slots

Payment Assistant

* Generate Razorpay payment link
* Confirm slot purchases

Admin Analytics Agent

* Identify top contributors
* Show upload statistics
* Detect inactive users

---

# Free AI Providers

The AI system uses **free APIs instead of OpenAI**.

Primary AI Model

Google Gemini

Backup Model

Groq (Llama / Mixtral)

Local Model Option

Ollama running models like:

* llama3
* mistral
* deepseek-coder

---

# AI Agent Flow

User asks AI:

"How many images can I upload?"

AI Agent

↓

calls MCP tool

↓

get_user_quota

↓

returns result

"You have 2 uploads remaining."

---

# Project Structure

/apps

frontend
Next.js application

backend
Node.js API server

mcp-server
MCP tool provider

ai-agent
AI orchestration logic

---

# Development Setup

Clone repository

git clone project-repo

Install dependencies

npm install

Run frontend

cd apps/frontend
npm run dev

Run backend

cd apps/backend
npm run dev

Run MCP server

cd apps/mcp-server
npm run dev

Run AI agent

cd apps/ai-agent
npm run dev

---

# Environment Variables

DATABASE_URL

NEXTAUTH_SECRET

AWS_ACCESS_KEY

AWS_SECRET_KEY

AWS_S3_BUCKET

RAZORPAY_KEY_ID

RAZORPAY_SECRET

GEMINI_API_KEY

GROQ_API_KEY

---

# Optional Local AI Setup

Install Ollama

Run a local model

ollama run llama3

This allows running AI agents **without any API cost**.

---

# Future Improvements

AI image tagging
AI duplicate image detection
AI semantic image search
Face recognition for tagging
Admin AI insights dashboard

---

# Goal

Build a scalable **AI-ready SaaS platform** that allows organizations to manage images, users, payments, and collaboration with AI automation while keeping operational costs minimal using free AI models.
