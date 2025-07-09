import NavBar from '@/components/NavBar';
import AnimatedBackground from '@/components/AnimatedBackground';

// Force dynamic rendering for dashboard pages
export const dynamic = 'force-dynamic';

export default function WithSidebarLayout({ children, sidebar }) {
  return (
    <>
      <AnimatedBackground />

      <div className="flex flex-col h-dvh">
        {/* navbar (fixed across all (dashboard) pages) */}
        <div>
          <NavBar />
        </div>

        {/* body container (main content area) */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center h-dvh text-theme-text-body">
            <div className="overflow-y-auto flex-1 mx-4 max-w-7xl mt-[40px] bg-theme-bg-main text-theme-text-body">
              <div className="bg-ctp-mantle">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
