-- Reads aggregate metrics by day; retention deletes by day alone, which the [type, day] index
-- cannot serve. Login-attempt cleanup deletes by `at` alone, which [key, at] cannot serve.
CREATE INDEX "metrics_day_idx" ON "metrics"("day");
CREATE INDEX "admin_login_attempts_at_idx" ON "admin_login_attempts"("at");
