from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Post, Comment

class MuralTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')

        self.post1 = Post.objects.create(autor=self.user1, titulo='Post 1', contenido_texto='Contenido 1')

    def test_create_comment(self):
        self.client.force_authenticate(user=self.user2)
        data = {'post': self.post1.id, 'texto': 'Comentario de prueba'}
        response = self.client.post('/api/comments/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.get().autor, self.user2)

    def test_delete_post_author(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(f'/api/posts/{self.post1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_delete_post_non_author(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(f'/api/posts/{self.post1.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Post.objects.count(), 1)

    def test_comments_in_post_detail(self):
        Comment.objects.create(post=self.post1, autor=self.user2, texto='Comentario 1')

        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f'/api/posts/{self.post1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('comentarios', response.data)
        self.assertEqual(len(response.data['comentarios']), 1)
        self.assertEqual(response.data['comentarios'][0]['texto'], 'Comentario 1')

    def test_delete_comment_author(self):
        comment = Comment.objects.create(post=self.post1, autor=self.user2, texto='Comentario 1')
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(f'/api/comments/{comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 0)

    def test_delete_comment_non_author(self):
        """Ensure a user cannot delete a comment they did not author."""
        comment = Comment.objects.create(post=self.post1, autor=self.user2, texto='Comentario 1')
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(f'/api/comments/{comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Comment.objects.count(), 1)
