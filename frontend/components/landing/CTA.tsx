import Link from "next/link"; 
import { ArrowRight, CheckCircle2 } from "lucide-react"; 
 
export default function CTA() { 
  return ( 
    <section className="bg-white px-5 pb-24 sm:px-8"> 
      <div className="mx-auto max-w-[1200px]"> 
        <div className="relative overflow-hidden border-2 border-[#211F1C] bg-[#211F1C] px-6 py-12 sm:px-10 sm:py-14 lg:px-14"> 
          <div 
            className="pointer-events-none absolute inset-0 opacity-[0.06]" 
            style={{ 
              backgroundImage: 
                "linear-gradient(#F3EFE7 1px, transparent 1px), linear-gradient(90deg, #F3EFE7 1px, transparent 1px)", 
              backgroundSize: "36px 36px", 
            }} 
          /> 
 
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center"> 
            <div className="max-w-2xl"> 
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-[#F3EFE7] sm:text-4xl"> 
                Have a tool? Share it. 
                <br /> 
                Need a tool? Rent it. 
              </h2> 
 
              <p className="mt-4 leading-7 text-[#F3EFE7]/70"> 
                Join a growing community that makes tools more accessible and 
                affordable. 
              </p> 
 
              <div className="mt-6 flex flex-wrap gap-4"> 
                <div className="flex items-center gap-2 text-sm text-[#F3EFE7]/80"> 
                  <CheckCircle2 className="size-4 text-[#E8A33D]" /> 
                  Easy to use 
                </div> 
 
                <div className="flex items-center gap-2 text-sm text-[#F3EFE7]/80"> 
                  <CheckCircle2 className="size-4 text-[#E8A33D]" /> 
                  Flexible rentals 
                </div> 
              </div> 
            </div> 
 
            <Link 
              href="/register" 
              className="group inline-flex shrink-0 items-center gap-2 border-2 border-[#E8A33D] bg-[#E8A33D] px-6 py-3.5 text-sm font-semibold text-[#211F1C] transition-colors hover:bg-transparent hover:text-[#E8A33D]" 
            > 
              Join ToolShare 
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /> 
            </Link> 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
}