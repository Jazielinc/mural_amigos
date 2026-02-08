# Mural Amigos

Mural Amigos is a social media application that allows users to share their thoughts, images, videos, and links with others. It provides a platform for users to connect, interact, and engage through posts and comments.

## Features

- **User Authentication**: Secure user registration and login system.
- **Profiles**: Each user has a profile with an avatar and a bio. Profiles are automatically created upon registration.
- **Posts**: Users can create posts with various content types:
    - Text
    - Images
    - Videos
    - External Links
- **Comments**: Users can comment on posts to engage in discussions.
- **Feed**: A main feed displaying posts from all users, ordered by creation date.

## Technologies Used

- **Backend**:
    - [Django](https://www.djangoproject.com/)
    - [Django REST Framework](https://www.django-rest-framework.org/)
    - SQLite (Default database)

- **Frontend**:
    - [React](https://reactjs.org/)
    - [Vite](https://vitejs.dev/)

## Getting Started

### Backend Setup

1.  **Navigate to the root directory.**
2.  **Create a virtual environment (optional but recommended):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    (Make sure you have the required packages installed. Since there is no requirements.txt, you might need to install them manually based on imports: `django`, `djangorestframework`, `pillow`, `django-cors-headers`)
    ```bash
    pip install django djangorestframework pillow django-cors-headers
    ```
4.  **Run migrations:**
    ```bash
    python3 manage.py migrate
    ```
5.  **Start the server:**
    ```bash
    python3 manage.py runserver
    ```
    The backend API will be available at `http://localhost:8000/`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173/` (or the port specified by Vite).

## Testing

To run the backend unit tests:

```bash
python3 manage.py test mural
```
