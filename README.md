# Codebase-Express-Sazanka



## Structure Folder

```
└── 📁src
    └── 📁api
        └── 📁controller
            └── 📁tasks
                └── 📁command
                    └── domain.js
                └── 📁models
                    └── Notification.js
                    └── Task.js
                    └── TaskComment.js
                    └── TaskHistory.js
                    └── UserTask.js
                └── 📁query
                    └── domain.js
            └── 📁users
                └── 📁command
                    └── domain.js
                └── 📁models
                    └── User.js
                └── 📁query
                    └── domain.js
        └── index.js
    └── 📁database
        └── db.js
        └── 📁redis
            └── connection.js
            └── redis_pub_sub.js
            └── redis.js
    └── 📁helpers
        └── 📁auth
            └── auth.js
            └── basicAuth.js
            └── jwtAuth.js
            └── privileges.js
        └── 📁config
            └── config.js
        └── 📁lib
            └── httpCode.js
            └── logger.js
        └── 📁utils
            └── crypt.js
            └── response.js
            └── validationPayload.js
            └── worker.js
    └── server.js
```

## Step by step install

```
git clone https://github.com/miscla/code-base.git
npm install
npm run dev
```

## env

```
# PORT
PORT=8080

MONGO_URI=mongodb+srv://miscla:0856Dian@test-db-sazanka.global.mongocluster.cosmos.azure.com/Assessment

# BASIC AUTHENTICATION
BASIC_AUTH_USERNAME=username
BASIC_AUTH_PASSWORD=password

# SECRET KEY
PUBLIC_KEY=public.pem
PRIVATE_KEY=private.pem
SECRET_KEY=test

REDIS_CLIENT_HOST=redis-12723.c53.west-us.azure.redns.redis-cloud.com
REDIS_CLIENT_PORT=12723
REDIS_CLIENT_PASSWORD=0856Dian
```

## Cloud Deployment

Service
- Azure Web App
- Azure Cosmos DB for MongoDB
- Redis Cloud