"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What is included in the EV charger installation?",
    answer:
      "Your installation includes a brand new BG Sync EV wall mounted charger, professional fitting, electrical testing and setup by a certified installer.",
  },
  {
    question: "How much does installation cost?",
    answer:
      "Full installations start from £879. The final price can depend on your property, electrical supply and any additional installation requirements.",
  },
  {
    question: "Can I charge my electric car from a normal plug socket?",
    answer:
      "You can, but it is usually much slower and not designed as a long-term charging solution. A dedicated EV charger is safer, faster and better suited for regular home charging.",
  },
  {
    question: "Do I need a driveway?",
    answer:
      "Most home EV charger installations require access to off-street parking, such as a driveway or private parking space, so the charger can safely reach your vehicle.",
  },
  {
    question: "Who installs the charger?",
    answer:
      "Your charger will be installed by fully certified Hey Electrics installers and engineers.",
  },
  {
    question: "Which charger do you install?",
    answer:
      "We install the brand new BG Sync EV wall mounted charger as part of our EV installation package.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Most standard installations can usually be completed in one visit, subject to property checks and installation requirements.",
  },
  {
    question: "Will you show me how to use the charger?",
    answer:
      "Yes. Once installed, our engineer will test the charger and guide you through the basic setup so you feel confident using it.",
  },
];

export function EVFAQ() {
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
