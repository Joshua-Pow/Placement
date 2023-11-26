/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XH0UY0mvFJS
 */
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import LanguageBadge from '@/components/LanguageBadge';
import Python from '@/components/Logos/Python';
import NextJs from '@/components/Logos/NextJs';
import Tailwind from '@/components/Logos/Tailwind';
import Flask from '@/components/Logos/Flask';
import ShadCn from '@/components/Logos/ShadCn';

export default function About() {
  return (
    <section className="min-h-[calc(100vh-9rem)] w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Us
          </h1>
          <span className="block mx-auto max-w-[800px] text-zinc-500 md:text-xl dark:text-zinc-400">
            We are four fourth-year computer engineering students, who have
            developed this application as our capstone project. Using{' '}
            <LanguageBadge href="https://nextjs.org/">
              <NextJs height={16} width={16} />
              Next.js
            </LanguageBadge>{' '}
            with{' '}
            <LanguageBadge href="https://tailwindcss.com/">
              <Tailwind height={16} width={16} />
              Tailwind
            </LanguageBadge>{' '}
            and{' '}
            <LanguageBadge href="https://ui.shadcn.com/">
              <ShadCn height={16} width={16} />
              ShadCN
            </LanguageBadge>{' '}
            for an engaging frontend and{' '}
            <LanguageBadge href="https://www.python.org/">
              <Python height={16} width={16} />
              Python
            </LanguageBadge>{' '}
            with{' '}
            <LanguageBadge href="https://flask.palletsprojects.com/en/3.0.x/">
              <Flask height={16} width={16} />
              Flask
            </LanguageBadge>{' '}
            for a powerful backend. Our project reflects our commitment to
            innovative software engineering. It&apos;s a culmination of our
            academic journey, blending advanced technologies with our
            collaborative spirit.
          </span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tighter text-center sm:text-3xl md:text-4xl mt-12 mb-6">
          Team
        </h2>
        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="p-2">
            <Image
              alt="Joshua Pow"
              className="mx-auto mb-4 rounded-full"
              src="/josh.png"
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              height={130}
              width={130}
            />
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Joshua Pow</h3>
              <Badge>Frontend</Badge>
              <p className="text-zinc-500 dark:text-zinc-400">
                Blending frontend passion with backend expertise, driven by
                innovation in web development.
              </p>
              <Link
                className="font-medium underline"
                href="https://www.linkedin.com/in/joshuapow/"
              >
                Read more
              </Link>
            </div>
          </Card>
          <Card className="p-2">
            <Image
              alt="Grace Li"
              className="mx-auto mb-4 rounded-full"
              src="/grace.png"
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              height={130}
              width={130}
            />
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Grace Li</h3>
              <Badge>Backend</Badge>
              <p className="text-zinc-500 dark:text-zinc-400">
                Textile expert with a rich history in algorithmic Python,
                combining fabric artistry with tech-driven industry solutions.
              </p>
              <Link
                className="font-medium underline"
                href="https://www.linkedin.com/in/-grace-li/"
              >
                Read more
              </Link>
            </div>
          </Card>
          <Card className="p-2">
            <Image
              alt="Jongjin Jung"
              className="mx-auto mb-4 rounded-full"
              src="/jong.png"
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              height={130}
              width={130}
            />
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Jongjin Jung</h3>
              <Badge>Frontend</Badge>
              <p className="text-zinc-500 dark:text-zinc-400">
                Startup veteran, excels in crafting UIs from scratch with a keen
                focus on performance and user engagement.
              </p>
              <Link
                className="font-medium underline"
                href="https://www.linkedin.com/in/jongjin-jung/"
              >
                Read more
              </Link>
            </div>
          </Card>
          <Card className="p-2">
            <Image
              alt="Vicky Xu"
              className="mx-auto mb-4 rounded-full"
              src="/vicky.png"
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              height={130}
              width={130}
            />
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Vicky Xu</h3>
              <Badge>Backend</Badge>
              <p className="text-zinc-500 dark:text-zinc-400">
                Expert in algorithm optimization, delivering efficient,
                innovative solutions for complex computational challenges.
              </p>
              <Link
                className="font-medium underline"
                href="https://www.linkedin.com/in/wen-vicky-xu/"
              >
                Read more
              </Link>
            </div>
          </Card>
        </div>
        <h2 className="text-2xl font-semibold tracking-tighter text-center sm:text-3xl md:text-4xl mt-12 mb-6">
          Faculty
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <Card className="p-2">
            <Image
              alt="Supervisor"
              className="mx-auto mb-4 rounded-full"
              src="/hamid.png"
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              height={150}
              width={150}
            />
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Hamid Timorabadi</h3>
              <Badge>Supervisor</Badge>
              <p className="text-zinc-500 dark:text-zinc-400">
                Hamid Timorabadi received his BSc, MASc, and PhD degrees in
                Electrical Engineering from the University of Toronto. He has
                worked as a project, design, and test engineer as well as a
                consultant to industry. His research interests include the
                application of digital signal processing in power systems.
              </p>
              <Link
                className="font-medium underline"
                href="https://www.linkedin.com/in/hamid-timorabadi-912049239/"
              >
                Read more
              </Link>
            </div>
          </Card>
          <Card className="p-2">
            <Image
              alt="Administrator"
              className="mx-auto mb-4"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS11c2VyLXJvdW5kIj48cGF0aCBkPSJNMTggMjBhNiA2IDAgMCAwLTEyIDAiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=" //TODO: replace with Inci actual image
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
              height={150}
              width={150}
            />
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Inci McGreal</h3>
              <Badge>Administrator</Badge>
              <p className="text-zinc-500 dark:text-zinc-400">
                Hands-on experience with engineering & project management of a
                variety of technologies such as medical & industrial equipment
                involving hardware & software integrations with peripheral
                devices. Methodical problem solver with a strong understanding
                of AC / DC circuits, analog & digital electronics, and
                applications. Detail oriented & strong with administration.
                Experienced at meeting or exceeding customers’ needs while
                developing business through customer satisfaction.
              </p>
              <Link
                className="font-medium underline"
                href="https://www.linkedin.com/in/incimcgreal/"
              >
                Read more
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
