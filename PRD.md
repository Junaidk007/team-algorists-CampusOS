# CampusOS
## Product Requirements Document (PRD)

Version: 1.0

---

# Executive Summary

## Overview

CampusOS is an AI-powered Autonomous University Operating System designed to modernize how universities manage campus resources, events, and operational workflows.

Instead of replacing existing university software such as ERP, Student Information Systems (SIS), or Learning Management Systems (LMS), CampusOS acts as an intelligent operational layer that centralizes resource management, automates event booking, detects scheduling conflicts, and provides AI-powered venue recommendations.

The primary objective is to eliminate fragmented workflows by providing a unified platform where clubs, faculty members, and administrators can seamlessly coordinate campus resources while reducing manual effort and improving operational efficiency.

CampusOS is designed as a headless, modular monolithic application built using the MERN stack. The backend exposes REST APIs while the frontend consumes these APIs independently, making the platform scalable and future-ready.

---

# Vision

To build the intelligent operating system for modern universities that connects people, resources, and decisions into one centralized ecosystem.

Rather than functioning as another management software, CampusOS serves as the orchestration layer responsible for coordinating university operations in real time.

The long-term vision is to evolve CampusOS into a complete Digital Campus Platform capable of managing every major university operation including resource allocation, event management, attendance, hostel management, transportation, analytics, and AI-assisted decision making.

---

# Mission

Our mission is to eliminate manual coordination across university operations by providing:

- Centralized resource management
- Intelligent event scheduling
- Automated conflict detection
- AI-powered venue recommendations
- Real-time operational visibility
- Streamlined approval workflows
- Improved campus communication

CampusOS enables universities to maximize infrastructure utilization while reducing administrative overhead.

---

# Problem Statement

Modern universities already use multiple software systems to manage different aspects of campus operations.

Examples include:

- Enterprise Resource Planning (ERP)
- Student Information System (SIS)
- Learning Management System (LMS)
- Event Management Software
- Department Portals
- Classroom Booking Systems
- Club Management Tools

Although these systems solve individual problems, they operate independently and rarely communicate with each other.

This fragmentation creates significant operational challenges across the university.

Current challenges include:

### Lack of Centralized Resource Visibility

Students, clubs, and faculty cannot easily determine which classrooms, laboratories, seminar halls, or auditoriums are available.

Finding an appropriate venue often requires contacting multiple departments manually.

---

### Resource Booking Conflicts

Multiple departments may unknowingly book the same venue for overlapping time slots.

This results in:

- Event cancellations
- Last-minute venue changes
- Administrative confusion
- Poor user experience

---

### Manual Approval Process

Resource booking generally involves multiple approval stages including:

- Faculty
- Department Coordinator
- Administration

This process is slow, repetitive, and lacks transparency.

---

### Fragmented Event Management

Campus events are managed independently using WhatsApp groups, Google Forms, emails, and spreadsheets.

There is no centralized system that provides visibility into ongoing or upcoming university events.

---

### Poor Resource Utilization

Administrators have limited visibility into how university infrastructure is being utilized.

As a result:

- Some classrooms remain underutilized.
- Other venues remain overbooked.
- Resource planning becomes inefficient.

---

### Communication Delays

Students and faculty are often informed late about:

- Venue changes
- Event rescheduling
- Booking approvals
- Class relocation

This creates confusion and unnecessary delays.

---

### Lack of Data-Driven Decision Making

University administrators lack operational analytics required to answer questions such as:

- Which department utilizes the most resources?
- Which laboratories remain unused?
- What are the peak booking hours?
- Which venues experience maximum demand?

Without these insights, planning future infrastructure becomes difficult.

---

# Proposed Solution

CampusOS addresses these problems by introducing a centralized operational platform responsible for managing university resources through intelligent automation.

The platform enables users to:

- Create campus events
- Request preferred venues
- Detect scheduling conflicts automatically
- Receive AI-powered alternative venue recommendations
- Manage approvals digitally
- Receive in-app notifications
- Monitor campus resource utilization through dashboards

Unlike traditional booking systems, CampusOS introduces AI-assisted decision support.

When a preferred venue is unavailable, the system automatically analyzes available campus resources and recommends the most suitable alternatives based on:

- Capacity
- Required facilities
- Department
- Venue availability
- Time slot compatibility

This significantly reduces manual effort while improving booking efficiency.

---

# Product Goals

The primary goals of CampusOS are:

## Goal 1

Provide a single platform for campus resource management.

---

## Goal 2

Reduce scheduling conflicts through automated validation.

---

## Goal 3

Digitize resource approval workflows.

---

## Goal 4

Improve resource utilization across departments.

---

## Goal 5

Provide AI-assisted venue recommendations during booking conflicts.

---

## Goal 6

Deliver real-time operational visibility through dashboards.

---

## Goal 7

Improve communication using centralized in-app notifications.

---

# Product Scope (MVP)

The initial MVP focuses on event booking and resource allocation.

Included Modules:

- User Authentication
- Department Management
- Resource Management
- Event Creation
- Venue Booking
- Conflict Detection
- AI Recommendation Engine
- Dashboard
- In-App Notifications

Out of Scope (MVP):

- Hostel Management
- Attendance
- Transport
- Library
- Finance
- Examination
- Smart IoT Integration

These features are planned for future releases.

---

# User Personas

CampusOS is designed for three primary user roles.

---

## 1. Club / Organization

### Description

A university club or organization responsible for organizing events, workshops, seminars, hackathons, competitions, and other campus activities.

Examples:

- TechNeekX
- IEEE Student Branch
- Google Developer Groups
- Coding Club
- Robotics Club

### Responsibilities

- Create events
- Request preferred venues
- Track booking status
- Receive booking notifications
- View event history

### Permissions

✅ Create Event

✅ Request Venue

✅ View Own Bookings

✅ View Notifications

❌ Cannot approve bookings

❌ Cannot manage university resources

---

## 2. Faculty

### Description

Faculty members supervise departments and approve event requests when required.

### Responsibilities

- Review booking requests
- Approve or reject events
- View department resources
- Monitor department bookings

### Permissions

✅ Approve Events

✅ Reject Events

✅ View Department Dashboard

✅ View Resource Availability

---

## 3. Administrator

### Description

The administrator manages the complete university resource ecosystem.

### Responsibilities

- Manage departments
- Manage resources
- Manage users
- Configure system settings
- Monitor dashboards
- View analytics
- Handle approvals

### Permissions

✅ Full Access

---

# User Stories

---

## Authentication

As a user,

I want to securely log into the system

so that I can access features according to my role.

---

## Event Creation

As a Club,

I want to create an event

so that I can organize university activities.

---

## Venue Selection

As a Club,

I want to choose my preferred venue

because every event has its own ideal location.

---

## Conflict Detection

As a User,

I want the system to automatically detect booking conflicts

so that duplicate bookings never occur.

---

## AI Recommendation

As a User,

when my preferred venue is unavailable,

I want AI to recommend the best alternatives

instead of forcing me to manually search for another venue.

---

## Booking Approval

As Faculty,

I want to review booking requests

so that university resources are allocated properly.

---

## Notifications

As a User,

I want instant notifications

when my booking status changes.

---

## Dashboard

As Admin,

I want to monitor campus resources

so that I can make better operational decisions.

---

# Functional Requirements

---

## Module 1 — Authentication

### Features

- Login
- Logout
- JWT Authentication
- Role-Based Authorization

Roles

- Admin
- Faculty
- Club

---

## Module 2 — Department Management

Each department stores:

- Department Name
- Total Floors
- Total Rooms
- Total Labs

Example

Engineering

Floor 5

45 Rooms

8 Labs

---

## Module 3 — Campus Resource Management

Every resource contains:

- Resource Name
- Resource Type
- Department
- Floor
- Capacity
- Available Facilities
- Current Status

Resource Types

- Classroom
- Laboratory
- Seminar Hall
- Auditorium
- Conference Room

Status

- Available
- Occupied
- Booked

---

## Module 4 — Event Management

Users can create events.

Each event stores:

- Event Name
- Event Type
- Hosted By
- Department
- Expected Capacity
- Date
- Time
- Requirements
- Preferred Venue

Event Status

- Pending
- Approved
- Rejected
- Completed

---

## Module 5 — Booking Management

Booking Process

1.

User creates event.

↓

2.

Preferred venue selected.

↓

3.

Conflict detection.

↓

4.

If available

Booking created.

↓

5.

If unavailable

AI recommendation starts.

↓

6.

User confirms recommendation.

↓

7.

Booking stored.

---

Booking Status

Pending

Approved

Rejected

Cancelled

Completed

---

## Module 6 — Conflict Detection Engine

The booking service validates:

- Venue availability
- Date overlap
- Time overlap
- Capacity compatibility
- Resource status

Possible Outcomes

No Conflict

Conflict Found

---

## Module 7 — AI Recommendation Engine

The AI Recommendation Engine activates ONLY when a conflict exists.

The backend sends:

Event Details

Preferred Venue

Available Resources

Requirements

Gemini returns

Three ranked alternatives.

Example

Option 1

Alternative Venue

Option 2

Same Venue

Different Time

Option 3

Same Venue

Different Date

The user chooses one recommendation.

Only after confirmation is the booking created.

AI never creates bookings automatically.

---

## Module 8 — Notification System

The system sends in-app notifications for:

Booking Approved

Booking Rejected

Booking Cancelled

Venue Changed

Event Updated

Notifications are delivered in real time using Socket.io.

---

## Module 9 — Dashboard

Dashboard displays:

Total Resources

Available Resources

Occupied Resources

Booked Resources

Today's Events

Pending Approvals

Recent Notifications

Department Summary

---

# Event Creation Workflow

Step 1

User Login

↓

Step 2

Create Event

↓

Step 3

Enter

- Event Name
- Event Type
- Department
- Hosted By
- Capacity
- Date
- Time
- Requirements
- Preferred Venue

↓

Step 4

Submit Request

↓

Step 5

Authentication

↓

Step 6

Conflict Detection

↓

No Conflict

↓

Booking Created

↓

Event Saved

↓

Notifications

↓

Dashboard Updated

OR

Conflict Found

↓

AI Recommendation

↓

Alternative Suggestions

↓

User Confirms

↓

Booking Created

↓

Notifications

↓

Dashboard Updated

---

# AI Recommendation Rules

The AI Recommendation Engine must follow these rules.

Priority 1

Preferred venue if available.

Priority 2

Alternative venue in same department.

Priority 3

Closest seating capacity.

Priority 4

Matching facilities.

Priority 5

Alternative time slot.

Priority 6

Alternative date.

AI recommendations are advisory only.

The final decision always belongs to the user.

---

# Business Rules

A booking cannot exist without an event.

Every event must belong to exactly one department.

Every event must have exactly one booking.

A resource cannot be booked for overlapping time slots.

Only Faculty/Admin can approve bookings.

Only approved bookings block resource availability.

Cancelled bookings immediately release resources.

Completed events automatically archive booking history.

AI recommendations never modify database records directly.

Only confirmed bookings are stored in MongoDB.

---

# System Architecture

CampusOS follows a **Headless Modular Monolithic Architecture**.

The frontend and backend are completely decoupled.

The frontend consumes REST APIs while the backend exposes business services.

```
                React Frontend
                       │
                REST API + JWT
                       │
               Express Backend
                       │
 ┌─────────────┬──────────────┬──────────────┐
 │             │              │              │
Authentication Event      Resource      Booking
 Service      Service      Service       Service
 │             │              │              │
 └─────────────┼──────────────┼──────────────┘
               │
      Conflict Detection Engine
               │
        AI Recommendation
        (Gemini API)
               │
 Notification Service
               │
 Dashboard Service
               │
           MongoDB
```

---

# System Components

## Authentication Service

Responsible for:

- Login
- JWT Generation
- Role Validation
- Authorization

---

## Event Service

Responsible for:

- Create Event
- Update Event
- Delete Event
- Event Status
- Event History

---

## Resource Service

Responsible for managing university resources.

Resources include:

- Classrooms
- Laboratories
- Seminar Halls
- Auditoriums
- Conference Rooms

Functions

- Get Resources
- Resource Availability
- Resource Details
- Update Resource Status

---

## Booking Service

Responsible for

- Booking Creation
- Booking Validation
- Booking Approval
- Booking Cancellation

The booking service coordinates with:

- Resource Service
- Conflict Detection Engine
- Notification Service

---

## Conflict Detection Engine

Before every booking the engine validates

- Preferred venue
- Date
- Time
- Capacity
- Existing bookings

Possible Result

No Conflict

OR

Conflict Found

---

## AI Recommendation Service

The AI Recommendation Service is NOT a chatbot.

It is a Decision Support System.

The service only executes after a booking conflict occurs.

Responsibilities

- Receive booking context
- Analyze available resources
- Call Gemini API
- Rank alternatives
- Return recommendations

The AI never creates bookings.

The final decision always belongs to the user.

---

## Notification Service

Responsible for

- Booking Updates
- Event Updates
- Venue Changes
- Approval Notifications

Notifications are delivered using Socket.io.

---

## Dashboard Service

Responsible for

Aggregated statistics.

Examples

- Total Rooms

- Available Resources

- Today's Events

- Pending Requests

- Recent Notifications

---

# Database Design

Database

MongoDB

---

## Collection

Users

Fields

```
_id

name

email

password

role

department

createdAt

updatedAt
```

Role

- Admin

- Faculty

- Club

---

## Collection

Departments

```
_id

name

totalFloors

totalRooms

totalLabs

createdAt
```

---

## Collection

Resources

```
_id

name

type

departmentId

floor

capacity

facilities

status
```

Status

- Available

- Occupied

- Booked

Facilities

Example

```
Projector

Smart Board

WiFi

Sound System

AC
```

---

## Collection

Events

```
_id

eventName

eventType

hostedBy

departmentId

capacity

requirements

preferredVenue

date

startTime

endTime

status
```

Status

Pending

Approved

Rejected

Completed

---

## Collection

Bookings

```
_id

eventId

resourceId

bookingDate

startTime

endTime

status

approvedBy
```

Status

Pending

Approved

Rejected

Cancelled

Completed

---

## Collection

Notifications

```
_id

userId

title

message

type

isRead

createdAt
```

---

# Collection Relationships

```
Department

│

├── Resources

├── Faculty

└── Events

Event

│

└── Booking

Booking

│

└── Resource

User

│

└── Notifications
```

---

# REST API Design

## Authentication

POST

```
/api/auth/login
```

POST

```
/api/auth/logout
```

GET

```
/api/auth/me
```

---

## Events

GET

```
/api/events
```

GET

```
/api/events/:id
```

POST

```
/api/events
```

PUT

```
/api/events/:id
```

DELETE

```
/api/events/:id
```

---

## Resources

GET

```
/api/resources
```

GET

```
/api/resources/:id
```

GET

```
/api/resources/department/:id
```

PATCH

```
/api/resources/:id
```

---

## Booking

POST

```
/api/bookings
```

GET

```
/api/bookings
```

PUT

```
/api/bookings/:id
```

DELETE

```
/api/bookings/:id
```

---

## Notifications

GET

```
/api/notifications
```

PATCH

```
/api/notifications/read
```

---

## Dashboard

GET

```
/api/dashboard
```

---

# Authentication Flow

```
User

↓

Login

↓

JWT Generated

↓

Client Stores Token

↓

Authorization Header

↓

Protected API

↓

Role Validation

↓

Success
```

---

# Event Booking Flow

```
User Login

↓

Create Event

↓

Submit Event Details

↓

Conflict Detection

↓

No Conflict

↓

Create Booking

↓

Save Event

↓

Notify Users

↓

Dashboard Update
```

OR

```
Create Event

↓

Conflict Found

↓

AI Recommendation

↓

User Selects Alternative

↓

Booking Created

↓

Notifications

↓

Dashboard Updated
```

---

# Error Handling

Every API should return

Success

```
{
   success: true,
   data: {}
}
```

Failure

```
{
   success: false,
   message: "",
   errors: []
}
```

---

# Security

Authentication

JWT

Authorization

Role Based Access Control

Passwords

bcrypt Hashing

Validation

Server Side Validation

Protected Routes

JWT Middleware

Input Validation

Express Validator

Environment Variables

.env

---

# Non Functional Requirements

Performance

Booking validation should complete in less than 2 seconds.

---

Scalability

Architecture should support future modules.

---

Availability

System should support concurrent bookings.

---

Maintainability

Business logic must remain inside services.

Controllers should remain lightweight.

---

Reliability

No duplicate bookings should occur.

---

Extensibility

Future modules can be added without major architectural changes.

Examples

- Hostel

- Attendance

- Transport

- Library

- Finance

---

# Folder Architecture

Client

```
Pages

Components

Services

Hooks

Context

Utils

Routes
```

Server

```
Controllers

Services

Routes

Models

Middleware

Config

Utils

Sockets
```

---

# Coding Principles

Controllers

Only request-response handling.

Services

Business Logic only.

Models

Database interactions only.

Routes

API mapping only.

Middleware

Authentication

Validation

Authorization

Utilities

Reusable helper functions.

---

# Development Milestones

Milestone 1

Authentication

---

Milestone 2

Department Module

---

Milestone 3

Resource Management

---

Milestone 4

Event Module

---

Milestone 5

Booking Module

---

Milestone 6

Conflict Detection

---

Milestone 7

Gemini Recommendation Engine

---

Milestone 8

Notifications

---

Milestone 9

Dashboard

---

Milestone 10

Testing & Deployment

---

# UI / UX Requirements

CampusOS should provide a modern, clean, and intuitive user experience inspired by products such as Linear, Notion, Stripe, and Vercel.

## Design Principles

- Clean and minimal interface
- White background with subtle gradients
- Rounded cards and components
- Consistent spacing
- Fast navigation
- Responsive design
- Accessibility-first
- Role-based dashboards

---

# Design Theme

Primary Color

Blue

Accent

Purple

Success

Green

Warning

Orange

Danger

Red

Background

#FFFFFF

Border Radius

12px

Typography

Inter

---

# Navigation

Sidebar Navigation

- Dashboard
- Events
- Resources
- Bookings
- Notifications
- Settings

Top Navigation

- Search
- Notifications
- Profile
- Logout

---

# Dashboard Requirements

Every user role should have its own dashboard.

## Club Dashboard

Widgets

- Upcoming Events
- Recent Bookings
- Booking Requests
- Notifications

Quick Actions

- Create Event
- View Resources

---

## Faculty Dashboard

Widgets

- Pending Approvals
- Department Events
- Resource Availability

Quick Actions

- Approve Requests
- View Department Resources

---

## Admin Dashboard

Widgets

- Total Departments
- Total Resources
- Today's Events
- Pending Approvals
- Recent Notifications

Charts

- Resource Utilization
- Daily Bookings
- Department Activity

---

# Event Creation Screen

Fields

- Event Name
- Event Type
- Department
- Hosted By
- Capacity
- Date
- Start Time
- End Time
- Requirements
- Preferred Venue

Buttons

Submit

Cancel

---

# Booking Conflict Screen

If a conflict exists, display:

Conflict Summary

Reason

Preferred venue unavailable

AI Recommendations

Option 1

Alternative Venue

Option 2

Same Venue Different Time

Option 3

Same Venue Different Date

User Actions

Accept Recommendation

Choose Another Venue

Cancel Request

---

# Notification Center

Display

Unread Notifications

Recent Notifications

Booking Updates

Approval Updates

Venue Changes

Mark All Read

---

# Acceptance Criteria

Authentication

✓ Users can securely log in.

✓ JWT authentication works.

✓ Unauthorized users cannot access protected APIs.

---

Event Creation

✓ Users can create events.

✓ Event validation works.

✓ Required fields are enforced.

---

Booking

✓ Users can request preferred venues.

✓ Booking is created if no conflict exists.

✓ Duplicate bookings are prevented.

---

Conflict Detection

✓ Time conflicts are detected.

✓ Resource conflicts are detected.

✓ Capacity mismatch is validated.

---

AI Recommendation

✓ AI activates only during conflicts.

✓ AI recommends three alternatives.

✓ AI never creates bookings automatically.

✓ User confirmation is mandatory.

---

Notifications

✓ Users receive in-app notifications.

✓ Notifications update in real time.

---

Dashboard

✓ Dashboard statistics update after bookings.

✓ Resource counts remain accurate.

---

# Edge Cases

Event capacity exceeds every available venue.

Expected Result

Return "No Suitable Venue Available."

---

Preferred venue does not exist.

Expected Result

Validation Error

---

Venue becomes occupied before approval.

Expected Result

Conflict Detection runs again before approval.

---

Faculty rejects booking.

Expected Result

Booking Status becomes Rejected.

---

Event cancelled.

Expected Result

Associated booking is released.

Resource becomes available again.

---

Multiple users try to book the same venue simultaneously.

Expected Result

Only the first valid booking succeeds.

Others receive conflict detection.

---

AI returns invalid response.

Expected Result

Fallback to manual venue selection.

---

Gemini API unavailable.

Expected Result

Booking workflow continues without recommendations.

---

# Testing Strategy

Unit Testing

- Services
- Controllers
- Utilities

Integration Testing

- Booking Flow
- Event Flow
- Conflict Detection
- AI Recommendation

End-to-End Testing

Login

↓

Create Event

↓

Conflict Detection

↓

Recommendation

↓

Booking

↓

Notification

↓

Dashboard

---

# Deployment

Frontend

Vercel

Backend

Render

Database

MongoDB Atlas

Environment Variables

Frontend

VITE_API_URL

Backend

PORT

MONGODB_URI

JWT_SECRET

GEMINI_API_KEY

CLIENT_URL

---

# Future Roadmap

## Phase 2

Attendance Integration

Timetable Integration

Faculty Scheduling

Approval Workflows

Email Notifications

---

## Phase 3

Library Management

Hostel Management

Transport Module

Inventory Management

Campus Analytics

---

## Phase 4

AI Chat Assistant

Predictive Resource Allocation

Smart Timetable Generation

Event Attendance Prediction

Usage Forecasting

---

## Phase 5

Complete Digital Twin

Campus Map

IoT Integration

Smart Energy Management

Predictive Maintenance

Emergency Management

---

# Risks

Heavy dependency on accurate booking data.

AI recommendation quality depends on available resource metadata.

Concurrent booking requests require transaction-safe validation.

Large universities may require pagination and optimized database indexing.

---

# Success Metrics

Booking conflict reduction

Target

80%

---

Average booking time

Target

< 2 minutes

---

Resource utilization improvement

Target

30%

---

User satisfaction

Target

> 90%

---

Approval turnaround time

Target

< 30 minutes

---

# Product Philosophy

CampusOS is not another University Management System.

It is an intelligent operational layer that coordinates university resources, automates scheduling, and assists users in making better decisions.

Every feature should follow these principles:

- Simplicity over complexity.
- Automation over manual work.
- Recommendations over assumptions.
- Transparency over hidden decisions.
- User confirmation before automation.

---

# Conclusion

CampusOS transforms fragmented university operations into one intelligent ecosystem.

By combining centralized resource management, automated conflict detection, AI-powered recommendations, and real-time operational visibility, CampusOS enables universities to operate more efficiently while improving the experience for students, clubs, faculty, and administrators.

The MVP focuses on intelligent event and venue management, while the architecture is designed to evolve into a complete Autonomous University Operating System capable of managing every major campus operation.