import { Link } from 'react-router-dom'
import HeroSection from '../../layouts/HeroSection'

export default function Home() {
  return (
    <div>
      <HeroSection
        title="Superpowers Project"
        subtitle="A consortium of schools pioneering AI-based student portfolio assessment"
      >
        <div className="flex gap-4 justify-center mt-4">
          <Link to="/about" className="btn btn-primary">Learn More</Link>
          <Link to="/register" className="btn btn-outline">Join Us</Link>
        </div>
      </HeroSection>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Collaborate</h2>
              <p>Connect with educators exploring innovative approaches to student assessment through AI-powered portfolios.</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Share Resources</h2>
              <p>Access and contribute to a growing library of tools, research, and best practices for portfolio assessment.</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Stay Informed</h2>
              <p>Keep up with the latest news, developments, and insights from consortium members.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
