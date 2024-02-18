'use client';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react';
import { ModeToggle } from './ModeToggle';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathName = usePathname();
  console.log('pathName', pathName);
  return (
    <Navbar
      classNames={{
        item: [
          'flex',
          'relative',
          'h-full',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
      }}
    >
      <NavbarBrand>
        <Link href="/" color="foreground">
          {/* <AcmeLogo /> */}
          <span className="font-bold text-inherit">Fit &apos;N Place</span>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathName === '/features'}>
          <Link
            color={pathName === '/features' ? 'primary' : 'foreground'}
            href="/features"
          >
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === '/'}>
          <Link
            color={pathName === '/' ? 'primary' : 'foreground'}
            href="/"
            aria-current="page"
          >
            Placement
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === '/about'}>
          <Link
            color={pathName === '/about' ? 'primary' : 'foreground'}
            href="/about"
          >
            About us
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === '/tutorial'}>
          <Link
            color={pathName === '/tutorial' ? 'primary' : 'foreground'}
            href="/tutorial"
          >
            Tutorial
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ModeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
