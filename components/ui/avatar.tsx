'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />
  )
) as React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & React.RefAttributes<HTMLDivElement>>;
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
  )
) as React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & React.RefAttributes<HTMLImageElement>>;
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback ref={ref} className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)} {...props} />
  )
) as React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & React.RefAttributes<HTMLDivElement>>;
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;
