import anvil from "~/assets/icons/Logoicon.webp?url";

export default function AnvilBadge() {
  return (
    <div class="relative inline-block h-9 w-9 select-none">
      {/* Pulsing forge glow behind the anvil */}
      <span
        class="absolute inset-0 rounded-full blur-lg opacity-80
               bg-[radial-gradient(circle,rgba(255,106,61,0.9)_0%,rgba(255,106,61,0.35)_40%,transparent_70%)]
               animate-[forgePulse_2.6s_ease-in-out_infinite]"
        aria-hidden="true"
      ></span>

      {/* Optional inner brass halo for depth */}
      <span
        class="absolute inset-0 rounded-full blur-md opacity-50
               bg-[radial-gradient(circle,rgba(199,162,106,0.8)_0%,transparent_70%)]
               mix-blend-overlay animate-[forgePulse_3.2s_ease-in-out_infinite]"
        aria-hidden="true"
      ></span>

      {/* The static anvil image */}
      <img
        src={anvil}
        alt="AuthorForge Anvil"
        class="relative z-10 h-9 w-9 object-contain
               drop-shadow-[0_0_8px_rgba(255,106,61,0.65)]
               transition-transform duration-300 hover:scale-[1.05]"
        draggable={false}
        decoding="async"
      />

      <style>
        {`
          @keyframes forgePulse {
            0%, 100% { opacity: 0.6; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-[forgePulse_2.6s_ease-in-out_infinite],
            .animate-[forgePulse_3.2s_ease-in-out_infinite] {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
