# Video assets

Drop video files here to make them appear on the site. Files in `public/`
are served from the web root, so a file placed at:

    frontend/public/media/demo.mp4

is reachable at `/media/demo.mp4`.

## Wiring a video to a slot

Video slots are defined in the database (see `backend/app/seed_data.py` → `MEDIA`).
Each slot has a `key`, a `kind` and a `src`:

| Want to use…        | Set `kind`  | Set `src` to…                              |
|---------------------|-------------|--------------------------------------------|
| A local file here   | `file`      | `/media/demo.mp4`                          |
| A hosted MP4 URL    | `mp4`       | `https://…/video.mp4`                      |
| A YouTube video     | `youtube`   | the video id, e.g. `dQw4w9WgXcQ`           |
| A Vimeo video       | `vimeo`     | the video id, e.g. `76979871`              |

After editing `MEDIA`, re-seed:

    cd backend
    python -m app.seed

The main demo slot (`product_demo`) is pre-wired to `/media/demo.mp4` — just drop
a file with that name here and it plays. Leave a slot's `src` empty to show an
elegant "video coming soon" placeholder instead.

> Recommended: H.264 MP4, 1080p or 720p, under ~30 MB for smooth loading.
> `.gitkeep` keeps this folder in version control while it's empty.
