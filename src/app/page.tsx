'use client';

import FileUpload from '@/components/FileUpload';
import Status from '@/components/Status';
import { Container, Flex, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

type Status = 'ACTIVE' | 'INACTIVE' | '';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<Status>('');

  // Keep polling the backend with an increasing interval until data.message is ACTIVE
  useEffect(() => {
    let intervalTime = 1000; // Start with 1 second
    const pollBackend = () => {
      fetch('/api/pdf')
        .then((res) => {
          if (res.ok) {
            setBackendStatus('ACTIVE');
          } else {
            // Double the interval time if not ACTIVE
            intervalTime *= 2;
            setTimeout(pollBackend, intervalTime);
          }
        })
        .catch((error) => {
          setBackendStatus('INACTIVE');
          console.error('Error polling backend:', error);
        });
    };
    setTimeout(pollBackend, intervalTime);
    // No cleanup function needed as we clear the timeout after 'ACTIVE' is received
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-between p-24">
      <Container size={'4'}>
        <Flex direction={'column'} pb={'4'} gap={'4'} align={'center'}>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Fit &apos;N Place
          </h1>
          <Text className="pb-2" color="gray">
            Upload your PDF to generate a layout.
          </Text>
          <Status request={backendStatus} />
          <FileUpload />
        </Flex>
      </Container>
    </main>
  );
}
