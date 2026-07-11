# AGENT.md

# CampusOS Development Agent Guide

Version: 1.0

---

# Purpose

This document defines the engineering standards, architecture, development principles, coding conventions, and implementation rules for AI coding agents contributing to the CampusOS project.

Every generated code change should follow this document.

This file acts as the single source of truth for software architecture and coding practices.

---

# Project Overview

Project Name

CampusOS

Product

Autonomous University Operating System

Architecture

Headless Modular Monolith

Frontend

React.js

Backend

Node.js + Express.js

Database

MongoDB

AI

Google Gemini API

Communication

REST APIs

Real-time

Socket.io

Authentication

JWT

Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

---

# Product Vision

CampusOS is not another University Management System.

CampusOS is an intelligent operational platform responsible for managing university resources through centralized workflows and AI-assisted decision support.

The primary objective is to simplify event management and campus resource allocation while preventing booking conflicts.

AI should only assist users.

AI must never make autonomous booking decisions.

---

# Core Principles

Every feature developed for CampusOS must follow these principles.

## 1. Single Responsibility

Every module should have exactly one responsibility.

Example

Authentication Service

Responsible only for authentication.

Never perform booking logic.

---

Booking Service

Responsible only for booking operations.

Never perform authentication.

---

AI Service

Responsible only for venue recommendations.

Never save bookings.

---

## 2. Business Logic Lives Inside Services

Controllers should never contain business logic.

Wrong

Controller

↓

Validation

↓

Database

↓

Conflict Detection

↓

Gemini

↓

Response

Correct

Controller

↓

Service

↓

Model

↓

Controller

↓

Response

---

## 3. Thin Controllers

Controllers should only

- Receive Request

- Validate Input

- Call Service

- Return Response

Nothing else.

---

## 4. Modular Design

Every feature should exist independently.

Authentication

↓

Booking

↓

Resource

↓

Events

↓

Notifications

Each feature should be replaceable without affecting other modules.

---

## 5. API First

Frontend must never access MongoDB directly.

Every operation should happen through REST APIs.

React

↓

REST API

↓

Express

↓

MongoDB

---

## 6. AI is Advisory

Gemini only provides recommendations.

Gemini never

- creates bookings

- modifies resources

- updates database

Final decisions always belong to users.

---

# Development Philosophy

Whenever possible

Automate repetitive work.

Never automate user decisions.

Examples

Good

Conflict Detection

Good

Venue Recommendation

Good

Notification Generation

Bad

Automatically booking a different venue.

Bad

Automatically rejecting requests.

Bad

Automatically changing event timings.

---

# Architecture

CampusOS follows a Headless Modular Monolith.

```

                React Frontend

                       │

               REST API + JWT

                       │

               Express Backend

                       │

 ┌──────────────┬──────────────┬──────────────┐

 │              │              │              │

Auth        Resource      Booking       Event

Service     Service       Service       Service

 │              │              │              │

 └──────────────┼──────────────┼──────────────┘

                │

      Conflict Detection Engine

                │

      AI Recommendation Service

                │

      Notification Service

                │

      Dashboard Service

                │

             MongoDB

```

---

# Feature Modules

CampusOS consists of the following modules.

Authentication

Resource Management

Event Management

Booking

Conflict Detection

AI Recommendation

Notifications

Dashboard

Each module should remain independent.

---

# Responsibilities

Authentication Service

- Login
- JWT
- Authorization

Resource Service

- Departments
- Rooms
- Labs
- Auditorium
- Availability

Event Service

- Event CRUD

Booking Service

- Booking CRUD
- Booking Validation

Conflict Detection

- Date overlap
- Time overlap
- Capacity validation
- Venue availability

AI Recommendation

- Gemini Integration
- Venue Ranking

Notification Service

- Socket.io
- In-app Notifications

Dashboard Service

- Analytics
- Counts
- KPIs

---

# Current MVP Scope

Included

Authentication

Departments

Resources

Events

Bookings

Conflict Detection

AI Recommendation

Notifications

Dashboard

Excluded

Library

Hostel

Transport

Attendance

IoT

Finance

Examination

Do not implement excluded modules unless explicitly requested.

---

# Project Goals

The codebase should prioritize

Readability

Maintainability

Modularity

Scalability

Developer Experience

Avoid premature optimization.

Simple code is preferred over clever code.

---

# Engineering Standards

Every function should

- Have one responsibility.

- Be reusable.

- Return predictable results.

Avoid

Deep nesting

Large functions

Duplicate logic

Magic strings

Magic numbers

---

# Naming Convention

Files

booking.service.js

event.controller.js

resource.routes.js

notification.socket.js

Variables

camelCase

Functions

camelCase

React Components

PascalCase

Folders

lowercase

Models

PascalCase

---

# Code Quality Rules

Never duplicate business logic.

Never duplicate validation.

Always reuse services.

Always separate concerns.

Every API should have

Controller

↓

Service

↓

Model

Never skip the service layer.

---

# AI Coding Rules

Whenever generating code

Prefer readability over optimization.

Prefer composition over inheritance.

Prefer reusable components.

Never introduce unnecessary dependencies.

Never install libraries unless they solve a real problem.

Avoid over-engineering.

Generate production-ready code.

---

# Folder Structure Standards

CampusOS follows a **feature-based modular architecture**.

Every feature owns its own business logic while sharing common infrastructure.

The project is divided into two independent applications.

```

CampusOS/

├── client/

└── server/

```

The frontend and backend communicate only through REST APIs.

Direct database access from the frontend is prohibited.

---

# Client Architecture

```

client/

│

├── src/

│

├── assets/

├── components/

├── pages/

├── services/

├── hooks/

├── context/

├── routes/

├── utils/

├── constants/

├── App.jsx

└── main.jsx

```

---

## assets/

Contains static assets.

Allowed

- Images
- Icons
- Logos

Do not place business logic here.

---

## components/

Reusable UI components.

Structure

```

components/

common/

layout/

dashboard/

event/

booking/

notification/

ui/

```

Rules

Components must be reusable.

Never call APIs inside reusable UI components.

Components should receive data through props.

---

## pages/

Every route corresponds to one page.

Example

```

pages/

dashboard/

events/

resources/

notifications/

profile/

auth/

```

Pages may

- fetch data

- call services

- manage page state

Pages should never contain reusable UI.

---

## services/

Responsible for API communication.

Example

```

event.service.js

booking.service.js

resource.service.js

auth.service.js

notification.service.js

```

Rules

Services

- perform HTTP requests

- transform responses

- never contain UI

---

## hooks/

Reusable custom hooks.

Example

```

useAuth()

useSocket()

useFetch()

```

Never place business logic inside hooks.

---

## context/

Global state only.

Allowed

Authentication

Socket

Theme

User

Avoid storing server data globally.

Use API requests instead.

---

## routes/

Contains routing logic.

Only

- route definitions

- protected routes

No business logic.

---

## utils/

Contains

- helper functions

- date formatting

- validators

- constants

Must remain framework independent.

---

# React Development Rules

React components should remain presentational whenever possible.

Example

Good

```

Dashboard.jsx

↓

DashboardCard.jsx

↓

StatsCard.jsx

```

Bad

```

Dashboard.jsx

↓

500 lines

↓

everything

```

---

Keep components small.

Recommended

100–200 lines maximum.

---

Never perform API requests inside deeply nested components.

Instead

Page

↓

Service

↓

Component

---

Use controlled forms.

Never manipulate DOM manually.

Never use document.querySelector().

---

# Server Architecture

```

server/

│

├── config/

├── controllers/

├── services/

├── routes/

├── models/

├── middleware/

├── sockets/

├── utils/

├── app.js

└── server.js

```

---

# Controllers

Controllers only coordinate requests.

Allowed

Read Request

↓

Call Service

↓

Return Response

Not Allowed

Database Queries

Gemini Calls

Booking Logic

Conflict Detection

Notification Logic

---

Example

Good

```

Controller

↓

bookingService.create()

↓

return response

```

Bad

```

Controller

↓

find()

↓

update()

↓

Gemini

↓

Socket

↓

response

```

---

# Services

Services contain ALL business logic.

Every feature should have its own service.

Example

```

booking.service.js

event.service.js

resource.service.js

```

Services may call other services.

Example

```

bookingService

↓

resourceService

↓

aiService

↓

notificationService

```

Services may never call controllers.

---

# Models

Models should contain

- schema

- indexes

- static methods (if required)

Models should never contain business logic.

---

# Routes

Routes should only map

```

POST /events

↓

eventController.create()

```

No logic.

---

# Middleware

Responsible for

Authentication

Authorization

Validation

Error Handling

Logging

Middleware should never access business services.

---

# Socket Layer

Socket.io is used only for

Real-time notifications.

Never perform booking operations through sockets.

Sockets should remain event-driven.

---

# Config

Contains

Database

Environment

Gemini

Socket

Configuration only.

---

# Request Lifecycle

Every request must follow this path.

```

HTTP Request

↓

Route

↓

Controller

↓

Service

↓

Model

↓

MongoDB

↓

Service

↓

Controller

↓

Response

```

Never bypass any layer.

---

# Service Communication

Allowed

```

Booking Service

↓

Resource Service

↓

AI Service

↓

Notification Service

```

Not Allowed

```

Controller

↓

Controller

```

Never call controllers from other controllers.

---

# Feature Development Standard

Whenever creating a new feature

Always create

```

feature.routes.js

feature.controller.js

feature.service.js

Feature.js

```

Example

```

booking.routes.js

booking.controller.js

booking.service.js

Booking.js

```

Every feature must follow this structure.

---

# API Response Standard

Success

```json
{
  "success": true,
  "message": "Booking created successfully.",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Preferred venue is already booked.",
  "errors": []
}
```

Maintain this response format consistently across all APIs.

---

# Error Handling Rules

Never expose stack traces.

Never expose database errors.

Always return meaningful messages.

Use centralized error middleware.

---

# Logging

Development

Console logging is acceptable.

Production

Use structured logging.

Never log

Passwords

JWT

Secrets

Environment Variables

---

# Dependency Rules

Before adding a new package

Ask

Can this be implemented using existing code?

Avoid unnecessary dependencies.

Keep the project lightweight.

---

# Performance Guidelines

Use pagination where appropriate.

Use indexes on frequently queried fields.

Avoid unnecessary database queries.

Avoid nested loops over large datasets.

Use async/await consistently.

---

# General Development Principles

Prefer readability over cleverness.

Prefer explicit code over implicit behavior.

Every function should be easy to understand.

Future developers should understand the code without reading documentation.

Write code for humans first, computers second.

# AI Development Guidelines

CampusOS uses AI only as a **Decision Support System**.

The AI must never become the primary source of truth.

MongoDB is always the source of truth.

Gemini only provides intelligent recommendations.

---

# AI Philosophy

The AI exists to assist users.

It never makes decisions on behalf of users.

Examples

✅ Good

Suggest a better venue.

Suggest another time slot.

Rank available resources.

Explain recommendation.

❌ Bad

Automatically book another room.

Automatically reject requests.

Automatically modify events.

Automatically update database.

---

# AI Service

File

services/ai.service.js

Responsibilities

- Build Gemini Prompt
- Send Request
- Parse Response
- Validate Response
- Return Recommendations

The AI Service should never

- access MongoDB directly
- create bookings
- update bookings
- modify resources
- send notifications

---

# AI Trigger Rules

Gemini should only execute when

Booking Conflict == TRUE

Example

Preferred Venue Available

↓

Booking Created

↓

Gemini NOT called

--------------------------------

Preferred Venue Occupied

↓

Conflict Detection

↓

Gemini Called

↓

Recommendations Returned

---

# Conflict Detection

Conflict Detection always happens BEFORE Gemini.

Flow

Booking Request

↓

Conflict Detection

↓

Available?

↓

No

↓

Gemini

Never ask Gemini whether a room is available.

Availability comes from MongoDB.

---

# AI Input Rules

Backend prepares all context.

Gemini should receive only filtered data.

Never send the entire database.

Good

Requested Event

Preferred Venue

Available Resources

Requirements

Capacity

Bad

Entire Resources Collection

Entire Bookings Collection

Entire Database

---

# Prompt Building

Prompt generation belongs inside

utils/geminiPrompt.js

Never hardcode prompts inside controllers.

Never hardcode prompts inside routes.

Only ai.service.js should use the prompt builder.

---

# Prompt Structure

System Prompt

↓

Booking Context

↓

Available Resources

↓

Expected JSON Output

Always request JSON.

Never request natural language.

---

# Response Validation

Every Gemini response must be validated.

Required fields

recommendations

priority

venue

reason

If validation fails

↓

Fallback

↓

Manual Venue Selection

Never trust AI blindly.

---

# AI Response Rules

Maximum recommendations

3

Ranking

1

Best Match

2

Alternative Time

3

Alternative Date

Reasons should remain under

30 words.

---

# AI Failure Handling

If Gemini API fails

Booking should continue.

The system must display

"AI recommendations are currently unavailable."

Allow users to manually select another venue.

AI failure must never crash booking.

---

# Business Logic Ownership

MongoDB

↓

Source of Truth

Booking Service

↓

Business Logic

Gemini

↓

Recommendation Only

Never reverse these responsibilities.

---

# Notification Rules

Notifications are created only after

Booking Confirmation.

Never notify users before confirmation.

Notification Types

Booking Approved

Booking Rejected

Booking Updated

Venue Changed

Event Cancelled

System Notification

---

# Dashboard Rules

Dashboard never stores data.

Dashboard always calculates statistics from MongoDB.

Examples

Count Events

Count Bookings

Count Resources

Count Pending Requests

Never duplicate dashboard data.

---

# Database Rules

Every database operation should happen through Mongoose Models.

Never write raw MongoDB queries throughout the project.

Always use Models.

---

# Schema Rules

Every schema must include

createdAt

updatedAt

Every schema should enable timestamps.

Example

timestamps: true

---

# Soft Delete

Do not permanently delete important business data.

Preferred

status = Cancelled

Avoid

deleteOne()

unless explicitly requested.

---

# Validation Rules

Validate input

before

calling services.

Services should assume validated input.

---

# Authorization Rules

Admin

Full Access

Faculty

Department Operations

Club

Own Events Only

Never trust role values coming from frontend.

Always validate JWT.

---

# API Rules

Every endpoint

must return

consistent response structure.

Never return raw MongoDB documents.

Transform responses if necessary.

---

# Security Rules

Never expose

Passwords

JWT Secrets

Gemini API Keys

MongoDB URI

Stack Traces

Environment Variables

Never commit

.env

node_modules

logs

uploads

---

# Environment Variables

Required

PORT

MONGODB_URI

JWT_SECRET

GEMINI_API_KEY

CLIENT_URL

Never hardcode secrets.

---

# Socket.io Rules

Sockets are used only for

Real-Time Notifications.

Never perform

Authentication

Booking

Database Updates

through sockets.

---

# Code Review Checklist

Before every commit verify

✔ No duplicated logic

✔ No business logic inside controllers

✔ No database access from frontend

✔ No direct Gemini calls outside AI Service

✔ Consistent API responses

✔ Validation exists

✔ JWT protection exists

✔ Errors handled

✔ Async/Await used

✔ No console.logs in production

---

# What AI Agent MUST NEVER Do

Never create business logic inside controllers.

Never access MongoDB from React.

Never call Gemini from React.

Never mix booking logic with event logic.

Never duplicate validation.

Never introduce unnecessary packages.

Never create circular dependencies.

Never bypass service layer.

Never modify database based solely on AI output.

Never automatically create bookings after AI recommendation.

Never expose secrets.

Never generate code without following folder conventions.

---

# Engineering Philosophy

CampusOS follows a simple principle.

Business logic belongs to the backend.

The frontend displays data.

MongoDB stores data.

Gemini assists decisions.

Users make final decisions.

This separation must never be broken.

---

# Feature Development Workflow

Every new feature must follow the same implementation lifecycle.

Never skip any step.

```
Understand Requirement
        │
        ▼
Design API
        │
        ▼
Design Database Changes
        │
        ▼
Create Model
        │
        ▼
Create Service
        │
        ▼
Create Controller
        │
        ▼
Create Routes
        │
        ▼
Test Business Logic
        │
        ▼
Connect Frontend
        │
        ▼
Socket Events (if required)
        │
        ▼
Final Testing
```

---

# Feature Checklist

Before considering any feature complete, verify the following.

## Backend

- Model Created
- Service Created
- Controller Created
- Route Added
- Validation Added
- Authentication Added
- Authorization Added
- Error Handling Added

---

## Frontend

- Page Created
- Components Reusable
- API Connected
- Loading State
- Error State
- Empty State
- Success State

---

## Integration

- API Tested
- Database Updated
- Notifications Sent
- Dashboard Updated

---

# Feature Folder Pattern

Every backend feature should follow the same pattern.

```
feature/

feature.routes.js

feature.controller.js

feature.service.js

Feature.js
```

Example

```
booking/

booking.routes.js

booking.controller.js

booking.service.js

Booking.js
```

---

# React Component Rules

Always split components.

Bad

```
Dashboard.jsx

1200 lines
```

Good

```
Dashboard/

Dashboard.jsx

StatsCard.jsx

ResourceCard.jsx

NotificationList.jsx

ChartCard.jsx
```

Every component should have one responsibility.

---

# UI Standards

CampusOS follows a premium SaaS interface.

Reference Inspiration

- Linear
- Stripe
- Vercel
- Notion
- Framer

---

## Colors

Background

White

Primary

Blue

Secondary

Purple

Success

Green

Danger

Red

Warning

Orange

---

## Border Radius

12px

---

## Cards

Rounded

Shadow

Minimal

Padding

24px

---

## Typography

Heading

Bold

Body

Medium

Labels

Regular

---

## Spacing

Follow 8-point spacing system.

8

16

24

32

48

Never use random spacing.

---

## Buttons

Primary

Filled

Secondary

Outlined

Danger

Red

Disabled

Gray

Loading

Spinner

---

## Forms

Every form must include

Validation

Error Messages

Loading State

Success Feedback

Required Field Indicators

---

# API Naming Standards

Good

```
POST /api/events

GET /api/resources

POST /api/bookings
```

Bad

```
POST /createEvent

GET /allRooms

POST /bookRoomNow
```

Use REST conventions.

---

# Service Naming

Good

```
booking.service.js

resource.service.js

event.service.js
```

Bad

```
bookingLogic.js

bookingFunctions.js
```

---

# Component Naming

Use PascalCase

Good

```
DashboardCard

ResourceCard

BookingForm

NotificationPanel
```

Bad

```
dashboardcard

resource_component

booking
```

---

# Variable Naming

Use descriptive names.

Good

```
availableResources

bookingRequest

preferredVenue
```

Bad

```
arr

x

temp

abc
```

---

# Git Commit Convention

Use Conventional Commits.

Examples

```
feat: add booking conflict detection

feat: implement AI recommendation service

fix: resolve overlapping booking validation

refactor: move business logic into booking service

docs: update PRD

style: improve dashboard layout

test: add booking service tests
```

---

# Branch Naming

Good

```
feature/event-booking

feature/notifications

feature/dashboard

bugfix/booking-conflict

refactor/resource-service
```

---

# Pull Request Checklist

Before merging

- Code compiles
- APIs tested
- Validation works
- No duplicated logic
- No console logs
- No unused imports
- Documentation updated

---

# Performance Guidelines

Prefer

Pagination

Database Indexes

Lean Queries

Projection

Async/Await

Avoid

Nested loops

Repeated database calls

Blocking operations

Large payloads

---

# Documentation Rules

Every service should contain a short description.

Example

```js
/**
 * Booking Service
 *
 * Handles event booking,
 * booking validation,
 * conflict detection,
 * and booking confirmation.
 */
```

Complex functions should include comments explaining **why**, not **what**.

---

# Error Message Standards

Good

```
Preferred venue is already booked.

Selected room capacity is insufficient.

Booking not found.
```

Bad

```
Error

Something went wrong.

Invalid request.
```

---

# Logging Standards

Development

Console logging allowed.

Production

Use structured logging.

Never log

Passwords

JWT

API Keys

MongoDB URI

Environment Variables

---

# Testing Philosophy

Test business logic first.

Priority

1.

Services

2.

Controllers

3.

API

4.

Frontend

Business logic should always be independently testable.

---

# AI Agent Workflow

Before writing code

Step 1

Understand requirement.

↓

Step 2

Locate correct module.

↓

Step 3

Check if similar logic already exists.

↓

Step 4

Reuse existing services whenever possible.

↓

Step 5

Implement feature.

↓

Step 6

Handle validation.

↓

Step 7

Handle errors.

↓

Step 8

Return consistent API response.

↓

Step 9

Update documentation if required.

↓

Step 10

Ensure no architectural rules are violated.

---

# AI Agent Priorities

When multiple solutions exist, always prioritize

1. Simplicity

2. Readability

3. Maintainability

4. Reusability

5. Scalability

Performance optimization should never compromise readability unless necessary.

---

# Project Principles

Every line of code should answer one question:

"Will another developer understand this six months from now?"

If the answer is no,

rewrite the code.

---

# Definition of Done

A feature is considered complete only when

✓ Backend implemented

✓ Frontend implemented

✓ Validation added

✓ Authorization added

✓ Error handling complete

✓ Notifications work (if applicable)

✓ Dashboard updates correctly

✓ API documented

✓ No architectural violations

✓ Code reviewed

✓ Ready for deployment

---

# Final Engineering Principles

CampusOS follows these principles above everything else.

- Business logic belongs in Services.
- Controllers remain thin.
- MongoDB is the source of truth.
- Gemini is only a recommendation engine.
- Users make final decisions.
- Every feature must be modular.
- Code should be easy to read.
- Simplicity is preferred over cleverness.
- Build for scalability without sacrificing maintainability.

---

# End of AGENT.md