"use client"; 
 
import Link from "next/link"; 
import { useEffect, useMemo, useState } from "react"; 
import { 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
} from "lucide-react"; 
 
import { getPublicTools, PublicTool } from "@/lib/toolapi"; 
 
export default function Hero() { 
  const [tools, setTools] = useState<PublicTool[]>([]); 
  const [search, setSearch] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [loading, setLoading] = useState(true); 
 
  useEffect(() => { 
    const fetchTools = async () => { 
      try { 
        setLoading(true); 
 
        const data = await getPublicTools(); 
 
        setTools(Array.isArray(data) ? data : []); 
      } catch (error) { 
        console.error("Failed to load hero tools:", error); 
        setTools([]); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    fetchTools(); 
  }, []); 
 
  const categories = useMemo(() => { 
    const categoryNames = tools 
      .map((tool) => tool.category?.name) 
      .filter( 
        (name): name is string => 
          typeof name === "string" && name.trim().length > 0, 
      ); 
 
    return ["All", ...Array.from(new Set(categoryNames))]; 
  }, [tools]); 
 
  const filteredTools = useMemo(() => { 
    const searchText = search.trim().toLowerCase(); 
 
    return tools 
      .filter((tool) => { 
        const matchesSearch = 
          !searchText || 
          tool.tool_name.toLowerCase().includes(searchText) || 
          tool.brand?.toLowerCase().includes(searchText) || 
          tool.description?.toLowerCase().includes(searchText); 
 
        const matchesCategory = 
          selectedCategory === "All" || 
          tool.category?.name === selectedCategory; 
 
        return matchesSearch && matchesCategory; 
      }) 
      .slice(0, 2); 
  }, [tools, search, selectedCategory]); 
 
  const getImageUrl = (image?: string | null) => { 
    if (!image) { 
      return "/placeholder-tool.jpg"; 
    } 
 
    if ( 
      image.startsWith("http://") || 
      image.startsWith("https://") 
    ) { 
      return image; 
    } 
 
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image}`; 
  }; 
 
  return ( 
    <section className="relative overflow-hidden border-b border-[#211F1C]/10 bg-[#F3EFE7]"> 
      {/* faint blueprint grid, subject-grounded texture instead of blurred gradient blobs */} 
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: 
            "linear-gradient(#211F1C 1px, transparent 1px), linear-gradient(90deg, #211F1C 1px, transparent 1px)", 
          backgroundSize: "44px 44px", 
        }} 
      /> 
 
      <div className="relative mx-auto grid max-w-[1200px] items-start gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:px-10 lg:pb-24 lg:pt-16"> 
        {/* Left Content */} 
        <div> 
          <div className="mb-6 inline-flex items-center gap-2 border border-[#211F1C]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#211F1C]"> 
            <Sparkles className="size-3.5 text-[#C1502E]" /> 
            Built for local tool sharing 
          </div> 
 
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-[42px] font-bold leading-[1.05] text-[#211F1C] sm:text-5xl lg:text-[56px]"> 
            Borrow the tool, skip the hardware bill. 
          </h1> 
 
          <p className="mt-6 max-w-md text-base leading-7 text-[#4B4A46] sm:text-lg"> 
            Find the tools you need nearby, rent them by the day, or list 
            the ones sitting unused in your shed. 
          </p> 
 
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"> 
            <Link 
              href="/tools" 
              className="inline-flex items-center justify-center gap-2 border-2 border-[#211F1C] bg-[#211F1C] px-6 py-3.5 text-sm font-semibold text-[#F3EFE7] transition-colors hover:bg-[#C1502E] hover:border-[#C1502E]" 
            > 
              Explore tools 
              <ArrowRight className="size-4" /> 
            </Link> 
 
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center border-2 border-[#211F1C]/25 bg-transparent px-6 py-3.5 text-sm font-semibold text-[#211F1C] transition-colors hover:border-[#211F1C]" 
            > 
              List your tools 
            </Link> 
          </div> 
 
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#211F1C]/10 pt-6"> 
            <div className="flex items-center gap-2 text-sm text-[#4B4A46]"> 
              <CheckCircle2 className="size-4 text-[#4C7A5E]" /> 
              Verified users 
            </div> 
 
            <div className="flex items-center gap-2 text-sm text-[#4B4A46]"> 
              <CheckCircle2 className="size-4 text-[#4C7A5E]" /> 
              Flexible rentals 
            </div> 
 
            <div className="flex items-center gap-2 text-sm text-[#4B4A46]"> 
              <CheckCircle2 className="size-4 text-[#4C7A5E]" /> 
              Secure platform 
            </div> 
          </div> 
        </div> 
 
        {/* Dynamic Tool Marketplace, styled as an inventory panel */} 
        <div className="relative border-2 border-[#211F1C] bg-white"> 
          <div className="absolute -top-2.5 left-6 bg-[#F3EFE7] px-2 text-[11px] font-semibold tracking-wide text-[#6B6A66]"> 
            Live inventory 
          </div> 
 
          {/* Marketplace Header */} 
          <div className="flex items-center justify-between border-b border-[#211F1C]/15 px-5 py-4"> 
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#211F1C]"> 
              Popular tools 
            </h3> 
 
            <div className="flex items-center gap-1.5 border border-[#4C7A5E]/40 bg-[#4C7A5E]/10 px-2.5 py-1 text-xs font-semibold text-[#3B6049]"> 
              <span className="size-1.5 rounded-full bg-[#4C7A5E]" /> 
              Live 
            </div> 
          </div> 
 
          {/* Search */} 
          <div className="px-5 pt-5"> 
            <div className="flex items-center gap-3 border border-[#211F1C]/20 bg-[#F3EFE7]/60 px-4 py-3 transition-colors focus-within:border-[#211F1C]"> 
              <Search className="size-4 shrink-0 text-[#6B6A66]" /> 
 
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search for tools..." 
                className="w-full bg-transparent text-sm text-[#211F1C] outline-none placeholder:text-[#8A8983]" 
              /> 
            </div> 
          </div> 
 
          {/* Dynamic Categories */} 
          <div className="scrollbar-hide flex gap-2 overflow-x-auto px-5 pt-4"> 
            {categories.slice(0, 5).map((category) => ( 
              <button 
                key={category} 
                type="button" 
                onClick={() => setSelectedCategory(category)} 
                className={`shrink-0 border px-3 py-1.5 text-xs font-semibold transition-colors ${ 
                  selectedCategory === category 
                    ? "border-[#211F1C] bg-[#211F1C] text-[#F3EFE7]" 
                    : "border-[#211F1C]/15 bg-transparent text-[#6B6A66] hover:border-[#211F1C]/40 hover:text-[#211F1C]" 
                }`} 
              > 
                {category} 
              </button> 
            ))} 
          </div> 
 
          {/* Tool Cards */} 
          <div className="grid grid-cols-2 gap-3 p-5"> 
            {loading ? ( 
              <> 
                <div className="border border-[#211F1C]/10 bg-[#F3EFE7]/60 p-3"> 
                  <div className="h-28 animate-pulse bg-[#211F1C]/10" /> 
                  <div className="mt-3 h-4 w-24 animate-pulse bg-[#211F1C]/10" /> 
                  <div className="mt-2 h-3 w-16 animate-pulse bg-[#211F1C]/5" /> 
                </div> 
 
                <div className="border border-[#211F1C]/10 bg-[#F3EFE7]/60 p-3"> 
                  <div className="h-28 animate-pulse bg-[#211F1C]/10" /> 
                  <div className="mt-3 h-4 w-24 animate-pulse bg-[#211F1C]/10" /> 
                  <div className="mt-2 h-3 w-16 animate-pulse bg-[#211F1C]/5" /> 
                </div> 
              </> 
            ) : filteredTools.length > 0 ? ( 
              filteredTools.map((tool) => ( 
                <Link 
                  key={tool.id} 
                  href={`/tools/${tool.id}`} 
                  className="group border border-[#211F1C]/12 bg-[#F3EFE7]/50 p-3 transition-colors hover:border-[#211F1C]/40 hover:bg-white" 
                > 
                  <div className="flex h-28 items-center justify-center overflow-hidden bg-white"> 
                    <img 
                      src={getImageUrl(tool.tool_image)} 
                      alt={tool.tool_name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    /> 
                  </div> 
 
                  <p className="mt-3 truncate text-sm font-semibold text-[#211F1C]"> 
                    {tool.tool_name} 
                  </p> 
 
                  <div className="mt-1 flex items-center justify-between gap-2"> 
                    <p className="truncate text-xs text-[#6B6A66]"> 
                      {tool.category?.name || "Tool"} 
                    </p> 
 
                    <p className="shrink-0 text-xs font-semibold text-[#C1502E]"> 
                      ৳ 
                      {Number( 
                        tool.rental_price_per_day, 
                      ).toLocaleString()} 
                      /day 
                    </p> 
                  </div> 
                </Link> 
              )) 
            ) : ( 
              <div className="col-span-2 border border-dashed border-[#211F1C]/20 bg-[#F3EFE7]/40 px-5 py-10 text-center"> 
                <div className="mx-auto flex size-11 items-center justify-center border border-[#211F1C]/15 bg-white text-[#8A8983]"> 
                  <Wrench className="size-5" /> 
                </div> 
 
                <p className="mt-3 text-sm font-semibold text-[#211F1C]"> 
                  No tools found 
                </p> 
 
                <p className="mt-1 text-xs text-[#8A8983]"> 
                  Try another search or category. 
                </p> 
              </div> 
            )} 
          </div> 
 
          {/* Footer Trust Box */} 
          <div className="mx-5 mb-5 flex items-center justify-between border border-[#211F1C]/12 bg-[#F3EFE7]/60 px-4 py-4"> 
            <div> 
              <p className="text-xs font-medium text-[#6B6A66]"> 
                Community trusted 
              </p> 
 
              <p className="mt-1 text-sm font-bold text-[#211F1C]"> 
                Safe & simple rentals 
              </p> 
            </div> 
 
            <div className="flex size-9 items-center justify-center border border-[#211F1C]/15 bg-white text-[#4C7A5E]"> 
              <ShieldCheck className="size-5" /> 
            </div> 
          </div> 
 
          {/* View All */} 
          <div className="border-t border-[#211F1C]/15 px-5 py-4"> 
            <Link 
              href="/tools" 
              className="group flex items-center justify-between text-sm font-semibold text-[#211F1C] transition-colors hover:text-[#C1502E]" 
            > 
              View all available tools 
 
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /> 
            </Link> 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
}