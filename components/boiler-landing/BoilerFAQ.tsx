"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What is a boiler service?",
    answer:
      "A boiler service is a thorough inspection carried out by a Gas Safe registered engineer to check that your boiler is operating safely and efficiently. It involves examining all key components, testing for gas leaks, checking the flue and ventilation, and ensuring the boiler meets current safety standards.",
  },
  {
    question: "How often should I service my boiler?",
    answer:
      "It is recommended that you have your boiler serviced at least once a year. Annual servicing helps prevent breakdowns, maintains energy efficiency, and ensures the safety of your household. For landlords, an annual gas safety check is a legal requirement.",
  },
  {
    question: "What does a boiler service include?",
    answer:
      "A typical boiler service includes a visual inspection of the boiler and controls, checking the flue and combustion releases, testing gas pressure and flow, inspecting key internal components for wear and corrosion, and ensuring the boiler operates efficiently and safely. You\u2019ll receive a full report detailing any findings and recommendations.",
  },
  {
    question: "How long does a boiler service take?",
    answer:
      "A standard boiler service usually takes between 30 minutes and an hour, depending on the type and condition of your boiler. Our engineers will ensure a thorough job without unnecessary delays.",
  },
  {
    question: "Do landlords need to service boilers?",
    answer:
      "Yes. Landlords are legally required to have all gas appliances, including boilers, checked annually by a Gas Safe registered engineer. A valid Gas Safety Certificate (CP12) must be provided to tenants within 28 days of the check, and records must be kept for at least two years.",
  },
];

export function BoilerFAQ() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1375px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-10 font-display">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-left text-black hover:opacity-70 font-display">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-text leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
