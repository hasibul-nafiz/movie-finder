# Feature 6: Share a movie

## What the user does

On the details screen, taps "Share". The Android share sheet opens with the movie title
and its TMDB link, so it can be sent to WhatsApp, a message, email, or anything else
installed. Choosing nothing and swiping the sheet away changes nothing.

## Where it lives

`handleSharePress` in `src/app/movie/[id].tsx`.

## How it works

`Share` from `react-native`, so no extra package is needed:

```
await Share.share({
  message: `${details.title} - https://www.themoviedb.org/movie/${details.id}`,
});
```

This is the native feature of the app. The message is plain text, which every Android
share target accepts. The link points at the public TMDB page for the movie, so whoever
receives it can open it without the app.

The call sits in `try/catch`; a failure shows the short error message, like every other
failure in the app.

## Done when

The share sheet opens on a real phone, the shared text contains the title and a working
TMDB link, and dismissing the sheet does not break the screen.
