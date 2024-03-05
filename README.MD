# Simple Blog web-app

![Static Badge](https://img.shields.io/badge/Next.js-^13-black)
![Static Badge](https://img.shields.io/badge/Node.JS-^20-orange)
![Static Badge](https://img.shields.io/badge/ExpressJS-^4.18-green)
![Static Badge](https://img.shields.io/badge/PostgreSQL-16-blue)
![Static Badge](https://img.shields.io/badge/Cloudinary-^2-black)

## How to run

### Front-end

- Need to install [PostgreSQL](https://www.postgresql.org/) into the system
- `cd client`
- run `npm install`
- Fill the environment variables. Variable name given in the `.env.example` file
- run `npx prisma migrate dev`
- run `npm run dev`

  The client will be run on [localhost:3000](http://localhost:3000)

### Back-end

- `cd server`
- run `yarn`
- Fill the environment variables. Variable name given in the `.env.example` file
- run `yarn dev`

  The server will be run on [localhost:5000](http://localhost:5000)
  
  and the API end-point [localhost:5000/api/](http://localhost:5000/api/)

## Technologies

- Next.js (Client)
- TailwindCSS (Style)
- Socket.io (for Real-time comment)
- SunEditor (Rich text editor)
- hookForm (Form validation)
- Expressjs (Server)
- JWT (Authentication)
- PostgreSQL (Database)
- Prisma (ORM)
- Cloudinary (Cloud storage)

## Back-end instruction

API end-point: [localhost:5000/api/](http://localhost:5000/api/)
