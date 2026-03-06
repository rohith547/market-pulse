"""
Cache utility — TTL-based in-memory cache to avoid hammering APIs.
"""
import time
from functools import wraps

_cache = {}

def cached(ttl_seconds: int = 300):
    """Decorator: caches function result for ttl_seconds."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key = f"{fn.__name__}:{args}:{kwargs}"
            now = time.time()
            if key in _cache and now - _cache[key]["ts"] < ttl_seconds:
                return _cache[key]["data"]
            result = fn(*args, **kwargs)
            _cache[key] = {"data": result, "ts": now}
            return result
        return wrapper
    return decorator
