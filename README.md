# IP-HCK81

## Overview

This project is a game management platform where users can browse games, manage wishlists, and get AI-based game recommendations. The backend is built with Node.js, Express, and Sequelize, while the frontend is built with React and Redux.

---

## API Endpoints

### User Endpoints

#### POST `/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `201 Created`:
    ```json
    {
      "username": "string",
      "email": "string"
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: Missing or invalid fields.
  - `500 Internal Server Error`: Server error.

#### POST `/login`
- **Description**: Login a user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK`:
    ```json
    {
      "token": "string"
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: Missing fields.
  - `401 Unauthorized`: Invalid username or password.
  - `500 Internal Server Error`: Server error.

#### GET `/user`
- **Description**: Get user details.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`:
    ```json
    {
      "id": "number",
      "username": "string"
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Missing or invalid token.

#### POST `/user/addPreferences`
- **Description**: Update user preferences.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "preferedCategory": "string",
    "hatedCategory": "string"
  }
  ```
- **Response**:
  - `200 OK`:
    ```json
    {
      "message": "User preference has been updated!"
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: Missing or invalid preferences.
  - `500 Internal Server Error`: Server error.

#### DELETE `/user/delete`
- **Description**: Delete user account.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`:
    ```json
    {
      "message": "Account has been deleted!"
    }
    ```
- **Error Responses**:
  - `500 Internal Server Error`: Server error.

---

### Game Endpoints

#### GET `/games`
- **Description**: Get all games.
- **Response**:
  - `200 OK`:
    ```json
    {
      "rows": [
        {
          "id": "number",
          "name": "string",
          "description": "string"
        }
      ],
      "count": "number"
    }
    ```
- **Error Responses**:
  - `500 Internal Server Error`: Server error.

#### GET `/games/:gameId`
- **Description**: Get detailed game by ID.
- **Response**:
  - `200 OK`:
    ```json
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "wishlist": [
        {
          "id": "number",
          "userId": "number",
          "comment": "string",
          "rating": "number",
          "user": {
            "username": "string"
          }
        }
      ]
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Game not found.
  - `500 Internal Server Error`: Server error.

#### GET `/public/games`
- **Description**: Get public games with filters.
- **Query Parameters**:
  - `page`: Page number (optional).
  - `search`: Search term (optional).
  - `sort`: Sort field (optional).
  - `order`: Sort order (asc/desc) (optional).
  - `filter`: Filter by category (optional).
- **Response**:
  - `200 OK`:
    ```json
    {
      "rows": [
        {
          "id": "number",
          "name": "string",
          "description": "string"
        }
      ],
      "count": "number",
      "page": "number",
      "limit": "number",
      "length": "number"
    }
    ```
- **Error Responses**:
  - `500 Internal Server Error`: Server error.

#### POST `/recommendation`
- **Description**: Get AI-based game recommendations.
- **Request Body**:
  ```json
  {
    "genre": "string",
    "degenre": "string"
  }
  ```
- **Response**:
  - `200 OK`:
    ```json
    {
      "games": [
        {
          "id": "number",
          "name": "string"
        }
      ],
      "comment": "string"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: No games available for recommendations.
  - `400 Bad Request`: AI failed to generate recommendations.
  - `500 Internal Server Error`: Server error.

---

### Wishlist Endpoints

#### GET `/wishlist`
- **Description**: Get all wishlist items.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`:
    ```json
    [
      {
        "id": "number",
        "userId": "number",
        "gameId": "number",
        "status": "string"
      }
    ]
    ```
- **Error Responses**:
  - `500 Internal Server Error`: Server error.

#### POST `/games/:gameId/wishlist`
- **Description**: Add a game to the wishlist.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `201 Created`:
    ```json
    {
      "message": "Game added to wishlist!"
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: Invalid game ID.
  - `500 Internal Server Error`: Server error.

#### DELETE `/games/:gameId/wishlist`
- **Description**: Remove a game from the wishlist.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`:
    ```json
    {
      "message": "Game removed from wishlist!"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Wishlist item not found.
  - `500 Internal Server Error`: Server error.

#### PATCH `/wishlist/:wishlistId/bought`
- **Description**: Mark a wishlist item as bought.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`:
    ```json
    {
      "message": "Wishlist item marked as bought!"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Wishlist item not found.
  - `500 Internal Server Error`: Server error.

#### POST `/games/:gameId/comment`
- **Description**: Add a comment to a wishlist item.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "comment": "string",
    "rating": "number"
  }
  ```
- **Response**:
  - `200 OK`:
    ```json
    {
      "message": "Comment added to wishlist item!"
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: Invalid comment or rating.
  - `500 Internal Server Error`: Server error.

#### GET `/games/:gameId/comment`
- **Description**: Get a comment for a wishlist item.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`:
    ```json
    {
      "comment": "string",
      "rating": "number"
    }
    ```
- **Error Responses**:
  - `500 Internal Server Error`: Server error.

