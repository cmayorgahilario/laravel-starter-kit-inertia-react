<?php

declare(strict_types=1);

namespace App\Models\Security;

use Illuminate\Database\Eloquent\Attributes\Table;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

#[Table('security_personal_access_tokens')]
class PersonalAccessToken extends SanctumPersonalAccessToken {}
