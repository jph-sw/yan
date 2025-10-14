# yan (yet-another-note)

## Basic Setup

**Docker Compose**

```yaml
services:
  yan:
    image: "jphsw/yan:latest"
    container_name: yan
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "file:/app/data/local.db" 
      BETTER_AUTH_SECRET: "blbabla"
      BETTER_AUTH_URL: "http://localhost:3000"
      WS_URL: "http://yan-ws:1234/collaboration"
    volumes:
      - yan-data:/app/data
    restart: unless-stopped
    
  yan-ws:
    image: "jphsw/yan-ws:latest"
    container_name: yan-ws
    ports:
      - "1234:1234"
    environment:
      YAN_URL: "http://yan:3000"
    depends_on:
      - yan
    restart: unless-stopped
    
volumes:
  yan-data:
```
