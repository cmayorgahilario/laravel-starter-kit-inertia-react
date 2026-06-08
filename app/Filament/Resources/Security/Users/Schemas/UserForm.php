<?php

declare(strict_types=1);

namespace App\Filament\Resources\Security\Users\Schemas;

use App\Models\Security\User;
use CodeWithDennis\FilamentLucideIcons\Enums\LucideIcon;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make()
                    ->schema([
                        Section::make()
                            ->schema([
                                FileUpload::make('avatar_path')
                                    ->label('Avatar')
                                    ->avatar()
                                    ->image()
                                    ->imageEditor()
                                    ->directory(Config::string('avatars.directory'))
                                    ->disk(Config::string('avatars.disk'))
                                    ->maxSize(2048),

                                TextInput::make('name')
                                    ->label('Name')
                                    ->required()
                                    ->maxLength(255),

                                TextInput::make('email')
                                    ->label('Email Address')
                                    ->email()
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255),

                                TextInput::make('password')
                                    ->label('Password')
                                    ->password()
                                    ->revealable()
                                    ->required(fn (string $context): bool => $context === 'create')
                                    ->dehydrateStateUsing(fn (string $state) => Hash::make($state))
                                    ->dehydrated(fn (?string $state): bool => filled($state))
                                    ->minLength(8),
                            ]),
                    ])
                    ->columnSpan(fn (?User $record): array => ['lg' => is_null($record) ? 4 : 3]),

                Group::make()
                    ->schema([
                        Section::make()
                            ->schema([
                                TextEntry::make('created_at')
                                    ->label('Date Created')
                                    ->isoDateTime('lll')
                                    ->icon(LucideIcon::CalendarPlus),

                                TextEntry::make('updated_at')
                                    ->label('Last Modified')
                                    ->isoDateTime('lll')
                                    ->icon(LucideIcon::CalendarClock),
                            ]),
                    ])
                    ->hidden(fn (?User $record): bool => is_null($record)),

            ])
            ->columns(4);
    }
}
