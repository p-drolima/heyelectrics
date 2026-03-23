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
      "A boiler service is a thorough inspection carried out by a qualified engineer to ensure your boiler is operating safely and efficiently. It includes checking key components, identifying wear and tear, and confirming everything is working as it should.",
  },
  {
    question: "How often should I service my boiler?",
    answer:
      "It’s recommended to service your boiler annually to maintain efficiency, ensure safety, and comply with manufacturer warranties.",
  },
  {
    question: "What does a boiler service include?",
    answer:
      "A typical service includes a visual inspection of the boiler and controls, checks for leaks, corrosion and wear, testing gas pressure and flow, flue and ventilation checks, and safety device testing.",
  },
  {
    question: "How long does a boiler service take?",
    answer:
      "Most boiler services take between 30 and 60 minutes, depending on the system and accessibility.",
  },
  {
    question: "Do landlords need to service boilers?",
    answer:
      "Yes. Landlords are responsible for ensuring gas appliances are safe, which usually includes annual checks and the relevant gas safety documentation where required.",
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
