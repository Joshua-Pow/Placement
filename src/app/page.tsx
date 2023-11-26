'use client';

import FileUpload from '@/components/FileUpload';
import Status from '@/components/Status';
import { Container, Flex, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [backendRequest, setBackendRequest] = useState('');

  //Make a request to the api at the /pdf endpoint
  useEffect(() => {
    fetch('/api/pdf')
      .then((res) => res.json())
      .then((data) => setBackendRequest(data.message));
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
          <Status request={backendRequest ? 'ACTIVE' : ''} />
          <FileUpload />
        </Flex>
      </Container>
    </main>
  );
}
