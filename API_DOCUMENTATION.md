# API Documentation

Base URL:

```text
http://localhost:5000/api
```

Protected admin routes require:

```http
Authorization: Bearer <jwt_token>
```

## Health

### GET `/health`

Returns API status.

## Auth

### POST `/auth/register`

Registers an admin.

Body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### POST `/auth/login`

Logs in an admin and returns a JWT.

Body:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### GET `/auth/me`

Returns the authenticated admin profile.

## Blogs

### GET `/blogs`

Returns all blogs, latest first.

Optional query:

```text
?search=keyword
```

### GET `/blogs/:id`

Returns one blog by MongoDB ID.

### POST `/blogs`

Protected. Creates a blog.

Content type: `multipart/form-data`

Fields:

```text
title: string
description: string
mediaType: none | image | gif | video | external
mediaUrl: required for gif, video, external
image: file, used when mediaType is image
```

### PUT `/blogs/:id`

Protected. Updates a blog.

Content type: `multipart/form-data`

Fields are the same as create.

### DELETE `/blogs/:id`

Protected. Deletes a blog.

## Likes

### POST `/blogs/:id/like`

Likes or unlikes a blog.

Body:

```json
{
  "liked": true
}
```

Use `"liked": false` to unlike.

## Comments

### POST `/blogs/:id/comment`

Adds a public comment.

Body:

```json
{
  "username": "Reader",
  "comment": "Great post."
}
```

### DELETE `/blogs/:id/comment/:commentId`

Deletes a comment.

## Response Shape

Successful responses include `success: true`.

Errors use:

```json
{
  "success": false,
  "message": "Validation or server error message"
}
```
