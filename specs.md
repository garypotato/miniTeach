# Project Specification

## Overview

This is a **Next.js** project designed to assist **parents** in finding suitable **companions** to look after their children. The platform displays a list of companions along with their details. If a parent wishes to obtain a companion's contact information, they must contact us directly. We will provide the necessary details privately.

---

## Website State Management

Use Redux to manage the state

---

## Pages

This project consists of three main pages:

- **`/pages`**  
  Provides general information about the platform. It also lists a selection of companions and allows users to view more.

- **`/companions/page`**  
  Displays a paginated list of all companions. Includes a search filter for quick and easy searching.

- **`/companion/page`**  
  Shows the detailed profile of a selected companion.

---

## Data Source

The project uses **Shopify** as the backend database.

### Collections in use:

1. **Companion**
2. **Q & A**
3. **Information**
4. **Parent**

Each **companion** is stored as a product under the `Companion` collection and includes the following **metafields**:

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

The [`shopify-api-node`](https://github.com/MONEI/Shopify-api-node) package is used to fetch products (companions) from Shopify. All necessary API keys are securely stored in the `.env` file.

---

## Code Standards

- **Server-side rendering (SSR)** and **server-side data fetching** must be prioritised. Use client-side rendering/fetching only when necessary.

- Use the `GlobalModal` component to:

  - Display loading indicators when fetching data
  - Wrap components such as the `SearchFilter`

- Follow the **DRY (Don’t Repeat Yourself)** principle:

  - Reuse existing shared components and utility functions before creating new ones.

- All Shopify API logic must be encapsulated within a dedicated folder (e.g. `lib/shopify/` or `services/shopify/`).

---
