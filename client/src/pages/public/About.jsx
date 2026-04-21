import HeroSection from '../../layouts/HeroSection'

export default function About() {
  return (
    <div>
      <HeroSection
        title="About the Superpowers Project"
        subtitle="Our mission is to explore and advance AI-based student portfolio assessment across a diverse consortium of schools."
      />
      <section className="py-12 px-4 max-w-3xl mx-auto prose">
        <h2>Our Mission</h2>
        <p>
          The Superpowers Project brings together forward-thinking schools to experiment with
          AI-based approaches to student portfolio assessment. We believe that every student
          has unique strengths — superpowers — that traditional assessment methods often fail
          to capture.
        </p>
        <h2>What We Do</h2>
        <p>
          Our consortium members collaborate to develop, test, and refine innovative assessment
          tools and practices. Through shared resources, regular communication, and collaborative
          research, we are building a community of practice around portfolio-based assessment
          enhanced by artificial intelligence.
        </p>
        <h2>Stay Connected</h2>
        <p>
          Whether you are a school looking to transform your assessment practices or an educator
          interested in following our work, we welcome your participation. Subscribe to our
          newsletter to stay informed about consortium news, resources, and developments.
        </p>
      </section>
    </div>
  )
}
