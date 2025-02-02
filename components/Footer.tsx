import Link from "next/link";
import { FaInstagram, FaYahoo } from "react-icons/fa"; 

export default function Footer() {
  return (
    <footer className="text-center text-sm text-gray-900 py-4">
      <nav className="mt-4 flex flex-col items-center space-y-2 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <a
          href="https://www.instagram.com/costco_hacker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-blue-700 hover:underline"
        >
          {/* React IconsのFaInstagramを使用 */}
          <FaInstagram />
          <span>Instagram</span>
        </a>

        <a
          href="https://news.yahoo.co.jp/expert/creators/costcohacker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-purple-700 hover:underline"
        >
          <FaYahoo />
          <span>Yahoo!コストコハッカー</span>
        </a>

        <Link href="/privacy">
          プライバシーポリシー
        </Link>
        <Link href="/web-request">
          Webサイト作成のご依頼
        </Link>
      </nav>
      <p className='mt-4'>© 2025 Costco Hacker Plus+ All rights reserved.</p>

    </footer>
  );
}
