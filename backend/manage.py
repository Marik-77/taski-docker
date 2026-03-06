#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
# flake8: noqa: I001,I005
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import \
            execute_from_command_line  # noqa: BLK100,E501,I001,I005
    except ImportError as exc:  # noqa: I005
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
