import LegalLayout from '../components/LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" effectiveDate="August 9, 2026">
      <section>
        <h2>1. What we collect</h2>
        <p>When you log into the dashboard with Discord, we receive:</p>
        <ul>
          <li>Your Discord user ID, username, and avatar</li>
          <li>The list of servers you belong to, so we can show only the ones where you're an admin and PySecured is already added</li>
        </ul>
        <p>
          We request the <code className="font-mono text-xs">identify</code> and{' '}
          <code className="font-mono text-xs">guilds</code> OAuth scopes only —
          never access to your messages, DMs, or friends list.
        </p>
        <p>For each server PySecured is added to, we store:</p>
        <ul>
          <li>The protection settings configured for that server (enabled/disabled, punishment type, timeout/ban length, channel and role IDs involved)</li>
          <li>Whether a temporary ban is scheduled to expire, and when</li>
        </ul>
      </section>

      <section>
        <h2>2. What we don't collect</h2>
        <p>
          PySecured reads message content in real time to check it against
          scam-detection patterns, but it does not store, log, or transmit
          the content of your messages anywhere. A flagged message is deleted
          (if that setting is on) and only a short machine-generated reason
          (like "scam phrase detected" or "posted in the spam-catcher trap
          channel") is posted to your own server's log channel — a channel
          you control, that we don't have access to.
        </p>
      </section>

      <section>
        <h2>3. Cookies</h2>
        <p>
          The dashboard sets one cookie to keep you logged in. It's
          HTTP-only (inaccessible to page scripts), expires after 7 days, and
          contains only your Discord ID, username, avatar, and the list of
          servers you can manage — nothing else. We don't use tracking or
          advertising cookies.
        </p>
      </section>

      <section>
        <h2>4. Who your data passes through</h2>
        <p>
          Running PySecured means your data necessarily passes through a
          small number of infrastructure providers as part of normal
          operation:
        </p>
        <ul>
          <li>Discord — for authentication and to operate the bot itself</li>
          <li>Our hosting provider — runs the bot and dashboard API</li>
          <li>Cloudflare — routes traffic to our hosting provider</li>
          <li>Vercel — hosts the dashboard's web pages</li>
        </ul>
        <p>
          We don't sell your data, and we don't share it with anyone else
          beyond what's needed to operate the service.
        </p>
      </section>

      <section>
        <h2>5. How long we keep it</h2>
        <p>
          A server's settings are kept for as long as PySecured remains added
          to that server. If PySecured is removed from a server, its saved
          settings and any pending scheduled unbans for that server are
          automatically deleted — this happens the next time the bot
          restarts at the latest, usually immediately.
        </p>
      </section>

      <section>
        <h2>6. Your choices</h2>
        <ul>
          <li>Remove PySecured from your server to delete that server's settings</li>
          <li>Log out of the dashboard at any time to clear your session cookie</li>
          <li>Contact us to request deletion of any data tied to your Discord account</li>
        </ul>
      </section>

      <section>
        <h2>7. Children's privacy</h2>
        <p>
          PySecured is not directed at children under the age Discord itself
          requires for an account (see Discord's Terms of Service). We don't
          knowingly collect data from anyone who doesn't meet that
          requirement.
        </p>
      </section>

      <section>
        <h2>8. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Meaningful changes
          will be reflected by updating the effective date above.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Questions, or a data deletion request: <code className="font-mono text-xs">[your contact email or support server link]</code>
        </p>
      </section>
    </LegalLayout>
  )
}
