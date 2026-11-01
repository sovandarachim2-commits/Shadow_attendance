# Phase: Telegram Login Security Notifications

Implement Telegram notifications for successful and failed login attempts in Shadow HR.

## 1. Successful Login
- Send a Telegram notification after the backend confirms successful authentication.
- Include employee name, username, role, IP address, device/browser, and timestamp.

## 2. Failed Login
- Send a Telegram notification when authentication fails.
- Include the submitted username (never the password), IP address, device/browser, failure reason, and timestamp.
- Handle unknown usernames without exposing whether an account exists.

## 3. Backend Security
- Implement notifications in the backend authentication flow.
- Never send passwords, tokens, cookies, or sensitive authentication data.
- Record events in the backend audit log.
- Apply rate limiting and notification throttling to prevent spam.
- Use asynchronous/background delivery where supported.
- Failed Telegram delivery must never block or break login.
- Log notification failures and retry safely.

## 4. Telegram Configuration
- Use environment variables for the Telegram bot token and security group chat ID.
- Never expose bot credentials in React/Vite frontend code.
- Provide a secure configuration and connection test for Super Admin.

## 5. Permissions
- Only Super Admin can configure Telegram security notification settings.
- Do not expose bot tokens or chat IDs to ordinary users.

## 6. Testing
- Test successful login.
- Test incorrect password.
- Test unknown username.
- Test repeated failed attempts and notification throttling.
- Test Telegram API failure.
- Confirm login continues working when Telegram is unavailable.

## Important
First inspect the existing Shadow HR authentication flow, backend framework, Telegram integration, and audit logging. Reuse existing infrastructure where possible. Do not create a second authentication system or break existing login behavior.