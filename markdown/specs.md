# Project Specification

## Overview

This is a **Next.js** project designed to assist **parents** in finding suitable **companions** to look after their children. The platform displays a list of companions along with their details. If a parent wishes to obtain a companion's contact information, they must contact us directly. We will provide the necessary details privately.

---

## Website State Management

- Use **Redux** to manage the application state.

---

## Data Source

The project uses **Shopify** as the backend database.

### Collections in Use

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

| Field           | Description                                 | Shopify Key   |
| --------------- | ------------------------------------------- | ------------- |
| **User Name**   | Email address of the user                   | `user_name`   |
| **First Name**  | Given name of the companion                 | `first_name`  |
| **Last Name**   | Family name of the companion                | `last_name`   |
| **Major**       | Area of study or specialisation             | `major`       |
| **Location**    | City or region where the companion is based | `location`    |
| **Password**    | bcrypt the password                         | `password`    |
| **Description** | Companion's self-introduction               | `description` |

---

### Optional Fields

| Field                | Description                                                | Shopify Key     |
| -------------------- | ---------------------------------------------------------- | --------------- |
| **WeChat ID**        | WeChat identifier                                          | `wechat_id`     |
| **Education**        | Education background                                       | `education`     |
| **Language**         | Languages spoken                                           | `language`      |
| **Age**              | Age of the companion                                       | `age`           |
| **Age Group**        | Preferred age group for working with                       | `age_group`     |
| **Blue Card / WWCC** | Holds a Blue Card or Working With Children Check (Boolean) | `blue_card`     |
| **Police Check**     | Has a valid police clearance (Boolean)                     | `police_check`  |
| **Skill**            | Possesses additional skills (Boolean)                      | `skill`         |
| **Certification**    | Relevant certifications held                               | `certification` |
| **Availability**     | General availability (e.g. weekdays, weekends)             | `availability`  |

---

## Notes

- The `title` field should be a combination of `first_name` + `last_name`.
- Include an **image uploader** that accepts a **maximum of 5 pictures**.
