"use client";

import { motion } from "framer-motion";
import { COMPONENTS } from "@/types/component-data";
import ComponentCard from "@/app/components/component-card";

function FeaturesSection() {
  const getItemConfig = (component: (typeof COMPONENTS)[0], index: number) => {
    const colSpans: { [key: number]: string } = {
      1: "md:col-span-1",
      2: "md:col-span-2",
      3: "md:col-span-3",
      4: "md:col-span-4",
      5: "md:col-span-5",
      6: "md:col-span-6",
      7: "md:col-span-7",
      8: "md:col-span-8",
      9: "md:col-span-9",
      10: "md:col-span-10",
      11: "md:col-span-11",
      12: "md:col-span-12",
    };

    const rowSpans: { [key: number]: string } = {
      1: "md:row-span-1",
      2: "md:row-span-2",
      3: "md:row-span-3",
      4: "md:row-span-4",
      5: "md:row-span-5",
      6: "md:row-span-6",
    };

    return {
      className: `${colSpans[component.cols] || "md:col-span-1"} ${rowSpans[component.rows] || "md:row-span-1"}`,
      delay: 0.05 * (index % 10),
    };
  };

  return (
    <section className="bg-background px-0 md:px-6 pt-16 md:pt-24 min-h-screen">
      <div className="max-w-7xl w-full mx-auto">
        {/* <motion.h1
          className="text-muted-foreground text-sm uppercase tracking-widest mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Explore Components
        </motion.h1> */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
        >
          Explore Components
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-xl max-w-3xl mb-16"
        >
          Select a component to see how it's implemented across different
          libraries.
        </motion.p>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min md:auto-rows-[100px] grid-flow-dense pb-40">
          {COMPONENTS.map((component, index) => {
            const config = getItemConfig(component, index);

            return (
              <motion.div
                key={component.slug}
                className={`${config.className} rounded-xl overflow-hidden cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: config.delay }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
              >
                <ComponentCard
                  component={component}
                  className="h-full w-full"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return <FeaturesSection />;
}
