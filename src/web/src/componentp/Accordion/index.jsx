import React, { useState } from "react";
import AccordionItem from "./AccordionItem";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          toggleOpen={() => toggleOpen(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
