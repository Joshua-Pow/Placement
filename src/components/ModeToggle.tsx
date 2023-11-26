'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Switch } from '@nextui-org/react';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Switch
      defaultSelected
      size="lg"
      //color="secondary"
      onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <MoonIcon className={className + ' p-0.5'} />
        ) : (
          <SunIcon className={className + ' p-0.5'} />
        )
      }
    />
  );
}
