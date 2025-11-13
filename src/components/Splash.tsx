// Example: src/components/Splash.tsx
import introVideo from "~/assets/media/AuthorForgeIntro.mp4?url";

export default function Splash() {
  return (
    <div class="fixed inset-0 flex items-center justify-center bg-[rgb(var(--forge-ink))]">
      <video
        autoplay
        muted
        playsinline
        loop
        class="w-[480px] max-w-[80%] rounded-xl shadow-ember"
      >
        <source src={introVideo} type="video/mp4" />
      </video>
    </div>
  );
}
