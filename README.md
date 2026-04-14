# YogPilot

YogPilot is a simple full-stack AI chat web application built with Node.js, Express, and the OpenAI API.

## Folder Structure

```text
yogpilot/
|-- public/
|   |-- index.html
|   |-- style.css
|   `-- script.js
|-- .env.example
|-- .gitignore
|-- package.json
|-- README.md
`-- server.js
```

## Features

- Clean modern chat interface
- User and AI messages
- Loading indicator while waiting
- Mobile responsive layout
- Express backend with `POST /ask-ai`
- OpenAI API key stored only on the server
- Simple error handling and console logs

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file and copy this:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-5.2
   PORT=3000
   ```

3. Start the app:

   ```bash
   node server.js
   ```

4. Open your browser and visit:

   ```text
   http://localhost:3000
   ```

## API

### `POST /ask-ai`

Request body:

```json
{
  "message": "What is artificial intelligence?"
}
```

Response body:

```json
{
  "reply": "Artificial intelligence is..."
}
```

## Notes

- The app uses the official OpenAI Node SDK on the backend.
- The frontend never sees the API key.
- If the API key is missing or invalid, the server returns a friendly error message.
