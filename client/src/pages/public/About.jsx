import { useState, useEffect } from 'react'
import { marked } from 'marked'
import HeroSection from '../../layouts/HeroSection'

function parseAboutSections(text) {
  // Split on ## headings, keeping the heading with its content
  const parts = text.split(/^(?=## )/m).filter((s) => s.trim())
  return parts.map((part) => {
    const lines = part.trim().split('\n')
    const title = lines[0].replace(/^## /, '')
    const body = lines.slice(1).join('\n').trim()
    return { title, body }
  })
}

function parsePeople(body) {
  // Split on ### headings to get individual people
  const parts = body.split(/^(?=### )/m).filter((s) => s.trim())
  return parts.map((part) => {
    const lines = part.trim().split('\n')
    const name = lines[0].replace(/^### /, '')
    const rest = lines.slice(1).join('\n').trim()
    const imgMatch = rest.match(/!\[.*?\]\((.+?)\)/)
    const image = imgMatch ? imgMatch[1] : null
    const bio = rest.replace(/!\[.*?\]\(.+?\)\n?/, '').trim()
    return { name, image, bio }
  })
}

function PeopleSection({ title, body }) {
  // Split intro text (before first ###) from people entries
  const firstPersonIdx = body.indexOf('### ')
  const intro = firstPersonIdx > 0 ? body.slice(0, firstPersonIdx).trim() : ''
  const peopleBody = firstPersonIdx >= 0 ? body.slice(firstPersonIdx) : body
  const people = parsePeople(peopleBody)
  return (
    <div>
      <h2 className="font-serif text-3xl mb-6" style={{ color: 'var(--color-ink)' }}>{title}</h2>
      {intro && <div className="prose prose-lg max-w-none mb-10" dangerouslySetInnerHTML={{ __html: marked(intro) }} />}
      <div className="flex flex-col gap-12">
        {people.map((person) => (
          <div key={person.name} className="flex flex-col sm:flex-row gap-8 items-start">
            {person.image && (
              <img
                src={`/${person.image}`}
                alt={person.name}
                className="w-36 h-36 object-cover flex-shrink-0"
              />
            )}
            <div>
              <h3 className="font-serif text-xl mb-3" style={{ color: 'var(--color-ink)' }}>{person.name}</h3>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)' }} dangerouslySetInnerHTML={{ __html: marked(person.bio) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProseSection({ title, body }) {
  return (
    <div>
      <h2 className="font-serif text-3xl mb-6" style={{ color: 'var(--color-ink)' }}>{title}</h2>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: marked(body) }} />
    </div>
  )
}

export default function About() {
  const [sections, setSections] = useState([])

  useEffect(() => {
    fetch('/about.md')
      .then((res) => res.text())
      .then((text) => setSections(parseAboutSections(text)))
      .catch(() => {})
  }, [])

  return (
    <div>
      <HeroSection
        title="About the Superpowers Project"
        subtitle="Our mission is to explore and advance AI-based student portfolio assessment across a diverse consortium of schools."
      />
      <section className="py-20 px-6 max-w-[68ch] mx-auto">
        {sections.map((sec, i) => {
          const hasPeople = sec.body.includes('### ')
          return (
            <div key={i} className={i > 0 ? 'mt-16 pt-16 hairline' : ''}>
              {hasPeople
                ? <PeopleSection title={sec.title} body={sec.body} />
                : <ProseSection title={sec.title} body={sec.body} />
              }
            </div>
          )
        })}
      </section>
    </div>
  )
}
