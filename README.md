This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# _Before doing any of these make sure you are in the root `./Placement`_

## Prerequisites

1. Ensure you are using a modern version of Node.js `node -v` should be at least 18.X
2. Make sure you have Python 3.10.13 installed `python --version` should be at least 3.10.13
   - Consider using [pyenv](https://github.com/pyenv/pyenv) to manage your Python versions
3. Create a Python virtual environment with: `python -m venv venv`

## Getting Started

Activate the virtual environment with:

```bash
Mac/Linux: source venv/bin/activate
Windows: venv\Scripts\activate
```

Make sure the virtual environment is the correct version(3.10.13) of Python with:

```bash
python --version
```

Install required packages with:

```bash
npm install
```

Then, run the frontend and backend together with:

```bash
npm run dev
```

Or to run just the backend:

```bash
npm run flask-dev
```

Or to run just the frontend:

```bash
npm run next-dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Backend runs on [http://localhost:5328/api/](http://localhost:5328/api/)

To see Backend documentation go to [http://localhost:5328](http://localhost:5328)

The backend lives in the `/api/...` file path

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Adding Python Packages

To add a Python package you need to make sure to add it to the requirements.txt file

```bash
pip freeze > requirements.txt
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
