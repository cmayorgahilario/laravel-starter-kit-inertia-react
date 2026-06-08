<?php

declare(strict_types=1);

namespace App\Models\Security;

use Illuminate\Database\Eloquent\Attributes\Table;
use Laravel\Passkeys\Passkey as BasePasskey;

#[Table('security_passkeys')]
class Passkey extends BasePasskey {}
