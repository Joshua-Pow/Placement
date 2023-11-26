import React from 'react';
import { Badge } from './ui/badge';

type Props = { children: React.ReactNode; href: string };

const LanguageBadge = ({ children, href }: Props) => {
  return (
    <Badge variant="outline">
      <a href={href}>
        <span className="max-w-fit flex gap-1 flex-wrap items-center text-center">
          {children}
        </span>
      </a>
    </Badge>
  );
};

export default LanguageBadge;
