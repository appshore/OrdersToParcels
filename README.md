Getting Started
---------------

```sh
# Install dependencies
npm install

# Start development live-reload server
npm run dev

# Start production server:
npm start
```

Docker Support
------
```sh
# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```
