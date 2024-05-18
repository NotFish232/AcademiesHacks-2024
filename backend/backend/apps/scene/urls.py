from django.urls import path
from .views import create_view, list_view, file_view

urlpatterns = [path("create", create_view), path("list", list_view), path("file", file_view)]
