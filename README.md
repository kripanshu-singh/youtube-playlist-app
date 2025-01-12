# YouTube Playlist Data Retriever

A Next.js application to fetch and display playlists and their contents from a YouTube channel using the YouTube Data API v3. This app features authentication via Google, making it easy to access user-specific playlists.

## Features

- Google Sign-In for user authentication.
- Fetch and display YouTube playlists owned by the authenticated user.
- Display enriched playlist information, including video count and privacy status.
- Secure token management using `next-auth`.
- Responsive and visually appealing design.

## Tech Stack

- **Next.js**: Framework for building React-based web applications.
- **TypeScript**: Strongly typed programming language for type safety.
- **next-auth**: Authentication library for managing user sessions.
- **YouTube Data API v3**: API to fetch YouTube playlists and videos.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Google OAuth**: Authentication provider for secure sign-ins.

## Project Structure

```bash
|-- src
|   |-- app
|       |-- api
|           |-- auth
|               |-- [...nextauth]
|                   |-- route.ts       # NextAuth configuration
|           |-- playlists
|               |-- route.ts          # API to fetch YouTube playlists
|   |-- components                    # Reusable UI components
|   |-- pages                         # Page-level components
|-- public                            # Static assets
|-- styles                            # Global and custom CSS
```

## Key Files

### `src/app/api/auth/[...nextauth]/route.ts`

Handles Google authentication and session management using `next-auth`.

### `src/app/api/playlists/route.ts`

Fetches YouTube playlists and enriches them with additional details like video count and privacy status.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [next-auth Documentation](https://next-auth.js.org/getting-started/introduction)

---

Feel free to contribute by submitting issues or pull requests!
