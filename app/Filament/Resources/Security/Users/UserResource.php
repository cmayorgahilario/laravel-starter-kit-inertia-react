<?php

declare(strict_types=1);

namespace App\Filament\Resources\Security\Users;

use App\Filament\Resources\Security\Users\Pages\CreateUser;
use App\Filament\Resources\Security\Users\Pages\EditUser;
use App\Filament\Resources\Security\Users\Pages\ListUsers;
use App\Filament\Resources\Security\Users\Pages\ViewUser;
use App\Filament\Resources\Security\Users\Schemas\UserForm;
use App\Filament\Resources\Security\Users\Schemas\UserInfolist;
use App\Filament\Resources\Security\Users\Tables\UsersTable;
use App\Models\Security\User;
use BackedEnum;
use CodeWithDennis\FilamentLucideIcons\Enums\LucideIcon;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $slug = 'security/users';

    protected static string|null|UnitEnum $navigationGroup = 'Security';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string|BackedEnum|null $navigationIcon = LucideIcon::Users;

    protected static ?int $navigationSort = 0;

    public static function form(Schema $schema): Schema
    {
        return UserForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return UserInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UsersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'view' => ViewUser::route('/{record}'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
