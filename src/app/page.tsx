'use client';

import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [backendRequest, setBackendRequest] = useState('');
  const [PDF, setPDF] = useState(null);

  const onPDFChange = useCallback(
    (e: ChangeEvent) => {
      const file = e?.target?.files[0];

      if (file) {
        setPDF(file);
      } else {
        setPDF(null);
      }
    },
    [setPDF],
  );

  //Make a request to the api at the /pdf endpoint
  useEffect(() => {
    fetch('/api/pdf/')
      .then((res) => res.json())
      .then((data) => setBackendRequest(data.message));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container size={'1'}>
        <Flex direction={'column'} pb={'4'}>
          <Heading>Placement</Heading>
          <Text color="gray">You can upload your PDF here.</Text>
          <Text color="gray">
            PDF: {PDF ? PDF.name : 'Select a PDF from your computer'}
          </Text>
          <Text color="gray">{backendRequest ?? '...loading'}</Text>
          <Link href="/api/pdf">
            <code className="font-mono font-bold">api/pdf.py</code>
          </Link>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" onChange={onPDFChange} />
          </div>
        </Flex>
      </Container>
    </main>
  );
}
