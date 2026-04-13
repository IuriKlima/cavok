package br.com.cavokavionics.api.security;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class RateLimitingService {

    private final Map<String, LoginAttempt> attemptsCache = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final long BLOCK_DURATION_MS = TimeUnit.MINUTES.toMillis(15);

    public boolean isBlocked(String ipAddress) {
        LoginAttempt attempt = attemptsCache.get(ipAddress);
        if (attempt == null) {
            return false;
        }
        if (attempt.attempts >= MAX_ATTEMPTS) {
            if (System.currentTimeMillis() - attempt.lastAttemptTime < BLOCK_DURATION_MS) {
                return true;
            } else {
                attemptsCache.remove(ipAddress);
                return false;
            }
        }
        return false;
    }

    public void registerFailedAttempt(String ipAddress) {
        attemptsCache.compute(ipAddress, (key, attempt) -> {
            if (attempt == null) {
                attempt = new LoginAttempt();
            }
            attempt.attempts++;
            attempt.lastAttemptTime = System.currentTimeMillis();
            return attempt;
        });
    }

    public void resetAttempts(String ipAddress) {
        attemptsCache.remove(ipAddress);
    }

    private static class LoginAttempt {
        int attempts = 0;
        long lastAttemptTime = 0;
    }
}
