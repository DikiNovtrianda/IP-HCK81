# IP-HCK81

## Overview

This project is a game management platform where users can browse games, manage wishlists, and get AI-based game recommendations. The backend is built with Node.js, Express, and Sequelize, while the frontend is built with React and Redux.

---

## API Endpoints

### **Authentication**

#### 1. **Login**
   - **POST** `/login`
   - **Description**: Logs in a user and returns a token.
   - **Request Body**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "token": "string"
     }
     ```

#### 2. **Register**
   - **POST** `/register`
   - **Description**: Registers a new user.
   - **Request Body**:
     ```json
     {
       "username": "string",
       "email": "string",
       "password": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "username": "string",
       "email": "string"
     }
     ```

#### 3. **Google Login**
   - **POST** `/google-login`
   - **Description**: Logs in a user using Google OAuth.
   - **Request Body**:
     ```json
     {
       "googleToken": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "token": "string"
     }
     ```

---

### **User**

#### 1. **Get User**
   - **GET** `/user`
   - **Description**: Retrieves the logged-in user's basic details.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "id": "integer",
       "username": "string"
     }
     ```

#### 2. **Get User Details**
   - **GET** `/user/detail`
   - **Description**: Retrieves detailed information about the logged-in user.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "id": "integer",
       "username": "string",
       "email": "string",
       "preferedCategory": "string",
       "hatedCategory": "string"
     }
     ```

#### 3. **Update User Preferences**
   - **POST** `/user/addPreferences`
   - **Description**: Updates the user's preferred and hated game categories.
   - **Headers**: `Authorization: Bearer <token>`
   - **Request Body**:
     ```json
     {
       "preferedCategory": "string",
       "hatedCategory": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User preference has been updated!"
     }
     ```

#### 4. **Delete User**
   - **DELETE** `/user/delete`
   - **Description**: Deletes the logged-in user's account.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "message": "Account has been deleted!"
     }
     ```

---

### **Games**

#### 1. **Get All Games**
   - **GET** `/games`
   - **Description**: Retrieves all games.
   - **Response**:
     ```json
     {
       "count": "integer",
       "rows": [ ... ]
     }
     ```

#### 2. **Get Public Games**
   - **GET** `/public/games`
   - **Description**: Retrieves paginated and filtered games.
   - **Query Parameters**:
     - `page`: Page number (optional)
     - `search`: Search term (optional)
     - `sort`: Sorting field (optional)
     - `order`: Sorting order (asc/desc) (optional)
     - `filter`: Genre filter (optional)
   - **Response**:
     ```json
     {
       "count": "integer",
       "rows": [ ... ]
     }
     ```

#### 3. **Get Game Details**
   - **GET** `/games/:gameId`
   - **Description**: Retrieves detailed information about a specific game.
   - **Response**:
     ```json
     {
       "id": "integer",
       "name": "string",
       "description": "string",
       "Wishlists": [ ... ]
     }
     ```

#### 4. **AI Recommendation**
   - **POST** `/recommendation`
   - **Description**: Retrieves AI-based game recommendations based on user preferences.
   - **Headers**: `Authorization: Bearer <token>`
   - **Request Body**:
     ```json
     {
       "preferedCategory": "string",
       "hatedCategory": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "games": [ ... ],
       "comment": "string"
     }
     ```

---

### **Wishlist**

#### 1. **Get Wishlist**
   - **GET** `/wishlist`
   - **Description**: Retrieves the logged-in user's wishlist.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     [ ... ]
     ```

#### 2. **Add to Wishlist**
   - **POST** `/games/:gameId/wishlist`
   - **Description**: Adds a game to the user's wishlist.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "message": "Wishlist created!"
     }
     ```

#### 3. **Remove from Wishlist**
   - **DELETE** `/games/:gameId/wishlist`
   - **Description**: Removes a game from the user's wishlist.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "message": "Wishlist deleted!"
     }
     ```

#### 4. **Mark as Bought**
   - **PATCH** `/wishlist/:gameId/bought`
   - **Description**: Marks a game in the wishlist as bought.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "message": "Game library added!"
     }
     ```

#### 5. **Get Wishlist Comment**
   - **GET** `/games/:gameId/comment`
   - **Description**: Retrieves the user's comment for a specific game in the wishlist.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "comment": "string",
       "rating": "integer"
     }
     ```

#### 6. **Add Comment**
   - **POST** `/games/:gameId/comment`
   - **Description**: Adds a comment and rating for a game in the wishlist.
   - **Headers**: `Authorization: Bearer <token>`
   - **Request Body**:
     ```json
     {
       "comment": "string",
       "rating": "integer"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Comment added!"
     }
     ```

---

## Environment Variables

The following environment variables are required:

- `JWT_SECRET`: Secret key for JWT.
- `PORT`: Port number for the server.
- `GIANTBOMB_API_KEY`: API key for GiantBomb.
- `GOOGLE_CLIENT_ID`: Google OAuth client ID.
- `GEMINI_API_KEY`: API key for Google GenAI.

Refer to `.env.example` for more details.

---

## Installation

1. Clone the repository.
2. Navigate to the `server` and `client` directories and install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file in both `server` and `client` directories.
4. Run the server:
   ```bash
   npm start
   ```
5. Run the client:
   ```bash
   npm run dev
   ```

---

## Testing

Run the test suite using:
```bash
npm test
```

---

## License

This project is licensed under the MIT License.

