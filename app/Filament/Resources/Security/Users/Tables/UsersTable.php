<?php

declare(strict_types=1);

namespace App\Filament\Resources\Security\Users\Tables;

use App\Models\Security\User;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Config;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar_path')
                    ->label('Avatar')
                    ->circular()
                    ->disk(Config::string('avatars.disk'))
                    ->defaultImageUrl(fn (User $record): string => $record->avatar_url),

                TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->label('Email Address')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Date Created')
                    ->isoDateTime('lll')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('email_verified')
                    ->label('Verification Status')
                    ->options([
                        'verified' => 'Verified',
                        'unverified' => 'Not Verified',
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query->when(
                        $data['value'] === 'verified',
                        fn (Builder $query): Builder => $query->whereNotNull('email_verified_at'),
                    )->when(
                        $data['value'] === 'unverified',
                        fn (Builder $query): Builder => $query->whereNull('email_verified_at'),
                    )),

                Filter::make('created_at')
                    ->label('Registration Date')
                    ->schema([
                        DatePicker::make('created_from')
                            ->label('From'),
                        DatePicker::make('created_until')
                            ->label('Until'),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when(
                            $data['created_from'],
                            fn (Builder $query, mixed $date): Builder => is_string($date)
                                ? $query->whereDate('created_at', '>=', $date)
                                : $query,
                        )
                        ->when(
                            $data['created_until'],
                            fn (Builder $query, mixed $date): Builder => is_string($date)
                                ? $query->whereDate('created_at', '<=', $date)
                                : $query,
                        )),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
