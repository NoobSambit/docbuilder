import { Html, Head, Main, NextScript } from "next/document";
import { THEME_BOOTSTRAP } from "@/components/landing/visit";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
