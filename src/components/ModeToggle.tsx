import * as React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Switch } from '@nextui-org/react';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Switch
      size="lg"
      isSelected={theme === 'dark'}
      onValueChange={(checked) => {
        setTheme(checked ? 'dark' : 'light');
      }}
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
