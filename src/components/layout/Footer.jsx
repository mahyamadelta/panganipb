import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = [
    { to: '/peta', label: 'Peta Makanan' },
    { to: '/rekomendasi', label: 'Rekomendasi' },
    { to: '/scan', label: 'Scan Makanan' },
  ];

  return (
    <footer className="bg-emerald-900 text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg">IPB Food Equity</h3>
            <p className="text-emerald-300 text-sm">Data berdasarkan survei langsung tim</p>
            <p className="text-emerald-400 text-xs">Informasi gizi bersifat perkiraan</p>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-1">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-emerald-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-800 text-center">
          <p className="text-emerald-400 text-sm">&copy; 2026 IPB Food Equity</p>
        </div>
      </div>
    </footer>
  );
}
