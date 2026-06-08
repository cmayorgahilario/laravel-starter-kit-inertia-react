<?php

declare(strict_types=1);

namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use App\Support\Security\UserAgent;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Connection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BrowserSessionsController extends Controller
{
    /**
     * Show the user's active browser sessions.
     */
    public function index(Request $request): Response
    {
        abort_unless(Config::string('session.driver') === 'database', 404);

        return Inertia::render('ucp/sessions', [
            'sessions' => $this->sessions($request),
        ]);
    }

    /**
     * Log the user out of every other browser session.
     *
     * @throws AuthenticationException
     */
    public function destroyOthers(Request $request): RedirectResponse
    {
        $request->validateWithBag('logoutOtherBrowserSessions', [
            'password' => ['required', 'current_password:web'],
        ]);

        Auth::logoutOtherDevices($request->string('password')->value());

        if (Config::string('session.driver') === 'database') {
            $this->connection()
                ->table($this->table())
                ->where('user_id', $request->user()?->getAuthIdentifier())
                ->where('id', '!=', $request->session()->getId())
                ->delete();
        }

        return back(303)->with('toast', [
            'type' => 'success',
            'message' => __('Se cerraron las demás sesiones.'),
        ]);
    }

    /**
     * Map the current user's session rows into view models.
     *
     * @return array<int, array<string, mixed>>
     */
    private function sessions(Request $request): array
    {
        $currentId = $request->session()->getId();

        return $this->connection()
            ->table($this->table())
            ->where('user_id', $request->user()?->getAuthIdentifier())
            ->orderByDesc('last_activity')
            ->get()
            ->map(function (object $session) use ($currentId): array {
                /** @var object{id: string, ip_address: string|null, user_agent: string|null, last_activity: int} $session */
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'is_current_device' => $session->id === $currentId,
                    'last_active' => Date::createFromTimestamp($session->last_activity)->diffForHumans(),
                    ...UserAgent::parse($session->user_agent ?? '')->toArray(),
                ];
            })
            ->all();
    }

    /**
     * Resolve the database connection backing the session store.
     */
    private function connection(): Connection
    {
        $name = config('session.connection');

        return DB::connection(is_string($name) ? $name : null);
    }

    /**
     * The table backing the database session store.
     */
    private function table(): string
    {
        $table = config('session.table');

        return is_string($table) ? $table : 'sessions';
    }
}
