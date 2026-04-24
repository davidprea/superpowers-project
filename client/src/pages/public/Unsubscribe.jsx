import HeroSection from '../../layouts/HeroSection'

export default function Unsubscribe() {
  return (
    <div>
      <HeroSection title="Unsubscribe" subtitle="Manage your newsletter preferences" />
      <section className="py-20 px-6 max-w-md mx-auto text-center">
        <p style={{ color: 'var(--color-ink-soft)' }}>This feature is not yet implemented.</p>
        <p className="mt-3" style={{ color: 'var(--color-mute)' }}>
          To unsubscribe, please contact us directly and we will remove you from our mailing list.
        </p>
      </section>
    </div>
  )
}
