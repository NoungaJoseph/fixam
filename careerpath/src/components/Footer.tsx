import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();

  const columns = [
    {
      titleKey: 'learners',
      links: [
        { labelKey: 'explorePaths', href: '/catalog' },
        { labelKey: 'faqs', href: '/faqs' },
      ],
    },
    {
      titleKey: 'providers',
      links: [
        { labelKey: 'getVerified', href: 'https://usefixam.com/verified' },
        { labelKey: 'findJobs', href: 'https://usefixam.com/jobs' },
      ],
    },
    {
      titleKey: 'aboutFixam',
      links: [
        { labelKey: 'aboutUs', href: '/about' },
        { labelKey: 'careers', href: '/careers' },
        { labelKey: 'blog', href: '/blog' },
      ],
    },
    {
      titleKey: 'support',
      links: [
        { labelKey: 'helpCenter', href: '/help' },
        { labelKey: 'privacy', href: '/privacy' },
        { labelKey: 'terms', href: '/terms' },
        { labelKey: 'contact', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Tagline block */}
          <div className="col-span-2 space-y-3">
            <span className="text-lg font-bold text-gray-800">
              Fixam<span className="text-primary font-medium ml-1">Pathways</span>
            </span>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-4 col-span-1">
              <h4 className="text-sm font-bold text-gray-800">
                {t(`footer.${col.titleKey}`)}
              </h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary transition-colors duration-200"
                      >
                        {t(`footer.${link.labelKey}`)}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-500 hover:text-primary transition-colors duration-200"
                      >
                        {t(`footer.${link.labelKey}`)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
            {/* Simple text-based social links */}
            {[
              { label: 'Facebook', href: 'https://facebook.com/usefixam' },
              { label: 'Twitter', href: 'https://x.com/usefixam' },
              { label: 'Instagram', href: 'https://instagram.com/usefixam' },
              { label: 'LinkedIn', href: 'https://linkedin.com/company/usefixam' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-200 transition-colors duration-200 text-xs font-bold"
                aria-label={social.label}
              >
                {social.label[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
