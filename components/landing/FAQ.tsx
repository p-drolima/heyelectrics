"use client";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What is an EICR?",
    answer:
      "An Electrical Installation Condition Report is an official document of findings produced after a certified inspection of the electrical installations within a property is performed. Our experienced engineers inspect the electrical system in your property to check for loose, damaged or deteriorated wires and appliances. We're on hand to confirm whether the equipment is correctly installed, identifying any defects or potential risks using simple priority codes: C1: Immediate danger present; meaning urgent action is required. C2: Potential danger present; urgent remedial action needed. C3: Improvements and repairs recommended (no immediate threats).",
  },
  {
    question: "How often should an EICR be carried out?",
    answer:
      "As of April 2021, carrying out an EICR test is a legal requirement for business owners and landlords. Landlords renting out properties must look to schedule an EICR inspection at least once every five years or sooner if there is a change in occupancy. Homeowners, however, should obtain a certificate every ten years unless any electrical faults occur.",
  },
  {
    question: "What does an EICR check?",
    answer:
      "That adequate earthing and bonding are in place. The proper functioning of circuit breakers and RCDs. The possible wear and tear, damage or deterioration of electrical systems. Any broken switches and outlets. The presence of exposed live wires. Compliance with the latest regulations. Overall safety and functionality of every electrical installation. Verification of correct voltage levels. This thorough process verifies that there are no hazards present that could lead to electrical shock or fire risks. If danger is detected, we will suggest remedial action and follow up with a re-inspection.",
  },
  {
    question: "Who can carry out an EICR?",
    answer:
      "Don't feel tempted to carry out an inspection yourself. EICR assessments must be conducted by qualified electricians as they can provide the most accurate and reliable information. Electricians must also have the correct insurance and licensing to work on domestic and commercial properties. Keep in mind that local authorities and estate agencies will not accept EICRs from anyone unqualified.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-10">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-left text-[#1a1a2e] hover:text-[#2CBCB0]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
