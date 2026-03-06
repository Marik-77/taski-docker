"""Admin configuration for the Task model."""

from django.contrib import admin

from .models import Task


class TaskAdmin(admin.ModelAdmin):
    """Admin class for Task."""

    list_display = ("title", "description", "completed")  # noqa: BLK100


admin.site.register(Task, TaskAdmin)
