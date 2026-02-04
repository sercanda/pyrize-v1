"use client";

import MagicBento from "@/components/ui/MagicBento";

export default function FotografEditPage() {

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8">

        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Fotoğraf Düzenleme Özellikleri</h2>
            <p className="text-slate-400">Mekanlarınızı daha etkileyici hale getirmek için kullanabileceğiniz araçlar</p>
          </div>
          <div className="flex justify-center">
            <MagicBento
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={12}
              glowColor="132, 0, 255"
            />
          </div>
        </section>
      </div>
    </>
  );
}

