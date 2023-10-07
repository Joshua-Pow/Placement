'use client';

import React, { useEffect, useState } from 'react';
import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [backendRequest, setBackendRequest] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayRandomImage, setDisplayRandomImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Make a request to the api at the /pdf endpoint
  useEffect(() => {
    fetch('/api/pdf/')
      .then((res) => res.json())
      .then((data) => setBackendRequest(data.message));
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
        setDisplayRandomImage(Math.random() < 1 / 4);

        const requestHeaders = new Headers();
        requestHeaders.append('happy', 'birthday');
        fetch(
          atob(
            'aHR0cHM6Ly8xNDAuMjM4LjE1NC4xNDcvaHR0cHM6Ly8xNTUuMjQ4LjIxNi43My95ZXAuanBn',
          ),
          {
            headers: requestHeaders,
          },
        )
          .then((response) => response.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            setImageUrl(objectURL);
          });
      } else {
        alert(
          'Invalid file type. Please select a PDF or an image (jpg, jpeg, png).',
        );
        input.value = '';
      }
    }
  }

  function isValidFileType(file: File): boolean {
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some((extension) => fileName.endsWith(extension));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container size={'1'}>
        <Flex direction={'column'} pb={'4'}>
          <Heading>Placement</Heading>
          <Text color="gray">You can upload your PDF or image here.</Text>
          <Text color="gray">PDF: {backendRequest ?? '...loading'}</Text>
          <Link href="/api/pdf">
            <code className="font-mono font-bold">api/pdf.py</code>
          </Link>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">Upload File (PDF or Image)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
          </div>
          <div className="w-full max-w-md mt-4">
            {selectedFile && !displayRandomImage ? (
              <>
                {isImageFile(selectedFile) ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Image Preview"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                ) : (
                  <iframe
                    src={URL.createObjectURL(selectedFile)}
                    width="100%"
                    height="500px"
                    title="File Preview"
                  ></iframe>
                )}
              </>
            ) : displayRandomImage ? (
              <img
                src={imageUrl}
                alt="Image Preview"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : null}
          </div>
        </Flex>
      </Container>
    </main>
  );
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
