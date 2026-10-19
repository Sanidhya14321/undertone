'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const dark = mounted && resolvedTheme === 'dark';
  const label = mounted ? `Switch to ${dark ? 'light' : 'dark'} mode` : 'Change color theme';
  return <button type="button" className="theme-toggle" aria-label={label} title={label} disabled={!mounted} onClick={() => setTheme(dark ? 'light' : 'dark')}>
    {dark ? <Sun size={17} aria-hidden="true"/> : <Moon size={17} aria-hidden="true"/>}
  </button>;
}
