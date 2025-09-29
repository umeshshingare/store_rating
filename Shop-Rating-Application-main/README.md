# Shop-Rating-Application
Store Rating Platform

A full-stack web application where users can register, log in, and rate stores (1–5).
Admins can manage users and stores, and store owners can view their stores and ratings.

 Features
 Authentication

Single login system for all roles (Admin, Store Owner, User)

JWT-based authentication and protected routes

1) Admin (System Administrator)

Add new users (admin, store owner, or normal user)

Add new stores and assign owners

View dashboard with:

Total Users

Total Stores

Total Ratings

View all users (with filters & sorting)

View all stores (with filters, ratings & sorting)

Update password (via modal popup)

Logout

2) Store Owner

Login and view their own stores

See ratings given by users

Track overall performance

3) Normal User

Register & login

Search stores by name/address

Submit or update ratings (1–5)

See average rating for each store

Update password

Logout

🛠️ Tech Stack

Frontend

React + React Router

Axios (API requests)

Tailwind CSS (modern UI styling)

Backend

Node.js + Express

JWT Authentication

MySQL (with foreign key constraints & rating relations)

 Installation


2) Backend Setup
cd backend
npm install


Configure .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=store
JWT_SECRET=your_jwt_secret


Run backend server:

npm start

3️) Frontend Setup
cd ../frontend
npm install
npm start


Frontend will run on http://localhost:3000
Backend on http://localhost:5000

 Database Schema (simplified)

1)users

id, name, email, password, address, role

2)stores

id, name, email, address, owner_id (FK → users.id)

3)ratings

id, user_id (FK → users.id), store_id (FK → stores.id), rating

Constraints:

Each user can only rate a store once (UNIQUE(user_id, store_id))






