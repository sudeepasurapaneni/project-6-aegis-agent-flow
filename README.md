# AegisFlow: Smart Payments

Create a simple but professional full-stack web application called AegisFlow.

COMPANY IDEA

AegisFlow is a fictional payment company that allows customers to use AI agents to make authorized payments on their behalf.

Example:

A customer gives an AI agent called "TravelBot" permission to book travel.

The customer can set:

Maximum transaction amount

Daily spending limit

Allowed payment categories

The AI agent can only make payments within these permissions.

The main purpose of the project is to demonstrate a secure multi-domain payment company architecture.

This is an educational prototype. Do not connect to real payment systems or process real money.

APPLICATIONS / DOMAINS

Create 5 separate applications/domains.

Each application must have a clearly different business purpose.

1. Customer Application

Purpose

Allow customers to manage their account, view payments and control their AI agents.

Users

Customers.

Main Features

Login

MFA verification

View account

View transactions

View payment history

View AI agents

Approve or reject payments

Manage security settings

Data

Customer profile

Transaction history

Payment approvals

Account information

2. AI Agent Management Application

Purpose

Allow customers to create and manage AI agents that can make payments on their behalf.

Users

Customers.

Main Features

Create an AI agent

Give the agent a purpose

Set spending limits

Set allowed categories

View agent activity

Pause an agent

Revoke agent access

Example agent:

TravelBot

Purpose:
Book flights and hotels.

Daily limit:
₹10,000

Allowed categories:
Flights
Hotels
Transportation

The AI agent must not be able to make payments outside these permissions.

Data

Agent details

Agent permissions

Spending limits

Agent activity

3. Merchant Application

Purpose

Allow merchants to receive and manage payments from customers and AI agents.

Users

Merchants.

Main Features

Merchant login

View payments

View orders

View refunds

View settlement information

View transaction history

Data

Merchant profile

Orders

Transactions

Settlement information

Refund information

Merchants must only be able to access their own business data.

4. Fraud & Risk Application

Purpose

Detect and investigate suspicious payments.

Users

Fraud analysts.

Main Features

View transactions

View suspicious transactions

Assign risk scores

Investigate transactions

Block suspicious payments

View fraud alerts

Example:

TravelBot normally spends ₹2,000–₹5,000.

Suddenly it tries to spend ₹50,000.

The system should display:

Risk Score: High

Reason:
"Transaction amount is significantly higher than the agent's normal spending behavior."

Action:
Blocked / Requires approval

Data

Transaction information

Risk scores

Fraud alerts

Investigation records

Fraud analysts should not have access to administrator settings.

5. Admin & Security Application

Purpose

Allow administrators to manage users, roles and security settings.

Users

System administrators.

Main Features

User management

Role management

Security monitoring

View audit logs

Manage access policies

View login/security events

Roles:

Customer
Merchant
Fraud Analyst
Administrator

Each role must have different permissions.

Data

User accounts

Roles

Permissions

Security events

Audit logs

This application must have the highest security restrictions.

SECURITY REQUIREMENTS

The architecture must clearly demonstrate the following six concepts.

1. Defense in Depth

Use multiple security layers:

Internet
↓
Firewall / WAF
↓
Authentication
↓
Authorization
↓
Application
↓
Database

Do not rely on a single security control.

2. Least Privilege

Users and AI agents should receive only the permissions they need.

Example:

TravelBot can:

✓ Book hotels
✓ Book flights

TravelBot cannot:

✕ Change customer account details
✕ Access the database
✕ Access admin settings
✕ View other customers

3. Zero Trust

Do not automatically trust users, AI agents or applications.

Every important request should be:

Authenticate
↓
Verify
↓
Authorize
↓
Allow / Deny

4. Secure Authentication

Provide:

Username/email

Password

MFA

Secure session handling

Create simple demo login options for:

Customer
Merchant
Fraud Analyst
Administrator

Use fictional demo accounts only.

5. Strong Authorization

Use Role-Based Access Control.

Customer:
Can access their own account and transactions.

Merchant:
Can access their own merchant information and payments.

Fraud Analyst:
Can investigate suspicious transactions.

Administrator:
Can manage users, roles and security policies.

Users should not be able to access applications outside their role.

6. Network Segmentation

Create a simple architecture diagram showing separate network areas:

Customer Zone

Customer Application

Payment/Application Zone

AI Agent Application
Payment Services

Fraud Zone

Fraud & Risk Application

Admin Zone

Admin & Security Application

Database Zone

Databases

Show that these zones have controlled communication.

For example:

Customer Application
→ Payment Service

Customer Application
✕→ Admin Database

AI Agent
✕→ Direct Database Access

Merchant Application
✕→ Admin Application

TECHNOLOGY

Use a simple modern technology stack.

Frontend:
React.js

Backend:
Node.js + Express.js

Database:
PostgreSQL

Hosting:
AWS

Authentication:
JWT + MFA demonstration

Use REST APIs between applications.

Do not expose database credentials or secret keys in frontend code.

DESIGN

Create a clean, modern fintech + cybersecurity design.

Company name:

AegisFlow

Tagline:

"Smart payments. Human control."

Design style:

Professional

Minimal

Modern

Secure-looking

Dark navy/white interface

Blue accent color

Clean cards

Simple charts

Responsive layout

Do NOT copy the design of PhonePe, Paytm, Google Pay or other existing payment apps.

DASHBOARD

Create a simple customer dashboard showing:

Account Balance

Active AI Agents

Today's Spending

Pending Approvals

Recent Transactions

Example:

TravelBot → HotelBooking → ₹6,500 → Approved

ShopBot → UrbanCart → ₹2,000 → Approved

TravelBot → LuxuryStay → ₹35,000 → Blocked

AI AGENT EXAMPLE

Create a sample AI agent:

Name:
TravelBot

Purpose:
Travel booking

Daily spending limit:
₹10,000

Allowed:
Flights
Hotels
Transportation

Blocked:
Gambling
Cryptocurrency
Other restricted categories

Create buttons:

Edit Permissions
Pause Agent
Revoke Access

PAYMENT SECURITY FLOW

Show a simple visual flow:

Customer
↓
AI Agent
↓
Authentication
↓
Permission Check
↓
Risk Check
↓
Authorization
↓
Payment
↓
Merchant

If the transaction violates the agent's permissions:

Transaction → BLOCKED

If the transaction is suspicious:

Transaction → HUMAN APPROVAL REQUIRED

FINAL REQUIREMENT

The final project should clearly show that AegisFlow is a multi-domain payment company, not a single payment application.

The 5 applications must remain separate because they have different business purposes:

Customer Application

AI Agent Management Application

Merchant Application

Fraud & Risk Application

Admin & Security Application

The project should demonstrate:

Defense in Depth

Least Privilege

Zero Trust

Secure Authentication

Strong Authorization

Network Segmentation

Keep the implementation simple enough for a college cybersecurity architecture assignment and make every feature easy to explain during a presentation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c79a5013-0e8b-42e5-be59-fd4923a91be2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
