import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header className="not-found-header">
        <Link href="/" className="brand-wrapper" aria-label="Safar home">
          <Image
            src="/assets/brand/safar-mark.svg"
            alt="Safar Logo"
            width={40}
            height={40}
            className="brand-logo-img"
          />
          <div>
            <div className="brand-title">Safar<span>.</span></div>
            <div className="brand-tagline">Express Bus Travel</div>
          </div>
        </Link>
      </header>

      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-copy">
          <p className="not-found-kicker">Oops, wrong stop</p>
          <h1 id="not-found-title">This page took a detour.</h1>
          <p>
            We couldn&apos;t find the page you&apos;re looking for. Let&apos;s get you back
            on the road and planning your next journey.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="btn-primary">
              <Home size={17} aria-hidden="true" />
              Go to homepage
            </Link>
            <Link href="/" className="btn-outline">
              <Search size={17} aria-hidden="true" />
              Find a bus
            </Link>
          </div>
          <Link href="/" className="not-found-back">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to a familiar route
          </Link>
        </div>
        <div className="not-found-illustration">
          <Image
            src="/assets/illustrations/empty-states/error-general.svg"
            alt="A Safar bus at a roadblock"
            width={320}
            height={240}
            priority
          />
          <span className="not-found-number" aria-hidden="true">404</span>
        </div>
      </section>
    </main>
  );
}
