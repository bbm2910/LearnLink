### LearnLink
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<h1><i>Learn</i> Link - Full stack MVP </h1>

**Peer-to-peer skill exchange platform**

LearnLink is a web-based platform that connects people who want to **teach and learn skills** in their local area. Whether you’re learning guitar, teaching Python, or exchanging photography tips, LearnLink makes it easy to find nearby skill-swappers, track your progress, and build your learning network.
 
![Screenshot of the logo with Github bg color.](learn-link-cli/assets/logo-writing.jpeg)

<!-- ## [Demo]() -->

## Empowering Communities: Skill Sharing Made Simple.


**Overview**
LearnLink is a peer-to-peer educational platform that enables users to trade skills in real-time based on location and availability.  It represents a culmination of the skills and tools we’ve learned on the course, including full-stack development, user experience design, Agile collaboration, and technical documentation.

⸻

**Challenge**

In today's fast-paced world, many people want to learn new skills, but face obstacles like cost, access, or time. Our mission was to create a collaborative, localised skill-sharing tool that makes learning more accessible, social, and efficient.

**Stakeholder Insights**

The planning and design of the application was underpinned by the summary of a wide variety of stakeholder pain points.

- <em>Learners</em> feel limited by traditional learning platforms due to cost or rigid formats.
- <em>Skill-holders</em> want to teach but lack a structured way to offer their time.
- <em>Communities</em> seek more local, inclusive, and informal learning experiences.

**Our Solution**

A location-based web app that matches users who want to learn a skill with others willing to teach it—whether it’s guitar, coding, photography, or cooking. Users create profiles, post skills they can offer or want to learn, and connect for in-person or online swaps. No money. Just learning.


**Key Features**

    •   🔒 User authentication (signup/login)
    •   📍 Location-based skill matchmaking
    •   💾 Persistent data via a relational database
    •   🔄 Skill offer/request posting
    •   🕒 Time availability calendar 
    •   📬 In-app messaging & request handling
    •   🌐 Fully responsive frontend UI

**Backlog Items**

    •   🧾 Profile ratings and reviews
    •   📊 Swap history and analytics
    •   📱 Mobile app version
    •   Social media profile sharing.
    •   Swap request flow before chat initiation.
    •   QR code-based session logging.
    •   General location display (Google Maps API).
    •   Visualizations: Total learning time per skill (requires session tracking).
    •   Learning streak tracking.

## 🧱 Data Architecture

LearnLink uses a **star schema** with dimension and fact tables:

- `dim_user`: Stores user profiles
- `dim_skill`: Skill categories and descriptions
- `dim_time`: Timestamp breakdowns for learning sessions
- `facts_learning`: Skills a user is learning
- `facts_teaching`: Skills a user is teaching
- `facts_session`: Logged peer-to-peer sessions
- `chat_rooms` and `messages`: Messaging system

PostgreSQL is used for storing structured, relational data that powers the visualizations and dashboard.
 

⸻

**Installation - Learning Flow**

To run the LearnLink project locally, follow these steps:


**Clone the Repository**

    •   git clone git@github.com:bbm2910/LearnLink.git
    •   cd LearnLink

**Install Dependencies**

    •  npm install
    •  cd server

**Create Environment Variables**

Inside the server folder, create a .env file:

    •  PORT=3000
    •  DB_URL='Your Databse URL'

**Start the Backend Server**

    •  npm run dev

The backend should now be running at http://localhost:3000.

**Using the App**

    •   Sign up / log in
    •   Add skills you can teach and skills you want to learn
    •   Search or browse skill-swappers nearby
    •   Connect and arrange your first skill swap!


**Development Tools, Methods and Technologies**

This project's aim was to integrate all core Lafosse course topics:

- • ✅ Agile methodologies & version control (Git & GitHub)
- • ✅ UX design principles and wireframing
- • ✅ Frontend development (HTML, CSS, JavaScript)
- • ✅ Backend development (Express, Node.js, Sockets io)
- • ✅ MVC architecture implementation
- • ✅ Database design and integration (SQL)
- • ✅ Data visualisation (matplotlib and seaborn)

**Technical Architecture**

    •   Frontend: HTML, CSS, JavaScript
    •   Backend: Node.js, Express
    •   Database: SQL
    •   Auth: Basic auth with hashed passwords
    -   Testing: Jest, Supertest
    •   Deployment: Render/Netlify
    •   Version Control: Git + GitHub, following feature branch workflow

**Style Guide**

    •   Naming: camelCase for JavaScript, snake_case for SQL
    •   Design: Accessible colour palette, readable fonts, intuitive navigation
    •   UI: Human-centred, clean, minimalist


**Sorces**

- img (/beyond_stem/client/homePage.html) https://storyset.com/

⸻

**Deliverables**

    •   ✅ Stakeholder & solution analysis
    •   ✅ Database schema (ERD)
    •   ✅ Wireframes & UI mock-ups
    •   ✅ Deployed MVP of the educational tool
    •   ✅ End-of-project team presentation

⸻

**API**

    GET '/' - Entry endpoint
    GET '/history' - get all history facts from database
    GET '/history/id' - get fact with specific id from database
    POST '/history' - create new fact in the database
    PATCH '/history/id' - update fact with specific id
    DELETE '/history/id' - delete fact with specific id

⸻

**Testing**

    •   Automated test coverage target: 60%+
    •   Automated test coverage actual: 78%
    •   Tests written with Jest and Supertest

**Resources**

    •   Lafosse Curriculum
    •   Writing Great READMEs
    •   Git Flow Guide

⸻

**What We’ve Learned**
The <i>Learn</i>Link team initially struggled with version control. Code conflicts, overwritten files, and unclear Git workflows were at times slowing the progress and created confusion. We have learned the importance of maintaining clear commit habits, consistent branching, and regular updates.

From user-centred design to full-stack development and project delivery, this project reflects our growth in:

    •   Communication and collaboration
    •   Agile project planning
    •   Writing maintainable, testable and scalable code
    •   Connecting frontend to backend with real dataerrors
    •   Making something fun that really works!

## Contributors ✨👏

- [Bobby](https://github.com/bbm2910)
- [Khavan](https://github.com/gitKhavan)
- [Daniel](hhttps://github.com/MrDanielHo)
- [Emma](https://github.com/EmmaAcquah)
- [Ubong](https://github.com/sfxmaudu)



## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!