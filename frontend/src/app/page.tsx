import { Container, Flex, Heading, Text } from '@radix-ui/themes';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container size={'1'}>
        <Flex direction={'column'} pb={'4'}>
          <Heading>Placement</Heading>
          <Text color="gray">You can upload your PDF here.</Text>
        </Flex>
      </Container>
    </main>
  );
}
