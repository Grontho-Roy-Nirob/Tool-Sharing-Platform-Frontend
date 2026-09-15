import { 
  ShieldCheck, 
  WalletCards, 
  UsersRound, 
  Sparkles, 
} from "lucide-react"; 
 
const benefits = [ 
  { 
    icon: ShieldCheck, 
    title: "Trusted community", 
    text: "Connect with users and owners through a structured rental platform.", 
  }, 
  { 
    icon: WalletCards, 
    title: "Save more", 
    text: "Rent tools for the time you need instead of buying expensive equipment.", 
  }, 
  { 
    icon: UsersRound, 
    title: "Share locally", 
    text: "Give useful tools a second life by sharing them with your community.", 
  }, 
  { 
    icon: Sparkles, 
    title: "Easy experience", 
    text: "A clean platform makes searching, renting and sharing much easier.", 
  }, 
]; 
 
export default function WhyToolShare() { 
  return ( 
    <section id="why-toolshare" className="border-t border-[#211F1C]/10 bg-white py-24"> 
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10"> 
        <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr]"> 
          <div> 
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#211F1C] sm:text-4xl"> 
              Built around people, tools and trust. 
            </h2> 
 
            <p className="mt-5 max-w-md leading-7 text-[#4B4A46]"> 
              We make it easier for people to access useful equipment without 
              the cost and hassle of ownership. 
            </p> 
 
            <div className="mt-8 h-px w-full max-w-md bg-[#211F1C]/15" /> 
 
            <p className="mt-6 text-sm font-medium text-[#8A8983]"> 
              Rent · Share · Save 
            </p> 
          </div> 
 
          <div className="grid border border-[#211F1C]/15 sm:grid-cols-2"> 
            {benefits.map((benefit, index) => { 
              const Icon = benefit.icon; 
              const isTopRow = index < 2; 
              const isLeftCol = index % 2 === 0; 
 
              return ( 
                <div 
                  key={benefit.title} 
                  className={`p-7 ${!isTopRow ? "border-t border-[#211F1C]/15" : ""} ${ 
                    isLeftCol ? "sm:border-r sm:border-[#211F1C]/15" : "" 
                  }`} 
                > 
                  <div className="flex size-11 items-center justify-center border border-[#211F1C]/15 bg-[#E8A33D]/25 text-[#211F1C]"> 
                    <Icon className="size-5" /> 
                  </div> 
 
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold text-[#211F1C]"> 
                    {benefit.title} 
                  </h3> 
 
                  <p className="mt-2 text-sm leading-6 text-[#6B6A66]"> 
                    {benefit.text} 
                  </p> 
                </div> 
              ); 
            })} 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
}