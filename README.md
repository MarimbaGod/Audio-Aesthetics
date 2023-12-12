# Audio Aesthetics by Tunity

[Click here to visit our deployed site right now!](https://team-tunity.gitlab.io/audio-aesthetics/signup)

...Or you can actually read the README first if you like. Choose your own adventure. :)

[Pssst...Here's the link to see our deployed FastAPI Swagger UI Docs as well if you'd like.](https://aug-2023-1-et-api3.mod3projects.com/docs)

## Audio Aesthetics is brought to you by the incredible engineers at Tunity:

- Kyle Bossert [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kyle-bossert/) [![GitLab](https://img.shields.io/badge/GitLab-FCA121?style=flat-square&logo=gitlab&logoColor=white)](https://gitlab.com/marimbagod)
- Gordon Tran [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gordontran/) [![GitLab](https://img.shields.io/badge/GitLab-FCA121?style=flat-square&logo=gitlab&logoColor=white)](https://gitlab.com/ItsNotGordon)
- Andrew Cadena [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrew-cadena-ponce/) [![GitLab](https://img.shields.io/badge/GitLab-FCA121?style=flat-square&logo=gitlab&logoColor=white)](https://gitlab.com/itscadena123)
- Angel Lawler Skye [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/angel-lawler-skye/) [![GitLab](https://img.shields.io/badge/GitLab-FCA121?style=flat-square&logo=gitlab&logoColor=white)](https://gitlab.com/angellawlerskye)

## Audio Aesthetics was created, tested, and deployed with:

[![Docker](https://img.shields.io/badge/Docker-6C757D?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-6C757D?style=for-the-badge&logo=python)](https://www.python.org/)
[![Git](https://img.shields.io/badge/Git-6C757D?style=for-the-badge&logo=git)](https://git-scm.com/)
[![Node.js](https://img.shields.io/badge/Node.js-6C757D?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-6C757D?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-6C757D?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Beekeeper Studio](https://img.shields.io/badge/Beekeeper_Studio-6C757D?style=for-the-badge&logo=beekeeper)](https://www.beekeeperstudio.io/)
[![pgAdmin](https://img.shields.io/badge/pgAdmin-6C757D?style=for-the-badge&logo=postgresql)](https://www.pgadmin.org/)
[![React](https://img.shields.io/badge/React-6C757D?style=for-the-badge&logo=react)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-6C757D?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JSON](https://img.shields.io/badge/JSON-6C757D?style=for-the-badge&logo=json)](https://www.json.org/)
[![JSX](https://img.shields.io/badge/JSX-6C757D?style=for-the-badge&logo=react)](https://reactjs.org/docs/introducing-jsx.html)
[![HTML](https://img.shields.io/badge/HTML-6C757D?style=for-the-badge&logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-6C757D?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Material-UI](https://img.shields.io/badge/Material--UI-6C757D?style=for-the-badge&logo=material-ui&logoColor=white)](https://material-ui.com/)
[![JWT.io](https://img.shields.io/badge/JWT.io-6C757D?style=for-the-badge)](https://jwt.io/)
[![Galvanize Cloud CLI](https://img.shields.io/badge/Galvanize_Cloud_CLI-6C757D?style=for-the-badge)](https://gitlab.com/galvanize-inc/foss/glv-cloud-cli)
[![GitLab Pages](https://img.shields.io/badge/GitLab_Pages-6C757D?style=for-the-badge&logo=gitlab)](https://pages.gitlab.io/)

## Design

- [API design](docs/apidocsnonotes.md)
- [Database Model](docs/data-model-diagram.png)
- [Front-End Layout](docs/front-end-layout.md)
- [Third-Party Integrations](docs/thirdpartyinfo.md)

## Our Users

Our Users are people who value music, art, and connecting with others over shared artistic taste and experiences.

## Current Functionality

As a User, I can:

- Create an Account.
- Make Posts about the music I love.
- Like Posts by other Users who share things relevant to my musical interests.
- Follow other Users who share a similar Audio Aesthetic as me.
- Link my Spotify Account
- See my Playlists
- Search through Spotify
- Use Stable Diffusion's Dreambooth V4 Text to Image Endpoint to generate a text-based image of any song I select from any of my playlists.

## The Future of Audio Aesthetics

- Color-based "Audio Aesthetic" data curated from a User's Spotify history that is displayed on their profile and used to match them to other Users who share similar tastes.

- Public Groups where Users can share posts just among their group.
- Private Groups where Users can share posts privately only among other Users who are in the same group.
- Further Spotify Integration for Users to create and share their own playlists based on their Audio Aesthetic.
- Further Stable Diffusion integration to allow users to create images based on their Spotify history.

## How to run Audio Aesthetics locally:

1. Clone our repo.
2. CD into the root directory of the project.
3. RUN docker volume create postgres-data
4. RUN docker compose build
5. RUN docker compose up
6. Navigate to localhost:3000 in your browser to see our Front-End and localhost:8000/docs to see the FastAPI Swagger UI.

## Special Thanks

Thank you to our Instructors, SEIRS, and hard-working Cohort at Hack Reactor for their contributions through this entire project. It has truly been a pleasure learning and working with you all.
