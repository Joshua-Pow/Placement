/**
 * v0 by Vercel.
 * @see https://v0.dev/t/L6957LHhEJ4
 */
import ActionButton from '@/components/ActionButton';
import { JSX, SVGProps } from 'react';

export default function Component() {
  return (
    <section className="w-full min-h-[calc(100vh-9rem)] py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="flex items-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              <span
                data-content="Optimize"
                className="relative before:content-[attr(data-content)] before:w-full before:z-0  before:absolute before:top-0 before:px-2 before:bottom-0 before:left-0 before:text-center before:animate-gradient-background-1"
              >
                <span className="px-2 text-transparent bg-clip-text bg-gradient-to-r from-gradient-1-start to-gradient-1-end animate-gradient-foreground-1">
                  Optimize
                </span>
              </span>
              Your
              <span
                data-content="Space"
                className="relative before:content-[attr(data-content)] before:w-full before:z-0  before:absolute before:top-0 before:px-2 before:bottom-0 before:left-0 before:text-center before:animate-gradient-background-2"
              >
                <span className="px-2 text-transparent bg-clip-text bg-gradient-to-r from-gradient-2-start to-gradient-2-end animate-gradient-foreground-2">
                  Space
                </span>
              </span>
              , Perfect Your
              <span
                data-content="Fit."
                className="relative before:content-[attr(data-content)] before:w-full before:z-0  before:absolute before:top-0 before:px-2 before:bottom-0 before:left-0 before:text-center before:animate-gradient-background-3"
              >
                <span className="px-2 text-transparent bg-clip-text bg-gradient-to-r from-gradient-3-start to-gradient-3-end animate-gradient-foreground-3">
                  Fit.
                </span>
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
              Our app provides the best solutions for optimizing the placement
              of shapes in your design projects. Get started now.
            </p>
          </div>
          <div className="py-10 space-x-4">
            <ActionButton text="Get Started &rarr;" />
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border rounded-lg shadow dark:bg-zinc-900 dark:border-zinc-700 transition-all transform hover:scale-105 duration-200">
            <IconReview className="mb-4 h-14 w-14 text-zinc-900 dark:text-zinc-50" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Review Uploaded File
            </h3>
            <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
              Review your uploaded file before processing.
            </p>
          </div>
          <div className="p-8 bg-white border rounded-lg shadow dark:bg-zinc-900 dark:border-zinc-700 transition-all transform hover:scale-105 duration-200">
            <IconAdjustsettings className="mb-4 h-14 w-14 text-zinc-900 dark:text-zinc-50" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Adjust Contours of Detected Shapes
            </h3>
            <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
              Fine-tune the contours of the detected shapes for better accuracy.
            </p>
          </div>
          <div className="p-8 bg-white border rounded-lg shadow dark:bg-zinc-900 dark:border-zinc-700 transition-all transform hover:scale-105 duration-200">
            <IconCompare className="mb-4 h-14 w-14 text-zinc-900 dark:text-zinc-50" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              See Multiple Layout Iterations
            </h3>
            <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
              Visualize and compare different layout iterations for your shapes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconCompare(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <path d="M11 18H8a2 2 0 0 1-2-2V9" />
    </svg>
  );
}
function IconAdjustsettings(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconReview(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
