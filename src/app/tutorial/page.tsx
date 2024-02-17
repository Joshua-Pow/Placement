/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XH0UY0mvFJS
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { FileUp, Move, Save } from 'lucide-react';

export default function About() {
  return (
    <section className="min-h-[calc(100vh-9rem)] w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Tutorial
          </h1>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-20">
              <TabsTrigger value="upload" className="h-full">
                <h2 className="scroll-m-20 text-2xl tracking-tight first:mt-0 mr-2">
                  1. Upload your file
                </h2>
                <FileUp />
              </TabsTrigger>
              <TabsTrigger value="adjust" className="h-full">
                <h2 className="scroll-m-20 text-2xl tracking-tight first:mt-0 mr-2">
                  2. Adjust your shapes
                </h2>
                <Move />
              </TabsTrigger>
              <TabsTrigger value="save" className="h-full">
                <h2 className="scroll-m-20 text-2xl tracking-tight first:mt-0 mr-2">
                  3. Save your placement
                </h2>
                <Save />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <p className="scroll-m-20 text-lg tracking-tight font-normal">
                      Click the Choose File button to select and upload your PDF
                      of shape layout.
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src="/upload.png"
                    alt="upload"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-md"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="adjust">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <p className="scroll-m-20 text-lg tracking-tight font-normal">
                      In the shape editor you can adjust the shapes to fit the
                      outlines in the background, as well as duplicating,
                      rotating, and marking the place on fold.
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src="/adjust.png"
                    alt="adjust"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-md"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="save">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <p className="scroll-m-20 text-lg tracking-tight font-normal">
                      From all the iteration results shown, you can select the
                      desired version and save it as a PDF.
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src="/save.png"
                    alt="save"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-md"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
