# yan (yet-another-note)

yan is a just another selfhosted note-taking/wiki app. I really tried to make something that's actually usable and easy to selfhost. 

yan is also very fast (lightning emoji)

> [!WARNING]
> yan is currently not production ready. PLEASE DO NOT OPEN YAN TO THE INTERNET

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
      DATABASE_URL: "file:/app/data/local.db"  # ← Changed to use volume path
      BETTER_AUTH_SECRET: "blbabla"
      BETTER_AUTH_URL: "http://localhost:3000"
    volumes:
      - yan-data:/app/data
    restart: unless-stopped
    network_mode: "host"
    
volumes:
  yan-data:
```

## Roadmap
- [ ] publishing documents
- [ ] comments
- [x] icons for collections
- [ ] more tabs on homepage (**favorites**, last viewed etc)
- [ ] more markdown features
- [x] **images** this is really important
- [ ] configuration of app (app title, colors etc)
- [ ] user management with teams support
- [ ] permissions
- [ ] settings page for that ^^
- [ ] spreadsheet support? (you can already create tables in markdown, but what about excel imports?)
- [ ] export to md/pdf/word etc
