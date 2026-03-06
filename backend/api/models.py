"""Defines the Task model."""

from django.db import models


class Task(models.Model):
    """A task with title, description, and completion status."""

    title = models.CharField(
        verbose_name="Заголовок", max_length=120
    )  # noqa: BLK100,E501
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        """Return the task title."""
        return self.title
