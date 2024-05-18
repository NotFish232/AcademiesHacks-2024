from django.db import models


class Scene(models.Model):
    filename = models.CharField(max_length=128) # type: ignore
    content = models.BinaryField() # type: ignore
    time = models.DateTimeField(auto_now_add=True, blank=True) # type: ignore
