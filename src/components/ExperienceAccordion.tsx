"use client";

import * as Accordion from "@radix-ui/react-accordion";

const POSITIONS = [
  {
    id: "role-1",
    role: "Senior Product Designer",
    company: "Company One",
    period: "2023 — Present",
    description:
      "Placeholder description of responsibilities and notable projects at this role.",
  },
  {
    id: "role-2",
    role: "Product Designer",
    company: "Company Two",
    period: "2021 — 2023",
    description:
      "Placeholder description of responsibilities and notable projects at this role.",
  },
  {
    id: "role-3",
    role: "UI/UX Designer",
    company: "Company Three",
    period: "2019 — 2021",
    description:
      "Placeholder description of responsibilities and notable projects at this role.",
  },
];

export default function ExperienceAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-white/10 border-y border-white/10">
      {POSITIONS.map((position) => (
        <Accordion.Item key={position.id} value={position.id}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between py-6 text-left">
              <span>
                <span className="block text-lg font-semibold">
                  {position.role}
                </span>
                <span className="block text-sm text-muted">
                  {position.company} · {position.period}
                </span>
              </span>
              <span className="font-mono text-xl text-muted transition-transform group-data-[state=open]:rotate-45">
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-down_0.3s_ease-out] data-[state=closed]:animate-[accordion-up_0.3s_ease-out]">
            <p className="max-w-xl pb-6 text-sm text-foreground/70">
              {position.description}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
