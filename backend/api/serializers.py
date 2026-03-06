"""Serializers for API models."""

from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model."""

    class Meta:
        """Serializer metadata."""

        model = Task  # noqa: BLK100
        fields = ("id", "title", "description", "completed")
