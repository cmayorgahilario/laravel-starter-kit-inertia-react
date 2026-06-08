<x-filament-widgets::widget class="fi-account-widget">
    <x-filament::section>
        <div class="fi-account-widget-main">
            <h2 class="fi-account-widget-heading">Back to app</h2>

            <p class="fi-account-widget-user-name">Return to the main app.</p>
        </div>

        <div class="fi-account-widget-logout-form">
            <x-filament::button tag="a" :href="$url" :icon="$icon" color="gray"> Go to app </x-filament::button>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
