---
title: Fortify actions
description: The security actions Fortify delegates to, under app/Actions/Security.
---

# Fortify actions

## Overview

Fortify delegates the write operations (create user, update profile, change/reset password) to **action
classes**. They live under `app/Actions/Security/` and implement the `Laravel\Fortify\Contracts`
interfaces. The bindings are registered in `App\Providers\FortifyServiceProvider`.

This is where to change validation rules or the side effects of each auth operation.

## Action catalog

| Action                         | Interface                       | Responsibility                                                             |
| ------------------------------ | ------------------------------- | -------------------------------------------------------------------------- |
| `CreateNewUser`                | `CreatesNewUsers`               | Validate and create a `User` (name, unique email, password).               |
| `UpdateUserProfileInformation` | `UpdatesUserProfileInformation` | Update name/email/photo; re-trigger verification if the email changes.     |
| `UpdateUserPassword`           | `UpdatesUserPasswords`          | Change password (requires current password).                               |
| `ResetUserPassword`            | `ResetsUserPasswords`           | Set a new password in the reset flow.                                      |
| `PasswordValidationRules`      | (trait)                         | Shared password rules: required, string, `Password::default()`, confirmed. |

## Worked example

`PasswordValidationRules` is a trait reused by the three password-touching actions, so the password
policy lives in one place:

```text
app/Actions/Security/PasswordValidationRules.php
app/Actions/Security/CreateNewUser.php        // uses passwordRules()
app/Actions/Security/UpdateUserPassword.php   // uses passwordRules()
app/Actions/Security/ResetUserPassword.php    // uses passwordRules()
```

**Key points:**

- Changing the password policy (length, complexity) is a single edit in `PasswordValidationRules`.
- `UpdateUserProfileInformation` marks the user unverified and sends a verification notification when
  the email changes — do not duplicate that logic elsewhere.

## What NOT to do

- Do not validate or persist auth data directly in controllers; route it through these actions so
  Fortify and the UCP stay consistent.
- Do not hardcode password rules per action; extend the shared `PasswordValidationRules` trait.
