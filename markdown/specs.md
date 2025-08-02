# Project Specification

## Overview

This is a **Next.js** project designed to assist **parents** in finding suitable **companions** to look after their children. The platform displays a list of companions along with their details. If a parent wishes to obtain a companion's contact information, they must contact us directly. We will provide the necessary details privately.

## Tech

- `Redux`: state management
- `database`: Shopify
- `Next-auth.js`: front-end Authentication for Next.js

## Data Source

The project uses **Shopify** as the backend database.

### Collections in Use

1. **Companion**
2. **Information**
3. **Parent**

Each **companion** is stored as a product under the `Companion` collection. For shopify standard file, I used `title` and `body_html`, and create the following **metafields**:

- `wechat_id`
- `major`
- `education`
- `language`
- `age`
- `location`
- `age_group`
- `blue_card`
- `police_check`
- `skill`
- `certification`
- `availability`
- `user_name`
- `password`
- `last_name`
- `first_name`

> Uses [`shopify-api-node`](https://github.com/MONEI/Shopify-api-node) to fetch products from Shopify.  
> All API credentials are securely stored in the `.env` file.

---

## Code Standards

- Use **Server-side Rendering (SSR)** and **server-side data fetching** as the default.
- Use **client-side fetching** only when absolutely necessary.
- Use the `GlobalModal` component to:
  - Show loading indicators during data fetching
  - Wrap components like `SearchFilter`
- Follow the **DRY (Don’t Repeat Yourself)** principle:
  - Reuse shared components and utilities before building new ones.
- Encapsulate all Shopify API logic inside a dedicated folder:
  - `lib/shopify/` or `services/shopify/`

---

## Pages

### `/pages`

- General info about the platform
- Lists a selection of companions
- Option to view more companions

### `/companions/page`

- Paginated list of all companions
- Includes a search filter for convenience

### `/companion/page`

- Detailed profile of a selected companion

### `/companion/create`

- Form to create a draft companion record

---

## Companion Creation Fields

### Required Fields

| Field           | Input Type  | Description                                 | Validation                                         | Shopify Key    |
| --------------- | ----------- | ------------------------------------------- | -------------------------------------------------- | -------------- |
| **First Name**  | Text        | Given name of the companion                 | Required, cannot be empty                          | `first_name`   |
| **Last Name**   | Text        | Family name of the companion                | Required, cannot be empty                          | `last_name`    |
| **User Name**   | Email       | Email address of the user (login)           | Required, valid email format, must be unique       | `user_name`    |
| **Password**    | Password    | Account password                            | Required, min 8 chars, letters + numbers           | `password`     |
| **Major**       | Text        | Area of study or specialisation             | Required, cannot be empty                          | `major`        |
| **Location**    | Select      | City or region where the companion is based | Required, dropdown (Sydney/Melbourne/Brisbane/etc) | `location`     |
| **Description** | Textarea    | Companion's self-introduction               | Required, minimum 50 characters                    | `description`  |
| **Images**      | File Upload | Profile photos                              | Required, 1-5 images, max 5MB each                 | Product images |

---

### Optional Fields

| Field                | Input Type | Description                                            | Validation               | Shopify Key     | Metafield Type              |
| -------------------- | ---------- | ------------------------------------------------------ | ------------------------ | --------------- | --------------------------- |
| **WeChat ID**        | Text       | WeChat identifier                                      | Optional, text           | `wechat_id`     | single_line_text_field      |
| **Education**        | Tags Input | Education background (comma-separated)                 | Optional, list of values | `education`     | list.single_line_text_field |
| **Age**              | Number     | Age of the companion                                   | Optional, numeric        | `age`           | number_integer              |
| **Blue Card / WWCC** | Select     | Holds a Blue Card or Working With Children Check       | Optional, Yes/No/Pending | `blue_card`     | boolean                     |
| **Police Check**     | Select     | Has a valid police clearance                           | Optional, Yes/No/Pending | `police_check`  | boolean                     |
| **Language**         | Tags Input | Languages spoken (comma-separated)                     | Optional, list of values | `language`      | list.single_line_text_field |
| **Age Group**        | Tags Input | Preferred age group for working with (comma-separated) | Optional, list of values | `age_group`     | single_line_text_field      |
| **Skill**            | Tags Input | Additional skills (comma-separated)                    | Optional, list of values | `skill`         | list.single_line_text_field |
| **Certification**    | Tags Input | Relevant certifications held (comma-separated)         | Optional, list of values | `certification` | list.single_line_text_field |
| **Availability**     | Tags Input | General availability (comma-separated)                 | Optional, list of values | `availability`  | single_line_text_field      |

---

## Input Type Details

### Tags Input

- **Behavior**: User types values separated by commas
- **Visual**: Each value becomes a removable tag/chip
- **Example**: "English, Chinese, Japanese" → [English] [Chinese] [Japanese]
- **Storage**: Comma-separated string in metafield
- **Metafield Format**: JSON array for `list.single_line_text_field` types

### Validation Rules

- **Email Uniqueness**: Real-time check using GraphQL, prevents duplicate registrations
- **Password**: bcrypt hashed before storage
- **Images**: Minimum 1 required, maximum 5 allowed, each max 5MB
- **Location**: Predefined options (Sydney, Melbourne, Brisbane, Gold Coast, Adelaide)
- **Boolean Fields**: Convert "yes"/"true"/"是" to true, others to false

## Technical Implementation

- **API Endpoint**: `POST /api/companions`
- **Metafield Storage**: All custom fields stored as Shopify product metafields with namespace `custom`
- **Product Type**: "Companion"
- **Product Title**: Combination of `first_name` + `last_name`
- **Initial Status**: Created as "active" then updated to "draft" for review
- **Collection**: Automatically added to Companion collection (ID: 491355177275)

## `/companion/login` ✅ COMPLETED

- ✅ **Login UI**: Fully functional login form with User Name and Password fields
- ✅ **Authentication Logic**: Supports both standard login (`user_name`/`password`) and WeChat fallback (`wechat_id` for both fields)
- ✅ **API Route**: `/api/companion/login` validates credentials and returns JWT token
- ✅ **Password Security**: Supports both bcrypt hashed passwords and plain text (legacy)
- ✅ **Next-auth.js Integration**: JWT handling with next-auth.js for session management
- ✅ **Redirect Logic**: Redirects to `/companion/dashboard` after successful login
- ✅ **Public Route**: Accessible without authentication

**Implementation Details:**
- Uses `getProductsWithMetafields()` to fetch companion data via GraphQL
- JWT secret stored in `.env` as `JWT_SECRET`
- Session strategy: JWT with 7-day expiration
- Error handling with Chinese localized messages

## `/companion/dashboard` ✅ COMPLETED

- ✅ **Dashboard Layout**: Professional dashboard UI with left sidebar navigation
- ✅ **Protected Route**: JWT authentication required for access
- ✅ **Navigation**: Left panel with Profile tab (expandable for future features)
- ✅ **Auto-redirect**: Automatically redirects to profile page by default
- ✅ **Responsive Design**: Works on both desktop and mobile devices

**Implementation Details:**
- Protected by companion layout with session validation
- Automatic redirect to `/companion/dashboard/profile`
- Branded header with MiniTeach logo and user info

## `/companion/dashboard/profile` ✅ COMPLETED

- ✅ **Profile Display**: Comprehensive view of companion information using metafields
- ✅ **Server Component**: Implemented as Next.js server component for optimal performance
- ✅ **Data Source**: Displays all metafields plus Shopify product `body_html` (ignores `title`)
- ✅ **Protected Route**: JWT authentication required
- ✅ **Responsive Layout**: Grid-based layout with profile images and detailed information sections

**Features Implemented:**
- **Basic Information**: Name, email, major, location, age, WeChat ID
- **About Section**: Rich HTML content from `body_html`
- **Skills & Qualifications**: Education, languages, certifications, blue card status
- **Preferences**: Age groups, availability
- **Profile Images**: Grid display of uploaded photos
- **Error Handling**: User-friendly error messages in Chinese

**Technical Implementation:**
- Server-side authentication with `getServerAuthSession()`
- Server action for data fetching (`getCompanionProfile()`)
- Reuses existing Shopify service functions
- Type-safe with TypeScript interfaces
- Performance optimized (497B bundle vs 2.34kB client component)

---

## Authentication System Architecture ✅ COMPLETED

### Server-Side Components
- **`app/lib/auth.ts`**: Shared NextAuth configuration and server session utilities
- **`app/actions/profile.ts`**: Server actions for companion profile operations
- **`app/api/auth/[...nextauth]/route.ts`**: NextAuth API routes
- **`app/api/companion/login/route.ts`**: Custom login validation endpoint

### Client-Side Components
- **`app/components/AuthButton.tsx`**: Authentication UI with hydration handling
- **`app/components/NavigationButtons.tsx`**: Conditional navigation based on auth state
- **`app/components/MobileMenu.tsx`**: Mobile navigation with auth integration

### Security Features
- JWT tokens with 7-day expiration
- bcrypt password hashing support
- Server-side session validation
- Automatic redirect for unauthenticated access
- Secure token storage in HTTP-only cookies

### UI/UX Features
- Conditional button display (hides "成为陪伴师" and "陪伴师登录" when logged in)
- Hydration-safe rendering with loading placeholders
- Responsive design for all screen sizes
- Chinese localized error messages
- Professional dashboard with sidebar navigation
