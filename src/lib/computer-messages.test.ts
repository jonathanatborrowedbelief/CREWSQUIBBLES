import { afterEach, expect, it } from "vitest";

import { localizeComputerProblem } from "./computer-messages";
import { setLocale, t } from "./i18n";

afterEach(() => setLocale("en"));

it("words the container runtime problems the server reports, and keeps any other text", () => {
  expect(localizeComputerProblem("Install a supported container runtime first")).toBe("Install a supported container runtime first");
  expect(localizeComputerProblem("Start docker first")).toBe("Start docker first");
  setLocale("pt-br");
  expect(localizeComputerProblem("Install a supported container runtime first")).toBe("Instale primeiro um ambiente de execução de contêineres compatível");
  expect(localizeComputerProblem("Start podman first")).toBe("Inicie podman primeiro");
  expect(localizeComputerProblem("Something new")).toBe("Something new");
});

it("words the unmanaged-container problem under the old and the new product name", () => {
  setLocale("pt-br");
  for (const brand of ["OpenMausBot", "CREW"]) {
    const problem = `The existing container was not created by ${brand}; recreate it`;
    expect(localizeComputerProblem(problem)).toBe(t("computer.problem.unmanaged"));
    expect(localizeComputerProblem(problem)).not.toBe(problem);
  }
});
