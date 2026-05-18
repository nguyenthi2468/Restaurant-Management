# Menu Module API Documentation

## Overview
This module provides APIs for managing menu categories and menu items in a restaurant management system.

## Base URL
```
/api
```

## Authentication
All endpoints require authentication. Include JWT token in Authorization header:
```
Authorization: Bearer <your_token>
```

## Menu Categories

### Get All Menu Categories
```
GET /menu-categories
```
- Returns: Array of active menu categories with their menu items
- Response: 
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "imageId": "string",
      "position": 0,
      "isActive": true,
      "createdAt": "date",
      "updatedAt": "date",
      "menuItems": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "price": 0,
          "imageId": "string",
          "position": 0,
          "isAvailable": true,
          "isVegetarian": false,
          "isVegan": false,
          "isGlutenFree": false,
          "isSpicy": false,
          "preparationTime": 0,
          "createdAt": "date",
          "updatedAt": "date",
          "ingredients": [],
          "options": []
        }
      ]
    }
  ]
  ```

### Get Menu Category by ID
```
GET /menu-categories/:id
```
- Parameters: 
  - `id`: Menu category ID
- Returns: Single menu category with its menu items
- Response: Same structure as above but single object

### Create Menu Category
```
POST /menu-categories
```
- Requires Role: admin, manager
- Body:
  ```json
  {
    "name": "string (required)",
    "description": "string (optional)",
    "imageId": "string (optional)",
    "position": "number (optional, default: 0)",
    "isActive": "boolean (optional, default: true)"
  }
  ```
- Returns: Created menu category object

### Update Menu Category
```
PATCH /menu-categories/:id
```
- Requires Role: admin, manager
- Parameters:
  - `id`: Menu category ID
- Body: Same as create (all fields optional)
- Returns: Updated menu category object

### Delete Menu Category
```
DELETE /menu-categories/:id
```
- Requires Role: admin, manager
- Parameters:
  - `id`: Menu category ID
- Returns: Success message
- Note: Performs soft delete (sets isActive to false)

## Menu Items

### Get All Menu Items
```
GET /menu-items
```
- Returns: Array of available menu items with category, image, ingredients, and options
- Response:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0,
      "categoryId": "string",
      "category": {
        "id": "string",
        "name": "string"
      },
      "imageId": "string",
      "image": {
        "id": "string",
        "publicId": "string",
        "url": "string",
        "secureUrl": "string"
      },
      "position": 0,
      "isAvailable": true,
      "isVegetarian": false,
      "isVegan": false,
      "isGlutenFree": false,
      "isSpicy": false,
      "preparationTime": 0,
      "createdAt": "date",
      "updatedAt": "date",
      "ingredients": [
        {
          "id": "string",
          "ingredientName": "string",
          "quantity": 0,
          "unit": "string",
          "isAllergen": false
        }
      ],
      "options": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "group": "string",
          "isRequired": false,
          "position": 0,
          "values": [
            {
              "id": "string",
              "name": "string",
              "description": "string",
              "priceAdjustment": 0,
              "position": 0
            }
          ]
        }
      ]
    }
  ]
  ```

### Get Menu Item by ID
```
GET /menu-items/:id
```
- Parameters:
  - `id`: Menu item ID
- Returns: Single menu item with all related data
- Response: Same structure as above but single object

### Create Menu Item
```
POST /menu-items
```
- Requires Role: admin, manager
- Body (multipart/form-data):
  - `image`: File (optional) - Image upload
  - `name`: string (required)
  - `description`: string (optional)
  - `price`: number (required, minimum 0)
  - `categoryId`: string (required)
  - `position`: number (optional, default: 0)
  - `isAvailable`: boolean (optional, default: true)
  - `isVegetarian`: boolean (optional, default: false)
  - `isVegan`: boolean (optional, default: false)
  - `isGlutenFree`: boolean (optional, default: false)
  - `isSpicy`: boolean (optional, default: false)
  - `preparationTime`: number (optional, minimum 0)
  - `ingredients`: JSON array (optional)
    ```json
    [
      {
        "ingredientName": "string",
        "quantity": number,
        "unit": "string",
        "isAllergen": false
      }
    ]
    ```
  - `options`: JSON array (optional)
    ```json
    [
      {
        "name": "string",
        "description": "string",
        "group": "string",
        "isRequired": false,
        "values": [
          {
            "name": "string",
            "description": "string",
            "priceAdjustment": number
          }
        ]
      }
    ]
    ```
- Returns: Created menu item object

### Update Menu Item
```
PATCH /menu-items/:id
```
- Requires Role: admin, manager
- Parameters:
  - `id`: Menu item ID
- Body (multipart/form-data): Same as create (all fields optional)
- Returns: Updated menu item object

### Delete Menu Item
```
DELETE /menu-items/:id
```
- Requires Role: admin, manager
- Parameters:
  - `id`: Menu item ID
- Returns: Success message
- Note: Performs soft delete (sets isAvailable to false)

## Error Responses
All endpoints may return the following error responses:

- 400 Bad Request: Invalid request data
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

Error response format:
```json
{
  "statusCode": 400,
  "message": ["error message"],
  "error": "Bad Request"
}
```

## Example Usage

### Creating a Pizza Category
```bash
curl -X POST 'http://localhost:3000/menu-categories' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-H 'Content-Type: application/json' \
-d '{
  "name": "Pizza",
  "description": "Various types of pizza",
  "position": 1
}'
```

### Creating a Margherita Pizza
```bash
curl -X POST 'http://localhost:3000/menu-items' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-F 'image=@margherita.jpg' \
-F 'name=Margherita Pizza' \
-F 'description=Classic pizza with tomato, mozzarella, and basil' \
-F 'price=12.99' \
-F 'categoryId=Pizza_CATEGORY_ID' \
-F 'position=1' \
-F 'isVegetarian=true' \
-F 'ingredients=[{"ingredientName":"Tomato sauce","quantity":50,"unit":"g"},{"ingredientName":"Mozzarella cheese","quantity":100,"unit":"g"},{"ingredientName":"Fresh basil","quantity":5,"unit":"g"}]' \
-F 'options=[{"name":"Size","group":"Size","isRequired":true,"values":[{"name":"Small","priceAdjustment":0},{"name":"Medium","priceAdjustment":2},{"name":"Large","priceAdjustment":4}]}]'
```