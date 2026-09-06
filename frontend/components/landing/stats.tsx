// const stats = [
//   {
//     value: "10K+",
//     label: "Tools Shared",
//     description: "Available from people in the community",
//   },
//   {
//     value: "5K+",
//     label: "Active Members",
//     description: "People lending and borrowing tools",
//   },
//   {
//     value: "25K+",
//     label: "Successful Shares",
//     description: "Tools exchanged through ToolShire",
//   },
//   {
//     value: "৳2M+",
//     label: "Money Saved",
//     description: "By sharing instead of buying",
//   },
// ];

// const Stats = () => {
//   return (
//     <section
//       id="stats"
//       className="mx-auto max-w-5xl px-4 pb-24 sm:px-8 sm:pb-32"
//     >
//       <div className="rounded-[32px] border border-[#292b30] bg-[#0d0e10] px-6 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:px-10 sm:py-12 lg:px-14">
//         <div className="grid grid-cols-2 divide-x divide-y divide-[#292b30] lg:grid-cols-4 lg:divide-y-0">
//           {stats.map((stat, index) => (
//             <div
//               key={stat.label}
//               className={`
//                 px-5 py-6 text-center
//                 sm:px-8
//                 ${index >= 2 ? "lg:pt-0" : "lg:pb-0"}
//               `}
//             >
//               <p className="text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl">
//                 {stat.value}
//               </p>

//               <h3 className="mt-3 text-base font-medium text-white sm:text-lg">
//                 {stat.label}
//               </h3>

//               <p className="mx-auto mt-2 max-w-[190px] text-sm leading-6 text-[#686a72]">
//                 {stat.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Stats;

"use client";

import { motion } from "motion/react";

const stats = [
  {
    value: "10K+",
    label: "Tools Shared",
    description: "Available from people in the community",
  },
  {
    value: "5K+",
    label: "Active Members",
    description: "People lending and borrowing tools",
  },
  {
    value: "25K+",
    label: "Successful Shares",
    description: "Tools exchanged through ToolShire",
  },
  {
    value: "৳2M+",
    label: "Money Saved",
    description: "By sharing instead of buying",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const statVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const Stats = () => {
  return (
    <section
      id="stats"
      className="mx-auto max-w-5xl px-4 pb-24 sm:px-8 sm:pb-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="rounded-[32px] border border-[#292b30] bg-[#0d0e10] px-6 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:px-10 sm:py-12 lg:px-14"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 divide-x divide-y divide-[#292b30] lg:grid-cols-4 lg:divide-y-0"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              className={`
                px-5 py-6 text-center
                sm:px-8
                ${index >= 2 ? "lg:pt-0" : "lg:pb-0"}
              `}
            >
              <p className="text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl">
                {stat.value}
              </p>

              <h3 className="mt-3 text-base font-medium text-white sm:text-lg">
                {stat.label}
              </h3>

              <p className="mx-auto mt-2 max-w-[190px] text-sm leading-6 text-[#686a72]">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Stats;
