'use client';

import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [backendRequest, setBackendRequest] = useState(null);

  //Make a request to the api at the /pdf endpoint
  useEffect(() => {
    fetch('/api/pdf/')
      .then((res) => res.json())
      .then((data) => setBackendRequest(data));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container size={'1'}>
        <Flex direction={'column'} pb={'4'}>
          <Heading>Placement</Heading>
          <Text color="gray">You can upload your PDF here.</Text>
          <Text color="gray">
            PDF: {backendRequest?.message ?? '...loading'}
          </Text>
          <Link href="/api/pdf">
            <code className="font-mono font-bold">api/pdf.py</code>
          </Link>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" />
          </div>
        </Flex>
      </Container>
    </main>
  );
}
