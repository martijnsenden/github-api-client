## Notities

Ik heb deze app gedurende de afgelopen avonden gebouwd. Hier wat aantekeningen over de app en het proces.

Ik heb gekozen het in Next.js te bouwen. Daar had ik nog niet veel ervaring mee en het leek me wel een goede gelegenheid.

Belangrijkste opmerking: ik heb uiteindelijk afgeweken van de opdracht. De filter op `followers`heb ik niet gebouwd. In de documentatie van GitHub staat deze inderdaad wel genoemd, maar asl je er dan op filtert, zie je geen verschil in de resultaten. Er is ook geen veld in de resositories die je terugkrijgt van GitHub dat ermee correspondeert. Ik dacht eerst misschien `subscribers`, maar dat leek toch ook niet te kloppen. Ik heb het toen maar gelaten en vervangen voor een extra filter op forks.

Verder was het toch nog best wat werk. Aan het inrichten van Jest en testing-library ben ik niet toegekomen. Normaal gebruik ik dat wel. Ook iets als Cypress tests heb ik niet gebouwd.

Ik zou ook nog wel wat willen refactoren, maar de tijd is nu wel op. Ik zou als eerste de search page uit elkaar halen in kleinere componenten. Ik had wel een poging gedaan, maar liep tegen issues aan en heb toen gekozen om dat voor nu niet te doen.

Ik heb de app niet op Vercel gedeployed. Maar je kunt hem natuurlijk clonen en lokaal draaien. Hieronder instructies.

Hopelijk bevalt de app. Het was in ieder geval wel leuk om te maken.

Groet, Martijn

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-  [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-  [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
