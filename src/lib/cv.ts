/**
 * CV download: "Download CV" appears only once the PDF exists in public/ (see README);
 * until then the site says "CV on request" and links to /contact?topic=hiring.
 * Runs at build time only.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

const CV_FILE = "/cv/ivan-sapronov-cv.pdf";

export const cvPath: string | undefined = existsSync(join(process.cwd(), "public", CV_FILE))
  ? CV_FILE
  : undefined;
