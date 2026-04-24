export default function Footer() {
  return (
    <footer className="hairline mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="meta-label">&copy; {new Date().getFullYear()} Superpowers Project</p>
        <p className="meta-label">All rights reserved</p>
      </div>
    </footer>
  )
}
