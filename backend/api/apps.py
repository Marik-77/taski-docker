"""Application configuration for the API app."""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    """Configuration for the API application."""

    default_auto_field = "django.db.models.BigAutoField"  # noqa: BLK100
    name = "api"
