# Simple NGINX container to serve the built app and static data
FROM nginx:1.27-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# App files (assumes you built locally: npm run build)
COPY dist/ /usr/share/nginx/html/

# Optional: mount your data dir at runtime to /usr/share/nginx/html/data
#   docker run -p 8080:80 -v $(pwd)/public/data:/usr/share/nginx/html/data:ro app

