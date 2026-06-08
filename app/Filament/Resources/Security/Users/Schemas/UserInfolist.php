<?php

declare(strict_types=1);

namespace App\Filament\Resources\Security\Users\Schemas;

use App\Models\Security\User;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Flex;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Config;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Group::make()
                    ->schema([
                        Section::make()
                            ->schema([
                                Flex::make([
                                    Group::make([
                                        TextEntry::make('name')
                                            ->label('Name'),
                                        TextEntry::make('email')
                                            ->label('Email Address')
                                            ->copyable(),
                                    ]),
                                    ImageEntry::make('avatar_path')
                                        ->label('Avatar')
                                        ->hiddenLabel()
                                        ->circular()
                                        ->disk(Config::string('avatars.disk'))
                                        ->defaultImageUrl(fn (User $record): string => $record->avatar_url)
                                        ->grow(false),
                                ])->from('lg'),
                            ]),

                        Section::make()
                            ->schema([
                                TextEntry::make('email_verified_at')
                                    ->label('Email Verified')
                                    ->badge()
                                    ->state(fn (User $record): string => $record->email_verified_at ? 'Verified' : 'Not Verified')
                                    ->color(fn (User $record): string => $record->email_verified_at ? 'success' : 'primary'),
                            ]),
                    ])
                    ->columnSpan(fn (?User $record): array => ['lg' => is_null($record) ? 4 : 3]),

                Group::make()
                    ->schema([
                        Section::make()
                            ->schema([
                                TextEntry::make('created_at')
                                    ->label('Date Created')
                                    ->isoDateTime('lll'),

                                TextEntry::make('updated_at')
                                    ->label('Last Modified')
                                    ->isoDateTime('lll'),
                            ]),
                    ])
                    ->hidden(fn (?User $record): bool => is_null($record)),
            ])
            ->columns(4);
    }
}
