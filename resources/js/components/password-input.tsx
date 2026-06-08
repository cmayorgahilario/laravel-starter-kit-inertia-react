import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import type { ComponentProps } from 'react';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

type PasswordInputProps = Omit<ComponentProps<typeof InputGroupInput>, 'type'>;

export function PasswordInput(props: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <InputGroup>
            <InputGroupInput type={visible ? 'text' : 'password'} {...props} />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    size="icon-xs"
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    onClick={() => setVisible((value) => !value)}
                >
                    {visible ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}
