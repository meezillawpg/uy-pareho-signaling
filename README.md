# Uy Pareho — PeerJS Signaling Server

A tiny PeerJS broker that handles the WebRTC handshake for the Uy Pareho
memory game's online multiplayer mode. Hosted separately from the static
game so it can stay online 24/7 and serve clients reliably worldwide.

## What this is — and isn't

**It is:** a "phone book" that helps two players' browsers find each other
when one player shares a join link. The handshake takes a few seconds.

**It isn't:** a game server. After the handshake, the actual game data
flows peer-to-peer between the two browsers directly via WebRTC. This
server never sees moves, scores, or names — just the introduction.

This means resource usage is tiny and the free tier is plenty for hundreds
of concurrent games.

## Local development

    npm install
    npm start

The server listens on port `9000` by default. To use a different port:

    PORT=8080 npm start

To test it from the game locally, in `index.html` set:

    const SIGNALING_HOST = "localhost";
    const SIGNALING_PORT = 9000;
    const SIGNALING_SECURE = false;

(Then revert before deploying to production.)

## Deployment to Render

Render's free tier is the easiest place to host this.

1. Push this folder to its own GitHub repository (separate from the game).
2. Create a new Web Service on https://render.com → "New" → "Web Service"
3. Connect to the repository.
4. Configure:
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Plan:** Free (or Starter for always-on, ~$7/mo)
5. Render auto-provides the `PORT` environment variable. No other env vars
   needed.

After ~1 minute Render gives you a URL like:

    https://uy-pareho-signaling.onrender.com

This is your signaling host. Copy it.

## Point the game at this server

In the main `Memory Game/index.html`, find the `SIGNALING_HOST` constant
near the top of the inline `<script>` block. Change it from `null` to
your Render hostname (no protocol, no path):

    const SIGNALING_HOST = "uy-pareho-signaling.onrender.com";

Push to staging via `./deploy-staging.sh "use self-hosted signaling"` to
verify, then `./deploy-prod.sh` to go live.

## Free-tier note

Render's free tier sleeps the service after 15 minutes of inactivity.
The first online game of the day will see a ~30-second "creating room…"
wait while the service wakes up; subsequent ones are instant. If that's
unacceptable for your users, upgrade to Starter ($7/month) to keep it
always warm.

## Cost summary

| Plan | Cost | When to use |
|---|---|---|
| Render Free | $0/month | Hobby / pre-launch / low traffic |
| Render Starter | $7/month | Production with reliable cold-start-free signaling |

The signaling server's load is tiny even with hundreds of concurrent
games, so you'll likely never need anything beyond Starter.
