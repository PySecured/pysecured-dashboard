import { FileText } from 'lucide-react'
import LegalLayout from '../components/LegalLayout'
import { DISCORD_SUPPORT_URL } from '../config'

const SECTIONS = [
  { id: "1-what-pysecured-is", title: "1. What PySecured is" },
  { id: "2-who-can-use-it", title: "2. Who can use it" },
  { id: "3-your-responsibility-for-configuration", title: "3. Your responsibility for configuration" },
  { id: "4-service-availability", title: "4. Service availability" },
  { id: "5-acceptable-use", title: "5. Acceptable use" },
  { id: "6-termination", title: "6. Termination" },
  { id: "7-disclaimer-and-limitation-of-liability", title: "7. Disclaimer and limitation of liability" },
  { id: "8-changes-to-these-terms", title: "8. Changes to these terms" },
  { id: "9-contact", title: "9. Contact" },
]


export default function Terms() {
  return (
    <LegalLayout
      sections={SECTIONS}
      title="Terms of Use"
      icon={FileText}
      path="/terms"
      description="Terms of use for the PySecured Discord moderation bot and web dashboard."
      effectiveDate="August 9, 2026"
    >
      <section id="1-what-pysecured-is">
        <h2>1. What PySecured is</h2>
        <p>
          PySecured is a Discord bot and companion web dashboard that monitors
          messages in servers it's added to for signs of a compromised
          account — scam links, fake giveaway messages, mass-ping spam — and
          can automatically quarantine, time out, kick, or ban the account
          that sent them, based on how each server's administrators configure
          it.
        </p>
      </section>

      <section id="2-who-can-use-it">
        <h2>2. Who can use it</h2>
        <p>
          You must be able to accept{' '}
          <a
            href="https://discord.com/terms"
            className="text-[var(--py-blue)] hover:underline"
          >
            Discord's own Terms of Service
          </a>{' '}
          to use PySecured, since it operates entirely within Discord and
          through Discord's login. Only a server's owner or a member with
          Administrator permission can configure PySecured for that server,
          through the <code className="font-mono text-xs">/setup</code> command
          or this dashboard.
        </p>
      </section>

      <section id="3-your-responsibility-for-configuration">
        <h2>3. Your responsibility for configuration</h2>
        <p>
          PySecured only acts according to the settings a server's own
          administrators choose — which action to take (quarantine role,
          timeout, kick, or ban), how long a ban or timeout lasts, which
          channel is a trap channel, and which roles are exempt. You're
          responsible for configuring it in a way that's appropriate for your
          server, including:
        </p>
        <ul>
          <li>Reviewing default settings before enabling protection</li>
          <li>Making sure the punishment you pick fits your community</li>
          <li>Whitelisting roles (moderators, other bots) that shouldn't be affected</li>
          <li>Understanding that a misconfigured trap channel punishes anyone who posts there, with no exceptions besides the whitelist</li>
        </ul>
        <p>
          Automated moderation can occasionally act on a message that wasn't
          actually malicious (a false positive). PySecured is a tool to
          reduce harm, not a guarantee against it.
        </p>
      </section>

      <section id="4-service-availability">
        <h2>4. Service availability</h2>
        <p>
          PySecured is provided on a best-effort basis. It may be
          unavailable, updated, changed, or discontinued at any time, with or
          without notice. We don't guarantee uptime, response time, or that
          detection will catch every compromised account or avoid every false
          positive.
        </p>
      </section>

      <section id="5-acceptable-use">
        <h2>5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use PySecured to violate Discord's Terms of Service or Community Guidelines</li>
          <li>Attempt to interfere with, disrupt, or reverse-engineer the bot or dashboard beyond what's needed for normal use</li>
          <li>Use the dashboard to access or modify settings for a server you don't have Administrator permission in</li>
        </ul>
      </section>

      <section id="6-termination">
        <h2>6. Termination</h2>
        <p>
          You can stop using PySecured at any time by removing it from your
          server — doing so automatically deletes that server's saved
          settings (see the Privacy Policy). We may also stop offering the
          service, or remove it from a specific server, at our discretion.
        </p>
      </section>

      <section id="7-disclaimer-and-limitation-of-liability">
        <h2>7. Disclaimer and limitation of liability</h2>
        <p>
          PySecured is provided "as is," without warranties of any kind. To
          the fullest extent permitted by law, we aren't liable for any
          damages arising from your use of it — including moderation actions
          taken against the wrong account, missed detections, or service
          downtime.
        </p>
      </section>

      <section id="8-changes-to-these-terms">
        <h2>8. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continuing to use
          PySecured after a change means you accept the updated terms.
        </p>
      </section>

      <section id="9-contact">
        <h2>9. Contact</h2>
        <p>
          Questions about these terms: <a href={DISCORD_SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--py-blue)] hover:underline">our Discord server</a>
        </p>
      </section>
    </LegalLayout>
  )
}
