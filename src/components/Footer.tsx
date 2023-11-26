/**
 * v0 by Vercel.
 * @see https://v0.dev/t/5IQ7uYWsmsT
 */
export default function Component() {
  return (
    <footer className="flex items-center justify-center w-full h-20 px-5 border-t">
      <p className="text-sm">
        <span aria-label="sparkles" role="img">
          ✨
        </span>
        <span>Designed with </span>
        <span aria-label="heart" role="img">
          ❤️
        </span>
        <span> by </span>
        <a
          className="font-bold hover:underline hover:decoration-wavy hover:decoration-primary  hover:decoration-from-font hover:underline-offset-[5px]"
          href="https://www.linkedin.com/in/joshuapow/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Joshua Pow
        </a>
        {', '}
        <a
          className="font-bold hover:underline hover:decoration-wavy hover:decoration-primary  hover:decoration-from-font hover:underline-offset-[5px]"
          href="https://www.linkedin.com/in/jongjin-jung/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Jongjin Jung
        </a>
        {', '}
        <a
          className="font-bold hover:underline hover:decoration-wavy hover:decoration-primary  hover:decoration-from-font hover:underline-offset-[5px]"
          href="https://www.linkedin.com/in/-grace-li/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Grace Li
        </a>
        {', '}
        <a
          className="font-bold hover:underline hover:decoration-wavy hover:decoration-primary  hover:decoration-from-font hover:underline-offset-[5px]"
          href="https://www.linkedin.com/in/wen-vicky-xu/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Vicky Xu
        </a>{' '}
        <span>for ECE496.</span>
        <span aria-label="sparkles" role="img">
          ✨
        </span>
      </p>
    </footer>
  );
}
