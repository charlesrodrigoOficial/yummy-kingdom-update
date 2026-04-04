"use client";

import { useMemo, useState } from "react";
import { LocateFixed, ShoppingBag, Truck, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type OrderMode = "deliver" | "collect" | "dinein";

const StartOrder = () => {
  const [mode, setMode] = useState<OrderMode>("deliver");

  const label = useMemo(() => {
    switch (mode) {
      case "deliver":
        return "Delivery postcode";
      case "collect":
        return "Search a store";
      case "dinein":
        return "Find a restaurant";
      default:
        return "Delivery postcode";
    }
  }, [mode]);

  return (
    <section className="w-full bg-[#f5f5f5]">
      <div className="py-10 md:py-14">
        <h2 className="text-center text-[#e31837] font-black tracking-tight text-4xl md:text-6xl">
          START YOUR ORDER
        </h2>

        <div className="mx-auto mt-7 w-full max-w-3xl rounded-md border bg-white shadow-sm">
          <div className="grid grid-cols-3 border-b bg-muted/30">
            <button
              type="button"
              onClick={() => setMode("deliver")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold",
                mode === "deliver" ? "bg-white" : "hover:bg-white/60"
              )}
            >
              <Truck className="h-4 w-4" /> Deliver
            </button>
            <button
              type="button"
              onClick={() => setMode("collect")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border-l",
                mode === "collect" ? "bg-white" : "hover:bg-white/60"
              )}
            >
              <ShoppingBag className="h-4 w-4" /> Collect
            </button>
            <button
              type="button"
              onClick={() => setMode("dinein")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border-l",
                mode === "dinein" ? "bg-white" : "hover:bg-white/60"
              )}
            >
              <UtensilsCrossed className="h-4 w-4" /> Dine-in
            </button>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px]">
              <div>
                <Input
                  aria-label={label}
                  placeholder={label}
                  className="h-12 rounded-none"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  For example, SG5 3RD
                </div>
              </div>
              <Button className="h-12 rounded-none bg-[#e31837] hover:bg-[#c7122f]">
                View Deals
              </Button>
            </div>

            <button
              type="button"
              className="mt-4 w-full text-center text-sm font-semibold text-[#e31837] hover:underline inline-flex items-center justify-center gap-2"
              onClick={() => {
                // UI-only: hook this up to Geolocation API if needed
              }}
            >
              Use My Current Location <LocateFixed className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartOrder;
